---
title: Deepseek API 接入：国产大模型的选择
date: 2026-11-23
category: 法宝推荐
tags: Deepseek, API, AI, 国产大模型, Python
summary: 为什么我在大量场景里优先用 Deepseek：OpenAI 兼容接口、性价比、上下文与限流实测注意事项，附最小可用接入代码与成本控制清单。
author: 仙帝·Zeyan
slug: deepseek-api-guide
pin: false
---

# Deepseek API 接入：国产大模型的选择

> 选模型不是选「最强」，是选「单位成本内最够用」。

我的项目里有大量 AI 调用：`doro` 的陪伴聊天、内容翻译、代码辅助。Deepseek 是目前我用得最多的一个——不是因为参数最多，而是因为**接入简单、价格可控、国内延迟低**。

## 一、它兼容 OpenAI 接口，这是最大优势

Deepseek 的 API 是 OpenAI-compatible 的，意味着：

- 现有 OpenAI SDK 直接换 `base_url` 和 `key` 就能用
- 切换模型成本极低，可以 A/B 对比
- 生态里的工具（LiteLLM、Dify、各类客户端）天然支持

```python
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["DEEPSEEK_API_KEY"],
    base_url="https://api.deepseek.com/v1",
)

resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一个严谨的技术助手。"},
        {"role": "user", "content": "解释一下什么是幂等。"},
    ],
    temperature=0.3,
    max_tokens=800,
)
print(resp.choices[0].message.content)
```

> 注意 `base_url` 带上 `/v1`，很多「401/404」都是漏了这个后缀。

## 二、两个模型怎么选

| 模型 | 适合 | 特点 |
| --- | --- | --- |
| `deepseek-chat` | 通用对话、写作、代码 | 默认首选，速度快、便宜 |
| `deepseek-reasoner` | 数学、推理、复杂逻辑 | 会输出思维链，慢一些、贵一些 |

经验：**80% 的场景用 chat 就够**，reasoner 留给真正需要一步步推的场景（如复杂 SQL、算法题）。

## 三、流式输出：体验的关键

```python
stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages,
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
```

流式能让首字延迟从「等 5 秒」变成「0.8 秒出字」，对桌面宠物、聊天窗这种交互场景，体感差别巨大。

## 四、成本控制：四个动作

1. **设 `max_tokens`**：不设的话模型可能写到你预算爆掉。
2. **截断历史**：只带最近 N 轮对话（我在 doro 里保留 30 轮），别把整个会话都塞进去。
3. **缓存系统提示**：固定的 system prompt 尽量保持前缀一致，可命中服务端缓存。
4. **记账**：每次调用记录 `prompt_tokens / completion_tokens`，按天汇总。

```python
usage = resp.usage
cost = usage.prompt_tokens * PRICE_IN + usage.completion_tokens * PRICE_OUT
```

没有这行记账，月底只能对着账单发呆。

## 五、错误处理：三类必须区分

| 错误 | 含义 | 处理 |
| --- | --- | --- |
| 401 | Key 无效/额度耗尽 | 不重试，告警 |
| 429 | 触发限流 | 退避重试（指数退避） |
| 5xx / 超时 | 服务端抖动 | 重试 2–3 次 |

```python
@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10),
       retry=retry_if_exception_type((RateLimitError, APITimeoutError)))
def ask(...):
    ...
```

## 六、密钥安全

- Key 只放服务端/环境变量，**永远不要进前端**
- 桌面应用（如 doro）用 `Electron safeStorage` 加密后存本地，渲染层拿不到
- 定期轮换；一旦怀疑泄露立刻重置

## 七、我的使用分工

| 场景 | 选择 |
| --- | --- |
| 日常写作/翻译/总结 | Deepseek chat |
| 复杂推理、架构设计 | Deepseek reasoner 或 Claude |
| 代码审查 | Claude 更稳，Deepseek 更快 |
| 长文档处理 | Claude（长上下文更稳） |

## 结语

Deepseek 的价值在于「够用且便宜」，配合 OpenAI 兼容接口，让它成为默认选项、让更贵的模型只处理难题——这才是成本与质量的最优解。

---

*相关：[GPT + Claude 双模型协作](https://www.juxingspacestation.top/article/gpt-claude-duo) · [Dify + GPT + Claude 工作流](https://www.juxingspacestation.top/article/dify-gpt-claude-workflow)*
