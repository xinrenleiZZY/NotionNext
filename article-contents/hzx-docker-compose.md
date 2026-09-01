---
title: "HZX 全栈系统（上）：Docker Compose 三服务架构设计实录"
date: 2026-07-20
category: "🧙 功法阁"
tags: ["Docker", "Docker Compose", "FastAPI", "Next.js", "系统架构", "HZX", "生产部署"]
summary: "完整拆解 HZX 采购管理系统的 Docker Compose 三服务（Web + API + Monitor）架构设计。包含 healthcheck 健康检查、depends_on 顺序控制、共享卷策略、日志管理、Dockerfile 分层缓存、生产环境加固方案，附完整可运行 Compose 模板。"
author: "仙帝·Zeyan"
cover: ""
slug: "hzx-docker-compose-architecture"
---

# HZX 全栈系统（上）：Docker Compose 三服务架构设计实录

> *「一个好的 Docker 编排，就是一位优秀的数字化管家。它知道谁先起、谁后等、数据放哪、挂了怎么救。」*
> —— 仙帝·Zeyan

---

## 一、为什么要做 HZX 系统？

### 1.1 业务背景

公司之前的采购流程全靠 **Excel + 微信**：

- 采购申请 → 销售群里 @ 老板审批
- 审批通过 → 运营手动录入 Excel
- 月底对账 → 三个 Excel 对照，经常加班到 10 点

**痛点：**
1. ❌ **无状态**：微信消息一刷就没，审批历史找不到
2. ❌ **易错**：人工录入 Excel，一个单元格错 = 全表翻车
3. ❌ **无监控**：采购进行到哪一步全靠问人
4. ❌ **数据孤岛**：合同附件、发票、物流分散在 3 人电脑里

### 1.2 系统目标

做一个轻量但完整的**采购全生命周期管理系统**（HZX = 三个字首字母，懂的都懂 😄）：

```
申请 → 审批 → 下单 → 物流 → 入库 → 对账 → 报表
   ↓      ↓       ↓      ↓      ↓       ↓
  飞书通知贯穿全程，任何状态变化全员感知
```

---

## 二、三服务架构总览

> **一个大而全的单体容器 = 容易维护但升级困难**
> **拆成微服务 = 架构师的浪漫，但团队只有我一个人**
>
> → 折中：**三服务架构**（前后端分离 + 独立监控服务）

### 2.1 架构图

```
                               ┌──────────────────────┐
                               │   Nginx / 公网反向代理  │  （HTTPS / 限流 / 静态资源）
                               └──────┬──────┬────────┘
                  :7500/ ←────────────┘      └────────────→ :7501/api/
                              │                     │
                     ┌────────▼───────┐   ┌─────────▼──────────┐
                     │   hzx-web      │   │     hzx-api        │
                     │  Next.js 15    │   │   FastAPI + Uvicorn│
                     │  前端 SSR/SSG  │   │   业务逻辑 + ORM   │
                     └────────┬───────┘   └──┬──────┬────┬────┘
                              │ HTTP /api     │      │    │
                              └───────────────┘      │    │
                                                    │    │
                         ┌──────────────────────────┘    │
                         ▼                               ▼
                ┌────────────────┐              ┌──────────────────┐
                │ SQLite/PostgreSQL│             │  Redis (队列+缓存)│
                │  (持久化卷挂载)  │              │  (任务调度)       │
                └────────┬────────┘              └───────┬──────────┘
                         │                               │
                         └───────────────┬───────────────┘
                                         ▼
                               ┌──────────────────┐
                               │   hzx-monitor     │  Python 独立进程
                               │  飞书 Bot · 告警  │  ← 不对外暴露端口
                               │  日报 · 监控 · 钉钉│
                               └──────────────────┘
```

### 2.2 服务清单

| 服务名 | 镜像来源 | 对外端口 | 技术栈 | 核心职责 |
|-------|---------|---------|-------|---------|
| `hzx-api` | 本地 Dockerfile 构建 | `7501:8000` | FastAPI + SQLAlchemy + Redis | 业务 API、鉴权、任务调度 |
| `hzx-web` | 本地 Dockerfile 构建 | `7500:3000` | Next.js 15 (Node) | 前端界面、SSR、API 聚合 |
| `hzx-monitor` | 本地 Dockerfile 构建 | 不暴露 | Python + APScheduler + 飞书 SDK | 告警、日报、群消息监控 |

---

## 三、完整 Docker Compose 详解

### 3.1 `docker-compose.yml` 完整版（可直接抄）

```yaml
# ============================================================
# HZX 采购管理系统 · Docker Compose 生产模板
# 仙帝·Zeyan · 2026
# ============================================================

version: "3.9"

# --- 全局命名 ---
name: hzx-system

services:

  # ============================================================
  # 1. hzx-api · 后端 API 服务
  # ============================================================
  hzx-api:
    build:
      context: ./hzx-api
      dockerfile: Dockerfile
      # 多阶段构建缓存
      cache_from:
        - python:3.11-slim
    image: hzx/hzx-api:latest
    container_name: hzx-api
    restart: unless-stopped
    ports:
      - "7501:8000"
    environment:
      TZ: Asia/Shanghai
      # 数据库
      DB_PATH: /app/data/hzx.db
      # Redis
      REDIS_URL: redis://hzx-redis:6379/0
      # 飞书（从 .env 读，避免写进镜像）
      FEISHU_APP_ID: ${FEISHU_APP_ID}
      FEISHU_APP_SECRET: ${FEISHU_APP_SECRET}
      FEISHU_WEBHOOK: ${FEISHU_WEBHOOK}
      # 鉴权
      JWT_SECRET: ${JWT_SECRET}
    volumes:
      # 【关键】业务配置和 SQLite 文件挂载到宿主机，镜像升级不丢数据
      - ./HZX-应用框架/data:/app/data
      # 共享项目根目录，方便读取文档模板
      - ./:/app/host-project:ro
    depends_on:
      hzx-redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 40s   # Python + 依赖加载需要时间，给足启动缓冲
    networks:
      - hzx-net
    logging:
      driver: "json-file"
      options:
        max-size: "20m"
        max-file: "5"         # 单服务日志上限 100MB，防磁盘爆

  # ============================================================
  # 2. hzx-web · Next.js 前端
  # ============================================================
  hzx-web:
    build:
      context: ./hzx-web
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_BASE_URL: http://hzx-api:8000
        NEXT_TELEMETRY_DISABLED: "1"   # 关 Vercel 遥测，省构建时间
    image: hzx/hzx-web:latest
    container_name: hzx-web
    restart: unless-stopped
    ports:
      - "7500:3000"
    environment:
      TZ: Asia/Shanghai
      NODE_ENV: production
      API_BASE_URL: http://hzx-api:8000   # 容器内通信走服务名
      NEXT_PUBLIC_SITE_URL: ${SITE_URL:-https://hzx.example.com}
    # 【关键】必须等 API 健康检查通过才启动，否则 SSR 请求 API 502
    depends_on:
      hzx-api:
        condition: service_healthy
    networks:
      - hzx-net
    logging:
      driver: "json-file"
      options:
        max-size: "15m"
        max-file: "3"

  # ============================================================
  # 3. hzx-monitor · 飞书监控 Bot（不对外暴露端口）
  # ============================================================
  hzx-monitor:
    build:
      context: ./hzx-monitor
      dockerfile: Dockerfile
    image: hzx/hzx-monitor:latest
    container_name: hzx-monitor
    restart: unless-stopped
    environment:
      TZ: Asia/Shanghai
      FEISHU_APP_ID: ${FEISHU_APP_ID}
      FEISHU_APP_SECRET: ${FEISHU_APP_SECRET}
      FEISHU_WEBHOOK: ${FEISHU_WEBHOOK}
      # 监控目标
      API_HEALTH_URL: http://hzx-api:8000/api/health
      CHECK_INTERVAL_SECONDS: 60
    volumes:
      - ./:/app/host-project:ro
    depends_on:
      hzx-api:
        condition: service_healthy
    networks:
      - hzx-net
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # ============================================================
  # 4. hzx-redis · 任务队列 + 缓存（基础设施）
  # ============================================================
  hzx-redis:
    image: redis:7.2-alpine
    container_name: hzx-redis
    restart: unless-stopped
    # 【注意】不对外映射端口，仅限容器内网访问
    # ports: []
    command: >
      redis-server
      --requirepass ${REDIS_PASSWORD}
      --appendonly yes
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
    volumes:
      - ./HZX-应用框架/redis:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - hzx-net

# ============================================================
# 网络 & 卷
# ============================================================
networks:
  hzx-net:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16   # 固定子网，方便 iptables 控制

# volumes: 这里我们用的是「绑定挂载」(./xxx)，不用命名卷，方便手动备份
```

### 3.2 配套 `.env` 文件模板

```dotenv
# ============== HZX 系统 · 敏感配置（.env 加到 .gitignore！） ==============

# 飞书开放平台
FEISHU_APP_ID=cli_xxxxxxxxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx

# JWT 鉴权（建议 openssl rand -hex 32 生成）
JWT_SECRET=请替换成32位以上随机字符串

# Redis
REDIS_PASSWORD=请替换成Redis密码

# 站点
SITE_URL=https://hzx.yourdomain.com
```

---

## 四、Dockerfile 分层优化详解

### 4.1 hzx-api · Python FastAPI 后端

**核心原则：依赖层在前、源码层在后 → 最大化缓存命中率**

```dockerfile
# ---------------- Stage 1: 构建/依赖层 ----------------
FROM python:3.11-slim AS builder

WORKDIR /app

# 装系统依赖（curl 给 healthcheck 用）
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl build-essential \
 && rm -rf /var/lib/apt/lists/*

# 👉 先复制 requirements.txt，这层不常变，缓存命中率极高
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---------------- Stage 2: 运行层 ----------------
FROM python:3.11-slim AS runner

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TZ=Asia/Shanghai

# 安装最小运行时依赖
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl tzdata \
 && rm -rf /var/lib/apt/lists/* \
 && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
 && echo $TZ > /etc/timezone

# 从 builder 层复制已安装好的 site-packages
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# 👉 最后复制源码，每次改代码这层 rebuild（前面层全用缓存）
COPY . .

# 非 root 运行（安全加固）
RUN useradd -m -u 1000 hzx && chown -R hzx:hzx /app
USER hzx

EXPOSE 8000

# HEALTHCHECK 指令（Docker 本身支持，比 compose 里 test 更直观）
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

### 4.2 hzx-web · Next.js 前端

**关键：Output Standalone 模式 → 镜像从 1.2GB → 200MB**

```dockerfile
# ---------------- Stage 1: 依赖安装 ----------------
FROM node:20-alpine AS deps
WORKDIR /app

# 先复制 lockfile
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --production=false

# ---------------- Stage 2: 构建 ----------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

RUN yarn build

# ---------------- Stage 3: 运行（极简） ----------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    TZ=Asia/Shanghai

# 独立输出模式：next.config.js 中 output: 'standalone'
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001 \
 && chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV PORT=3000 \
    HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
```

---

## 五、五大关键设计决策（我为什么这样做）

### 决策 1：`depends_on + healthcheck` 而不是 `depends_on`  alone

**踩坑史：**
> 我最早只写了 `depends_on: [hzx-api]`，结果：
> - API 容器启动了但 Uvicorn 还在加载依赖 → 就 2 秒
> - Web 容器一启动就 SSR 请求 API → 502 → Web Crash
> - Compose 认为 Web 退出 → restart 循环 💥

**解决方案：** 强制等 healthcheck 过。API 真能返回 `200 /api/health` 才叫「服务好了」。

---

### 决策 2：共享数据卷 `./HZX-应用框架/` 绑定挂载

**为什么不用 Docker 命名卷？**
| 维度 | 命名卷 | 绑定挂载（我选的） |
|-----|-------|------------------|
| 位置 | `/var/lib/docker/volumes/...` 难找 | 项目目录下，一眼看到 |
| 手动备份 | 要 `docker run --volumes-from` 才行 | 直接 `tar czf` 打包 |
| 跨机器迁移 | 要 export | scp 整个文件夹就走 |
| 宿主机直接编辑 | 不行 | 可以，改配置秒生效 |

**目录结构：**
```
HZX-应用框架/
├── data/              # SQLite 数据库、业务文件
│   └── hzx.db
├── redis/             # Redis AOF 持久化
├── 合同模板/          # 采购合同 Word 模板
└── 导出文件/          # 系统导出的 Excel/PDF
```

---

### 决策 3：Redis 不对外暴露端口 + 密码

- 内网服务 `hzx-net` 内互通就够了
- 加密码 `requirepass` 防止内网其他容器越权
- 固定子网 `172.28.0.0/16`，方便服务器 `iptables` 进一步白名单

---

### 决策 4：日志轮询上限（json-file max-size / max-file）

**踩过的坑：**
> 有一次 hzx-api 出 Bug，打了一堆错误日志。过了三天服务器磁盘 100% 全满……
> 最后 `docker system df` 发现一个容器日志 38GB。

**现在一律加：**
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "20m"
    max-file: "5"
```
每个服务 5 卷 × 20MB = 100MB 封顶。

---

### 决策 5：Monitor 服务不暴露任何端口

hzx-monitor 只做**主动外联**（飞书 API、拉取 Redis 队列），本身不提供服务。
→ 不 `ports:` = 零攻击面。

---

## 六、生产加固 & 日常运维

### 6.1 Nginx 前置反向代理（必做）

我没有直接把 7500/7501 暴露公网，而是走 Nginx：

```nginx
server {
    listen 443 ssl http2;
    server_name hzx.yourdomain.com;

    # SSL（建议用 Certbot）
    ssl_certificate     /etc/letsencrypt/live/hzx.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hzx.yourdomain.com/privkey.pem;

    # 前端
    location / {
        proxy_pass http://127.0.0.1:7500;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        client_max_body_size 20m;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://127.0.0.1:7501/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        # 简单速率限制：单 IP 每分钟最多 300 次请求
        limit_req zone=api burst=50 nodelay;
    }
}
```

### 6.2 运维常用命令（我每天敲的）

```bash
# 🚀 启动 / 停止
docker compose up -d --build        # 重新构建并后台启动
docker compose down                 # 停止并移除容器（数据保留，因为是绑定挂载）
docker compose restart hzx-api      # 只重启 API

# 👀 查看状态
docker compose ps                   # 看容器是否 healthy
docker compose top                  # 看容器内进程

# 📜 日志（最常用）
docker compose logs -f --tail=200 hzx-api      # 跟踪 API 实时日志
docker compose logs hzx-monitor --since=1h     # 看监控最近 1 小时
docker compose logs hzx-web 2>&1 | grep ERROR  # 只看 Web 的错误

# 💊 故障定位神器
docker compose exec hzx-api /bin/bash          # 进 API 容器调试
docker stats --no-stream                        # 实时 CPU/内存/IO

# 💾 一键备份（我加进 crontab，每日凌晨 3 点执行）
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M)
tar czf /backup/hzx-data-$DATE.tar.gz ./HZX-应用框架/
find /backup -name "hzx-data-*.tar.gz" -mtime +7 -delete   # 只留 7 天
```

### 6.3 升级流程（零停机版本）

```bash
# 步骤 1: 拉最新代码
git pull

# 步骤 2: 只构建并重启「改了的服务」，未改的继续服务
docker compose up -d --build --no-deps hzx-api
docker compose up -d --build --no-deps hzx-web

# 步骤 3: 健康检查
until curl -sf http://localhost:7501/api/health; do sleep 1; done
echo "✅ 升级完成，API 已恢复"
```

---

## 七、踩坑集锦（避坑指南）

| # | 坑 | 现象 | 解法 |
|---|----|------|------|
| 1 | **时区偏移** | 定时任务都晚了 8 小时 | 每个容器都强制 `TZ=Asia/Shanghai` + Dockerfile 里软链接 |
| 2 | **Next.js 构建 OOM** | 1G 服务器 build 卡死 | 开 SWAP (`dd if=/dev/zero of=/swapfile bs=1M count=2048`) |
| 3 | **飞书 token 过期** | 两小时后消息发不出去 | 写 `get_tenant_token()` 带缓存 + 401 自动刷新 |
| 4 | **SQLite 锁** | 并发写入报 `database is locked` | 把高频任务改走 Redis 队列，串行写 DB |
| 5 | **Node_modules 体积** | Web 镜像 1.2G+ | Next.js `output: 'standalone'`，多阶段构建 → 200MB |
| 6 | **Healthcheck 卡死** | curl 没装就写 CMD curl | Dockerfile 先 `apt-get install curl` 或者用 `wget` |
| 7 | **Redis 数据丢** | 没开 AOF 重启就空 | `redis-server --appendonly yes` |

---

## 八、后续进化路线

- [ ] **K8s 迁移**：公司业务量破 1000 单/月时
- [ ] **Pg 替换 SQLite**：并发上 100 DAU 时
- [ ] **接入 Prometheus + Grafana**：可视化监控
- [ ] **蓝绿部署**：升级不丢请求

---

## 九、结语

一个人的全栈系统，最怕的是「什么都想搞成微服务」。

Docker Compose 三服务架构对我而言刚好：
- ✅ 复杂度在一个人能掌控的范围
- ✅ 镜像升级、故障定位都很清晰
- ✅ 生产稳定跑了半年零大事故

**架构不在炫，合适最好。**

*—— 仙帝·Zeyan · 于 HZX 线上稳定运行第 180 天记*
