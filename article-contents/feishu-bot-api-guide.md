---
title: 飞书 API 接入实战：从消息机器人到 HZX 智能调度中枢
date: 2026-02-14
category: 工程札记
tags: 飞书, Lark, Bot, API, 自动化, 交互式卡片, Python, 消息推送
summary: HZX 采购系统里飞书 Bot 的完整演进史。从最简单的 Webhook 消息推送，到群聊关键词监控触发任务、交互式审批卡片、定时日报、告警中枢，附 Token 管理、QPS 限速、踩坑清单等生产级经验。
author: 仙帝·Zeyan
slug: feishu-bot-api-guide
pin: false
---

# 飞书 API 接入实战：从 Bot 到自动化工作流

> 飞书 Bot 是 HZX 采购系统的"嘴巴 + 耳朵 + 神经系统"——
> 嘴巴会说话（日报/告警），耳朵会听话（群聊指令），神经会调度（触发任务）。
>
> 本文从 0 到 1 拆解我在生产环境跑了 11 个月的飞书机器人，含完整代码与踩坑清单。

---

## 一、项目缘起：HZX 系统里飞书 Bot 的三阶段进化

| 阶段 | 时间 | 功能 | 日均交互量 |
|------|------|------|-----------|
| V1.0 传声筒 | 2025.04 | 单一 Webhook 推消息：采购异常、Celery 报错 | ~120 条/天 |
| V2.0 监测站 | 2025.08 | 收消息：群聊关键词监控 → 自动触发任务 | ~600 次/天 |
| V3.0 调度中枢 | 2025.12 | 交互式卡片 + 审批流 + 命令式对话 + 多租户支持 | **~3,400 次/天** |

现在 HZX 系统里 80% 的"人与系统交互"都不需要登录后台——**在飞书群里 @Bot 就能搞定。**

---

## 二、飞书 Bot 开发：从零到跑通第一条消息

### 2.1 三步创建应用

1. 🔑 打开 **飞书开放平台** → https://open.feishu.cn → 创建企业自建应用
2. 📇 填好应用名、图标、描述 → 拿到 **App ID** 和 **App Secret**
3. 🚀 发布版本 → 企业管理员审核通过（开发期可以加测试人员白名单免审）

### 2.2 权限配置（HZX 用到的权限全景）

权限千万不要一次性全开！**最小权限原则**，开多了安全合规部会找上门：

```json
// HZX-Bot 实际权限清单（3 类 9 条）
{
  "消息与群组 (IM)": [
    "im:message",           // 发送消息
    "im:message.group_at_msg:readonly",   // 接收群里 @机器人 的消息
    "im:message.p2p_msg:readonly",        // 接收私聊消息
    "im:chat",             // 获取群信息 / 群成员
    "im:chat:readonly"
  ],
  "通讯录 (Contact)": [
    "contact:user.base:readonly",         // 读用户基本信息（名字/头像/邮箱）
    "contact:user.id:readonly"            // 读 open_id / user_id（@人用）
  ],
  "审批 (Approval)": [
    "approval:approval:readonly",
    "approval:task"
  ]
}
```

### 2.3 第一滴血：用 Webhook 发消息（最简单）

最基础的玩法——飞书群 → 群设置 → 添加机器人 → 自定义 → 拿到 Webhook URL（5 秒搞定，不需要创建应用）。

```python
"""最简版：飞书自定义机器人 Webhook 发送"""
import hashlib
import hmac
import base64
import time
import httpx

WEBHOOK_URL = "https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx"
WEBHOOK_SECRET = "abc123_secret_salt"  # 创建机器人时设置的签名密钥

def _gen_sign(timestamp: int) -> str:
    """HMAC-SHA256 签名（不开签名校验可以跳过）"""
    string_to_sign = f"{timestamp}\n{WEBHOOK_SECRET}"
    hmac_code = hmac.new(
        string_to_sign.encode("utf-8"),
        digestmod=hashlib.sha256
    ).digest()
    return base64.b64encode(hmac_code).decode("utf-8")

async def send_text(message: str):
    timestamp = int(time.time())
    async with httpx.AsyncClient() as client:
        await client.post(WEBHOOK_URL, json={
            "timestamp": str(timestamp),
            "sign": _gen_sign(timestamp),
            "msg_type": "interactive",  # ✅ 推荐：交互式卡片（比富文本美观 10 倍）
            "card": {
                "config": {"wide_screen_mode": True},
                "header": {
                    "title": {"tag": "plain_text", "content": "🎯 HZX 采购系统通知"},
                    "template": "blue"
                },
                "elements": [
                    {"tag": "markdown", "content": message},
                    {"tag": "hr"},
                    {"tag": "note", "elements": [
                        {"tag": "plain_text", "content": f"HZX-Bot · {time.strftime('%Y-%m-%d %H:%M:%S')}"}
                    ]}
                ]
            }
        })

# 调用
await send_text(f"""
**【采购异常警报】**
> 物料编号：`SKU-88427`
> 本次采购价：**¥168.00**
> 历史均价：**¥92.30**（偏差 **+82%**）
> 建议：⚠️ 二次议价 / 更换供应商
""")
```

> 💡 **关键选择**：能发 interactive card 就不要发 text / post。
> 卡片支持 Markdown、表格、按钮、色彩主题，**体验差距就像 QQ 短信 vs iMessage**。

---

## 三、进阶能力 1：Token 管理 + 请求客户端封装

"自己写 Webhook 发消息只能 10 人小团队用，要做大必须上 **开放平台完整 SDK 模式**"——

### 3.1 tenant_access_token 生命周期管理（最容易踩的坑 #1）

```python
"""飞书 Token 管理器：双缓存 + 自动刷新
   
   坑：Token 有效期只有 2 小时，且刷新期间旧 Token 只有 30 秒宽限期。
   策略：提前 15 分钟就刷新，进程内内存缓存 + Redis 分布式缓存双保险。
"""
import time
import threading
import redis.asyncio as aioredis

class FeishuTokenManager:
    CACHE_KEY = "feishu:tenant_access_token"
    REFRESH_BEFORE_EXPIRE = 900  # 提前 15 分钟刷新

    def __init__(self, app_id: str, app_secret: str, redis: aioredis.Redis):
        self.app_id = app_id
        self.app_secret = app_secret
        self.redis = redis
        self._local_token: str | None = None
        self._local_expire_at: float = 0.0
        self._lock = threading.Lock()

    async def get_token(self) -> str:
        now = time.time()

        # 1) 进程内缓存命中且还剩 >15 分钟 → 直接用
        if self._local_token and now < self._local_expire_at - self.REFRESH_BEFORE_EXPIRE:
            return self._local_token

        # 2) 查 Redis 分布式缓存（多 Worker 共用）
        redis_token = await self.redis.getex(self.CACHE_KEY)
        if redis_token:
            ttl = await self.redis.ttl(self.CACHE_KEY)
            self._local_token = redis_token.decode()
            self._local_expire_at = now + ttl
            if ttl > self.REFRESH_BEFORE_EXPIRE:
                return self._local_token

        # 3) 两级都 miss → 调 API 刷新（加锁防止惊群）
        with self._lock:
            return await self._refresh_token()

    async def _refresh_token(self) -> str:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
                json={"app_id": self.app_id, "app_secret": self.app_secret},
                timeout=10,
            )
            data = resp.json()
            assert data["code"] == 0, f"飞书 Token 刷新失败: {data}"

            token = data["tenant_access_token"]
            expire = data["expire"]
            self._local_token = token
            self._local_expire_at = time.time() + expire
            # 写 Redis，TTL 比实际短 15 分钟
            await self.redis.setex(self.CACHE_KEY, int(expire) - 900, token)
            return token
```

### 3.2 统一 Feishu 客户端（含 QPS 限速）

```python
"""飞书 API 客户端：
   
   坑 #2：QPS 限制严格 —— 单应用发送消息默认 100 次/分钟，超了直接 99991400 错误。
   策略：Token Bucket 限速器 + 失败指数退避重试。
"""
from aiolimiter import AsyncLimiter  # pip install aiolimiter

class FeishuClient:
    BASE = "https://open.feishu.cn/open-apis"

    def __init__(self, token_mgr: FeishuTokenManager):
        self.token_mgr = token_mgr
        self._limiter = AsyncLimiter(max_rate=90, time_period=60)  # 比官方 100 留 10% 余量

    @retry(stop=stop_after_attempt(4), wait=wait_exponential(min=0.5, max=10),
           retry=retry_if_exception_type((httpx.HTTPStatusError, RateLimitError)))
    async def _request(self, method: str, path: str, **kwargs) -> dict:
        """统一请求封装"""
        async with self._limiter:  # Token Bucket 限速
            token = await self.token_mgr.get_token()
            kwargs.setdefault("headers", {})["Authorization"] = f"Bearer {token}"

            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.request(method, f"{self.BASE}/{path.lstrip('/')}", **kwargs)
                # 限速错误抛给 retry 机制
                if resp.status_code == 429 or (resp.status_code == 200 and
                    resp.json().get("code") == 99991400):
                    raise RateLimitError("飞书 API 限速")
                resp.raise_for_status()
                data = resp.json()
                if data.get("code") != 0:
                    raise FeishuAPIError(data["code"], data.get("msg"))
                return data

    # ───────────────── 常用 API 快捷方法 ─────────────────
    async def send_card_to_chat(self, chat_id: str, card: dict) -> str:
        """给指定群发卡片，返回 message_id"""
        r = await self._request("POST", "im/v1/messages", params={"receive_id_type": "chat_id"},
                                json={"receive_id": chat_id, "msg_type": "interactive",
                                      "content": json.dumps(card)})
        return r["data"]["message_id"]

    async def reply_card(self, message_id: str, card: dict):
        """在一条消息下面回复卡片（对话流必备）"""
        return await self._request("POST", f"im/v1/messages/{message_id}/reply",
                                   json={"msg_type": "interactive",
                                         "content": json.dumps(card)})

    async def list_chat_members(self, chat_id: str) -> list[dict]:
        """获取群成员（用于 @人、审批人选择）"""
        members = []
        page_token = None
        while True:
            r = await self._request("GET", f"im/v1/chats/{chat_id}/members",
                                    params={"page_token": page_token, "page_size": 100})
            members.extend(r["data"]["items"])
            if not r["data"].get("has_more"):
                break
            page_token = r["data"]["page_token"]
        return members
```

---

## 四、进阶能力 2：群聊消息监听 → 任务自动触发

HZX 的"神来之笔"：采购员在群里说 `@HZX-Bot 查 SKU-88427 最近报价`，机器人直接回卡片。

### 4.1 订阅事件 + 回调处理

飞书事件回调是"发布-订阅"模式，要做好 **URL 校验 + 消息幂等 + 加密解密** 三件套：

```python
"""FastAPI 路由：飞书事件回调"""
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()

@app.post("/api/v1/feishu/events")
async def feishu_events(req: Request):
    body_bytes = await req.body()
    body = json.loads(body_bytes)

    # 1) URL 校验（飞书首次配置回调时会发 challenge）
    if body.get("type") == "url_verification":
        return {"challenge": body["challenge"]}

    # 2) 校验签名（防止伪造回调）
    await verify_event_signature(req.headers, body_bytes)  # 用 Encrypt Key 校验

    # 3) 事件分发：im.message.receive_v1
    event = body.get("event", {})
    if body.get("header", {}).get("event_type") == "im.message.receive_v1":
        # 4) 幂等：同一条消息处理过就跳过（飞书可能会重推 3 次）
        msg_id = event["message"]["message_id"]
        if await redis.setnx(f"feishu:msg:processed:{msg_id}", "1"):
            await redis.expire(f"feishu:msg:processed:{msg_id}", 3600)
            asyncio.create_task(handle_user_message(event))  # 异步处理，立即返回 200

    # 飞书要求必须尽快返回 200，否则会重推
    return {"code": 0}
```

### 4.2 指令解析器

我把消息解析做成了"装饰器路由模式"，和 Flask 路由一样好用：

```python
"""HZX-Bot 指令解析器 —— 支持自然语言 + 命令式双模式"""
import re
from functools import wraps

class CommandRouter:
    def __init__(self):
        self._handlers: list[tuple[re.Pattern, callable]] = []

    def route(self, pattern: str):
        """装饰器：注册正则路由"""
        regex = re.compile(pattern, re.IGNORECASE)
        def decorator(fn):
            self._handlers.append((regex, fn))
            @wraps(fn)
            def wrapper(*args, **kwargs):
                return fn(*args, **kwargs)
            return wrapper
        return decorator

    async def dispatch(self, text: str, context: dict):
        for regex, handler in self._handlers:
            m = regex.search(text)
            if m:
                return await handler(m, context)
        # 兜底：走 LLM 意图识别（Dify 工作流）
        return await llm_fallback(text, context)

router = CommandRouter()

# ───────── 注册指令（可以无限扩展）─────────
@router.route(r"(查|查询|报价|价格).*SKU[-_]?(\w+)")
async def _cmd_price(match, ctx):
    action, sku = match.group(1), match.group(2)
    rows = await db.query_price_history(sku, days=90)
    return render_price_card(sku, rows)  # 返回飞书卡片 JSON

@router.route(r"(日报|采购日报|昨天情况)")
async def _cmd_daily(match, ctx):
    stats = await compute_yesterday_stats()
    return render_daily_report_card(stats)

@router.route(r"(审批|通过|同意).*PO(\d+)")
async def _cmd_approve(match, ctx):
    _, po_no = match.group(1), match.group(2)
    result = await approve_purchase_order(ctx["sender_open_id"], po_no)
    return render_result_card(result)
```

> 🎯 效果：采购员现在习惯直接在群里 @机器人 下单，**HZX 后台日均登录 UV 下降了 64%**。

---

## 五、进阶能力 3：交互式审批卡片 + 回调

飞书最强大的不是"消息"，而是"**卡片上点按钮，后端能收到回调**"——这就是一个轻量级审批系统。

### 5.1 设计一张采购审批卡

```python
"""HZX 超标采购单审批卡片"""
def build_purchase_approval_card(po: PurchaseOrder) -> dict:
    return {
        "config": {"wide_screen_mode": True, "enable_forward": True},
        "header": {
            "title": {"tag": "plain_text", "content": f"📋 采购审批 · PO-{po.no:06d}"},
            "template": "red" if po.amount > 50000 else "orange"
        },
        "elements": [
            # ① 基本信息（Markdown 表格）
            {"tag": "markdown", "content": f"""
| 项目 | 详情 |
|------|------|
| 🛒 **采购单** | `PO-{po.no:06d}` |
| 📦 **物料** | {po.item_name} |
| 🧾 **数量** | {po.quantity} × **¥{po.unit_price:,.2f}** |
| 💰 **总金额** | **¥{po.amount:,.2f}**（⚠️ 超标 ¥{po.amount - 50000:,.2f}） |
| 🏢 **供应商** | {po.supplier_name} |
| 📅 **期望交期** | {po.delivery_date.strftime('%Y-%m-%d')} |
| 👤 **采购员** | <at id={po.buyer_open_id}></at> |
"""},
            {"tag": "hr"},
            # ② 按钮组（三个动作，value 会原封不动回传后端）
            {
                "tag": "action",
                "actions": [
                    {
                        "tag": "button",
                        "text": {"tag": "plain_text", "content": "✅ 批准"},
                        "type": "primary",
                        "value": {"action": "approve", "po_no": po.no}
                    },
                    {
                        "tag": "button",
                        "text": {"tag": "plain_text", "content": "❌ 驳回"},
                        "type": "danger",
                        "value": {"action": "reject", "po_no": po.no}
                    },
                    {
                        "tag": "button",
                        "text": {"tag": "plain_text", "content": "💬 转议价"},
                        "type": "default",
                        "value": {"action": "negotiate", "po_no": po.no}
                    },
                ]
            },
            {"tag": "note", "elements": [{"tag": "plain_text",
                "content": f"HZX-Bot · {datetime.now().strftime('%Y-%m-%d %H:%M')} · 超时 48 小时自动驳回"}]}
        ]
    }
```

### 5.2 卡片回调处理

```python
"""FastAPI：卡片交互回调"""
@app.post("/api/v1/feishu/card-action")
async def feishu_card_action(req: Request):
    body = await req.json()
    if body.get("type") == "url_verification":
        return {"challenge": body["challenge"]}

    action = body["action"]
    value = action["value"]   # 就是按钮上设置的 value：{"action":"approve","po_no":123}
    operator_id = action["operator"]["open_id"]
    operator_name = action["operator"]["name"]

    # 分发处理
    match value.get("action"):
        case "approve":
            result = await approve_purchase_order(operator_id, value["po_no"])
            update = f"✅ 已由 **{operator_name}** 批准，采购单下发至仓储部"
        case "reject":
            result = await reject_purchase_order(operator_id, value["po_no"])
            update = f"❌ 已由 **{operator_name}** 驳回，原因：{result.reason}"
        case "negotiate":
            result = await transfer_to_negotiation(operator_id, value["po_no"])
            update = f"💬 已转入议价流程，对接人：{result.assignee}"

    # ✨ 关键：把原卡片更新掉（而不是新发一条），让审批结果"原地生效"
    await feishu_client.update_message(
        message_id=body["context"]["open_message_id"],
        card=merge_status_into_card(body["open_message_id"], update)
    )
    return {}
```

> 🎉 HZX 的审批流程现在是 **"72 小时完成率 94%"**，之前跑线下 Excel 审批时只有 58%。

---

## 六、进阶能力 4：定时任务 + 日报推送

结合 `APScheduler`，让 HZX 每天早上自动来"请安"：

```python
"""调度器：飞书定时推送"""
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

sched = AsyncIOScheduler(timezone="Asia/Shanghai")

# ────────── 每天 09:30 推采购日报 ──────────
@sched.scheduled_job(CronTrigger(hour=9, minute=30))
async def daily_morning_report():
    """昨日采购情况汇总 → 推到 3 个群"""
    stats = await compute_yesterday_stats()
    card = render_daily_report_card(stats)

    for chat_id in PURCHASE_GROUP_CHAT_IDS:
        try:
            await feishu_client.send_card_to_chat(chat_id, card)
        except Exception as e:
            logger.error(f"日报推送失败 chat={chat_id}: {e}")

# ────────── 每 10 分钟巡检 Celery Worker ──────────
@sched.scheduled_job("interval", minutes=10)
async def celery_worker_health_check():
    """Worker 不干活了 → 飞书告警"""
    alive_workers, dead_workers = await inspect_celery_cluster()
    if dead_workers:
        await feishu_client.send_card_to_chat(OPS_GROUP_CHAT_ID,
            render_alert_card("Celery Worker 宕机告警", dead_workers))

# ────────── 每月 1 号 10:00 推月度财务简报 ──────────
@sched.scheduled_job(CronTrigger(day=1, hour=10, minute=00))
async def monthly_finance_briefing():
    await feishu_client.send_card_to_chat(FINANCE_GROUP_CHAT_ID,
        render_monthly_finance_card(await compute_monthly_stats()))

sched.start()
```

---

## 七、踩坑清单（11 个月踩过的 8 个大坑）

| # | 坑症状 | 原因 | 正确做法 |
|---|--------|------|----------|
| 1 | **`tenant_access_token` 间歇性失效** | 多 Worker 同时刷新，Token 互相覆盖 | Token Manager + 分布式缓存 + 锁 |
| 2 | **发消息 99991400 错误** | QPS 超限（默认 100/min） | AsyncLimiter 限速，留 10% 余量 |
| 3 | **群消息机器人收不到** | 机器人没加群 / 没开"接收消息"权限 | 权限 + 事件订阅 + 机器人进群三件套配齐 |
| 4 | **卡片按钮点了没反应** | 回调 URL 502 / 超时 >3s | 回调必须 <500ms 返回，业务逻辑异步处理 |
| 5 | **@人不生效** | 用了 name 而不是 open_id | `<at id=ou_xxx></at>` 语法 + 通讯录权限 |
| 6 | **图片上传后无法显示** | `image_key` 必须先调 `/im/v1/images` 上传拿到 | 不要直接放 URL，飞书会防盗链 |
| 7 | **消息重推导致重复执行** | 事件回调 3 秒内没返回 200 会重推 3 次 | 先 ack（`return {}`）再处理 + Redis 幂等去重 |
| 8 | **Webhook 机器人不能 @人** | 自定义 Webhook Bot 能力有限 | 超过 10 人团队直接上"自建应用"模式 |

---

## 八、HZX 飞书 Bot 效果量化

| 指标 | 上线前（2025.03） | 现在（2026.02） | 变化 |
|------|-----------------|---------------|------|
| **审批平均耗时** | 4.3 天 | **1.2 天** | ⬇️ 72% |
| **采购异常响应时间** | 3.1 小时 | **12 分钟** | ⬇️ 94% |
| **后台登录 UV / 日** | 148 人 | **53 人** | ⬇️ 64% |
| **日报制作时间** | 45 分钟 / 人 | **0 分钟（全自动）** | 100% ↓ |
| **告警 → 修复 MTTR** | 4.7 小时 | **0.9 小时** | ⬇️ 81% |
| **员工对系统满意度** | NPS 28 | **NPS 76** | ⬆️ 171% |

---

## 九、写在最后

很多团队第一次接入飞书 Bot，只是想"把监控告警推到群里"——就像 HZX 的 V1.0。

但 11 个月跑下来，Bot 已经成长为 HZX 系统的**神经系统中枢**：
- 对普通用户，它是"系统 UI"（不用登后台，群里一句话搞定）
- 对管理者，它是"控制塔"（每天早晨一眼看清昨天发生了什么）
- 对运维，它是"哨兵 + 传令兵"（告警 + 应急通报一秒不差）
- 对系统本身，它是"触发器"（审批按钮点下去，业务流程自动往后走）

**别小看一个聊天机器人。给它一对"眼睛"（事件监听）和一双"手"（卡片回调），它能帮你管理一个公司。**

---

*—— 仙帝·Zeyan 记于永恒仙庭·仙庭通讯基站*
