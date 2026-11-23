---
title: Nginx 网关在微服务架构中的核心作用
date: 2026-11-23
category: 功法阁
tags: Nginx, 微服务, 网关, 反向代理, 负载均衡, 运维
summary: 网关不是「转发一下」那么简单：TLS 终结、路由、负载均衡、超时、限流、WebSocket、真实 IP、日志，这八件事决定微服务是否稳。附可直接套用的 nginx.conf 片段。
author: 仙帝·Zeyan
slug: nginx-microservice-gateway
pin: false
---

# Nginx 网关在微服务架构中的核心作用

> 微服务拆得越细，越需要一个「总入口」把复杂度挡在外面。Nginx 就是那个便宜的答案。

很多人对 Nginx 的印象停留在「反向代理」，但在我的项目里（HZX 多服务、MHC 三容器、更新源静态分发），它承担的是**网关**职责：TLS、路由、限流、缓冲、日志全在这层。

## 一、八个职责，一个配置文件

```nginx
upstream api_backend {
    least_conn;
    server 127.0.0.1:7601 max_fails=3 fail_timeout=15s;
    server 127.0.0.1:7603 backup;
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    client_max_body_size 20m;

    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 5s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
    }

    location /ws/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600s;
    }
}
```

## 二、负载均衡策略怎么选

| 策略 | 配置 | 适用 |
| --- | --- | --- |
| 轮询（默认） | `server a; server b;` | 无状态、机器性能一致 |
| 最少连接 | `least_conn;` | 请求耗时差异大（推荐默认用它） |
| IP 哈希 | `ip_hash;` | 需要会话粘性（能用无状态就别用） |
| 权重 | `server a weight=3;` | 机器性能不一致 |

再加两个细节：

- `max_fails` / `fail_timeout`：连续失败自动摘除，恢复后自动加回
- `keepalive 32;` + `proxy_http_version 1.1` + `Connection ""`：**开启长连接**，能显著降低高并发下的 TIME_WAIT

## 三、超时：90% 的「502/504」都是它

常见事故：接口本身 3 秒返回，但网关 60 秒后报 504，用户看到的是「超时」。原因通常是：

1. 上游 `read_timeout` 比业务耗时短
2. 上游在读请求体时被 `client_body_timeout` 掐断
3. 大文件上传被 `client_max_body_size` 挡住（报 413）

经验值：

| 场景 | 建议 |
| --- | --- |
| 普通 API | `read_timeout 30–60s` |
| 导出/报表 | 单独 location，`read_timeout 300s` + 前端轮询 |
| WebSocket | `read_timeout 3600s`，并配 `proxy_send_timeout` |
| 上传 | `client_max_body_size` 对齐业务上限 |

## 四、限流：保护后端的最低成本手段

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    limit_req_status 429;
    proxy_pass http://api_backend;
}
```

- `rate=10r/s`：单 IP 每秒 10 个请求
- `burst=20 nodelay`：允许突发 20 个，超出直接 429
- 对登录/发送验证码这类接口，单独设更严格的 zone

## 五、真实 IP：日志与风控的前提

经过 CDN/反代后，`$remote_addr` 变成上一跳的地址。要么在应用里读 `X-Forwarded-For`，要么在 Nginx 里还原：

```nginx
set_real_ip_from 10.0.0.0/8;
real_ip_header X-Forwarded-For;
real_ip_recursive on;
```

不配这个，你的限流会「把所有用户当成一个人」，日志也没法排查。

## 六、缓冲与压缩

```nginx
proxy_buffering on;
proxy_buffers 16 16k;
proxy_busy_buffers_size 32k;

gzip on;
gzip_types text/plain text/css application/json application/javascript image/svg+xml;
gzip_min_length 1024;
```

大响应体（JSON 列表、导出）开缓冲能让慢客户端不拖住上游；小文件（如图标）不必 gzip，省 CPU。

## 七、静态资源与更新分发

我的局域网更新源就是这么干的：

```nginx
location /updates/ {
    alias /srv/updates/;
    autoindex on;
    add_header Cache-Control "no-cache";
}
```

`latest.yml` 这类清单文件必须 `no-cache`，安装包本体可以长缓存——否则客户端永远拿不到新版本。

## 八、上线检查清单

- [ ] TLS 证书自动续期（certbot/acme.sh）
- [ ] 只开 TLS1.2/1.3，禁用弱套件
- [ ] `X-Real-IP` / `X-Forwarded-*` 全链路透传
- [ ] 超时按业务分层设置
- [ ] 关键接口有限流
- [ ] WebSocket 单独 location + Upgrade 头
- [ ] 访问日志按天切割、保留 14 天
- [ ] 配置改动先 `nginx -t` 再 reload

## 结语

网关是「一处配置，全局受益」的地方：限流、超时、TLS、日志，改一处保护所有服务。把它当基础设施认真配一次，比在每个服务里各写一遍靠谱得多。
