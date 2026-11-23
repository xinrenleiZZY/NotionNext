---
title: Docker 容器化部署实战：从开发到生产
date: 2026-11-23
category: 功法阁
tags: Docker, 容器化, Docker Compose, 部署, Next.js, FastAPI
summary: 一份能直接抄的容器化清单：多阶段构建、Compose 编排、端口规划、健康检查、数据卷、日志与备份，附我项目里 7600-7602 / 9400 / 9500 这套端口布局的由来。
author: 仙帝·Zeyan
slug: docker-deployment-guide
pin: false
---

# Docker 容器化部署实战：从开发到生产

> 判断一个项目是否「交付」，我只看一件事：换一台机器，`docker compose up -d` 能不能起来。

这篇不讲 Docker 基础概念，只讲**把它用到能上线**的那些细节。

## 一、多阶段构建：镜像从 1.2GB 降到 200MB

Node 项目最容易犯的错是把 `node_modules` 和源码一起打进运行镜像。正确姿势：

```dockerfile
# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

要点：

| 做法 | 收益 |
| --- | --- |
| 分离 deps/builder/runner | 运行镜像只带产物 |
| `--frozen-lockfile` | 构建可复现，不会偷偷升级依赖 |
| `standalone` 输出 | Next.js 官方推荐，运行时体积最小 |
| `.dockerignore` 排除 `node_modules/.next/.git` | 构建缓存更稳，上下文更小 |

Python 同理：`pip install` 单独一层，源码后拷，利用缓存。

## 二、Compose：把「启动顺序」写清楚

以我机器上的模型健康监控中心（MHC）为例，三个服务：

```yaml
services:
  mhc-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: mhc
    volumes:
      - mhc-db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 10
    restart: unless-stopped

  mhc-api:
    build: ./api
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@mhc-db:5432/mhc
    depends_on:
      mhc-db:
        condition: service_healthy
    ports: ["7601:7601"]
    restart: unless-stopped

  mhc-web:
    build: ./web
    environment:
      NEXT_PUBLIC_API_BASE: http://mhc-api:7601
    depends_on: [mhc-api]
    ports: ["7600:7600"]
    restart: unless-stopped

volumes:
  mhc-db-data:
```

**`condition: service_healthy` 是关键**：只写 `depends_on` 只保证容器启动顺序，不保证数据库「能用」。没有健康检查时，API 经常在数据库还没初始化完就崩一次。

## 三、端口规划：一次想清楚，省下无数排查

我踩过最蠢的坑是端口冲突：新系统起不来，查了半天发现 7500/7502 被旧系统占了。现在的规矩是**新系统先定端口段，写进 README**：

| 端口 | 用途 |
| --- | --- |
| 7600 | MHC Web |
| 7601 | MHC API（虚拟机推送上来的入口） |
| 7602 | PostgreSQL |
| 9400 | 局域网更新源（Nginx 静态） |
| 9500 | 社交/排行榜服务 |

建议：`76xx` 给业务、`94xx` 给静态分发、`95xx` 给社交类服务，按段分配，永不交叉。

## 四、生产必须有的四件套

1. **健康检查**：每个服务都要有 `/health`，Compose 里配 `healthcheck`。
2. **重启策略**：`restart: unless-stopped`，别用 `always`（手动停掉会被拉起来）。
3. **数据卷**：数据库、上传目录、缓存必须挂卷；容器删了数据不能丢。
4. **日志**：给 Docker 配日志轮转，否则 `/var/lib/docker` 会被日志撑爆：

```yaml
logging:
  driver: json-file
  options:
    max-size: "20m"
    max-file: "5"
```

## 五、密钥与配置

- 敏感项只走环境变量或 `.env`，**不要写进镜像**
- `.env` 加 `.gitignore`，仓库里只留 `.env.example`
- Compose 里用 `${VAR}` 引用，启动时校验

```bash
# 启动前先校验必填项
: "${DB_PASSWORD:?DB_PASSWORD is required}"
```

## 六、备份：容器化最容易忘的一步

```bash
# 每天 03:00 备份数据库
docker exec mhc-db pg_dump -U postgres mhc | gzip > /backup/mhc-$(date +%F).sql.gz
# 保留 14 天
find /backup -name 'mhc-*.sql.gz' -mtime +14 -delete
```

备份没验证过等于没备份——每月至少恢复一次到临时容器确认能起来。

## 七、上线检查清单

- [ ] 镜像多阶段构建，运行层不含源码/开发依赖
- [ ] `.dockerignore` 已排除无关目录
- [ ] 所有服务有健康检查，`depends_on` 用 `service_healthy`
- [ ] 端口按段规划并写进 README
- [ ] 数据卷 + 日志轮转 + `restart: unless-stopped`
- [ ] 密钥不进镜像，`.env` 已 gitignore
- [ ] 备份脚本 + 恢复演练
- [ ] 反代（Nginx）已配好 TLS 与超时

## 结语

容器化的价值不在「潮」，在于**把环境差异消灭掉**。做到上面这一套，换机器、换同事、换机房，都只是一条命令的事。

---

*相关：[openclaw-sync-tray](https://github.com/xinrenleiZZY/openclaw-sync-tray)（Docker Compose 三服务）*
