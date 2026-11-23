---
title: GPT API 接入指南：从对话到函数调用
date: 2026-11-23
category: 法宝推荐
tags: GPT, OpenAI, API, AI, 函数调用
summary: 从一次 chat/completions 调用开始，讲到 function calling、JSON 模式、流式与用量控制，附一份能直接用的封装思路与常见坑。
author: 仙帝·Zeyan
slug: gpt-api-guide
pin: false
---

# GPT API 接入指南：从对话到函数调用

> 大模型接入的门槛不在「调用一次」，而在「稳定地调用一千次」。

## 一、最小可用调用

```python
from openai import OpenAI
import os

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "你是严谨的技术助手，回答不超过 300 字。"},
        {"role": "user", "content": "什么是最小权限原则？"},
    ],
    temperature=0.2,
)
print(resp.choices[0].message.content)
```

## 二、参数怎么调

| 参数 | 建议 | 说明 |
| --- | --- | --- |
| `temperature` | 0–0.3 事实类；0.7–1 创意类 | 越高越发散 |
| `max_tokens` | 必设 | 防止超长输出烧钱 |
| `top_p` | 一般不动 | 与 temperature 二选一调 |
| `response_format` | `{"type":"json_object"}` | 需要结构化输出时 |
| `seed` | 固定可复现 | 调试时有用 |

## 三、函数调用（工具调用）

这是让模型「能干活」的关键：

```python
tools = [{
    "type": "function",
    "function": {
        "name": "query_inventory",
        "description": "按 SKU 查询库存数量",
        "parameters": {
            "type": "object",
            "properties": {"sku": {"type": "string"}},
            "required": ["sku"],
        },
    },
}]

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "A123 还有多少库存？"}],
    tools=tools,
    tool_choice="auto",
)

call = resp.choices[0].message.tool_calls[0]
# 1. 在后端执行 call.function.name + json.loads(call.function.arguments)
# 2. 把结果作为 role=tool 的消息回填
# 3. 再请求一次，得到最终回答
```

**三条铁律**：

1. 模型返回的参数**必须校验**（类型、范围、权限），不能直接拼 SQL/命令。
2. 执行失败要把错误作为 `tool` 消息回给模型，让它自己修正。
3. 每轮工具调用设上限（如 5 次），防止死循环。

## 四、结构化输出

需要稳定 JSON 时：

```python
resp = client.chat.completions.create(
    model="gpt-4o-mini",
    response_format={"type": "json_object"},
    messages=[
        {"role": "system", "content": "只输出 JSON，字段：summary, tags(array)"},
        {"role": "user", "content": article},
    ],
)
data = json.loads(resp.choices[0].message.content)  # 仍要做 try/except
```

即便开了 JSON 模式，也要兜底解析失败的情况。

## 五、用量与成本

```python
u = resp.usage
log_usage(
    prompt=u.prompt_tokens,
    completion=u.completion_tokens,
    model="gpt-4o-mini",
)
```

四个省钱手段：设 `max_tokens`、裁历史、缓存固定前缀、简单任务换小模型。

## 六、常见坑

| 现象 | 原因 |
| --- | --- |
| 401 | Key 失效/未加载 env |
| 429 | 限流，需退避重试 |
| 400 `max_tokens` 非法 | 部分模型要求用 `max_completion_tokens` |
| 输出被截断 | 达到 `max_tokens`，需调大或分段 |
| JSON 解析失败 | 未开 JSON 模式或输出混了说明文字 |

## 七、封装建议

我在项目里统一封了一个 `ask()`：

```python
def ask(prompt, system=None, model="gpt-4o-mini", json_mode=False, retries=3):
    ...
    # 统一：超时、重试、用量记账、错误上报
```

所有业务都调它，换模型/换供应商只改一处——这就是「接入一次，处处可用」。

## 结语

GPT 生态最成熟，文档与示例最多，适合作为「第一接入」。真正决定体验的，不是模型多强，而是你有没有做好：**重试、超时、校验、记账**。
