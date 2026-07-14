# Docker Compose 编排的艺术：HZX 管理系统全栈设计

## 系统架构

HZX 采购管理系统采用三服务架构：

```
hzx-web (Next.js 15)  →  :7500  前端界面
hzx-api (FastAPI)     →  :7501  后端 API
hzx-monitor (Python)  →  --     飞书监控 Bot
```

## Docker Compose 配置

```yaml
services:
  hzx-api:
    build: ./hzx-api
    ports:
      - "7501:8000"
    volumes:
      - ./HZX-应用框架:/app/data
      - ./:/app/project
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  hzx-web:
    build: ./hzx-web
    ports:
      - "7500:3000"
    environment:
      - API_BASE_URL=http://hzx-api:8000
    depends_on:
      hzx-api:
        condition: service_healthy

  hzx-monitor:
    build: ./hzx-monitor
    environment:
      - FEISHU_APP_ID=${FEISHU_APP_ID}
      - FEISHU_APP_SECRET=${FEISHU_APP_SECRET}
    volumes:
      - ./:/app/project
```

## 关键设计理念

### 1. 依赖控制

`depends_on` + `healthcheck` 确保服务按顺序启动：

```
hzx-monitor → hzx-api → hzx-web
              ↓
         健康检查通过后，web 才会启动
```

### 2. 数据持久化

```yaml
volumes:
  - ./HZX-应用框架:/app/data   # 配置文件持久化
  - ./:/app/project            # 项目数据共享
```

### 3. 环境变量管理

使用 `.env` 文件管理敏感配置：

```
FEISHU_APP_ID=cli_xxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxx
```

## Docker 部署技巧

### 构建加速

使用 Docker 缓存层优化：

```dockerfile
# 先复制依赖文件，安装后再复制源码
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
```

### 日志管理

所有服务的日志通过 Docker 统一收集：

```bash
docker-compose logs -f --tail=100
```

---

*一个好的 Docker 编排，就是一个优秀的数字化管家。*
