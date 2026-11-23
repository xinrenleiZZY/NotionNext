---
title: 用 Docker 搭建私有 Wiki 知识库系统
date: 2026-11-23
category: 功法阁
tags: Docker, Wiki, 知识库, PostgreSQL, 部署
summary: 为什么自建 Wiki 比用笔记软件更适合团队知识沉淀，以及用 Docker Compose 在半天内搭好一套带搜索、权限、备份的私有知识库。
author: 仙帝·Zeyan
slug: docker-wiki-knowledge-base
pin: false
---

# 用 Docker 搭建私有 Wiki 知识库系统

> 团队知识散落在聊天记录里，等于没有知识。一个能搜索、能版本化、能权限控制的 Wiki，是最基础的基建。

## 一、为什么自建

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| 笔记软件（Notion/飞书） | 上手快 | 数据在别人家、检索弱、价格随人涨 |
| 自建 Wiki | 数据自有、可定制、成本低 | 需要一台服务器 + 半天折腾 |

团队超过 3 人、文档超过 50 篇，自建的性价比就出来了。

## 二、技术选型

常见方案对比：

| 方案 | 技术栈 | 适合 |
| --- | --- | --- |
| Wiki.js | Node + PostgreSQL | 功能全、管理界面友好（推荐） |
| Outline | Node + PostgreSQL + Redis | 类 Notion 体验，团队协作强 |
| Docusaurus | 静态生成 | 对外文档、无需后台 |
| MkDocs Material | 静态生成 | 个人知识库、极简 |

本文以 **Wiki.js + PostgreSQL** 为例，单机 Docker Compose 即可。

## 三、Compose 编排

```yaml
services:
  wiki-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: wiki
      POSTGRES_USER: wiki
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - wiki-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U wiki"]
      interval: 10s
      retries: 10
    restart: unless-stopped

  wiki:
    image: requarks/wiki:2
    depends_on:
      wiki-db:
        condition: service_healthy
    environment:
      DB_TYPE: postgres
      DB_HOST: wiki-db
      DB_PORT: 5432
      DB_USER: wiki
      DB_PASS: ${DB_PASSWORD}
      DB_NAME: wiki
    ports:
      - "127.0.0.1:3000:3000"
    restart: unless-stopped

volumes:
  wiki-db:
```

启动：

```bash
docker compose up -d
```

首次访问 `http://127.0.0.1:3000` 完成初始化（管理员账号、站点名）。

## 四、必须做的四件事

### 1. 只监听本地，走 Nginx 反代

端口映射写 `127.0.0.1:3000:3000`，公网访问统一由 Nginx 处理 TLS 与限流。

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 120s;
}
```

### 2. 开全文搜索

Wiki.js 内置搜索，中文建议把搜索引擎换成 PostgreSQL 的 `pg_trgm` 或接 Meilisearch（再加一个容器即可）。

### 3. 配权限

- 游客：只读公开空间
- 成员：可编辑
- 管理员：可管理用户与备份

别一上来就全员管理员——知识库最大的风险是「误删」。

### 4. 自动备份

```bash
#!/usr/bin/env bash
set -euo pipefail
TS=$(date +%F)
docker exec wiki-db pg_dump -U wiki wiki | gzip > /backup/wiki-$TS.sql.gz
find /backup -name 'wiki-*.sql.gz' -mtime +14 -delete
```

配合 crontab 每天 03:00 跑一次，并**每月恢复演练一次**。

## 五、内容组织建议

- 一级目录按「团队/项目」分，不按「文档类型」分（类型检索能解决，归属不能）
- 每篇文档头部统一写：更新时间、负责人、适用范围
- 每周固定「文档日」：把本周聊天里的结论沉淀进 Wiki

## 六、上线检查清单

- [ ] Compose 编排 + 健康检查
- [ ] 端口只监听 127.0.0.1，走 Nginx + HTTPS
- [ ] 管理员/成员/游客权限分明
- [ ] 备份脚本 + 恢复演练
- [ ] 中文全文搜索可用
- [ ] 日志轮转、磁盘空间监控

## 结语

自建 Wiki 的价值不在「省了软件费」，而在于**知识终于有了一个确定的家**：能搜、能追溯、能交接。半天搭好，长期受益。
