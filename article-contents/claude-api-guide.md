---
title: Claude API 接入指南：长文档处理的利器
date: 2026-11-23
category: 法宝推荐
tags: Claude, API, Anthropic, AI, 长文本
summary: Claude 的 Messages API 与 OpenAI 的差异、超长文档的处理策略、流式与工具调用写法，以及把它用在「代码审查 + 长文档」上的实战经验。
author: 仙帝·Zeyan
slug: claude-api-guide
pin: false
---

# Claude API 接入指南：长文档处理的利器

> 有些活适合快，有些活适合稳。Claude 属于后者。

我在两类任务上几乎只用 Claude：**长文档处理**和**代码审查**。这篇记录它的 API 特点与落地细节。

## 一、Messages API：和 OpenAI 不一样的地方

Claude 用的是 Anthropic 的 Messages 接口，最主要的差异：

| 点 | OpenAI | Claude |
| --- | --- | --- |
| 系统提示 | `messages` 里 role=system | 顶层 `system` 参数 |
| 消息角色 | user / assistant / system | 只有 user / assistant |
| 必填参数 | 无 | **必须** `max_tokens` |
| 返回结构 | `choices[0].message` | `content[]` 数组 |
| 多模态 | `image_url` | `source: { type: "base64" }` |

```python
import anthropic, os

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

msg = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=2000,
    system="你是一名资深代码审查员，只关注正确性与安全性。",
    messages=[{"role": "user", "content": "审查这段 Python 代码：\n" + code}],
)
print(msg.content[0].text)
```

> 忘了 `max_tokens` 会直接 400，这是从 OpenAI 迁过来最常见的坑。

## 二、长文档怎么喂

Claude 的优势是长上下文，但「能塞」不等于「塞得好」。我的策略：

1. **分块 + 摘要**：先对每块生成摘要，再基于摘要做全局推理。
2. **结构化输入**：用 XML 风格标签分隔，模型对标签结构理解很稳：

```text
<doc id="1">
  第一份文档内容……
</doc>
<doc id="2">
  第二份文档内容……
</doc>
```

3. **明确引用要求**：让它输出「结论 + 依据片段」，便于核对。

```python
prompt = f"""<docs>{docs}</docs>
请回答：该公司数据出境的合规风险有哪些？
要求：每条结论后附原文引用（用 <quote> 包裹）。"""
```

## 三、流式输出

```python
with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=1500,
    messages=[{"role": "user", "content": "写一段 200 字的项目介绍"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

长文生成时流式几乎是必须的，否则用户会以为卡死。

## 四、工具调用（Tool Use）

Claude 的工具调用协议和 OpenAI 的 function calling 类似但更显式：你要把「工具定义」交给模型，它会返回 `tool_use` 块，由你执行后以 `tool_result` 回填。

```python
tools = [{
    "name": "get_order",
    "description": "按订单号查询订单状态",
    "input_schema": {
        "type": "object",
        "properties": {"order_id": {"type": "string"}},
        "required": ["order_id"],
    },
}]

resp = client.messages.create(
    model="claude-sonnet-4-5", max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "帮我查订单 A123 到哪了"}],
)
for block in resp.content:
    if block.type == "tool_use":
        print(block.name, block.input)  # 交给你的后端执行
```

**关键原则**：模型只负责「决定调用哪个工具、传什么参数」，真正的执行必须在你自己的服务里做校验——这跟我在 doro 里「让模型说话、不让模型动手」是同一个思路。

## 五、代码审查的实战用法

我固定的审查 prompt 结构：

```text
<role>资深后端工程师</role>
<focus>1) 正确性 2) 安全性 3) 并发 4) 可维护性</focus>
<rule>只报真实问题，按严重级别排序，给出行号与修改建议；不要夸奖。</rule>
<diff>...git diff 内容...</diff>
```

这样输出稳定、可贴进 PR 评论，比「帮我看看代码」有效得多。

## 六、成本与限流

- 按 input/output token 分别计价，**长文档主要花在 input**
- 用 `cache_control` 缓存大段固定内容（如知识库），能省不少
- 429 用指数退避；并发别一次打满

## 七、什么时候选 Claude

| 任务 | 建议 |
| --- | --- |
| 50 页合同/报告分析 | ✅ Claude |
| 代码审查、重构建议 | ✅ Claude |
| 实时聊天、桌面陪伴 | 视延迟，Deepseek 更快 |
| 大批量翻译 | 成本优先，Deepseek |

## 结语

Claude 不是「最强模型」，但它在长文本与代码质量上的稳定性，让我愿意为它多付一点钱——**在需要一次做对的场景，贵一点是便宜的**。

---

*相关：[GPT API 接入指南](https://www.juxingspacestation.top/article/gpt-api-guide) · [GPT + Claude 双模型协作](https://www.juxingspacestation.top/article/gpt-claude-duo)*
