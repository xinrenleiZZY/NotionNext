---
title: Python 数据采集：从入门到准生产级
date: 2026-11-23
category: 功法阁
tags: Python, 爬虫, 数据采集, FastAPI, 反爬, 亚马逊
summary: 从「一个脚本能跑」到「准生产级采集系统」需要补的六件事：分层架构、节奏控制、去重与断点、失败重试、数据落库、可观测性。附 amazon_scraper_system 的真实目录结构。
author: 仙帝·Zeyan
slug: python-scraping-guide
pin: false
---

# Python 数据采集：从入门到准生产级

> 写爬虫的第一天靠技巧，第十天靠节奏，第一百天靠工程。

`anti_scraping` 这个仓库里的 `amazon_scraper_system`，从最开始的单文件脚本，迭代到现在的分层服务。这篇讲清楚「脚本」和「准生产级采集系统」之间差了什么。

## 一、先看最终形态

```
backend/                      # 后端服务（FastAPI）
├── app/
│   ├── main.py              # 入口，注册路由
│   ├── config.py            # 读取 .env
│   ├── database.py          # PostgreSQL 连接池、会话管理
│   ├── models.py            # SQLAlchemy ORM 表结构
│   ├── schemas.py           # Pydantic 请求/响应模型
│   ├── crud.py              # 数据库读写
│   └── scraper/             # 爬虫模块
├── scraper_config.json      # 关键词、目标站点等配置
```

这个结构解决的不是「能不能爬到」，而是四件事：**采集与存储解耦、配置外置、接口契约、可重跑**。

## 二、节奏：决定爬虫寿命的不是技巧

反爬对抗里，最有效的从来不是「更高级的破解」，而是**让请求看起来像正常用户**：

| 维度 | 做法 | 说明 |
| --- | --- | --- |
| 频率 | 随机间隔（如 3–8 秒）+ 每轮限流 | 固定间隔是最明显的机器特征 |
| UA | 轮换真实 UA 池 | 别用默认 `python-requests/x.x` |
| 失败退避 | 指数退避 1s → 2s → 4s → 8s | 连续失败就停，别硬刚 |
| 代理 | 按目标站点分流 | 亚马逊这类站点，IP 质量比算法重要 |
| 会话 | 复用 Cookie / Session | 复用能显著降低验证码概率 |

代码上就三行：

```python
import random, time
def polite_sleep(base=3.0, jitter=5.0):
    time.sleep(base + random.random() * jitter)
```

这条规则的价值，跑一周就能看出来：固定 1 秒间隔的脚本通常 2 小时被封，随机 3–8 秒的能活好几天。

## 三、去重与断点：别每次都从头爬

生产采集必须有「任务状态」。最小实现：

```sql
CREATE TABLE crawl_task (
  id BIGSERIAL PRIMARY KEY,
  keyword   TEXT NOT NULL,
  page_no   INT  NOT NULL,
  status    TEXT NOT NULL DEFAULT 'pending',  -- pending/running/done/failed
  attempts  INT  NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (keyword, page_no)
);
```

好处：

- **断点续采**：进程挂了重启，只跑 `status != 'done'` 的任务
- **去重**：`UNIQUE(keyword, page_no)` 天然防重复入队
- **可观测**：随时查「还剩多少页没采」

数据本身同理，用业务唯一键（如 ASIN + 站点 + 日期）做 upsert，而不是每次 `INSERT`。

## 四、失败处理：把「重试」当成一等公民

```python
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

@retry(
    retry=retry_if_exception_type((TimeoutError, ConnectionError)),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=15),
)
def fetch(url):
    ...
```

三条规则：

1. **只重试可重试的错误**：超时、连接重置、5xx；404/403 重试无意义。
2. **重试要有上限**：无限重试会把队列堵死。
3. **失败要留痕**：失败的 URL 落表，后续可补采，而不是只在日志里。

## 五、落库：ORM 不是装饰

`models.py` 用 SQLAlchemy 定义表，`schemas.py` 用 Pydantic 定义出入参，`crud.py` 只做数据操作。三层分开带来的直接收益：

- 换数据源不需要改数据库层
- 接口字段有契约，前端不会拿到「忽有忽无」的 JSON
- 单测可以直接对 `crud` 层做，不必起爬虫

连接池参数也别忽略（PostgreSQL）：

```python
engine = create_engine(
    DATABASE_URL,
    pool_size=10, max_overflow=20, pool_pre_ping=True, pool_recycle=1800
)
```

`pool_pre_ping=True` 能救掉「隔夜连接失效」这一类经典问题。

## 六、可观测性：没有监控的采集等于没采

最低配三件套：

| 指标 | 怎么看 |
| --- | --- |
| 采集成功率 | `done / (done + failed)`，低于 95% 告警 |
| 单页耗时 | 突然翻倍说明被限流或网络异常 |
| 数据量趋势 | 某天入库量骤降，通常是选择器失效 |

我现在的做法是：每轮结束把「新增/更新/失败」三个数字推到飞书，异常直接 @ 自己。**采集系统的第一个用户应该是你自己。**

## 七、一个必须提醒的法律边界

采集公开数据不等于可以随意采集。至少守住三条：

1. 只采公开可见内容，不绕过登录与付费墙
2. 遵守目标站点的robots 与用户协议
3. 不采集个人信息；跨境场景还要看数据出境合规（见《跨境数据合规》一篇）

## 结语

从脚本到准生产，差的不是更花哨的反爬技巧，而是这六件事：**分层、节奏、去重、重试、落库、监控**。做到这六件，采集系统才算「能长期跑」——而不是「今天能跑」。

---

*项目地址：[anti_scraping](https://github.com/xinrenleiZZY/anti_scraping)（amazon_scraper_system）*
