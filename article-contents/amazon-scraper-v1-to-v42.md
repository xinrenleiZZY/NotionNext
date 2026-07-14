# 亚马逊采集系统 V1 到 V4.2：架构演进全记录

## 项目背景

`amazon_scraper_system` 是我个人最早期的项目之一，经历了从简单的单机脚本到完整的分布式采集系统的蜕变。

## 版本演进

### V1.0 — 原型期

最初的版本只是一个 Python 脚本，用 `requests` + `BeautifulSoup` 抓取亚马逊商品页面。

```python
import requests
from bs4 import BeautifulSoup

def scrape_product(url):
    resp = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(resp.text, 'html.parser')
    # ... 解析逻辑
    return product_data
```

**问题：** 单线程、无容错、IP 被限就 GG。

### V2.0 — 多线程 + 代理池

- 引入 `concurrent.futures` 多线程
- 搭建简单的代理池（付费代理 + 自建代理）
- 加入重试机制和异常处理

### V3.0 — Scrapy 框架 + Docker 部署

- 迁移到 Scrapy 框架
- Docker 容器化，统一环境
- 加入 `docker-compose.yml` 编排

### V4.0 — 分布式 Worker 架构

- 引入消息队列（Redis/MQ）
- Master-Worker 架构
- 支持水平扩展

### V4.2 — 准生产级

- 完整的监控和告警
- 自动轮转代理
- 请求频率智能控制
- 数据自动清洗入库

## 架构图

```
[调度器] → [Redis 队列] → [Worker 集群]
                              ↓
                         [代理池] → [亚马逊]
                              ↓
                         [数据清洗] → [数据库]
```

## 技术栈

| 组件 | 技术 |
|------|------|
| 爬虫框架 | Scrapy |
| 容器化 | Docker + Docker Compose |
| 消息队列 | Redis |
| 数据存储 | MongoDB / PostgreSQL |
| 代理管理 | 自建代理池 |
| 监控 | Prometheus + Grafana |

## 经验总结

1. **反爬是永恒的主题** — 没有万能的方案，只有持续升级的策略
2. **日志是最好的朋友** — 分布式系统下，没有日志寸步难行
3. **容错设计决定系统可用性** — 任何一个环节都要考虑失败
4. **监控先行** — 上线前先把监控搭好

---

*从 V1 到 V4.2 踩过的坑，都可以写成一本小说了。*
