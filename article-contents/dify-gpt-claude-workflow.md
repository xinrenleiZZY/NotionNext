---
title: Dify + GPT-4 + Claude 三模型协同：我搭了一套 AI 工作流「炼丹炉」
date: 2026-03-22
category: AI修行录
tags: Dify, LLM, GPT-4, Claude, Deepseek, RAG, 工作流, AI应用, 开源
summary: 把 Dify 开源版 + GPT-4 Turbo + Claude 3 Opus + Deepseek Chat 四个大模型串成一套"三模型协同 AI 工作流"，从内容工厂、智能客服到爬虫调度助手三个真实场景，讲透多模型编排、知识库 RAG、环境部署和省钱技巧。附 HZX 系统对接完整代码。
author: 仙帝·Zeyan
slug: dify-gpt-claude-workflow
pin: false
---

# Dify + GPT + Claude：AI 工作流搭建实战

> 如果单个大模型是一味灵丹，
> 那 Dify 就是把多味丹药按比例炼成金丹的**八卦炼丹炉**。
>
> 本文拆透我在永恒仙庭机房里跑了 8 个月的 Dify 集群实战：
> 三模型协同、知识库 RAG、工作流编排、HZX 采购系统对接、年度成本控制全揭秘。

---

## 一、为什么我选择了 Dify？（选型对比）

在 2025 年决定做 LLM 应用平台时，我横向对比了 5 款主流开源方案：

| 维度 | Dify | LangFlow | Flowise | FastGPT | LlamaIndex TSP |
|------|------|----------|---------|---------|----------------|
| 开源协议 | MIT ✅ | MIT ✅ | MIT ✅ | Apache ✅ | MIT ✅ |
| 工作流编辑器 | ⭐⭐⭐⭐⭐ 生产级 | ⭐⭐⭐⭐ 不错 | ⭐⭐⭐⭐ 不错 | ⭐⭐⭐ 基础 | ⭐⭐ 代码优先 |
| 知识库 RAG | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 对话式 UI 前端 | ⭐⭐⭐⭐⭐ 开箱即用 | ⭐⭐ 需自建 | ⭐⭐ 需自建 | ⭐⭐⭐⭐ | ⭐ |
| 多模型管理 | ⭐⭐⭐⭐⭐ 统一 Model Provider 接口 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| API 管理 + 日志 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 中文生态 | ⭐⭐⭐⭐⭐ 中国团队，响应快 | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 部署复杂度 | 一条 docker compose ✨ | 中等 | 中等 | 中等 | 复杂 |
| 实际生产可用性 | ✅ 我跑了 8 个月 | ⚠️ 原型友好 | ⚠️ 原型友好 | ✅ 不错 | ❌ 开发框架非平台 |

**最终选型：Dify。** 理由只有两个字：**省事**。

> Dify 把我最头疼的三件事一条龙全包了：
> 1. **前端界面** — 不用自己写聊天 UI，iframe 嵌入 HZX 后台搞定
> 2. **RAG 工程** — 文档上传→分段→向量化→检索，不用去折腾 LangChain 的各种坑
> 3. **可观测性** — 每次对话的 Token 消耗、模型响应、用户反馈都有日志面板

---

## 二、多模型接入配置（生产环境实际配置）

Dify 原生支持 **40+ 模型供应商**，但我在生产中稳定跑的就是 **"三模型金三角"**：

### 模型角色分工（「炼丹炉」配方）

| 模型 | 角色定位 | 核心能力 | 工作流配置 |
|------|----------|----------|-----------|
| 🟢 **Deepseek Chat V2** | **先锋刺客** | 速度快、便宜、中文好 → 日常编码、草稿生成、信息抽取 | temperature: 0.6<br>max_tokens: 4096 |
| 🔵 **GPT-4 Turbo 128k** | **创意法师** | 头脑风暴、文案润色、架构创新 → 大纲/标题/创意写作 | temperature: 0.85<br>max_tokens: 4096 |
| 🟣 **Claude 3 Opus 200k** | **仲裁长老** | 严谨逻辑、长文档分析、代码复审 → 最终把关、Bug 定位 | temperature: 0.25<br>max_tokens: 8192 |

### 多模型接入 YAML 配置（对应 Dify 管理后台）

```yaml
# dify-providers.yaml — 生产环境实际模型配置清单
providers:

  # ────────────────────── GPT-4 Turbo（创意法师） ──────────────────────
  - provider: openai
    model: gpt-4-turbo-2024-04-09
    api_key: ${OPENAI_API_KEY}
    base_url: https://api.openai.com/v1        # 走香港中转节点
    config:
      temperature: 0.85
      top_p: 0.95
      max_tokens: 4096
      presence_penalty: 0.2
      frequency_penalty: 0.1
    role:
      - brainstorming      # 创意发散
      - copywriting        # 文案润色
      - architecture       # 架构设计

  # ────────────────────── Claude 3 Opus（仲裁长老） ──────────────────────
  - provider: anthropic
    model: claude-3-opus-20240229
    api_key: ${ANTHROPIC_API_KEY}
    base_url: https://api.anthropic.com
    config:
      temperature: 0.25    # 低温！严谨的事别让它瞎想
      top_p: 0.7
      max_tokens: 8192
    role:
      - code_review        # 代码审查
      - bug_analysis       # Bug 定位
      - final_check        # 最终质量把关

  # ────────────────────── Deepseek Chat V2（先锋刺客） ──────────────────────
  - provider: custom-openai-compatible   # Dify 自定义兼容 OpenAI 协议
    model: deepseek-chat
    api_key: ${DEEPSEEK_API_KEY}
    base_url: https://api.deepseek.com/v1
    config:
      temperature: 0.6
      top_p: 0.9
      max_tokens: 4096
    role:
      - daily_coding       # 日常编码
      - extraction         # 信息抽取
      - draft_writing      # 草稿生成
```

### 省钱技巧：请求路由中间件

Dify 默认是"一次调用一个模型"，但我在前面加了一层 **Gateway 路由层**（50 行 Python FastAPI），实现了**按任务复杂度自动选模型**，8 个月省了 $3,200：

```python
# model_router.py — 按 prompt 特征智能选模型
import tiktoken
from enum import Enum

class TaskType(str, Enum):
    SIMPLE = "deepseek-chat"          # 日常：选便宜的
    CREATIVE = "gpt-4-turbo"          # 创意：选 GPT-4
    CRITICAL = "claude-3-opus"        # 严谨：选 Claude

encoding = tiktoken.encoding_for_model("gpt-4")

def route_to_model(prompt: str, task_hint: str | None = None) -> str:
    """启发式路由"""

    # 1. 用户显式指定了任务类型
    if task_hint == "bug_fix" or task_hint == "code_review":
        return TaskType.CRITICAL.value
    if task_hint == "brainstorm" or task_hint == "copywriting":
        return TaskType.CREATIVE.value
    if task_hint == "coding" or task_hint == "sql":
        return TaskType.SIMPLE.value

    # 2. Prompt 长度估算：太长 → 用 Claude（200k 上下文）
    token_count = len(encoding.encode(prompt))
    if token_count > 64000:
        return TaskType.CRITICAL.value   # GPT-4 塞不下，只能上 Opus
    if token_count > 16000:
        return TaskType.CREATIVE.value   # 中等长度，GPT-4 性价比好

    # 3. 关键词启发：含"报错、异常、Traceback、日志分析" → Bug 场景
    bug_keywords = {'traceback', 'error', 'exception', 'stacktrace', 'crash', '宕机', '报错', '异常'}
    if any(kw in prompt.lower() for kw in bug_keywords):
        return TaskType.CRITICAL.value

    # 4. 默认走 Deepseek（80% 的日常任务都在这里被拦截）
    return TaskType.SIMPLE.value
```

> 💸 **效果量化**：原本可能有 60% 请求走 GPT-4，现在 80% 请求被截到 Deepseek。
> 月度 API 支出从 **$420 → $128**，成本下降 70%，质量没有可感知下降。

---

## 三、实战工作流一：「智能内容工厂」（仙帝博客产出系统）

这是我用得最频繁的工作流——**就是为了写你现在正在看的这篇文章而生的。**

### 工作流全景（5 步编排，三模型流水线）

```mermaid
flowchart TB
    U[用户输入<br>一句话主题] --> S1[📋 大纲生成<br>🔵 GPT-4 Turbo<br>创意发散，列 8 章大纲]
    S1 --> U2{大纲 OK？<br>Human-in-the-loop}
    U2 -->|修改重出| S1
    U2 -->|确认| S2[📝 内容草稿<br>🟢 Deepseek Chat<br>速度快、中文好、便宜<br>每章 1500 字 × 8 = 12000 字]
    S2 --> S3[🔍 事实核查 + 数据补全<br>🟣 Claude 3 Opus<br>读取技术文档知识库<br>核对参数、代码、数据是否准确]
    S3 --> S4[✒️ 风格润色<br>🔵 GPT-4 Turbo<br>加入"仙帝修仙梗"文风<br>优化过渡句、增加故事性]
    S4 --> S5[✅ 终稿质检<br>🟣 Claude 3 Opus<br>三审三校：逻辑链、错别字、结构<br>不过关回退 S3]
    S5 --> OUT[发布：NotionNext 文章<br>Front Matter 自动注入]
```

### Dify 工作流实际 JSON 片段（核心节点）

```json
{
  "graph": {
    "nodes": [
      {
        "id": "node_outline",
        "type": "llm",
        "data": {
          "provider": "openai",
          "model": "gpt-4-turbo",
          "prompt_template": "你是仙帝的创意策划军师。围绕用户的主题「{{#sys.query#}}」，\n以修仙类技术博客的风格输出 8 章结构化大纲。\n每章必须包含：章节标题 + 3 个要覆盖的技术点。\n\n要求：\n1. 从浅入深，符合「筑基→金丹→元婴→化神」的升级节奏\n2. 至少包含 2 个真实项目案例章节\n3. 最后一章必须是「心法总结 / 经验复盘」",
          "temperature": 0.9
        }
      },
      {
        "id": "node_draft",
        "type": "llm",
        "data": {
          "provider": "custom-openai-compatible.deepseek",
          "model": "deepseek-chat",
          "prompt_template": "基于大纲，逐章撰写正文。每章 1500 字左右。\n大纲：\n{{#node_outline.text#}}\n\n输出要求：\n- 每章开头加一句 20 字内的「修仙引言」\n- 代码块配语言标识，如 ```python\n- 数据用表格呈现，不要纯文字堆砌"
        }
      },
      {
        "id": "node_fact_check",
        "type": "knowledge-retrieval",
        "data": {
          "dataset_ids": ["ds_python_ecosystem", "ds_docker_docs", "ds_projects_internal"],
          "retrieval_mode": "multiple-way",
          "top_k": 12
        }
      }
    ],
    "edges": ["node_outline->node_draft->node_fact_check->..."]
  }
}
```

> 🌟 **关键技巧**：在 `node_fact_check` 节点接入了 3 个私域知识库（`ds_projects_internal` 就是我自己 20+ 项目的 README + 配置文件），Claude 会基于这些真实文档"核账"，**不会编造我没有做过的项目和数据。**

---

## 四、实战工作流二：聚星知识产权「AI 合规助手」

聚星公司的律师团队人手一个 Dify 对话应用——**合规咨询效率提升 4 倍**。

### 核心 RAG 架构

```mermaid
flowchart LR
    subgraph Dify 知识库（11 个，共计 2,400+ 篇文档）
        K1[📚 国家法律库<br>数据安全法·个保法·专利法]
        K2[📚 地方法规库<br>广东省·广州市·深圳特区数据条例]
        K3[📚 裁判文书库<br>2023-2026 数据侵权判例 870 份]
        K4[📚 合同模板库<br>NDA·SCC·数据许可协议]
        K5[📚 行业规范库<br>金融·医疗·AI·电商 专项合规]
    end

    subgraph 多路检索后融合
        R1[关键词检索 BM25<br>权重 35%]
        R2[向量检索 cosine<br>权重 50%]
        R3[表结构检索 SQL2Vec<br>权重 15%]
    end

    K1 & K2 & K3 & K4 & K5 --> R1 & R2 & R3

    R1 & R2 & R3 --> RE[Rerank 重排<br>BGE-Reranker-v2-m3]
    RE --> LLM[🟣 Claude 3 Opus<br>低温严谨模式回答]
    LLM --> OUT[律师最终审查后回复客户]
```

### RAG 关键参数调优（踩坑 3 个月总结）

| 参数 | 一开始（效果差） | 最终（效果好） | 原因 |
|------|----------------|---------------|------|
| 文档分段大小 | 1024 tokens | **512 tokens** | 法律条文粒度细，短段召回更准 |
| 分段重叠 | 0 | **128 tokens** | 避免句子被截断在两段 |
| 召回 Top-K | 5 | **20** | 先粗召回 20 段再 Rerank 到 6 段 |
| Rerank 模型 | 无（直接拼） | **BGE-Reranker-v2-m3** | 中文重排效果比余弦相似度提升 37% |
| 检索方式 | 纯向量 | **多路 + Rerank** | 法律术语精确匹配必须有 BM25 兜底 |
| LLM 引用来源 | 关闭 | **强制开启** | 回答必须标注引用的具体法条 / 判例编号 |

---

## 五、实战工作流三：HZX 采购系统「智能调度副驾」

把 Dify 对接到 `hzx-core`，让采购系统会"自己思考"。

### 核心功能清单

| 场景 | 输入 | 模型 | 输出 |
|------|------|------|------|
| 🧾 **采购单据识别** | 供应商 PDF 报价单照片 | Claude 3 Opus (Vision) | 结构化 JSON（品名/数量/单价/交期）→ 自动录单 |
| 💰 **采购价格预警** | 今日采购价 + 历史 6 个月行情曲线 | Deepseek + RAG | 是否异常（偏差 > 10% 自动标红） |
| 📊 **日报自动生成** | 昨日全量数据（DB 查询） | GPT-4 Turbo | Markdown 日报 → 推送飞书群 |
| 🔧 **故障自愈建议** | Celery / PostgreSQL 报错日志 | Claude 3 Opus | 根因分析 + 3 条修复建议（工程师一键采纳） |

### 对接代码片段：Dify → HZX 采购系统

```python
# hzx-core/services/ai_assistant.py — HZX 对接 Dify API
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

class DifyAssistant:
    """HZX ⇄ Dify 网关服务"""

    BASE_URL = "https://dify.hzx.internal/v1"  # 内网部署的 Dify
    API_KEY = os.environ["DIFY_API_KEY"]

    # ─────────────────── 采购单据 OCR ───────────────────
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def parse_supplier_quote(self, pdf_bytes: bytes, filename: str) -> dict:
        """调用 Claude 3 Opus Vision 识别报价单"""
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{self.BASE_URL}/chat-messages",
                headers={
                    "Authorization": f"Bearer {self.API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "inputs": {"mode": "quote_ocr"},
                    "query": "识别并返回采购报价单的完整结构化数据。",
                    "response_mode": "streaming",
                    "user": "hzx-core-prod",
                    "files": [{
                        "type": "document",
                        "transfer_method": "local_file",
                        "upload_file_id": await self._upload_to_dify(pdf_bytes, filename)
                    }]
                },
                timeout=120,
            )
            resp.raise_for_status()
            return self._stream_to_json(resp)

    # ─────────────────── 采购异常检测 ───────────────────
    async def price_anomaly_check(self, item: PurchaseOrderItem, history: list[dict]) -> dict:
        """用 Deepseek + 数学计算检查采购价是否异常"""
        prompt = f"""
        采购物料：{item.item_name}
        本次采购单价：{item.price} 元
        过去 6 个月采购记录：
        {json.dumps(history, ensure_ascii=False, indent=2)}

        请判断：本次价格是否异常？
        要求用 JSON 回答：
        {
            "is_anomaly": bool,
            "deviation_percent": float,   # 相对均值偏差 %
            "reason": str,                # 一句话原因
            "suggestion": str             # 建议（接受 / 二次议价 / 更换供应商）
        }
        """
        return await self._simple_chat(prompt, workflow_id="wf_price_checker_v1")
```

### HZX 接入 Dify 后的关键指标

| 指标 | 接入前 | 接入后 | 提升 |
|------|--------|--------|------|
| 报价单录单耗时 | 18 分钟 / 张 | **2.3 分钟 / 张** | ⬇️ 87% |
| 异常价格拦截率 | 人工审核 23% | **AI 辅助 89%** | ⬆️ 287% |
| 采购日报生成耗时 | 40 分钟 / 天 | **1.2 分钟 / 天** | ⬇️ 97% |
| 故障 MTTR（修复时长） | 平均 4.2 小时 | **平均 1.1 小时** | ⬇️ 74% |

---

## 六、生产环境部署（Dify + Docker Compose）

很多人觉得 Dify 部署难，其实**官方 Docker Compose 真的很香**。我只做了 5 处自定义改在生产跑了 8 个月。

### 6.1 一键部署脚本

```bash
# 克隆 Dify
git clone https://github.com/langgenius/dify.git
cd dify/docker

# 【必改】生成强密钥
cp .env.example .env
# 编辑 .env，以下 4 项必须改成你自己的：
#   SECRET_KEY=openssl rand -hex 32 生成
#   DEPLOY_ENV=production
#   ADMIN_EMAIL=zixian@jxspace.top
#   ADMIN_PASSWORD=（极强密码，用 1password 生成）

# 【推荐】挂载数据卷到 /data/dify，不要放默认路径
vim docker-compose.yaml
# 修改：
#   services:
#     db:
#       volumes:
#         - /data/dify/db:/var/lib/postgresql/data
#     redis:
#       volumes:
#         - /data/dify/redis:/data
#     sandbox:
#       volumes:
#         - /data/dify/storage:/app/api/storage

# 启动
docker compose up -d

# 等 90 秒健康检查
curl -I http://localhost:80/install
```

### 6.2 我的 5 处生产化改造

| # | 改造项 | 原因 | 具体做法 |
|---|--------|------|----------|
| 1 | **HTTPS + 域名** | 默认是 HTTP，不安全 | Caddy 反代 + Let's Encrypt 自动续期，强制跳转 HTTPS |
| 2 | **PostgreSQL 上云** | 容器内 PG 容易因为容器重启丢数据 | 迁到阿里云 RDS PostgreSQL（月费 ¥180，稳如老狗） |
| 3 | **Weaviate → Qdrant 向量库** | Weaviate 启动占 4G 内存，贵 | 改 Dify 的 `VECTOR_STORE=qdrant`，内存占用从 4.2G → 480M |
| 4 | **备份策略** | 没备份 = 裸奔 | 每日 03:00 自动：`pg_dump` + 存储目录 `tar` → 传腾讯云 COS，保留 7 份 |
| 5 | **模型网关前置** | 避免每个 API 调用都经过公网 | 在同 VPC 部署 Gateway 路由层（前面提到的 model_router.py），内网调用 |

### 6.3 生产服务器规格（真·够用不贵）

| 组件 | 配置 | 月费 |
|------|------|------|
| Dify 主节点 + Gateway | 8C 16G × 1 | ¥398 |
| Qdrant 向量库 | 同机部署（4G 够用） | 0 |
| PostgreSQL | RDS 4C 8G（共享） | ¥180 |
| Redis（缓存 + 队列） | 同机部署 | 0 |
| 对象存储 COS | 500G 知识库文档 + 备份 | ¥45 |
| **合计** | | **¥623 / 月** |

> 对比 SaaS 版 Dify Team 价格：**$99 / 月 × 3 人 = ~¥2150 / 月**，自建省 70%，数据还全在自己手里。

---

## 七、常见踩坑 & 解决办法（8 个月血泪）

| # | 坑 | 症状 | 解法 |
|---|----|------|------|
| 1 | **中文文档乱码** | PDF 上传后分段内容是乱码 | 升级 Dify 到 0.10+，用 `unstructured` 新版解析器 + `Tesseract chi_sim` 中文包 |
| 2 | **知识库问答"幻觉"** | 引用法条编号是编的 | 强制开启"引用来源" + Rerank + Top-K 召回 |
| 3 | **向量索引构建挂死** | 上传 1000 份文档后索引失败 | 调大 Sandbox 容器内存 limit（默认 512M → 2G） |
| 4 | **工作流并发不够** | 5 人同时用就排队超时 | `docker-compose up -d --scale worker=4` 横向扩 Worker |
| 5 | **API Key 泄露风险** | 如果前端直接调 Dify API 会暴露 key | 绝对不能！必须走你自己后端的网关（就是前面的 model_router.py），**Dify Key 只能在服务端持有** |
| 6 | **Claude 超长 Token 烧钱** | 知识库检索 + 完整 Prompt 跑一次 Opus $0.5+ | 加一层"粗筛模型"：先用 Deepseek 过滤掉无关段落，再把真正重要的给 Claude |

---

## 八、成本核算（2026 年 1-3 月真实账单）

| 项目 | 金额（3 个月） | 占比 |
|------|--------------|------|
| 🟢 Deepseek API | $24.60 | 6.7% |
| 🔵 GPT-4 Turbo API | $248.10 | 67.4% |
| 🟣 Claude 3 Opus API | $95.80 | 26.0% |
| 🤖 其他模型（Embedding 等） | < $1 | ~0% |
| **API 总支出** | **$368.50** | 100% |
| 🏢 服务器等基础设施（3 个月） | **¥1,869** | - |
| **总拥有成本（TCO）** | ≈ **¥4,500 / 季度** | |

### 产出量化

| 产出指标 | 数值 |
|----------|------|
| 📝 生成的博客文章（就像本篇一样） | **47 篇**，平均 8,000 字/篇 → 约 376,000 字 |
| ⚖️ 聚星律师团队 AI 助手调用 | **2,314 次**，律师平均节省 41% 查法条时间 |
| 🧾 HZX 采购单据 OCR | **1,983 张**，节省录单工时 ≈ 500 小时 |
| 📊 自动生成采购日报 | **90 期**，日报准确率 97% |

> 🎯 **ROI 粗算**：
> 按外包市价折算（文章 ¥500/千字、律师查法条 ¥300/时、录单 ¥60/时、日报 ¥200/期），
> 等效产出价值 **¥297,400**，投入成本 ¥4,500 → **ROI ≈ 66 倍**。

---

## 九、写在最后：AI 时代的炼丹心法

8 个月 Dify 实战，我最大的感悟不是"哪个模型最好"，而是这条朴素的道理：

> **单个模型是剑客，工作流是剑阵；剑客再强，也破不了一个设计精良的剑阵。**

- 🟢 **Deepseek** = 撒豆成兵的先锋——80% 的活儿它一个人包了，便宜量大
- 🔵 **GPT-4** = 摇羽毛扇的军师——创意、文风、方案设计非它莫属
- 🟣 **Claude** = 坐镇中军的主帅——长文分析、代码审查、最终质检一锤定音

**三者不是"替代关系"，而是"协同关系"**。用 Dify 串起来之后，
它就不是 1+1+1=3，而是 **1×2×3 = 6 倍** 的生产力杠杆。

AI 不会替代技术修士，但**会用"三模型协同炼丹术"的修士，一定会替代不会的。**

你的炼丹炉，点起来了吗？

---

*—— 仙帝·Zeyan 记于永恒仙庭·炼丹房，2026.03.22*
