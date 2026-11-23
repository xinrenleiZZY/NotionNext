---
title: OpenClaw 云函数平台部署实战
date: 2026-11-23
category: 功法阁
tags: OpenClaw, Serverless, 云函数, 部署, 网关
summary: 从本地到云函数：环境准备、配置注入、依赖打包、冷启动与日志排查，以及一套「先本地跑通再上云」的部署顺序。
author: 仙帝·Zeyan
slug: openclaw-deploy-guide
pin: false
---

# OpenClaw 云函数平台部署实战

> Serverless 的坑不在写代码，在「它到底有没有按你以为的方式跑」。

OpenClaw 平台提供云函数能力，适合把「定时抓取、消息转发、Webhook 中转」这类轻逻辑跑在云端。这篇按部署顺序记录要点。

## 一、先分清「本地能跑」和「云上能跑」

本地跑通 ≠ 云上跑通，差异主要在四处：

| 维度 | 本地 | 云函数 |
| --- | --- | --- |
| 运行环境 | 你自己的 Python/Node | 平台指定版本 |
| 依赖 | 全局已装 | 必须随包上传 |
| 状态 | 有磁盘、有常驻进程 | 无状态、随时被回收 |
| 网络 | 直连 | 有出网限制/白名单 |

**第一条铁律**：云函数必须无状态——所有需要持久化的东西放外部存储（数据库/对象存储）。

## 二、环境与依赖

以 Python 为例：

```bash
# 只装运行所需依赖到本地目录
pip install -r requirements.txt -t ./vendor --no-cache-dir
```

要点：

- 不要用 `pip install` 到系统环境再打包，容易带进无关包
- 二进制依赖（如 `psycopg2`）要与云端架构/版本一致
- 体积越小冷启动越快，能拆就拆

## 三、配置注入

密钥永远不要写进代码。用平台的环境变量：

```python
import os
DB_URL = os.environ["DB_URL"]
FEISHU_WEBHOOK = os.environ["FEISHU_WEBHOOK"]
```

启动时做一次校验，缺了就直接报错，比跑一半才崩好排查：

```python
required = ["DB_URL", "FEISHU_WEBHOOK"]
missing = [k for k in required if not os.getenv(k)]
if missing:
    raise RuntimeError(f"missing env: {missing}")
```

## 四、入口函数与超时

平台一般要求固定入口签名：

```python
def handler(event, context):
    try:
        payload = json.loads(event.get("body") or "{}")
        do_work(payload)
        return {"statusCode": 200, "body": "ok"}
    except Exception as e:
        # 一定要打日志，否则只能看到 "500"
        print("ERROR", repr(e))
        return {"statusCode": 500, "body": str(e)}
```

超时是最容易被忽略的配置：默认往往 3–10 秒，长任务必须调大，或者改造成「触发 + 异步处理」。

## 五、冷启动与预热

- 依赖越多、体积越大，冷启动越慢
- 把「连接数据库/初始化客户端」放在函数外层（模块级），可复用热实例
- 低频定时任务可以接受冷启动；面向用户的接口必须预热

```python
# 模块级初始化，热实例复用
db_pool = create_pool(os.environ["DB_URL"])

def handler(event, context):
    ...
```

## 六、日志与排查

上线后第一时间确认三件事：

1. 触发有没有到（打印 `event` 前 200 字符）
2. 依赖有没有加载（打印关键库版本）
3. 出网是否正常（调用一次外部健康检查接口并打日志）

我在所有云函数开头加一行 `print("[invoke]", context.request_id, event.get("path"))` —— 出问题时能立刻区分「没触发」和「触发了但失败」。

## 七、上线顺序

1. 本地单元测试通过
2. 打包体积确认（< 平台限制）
3. 测试环境部署 + 手动触发
4. 灰度：先接一个低频任务
5. 观察 24 小时日志与告警
6. 全量切换

## 结语

云函数省的是运维，不是调试。把「无状态、依赖打包、配置注入、日志可查」这四件事做对，Serverless 才真的省心。
