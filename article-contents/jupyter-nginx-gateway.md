---
title: Jupyter + Nginx 网关：搭建安全的在线编程环境
date: 2026-11-23
category: 功法阁
tags: Jupyter, Nginx, 网关, 在线编程, 安全, Docker
summary: 把 Jupyter 暴露到公网前的必修课：base_url 配置、token 与密码、Nginx WebSocket 反代、HTTPS、访问控制与资源限制。附完整可用的配置片段。
author: 仙帝·Zeyan
slug: jupyter-nginx-gateway
pin: false
---

# Jupyter + Nginx 网关：搭建安全的在线编程环境

> Jupyter 直接暴露公网 = 把服务器 root 权限挂在门外。加一层 Nginx，是成本最低的安全升级。

远程写代码、跑数据脚本，Jupyter 是最好用的。但它默认的监听方式和认证机制，不适合直接对外。这篇记录我把它安全地放到 Nginx 后面的完整过程。

## 一、Jupyter 侧配置

生成配置并改关键项：

```bash
jupyter notebook --generate-config
```

`~/.jupyter/jupyter_notebook_config.py`：

```python
# 只监听本地，由 Nginx 对外
c.ServerApp.ip = '127.0.0.1'
c.ServerApp.port = 8888

# 必须设置 base_url，且与 Nginx location 完全一致
c.ServerApp.base_url = '/jupyter/'
c.ServerApp.open_browser = False

# 密码登录（推荐）而不是只用 token
from jupyter_server.auth import passwd
c.ServerApp.password = passwd('your-strong-password')
# 想临时用 token 就保留默认，但公网务必配合 HTTPS
```

三个容易踩的点：

1. **`base_url` 必须以 `/` 开头、以 `/` 结尾**，且和 Nginx 的 `location` 一一对应，否则静态资源和 kernel 连接全 404。
2. **绑 `127.0.0.1`**，不要 `0.0.0.0`，让 Nginx 成为唯一入口。
3. 密码用 `passwd()` 生成哈希，不要写明文。

## 二、Nginx 反代：WebSocket 是关键

Jupyter 的 kernel 通信走 WebSocket，所以必须配 `Upgrade`：

```nginx
location /jupyter/ {
    proxy_pass http://127.0.0.1:8888/jupyter/;
    proxy_http_version 1.1;

    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSocket
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection "upgrade";

    # 长连接与超时
    proxy_read_timeout  3600s;
    proxy_send_timeout  3600s;
    proxy_buffering     off;
}
```

如果发现「页面能打开但 kernel 一直 connecting」，99% 是 `Upgrade` / `Connection` 头没配，或者 `proxy_buffering` 没关。

## 三、HTTPS：公网必须

```bash
certbot --nginx -d code.example.com
```

Nginx 会自动加 443 与跳转。另外把 HTTP 强制跳 HTTPS：

```nginx
server {
    listen 80;
    server_name code.example.com;
    return 301 https://$host$request_uri;
}
```

## 四、再加一道认证：Basic Auth

Jupyter 自带登录，但多一层没坏处（尤其是团队共享）。

```bash
htpasswd -c /etc/nginx/.htpasswd dev
```

```nginx
location /jupyter/ {
    auth_basic           "restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;
    # ... proxy_pass 略
}
```

更严格的做法：只允许公司 IP 段访问

```nginx
allow 203.0.113.0/24;
deny  all;
```

## 五、资源限制：防止一个人跑崩整台机器

Jupyter 里 `pd.read_csv('10GB.csv')` 一行就能把内存吃满。三条防线：

1. **容器化运行**并限制资源：
   ```bash
   docker run -d --name jupyter \
     -p 127.0.0.1:8888:8888 \
     -v /data/notebooks:/home/jovyan/work \
     --memory=4g --cpus=2 \
     jupyter/scipy-notebook
   ```
2. **Nginx 限制上传大小**：`client_max_body_size 50m;`
3. **定期清理空闲 kernel**：Jupyter 自带 `cull_idle_servers.py`，配 crontab 每 10 分钟跑一次。

## 六、目录与权限：别用 root 跑

- 容器用非 root 用户（`jovyan`）
- 挂载目录权限 `750`，只给需要的人
- **不要把宿主 `/`、`/etc`、Docker socket 挂进去**——这是最危险的配置，等于把整台机器交出去

## 七、上线检查清单

- [ ] Jupyter 只监听 `127.0.0.1`
- [ ] `base_url` 与 Nginx `location` 一致
- [ ] WebSocket 头已配（Upgrade/Connection）
- [ ] `proxy_buffering off`、超时 ≥ 1 小时
- [ ] HTTPS 强制，证书自动续期
- [ ] 密码/token + Basic Auth（或 IP 白名单）
- [ ] 容器内存/CPU 限制，非 root 运行
- [ ] 空闲 kernel 自动清理
- [ ] 日志保留、异常登录可查

## 结语

Jupyter 的安全问题，本质上不是 Jupyter 的问题，是「把开发工具直接暴露到公网」的问题。加一层 Nginx、加上认证与资源限制，就能把「方便」和「安全」同时拿到。

---

*相关：[在 Docker 里跑多服务](https://github.com/xinrenleiZZY/NotionNext) 的端口规划思路，参见《Docker 容器化部署实战》一篇。*
