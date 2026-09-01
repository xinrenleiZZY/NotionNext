---
title: SaaS_JX_System 架构揭秘：聚星多租户知产 SaaS 从 0 到 11 租户的 9 个月
date: 2026-03-08
category: 工程札记
tags: SaaS, 多租户, 聚星知识产权, 系统架构, PostgreSQL, FastAPI, RBAC, SaaS_JX_System
summary: 聚星知识产权 SaaS 平台（代号 SaaS_JX_System）9 个月架构演进全记录。从单租户 HZX 采购系统孵化到同时服务 11 家 B 端租户，深度拆解多租户数据隔离模型（Schema-based 方案）、RBAC 权限体系、计费计量、运维多租户监控、以及 3 次最大的架构升级踩坑实录。
author: 仙帝·Zeyan
slug: saas-jx-system-architecture
pin: false
---

# SaaS_JX_System 聚星知产 SaaS 架构：从单租户 HZX 到 11 租户的 9 个月

> 做一套系统给自己用，和做一套系统卖给 11 家公司用，
> **技术难度的差距，不是 11 倍——是 110 倍。**
>
> 数据隔离、租户计费、权限分级、在线不停机升级、SLA 承诺……
> 每一个"看起来很简单"的 SaaS 功能，背后都是一整条工程链路。
>
> 本文拆解「SaaS_JX_System」——聚星知识产权 SaaS 平台——
> 从 **HZX 采购系统**（单租户内部系统）孵化到
> **11 家 B 端租户同时在线**的 9 个月架构演进全记录。

---

## 一、项目缘起：为什么要做 SaaS_JX_System？

### 1.1 单租户 HZX 的成功与瓶颈

2025 年 5 月，HZX 采购管理系统 V1.0 上线。给 **「华兴智造」**（代号 HZX，聚星最大的制造型客户之一）用了半年后效果惊艳：

| 指标 | HZX 上线 6 个月数据 |
|------|-------------------|
| 采购周期 | 从 14.2 天 → **6.9 天**（↓51%） |
| 异常价拦截率 | 人工 18% → **AI + 规则 89%** |
| 采购人员工时下降 | 人均下降 **43%** |
| 客户 CEO 满意度 | **9.2/10** |

很快，HZX 的 CEO 在 3 个制造业老板群里"吹了一波"——
**5 家公司直接找上门：能不能给我们也上一套？**

这就是 SaaS_JX_System 的起源：**不是市场部规划的，是老客户口碑推出来的。**

### 1.2 SaaS 化的 4 个生死拷问

当我坐在白板前，决定把 HZX 从单租户改成 SaaS 化多租户时，我画了 4 个大问号：

```
Q1: 数据隔离怎么做？
    11 家公司的数据，如何保证「华兴智造」绝对看不到「顺达电子」的采购价？
    → 选错隔离方案 = 客户数据泄漏 = SaaS 公司死刑

Q2: 租户怎么管？
    客户自助注册？销售手工开通？超了配额怎么办？到期了怎么优雅停服？
    → 不把这一套做好，每个新客户要花 3 天手工部署 → 永远做不到规模化

Q3: 权限体系怎么设计？
    每个租户组织结构都不一样。
    A 租户：老板→采购总监→采购员→仓管员 4 级
    B 租户：总经理→采购主管→助理 3 级
    C 租户：老板自己一个人干全部
    → 硬编码权限模型 = 每接 1 个新客户改 3 天代码

Q4: SLA 怎么承诺？
    合同写着「99.9% 可用性」，一年宕机不能超 8.76 小时。
    单租户时代半夜 2 点崩了，明早修也行；SaaS 时代 1 个租户崩了，11 家客户都在看监控。
    → 运维、监控、备份、回滚能力全部要升级一个数量级
```

---

## 二、SaaS_JX_System 架构全景（2026.03 · 当前版本 V2.3）

```mermaid
flowchart TB
    subgraph 用户接入层
        W[WAF CDN + 云防护<br>阿里云 WAF]
        LB[Nginx Ingress<br>租户域名解析 + SSL 终止]
        GW[SaaS Gateway<br>FastAPI<br>① 租户识别<br>② 认证鉴权<br>③ 限流计费<br>④ 日志 Trace]
    end

    subgraph 多租户业务层（BFF 层）
        WEB[Next.js 前端<br>多租户动态主题 + i18n]
        CORE[SaaS Core API 集群<br>FastAPI 4 副本 POD]
        BIZ1[采购管理模块<br>询报价·合同·入库]
        BIZ2[案件管理模块<br>专利·软著·维权]
        BIZ3[AI 助手模块<br>飞书 Bot + Dify 工作流桥接]
        BIZ4[CRM 模块<br>客户·商机·合同]
    end

    subgraph 平台能力层（SaaS 基础设施）
        TENANT[租户管理服务<br>开通·冻结·配额·套餐]
        AUTH[认证权限服务<br>OIDC SSO + RBAC ABAC]
        BILL[计费计量服务<br>用量采集·账单·续费提醒]
        OBS[可观测中心<br>Prometheus × Grafana × Loki]
    end

    subgraph 多租户数据层（隔离策略：Schema-based）
        PG[(PostgreSQL 16<br>集群模式 主 2 从<br>11 租户 = 11 个独立 Schema<br>+ 1 个 public 共享元数据表)]
        REDIS[(Redis Cluster 3 主 3 从<br>按租户 ID 前缀分 Key：t12:*, t15:*)]
        OBJ[腾讯云 COS<br>Bucket 按租户隔离：saas-jx-t12, saas-jx-t15]
    end

    W --> LB --> GW
    GW --> WEB --> CORE
    GW --> CORE
    CORE --> BIZ1 & BIZ2 & BIZ3 & BIZ4
    CORE --> TENANT & AUTH & BILL & OBS
    BIZ1 & BIZ2 & BIZ3 & BIZ4 --> PG & REDIS & OBJ
```

### 2.1 当前运行指标（截至 2026.03）

| 指标 | 数值 | SLA 承诺 | 实际表现 |
|------|------|----------|----------|
| 🏢 付费租户 | **11 家**（其中 5 家 HZX 采购 + 6 家聚星知产业务系统） | - | - |
| 👥 终端用户 | 1,384 人 | - | - |
| 🧾 每日 API 请求 | **270 万次** | - | - |
| 📈 可用性（近 90 天） | 99.963% | ≥ 99.9% | ✅ 超额达标（宕机 47 分钟 vs 允许 21 小时） |
| ⚡ API P95 延迟 | 384ms | ≤ 800ms | ✅ |
| 💾 每日数据增量 | 3.2GB | - | - |
| 💰 SaaS 月营收 | ¥68,000（ARR ¥81.6 万） | - | 增速：月环比 +18% |

---

## 三、核心设计决策 1：多租户数据隔离模型

**"SaaS 的第一性原理 = 数据隔离。"** 选错 = 自杀。

### 3.1 三种隔离方案对比（我当时做的选型表）

| 方案 | 隔离度 | 成本 | 运维复杂度 | 租户上限 | 适合场景 |
|------|--------|------|-----------|----------|---------|
| **① 行级租户 ID 隔离（Share Database, Share Schema）** | ⭐⭐ 弱 | 💰 极低（一套 DB） | ⭐ 极低 | 10,000+ | 超大规模 C 端 SaaS，不涉及核心敏感数据（如 Notion） |
| **② Schema-based 隔离（Share Database, Dedicated Schema）** | ⭐⭐⭐⭐ 强 | 💰💰 中等 | ⭐⭐ 中等 | 50 ~ 1,000 | **B 端中大型·核心商业数据**（采购价、财务数据）⭐ **仙帝选了这个！** |
| **③ Database 独立（Dedicated Database 物理隔离）** | ⭐⭐⭐⭐⭐ 最强 | 💰💰💰 极贵 | ⭐⭐⭐⭐⭐ 复杂 | ≤ 50 | 金融 / 医疗 / 政企强合规 |

**为什么我选 Schema-based？** 因为它完美匹配 SaaS_JX_System 的画像：

```
✅ 商业核心数据：采购价、供应商报价、合同金额、财务 → 必须强隔离（不行级）
✅ 租户量级 11~500：Schema-based 1000 个 Schema 对 PostgreSQL 完全无压力
✅ 成本可控：1 套 RDS 64G 就够，不像物理隔离要 50 套实例月费 20 万
✅ 运维友好：备份/恢复可以按 Schema（pg_dump -n t_xxx），不用整个库
✅ 合规 OK：客户审计时可以证明「你的 Schema 别人连权限都没有」
```

### 3.2 PostgreSQL Schema 隔离落地细节

```
saas_jx_db（一个数据库）
├─ public schema（共享元数据，所有租户共通）
│   ├─ tenants                    # 租户注册表（id, name, schema_name, plan, expired_at...）
│   ├─ users                      # 全局用户表（email 全局唯一，hash_password）
│   ├─ user_tenant_roles          # 用户-租户-角色 三角关系
│   ├─ rbac_roles / rbac_perms    # 权限字典
│   ├─ pricing_plans              # 套餐定义
│   ├─ usage_metrics_daily        # 每日用量汇总（跨租户统计）
│   └─ flyway_schema_history      # 数据库迁移记录
│
├─ t_hzx schema（华兴智造租户专属 Schema，内部 ID=12）
│   ├─ po_purchase_orders         # 采购单
│   ├─ po_items                   # 采购明细
│   ├─ suppliers                  # 供应商（本租户私有，别人看不到）
│   ├─ ip_cases                   # 知产案件（聚星知产客户租户才有的表）
│   └─ ... 共 47 张业务表
│
├─ t_sunda schema（顺达电子租户专属 Schema，内部 ID=15）
│   └─ ... 同样 47 张表，和 t_hzx 结构 100% 相同
│
└─ ... t_xxx schema × 11 租户
```

### 3.3 关键：路由到正确的 Schema（最容易写错的地方）

```python
"""saas_gateway/middleware/tenant_resolver.py —— 租户解析中间件

三种解析策略（按优先级从高到低）：
1. JWT Token 里的 tenant_id（登录后最常用，最可靠）
2. HTTP Header：X-Tenant-ID（后端服务对内调用时用）
3. 子域名：customer1.jxspace.top → 查询 tenants 表找到对应 schema
"""
from contextvars import ContextVar   # ✨ 异步上下文变量（线程安全的"全局变量"）

current_tenant_ctx: ContextVar[Tenant | None] = ContextVar("current_tenant", default=None)

class TenantResolverMiddleware:
    async def __call__(self, request: Request, call_next):
        tenant = None

        # 1) JWT 里读 tenant_id
        claims = extract_jwt_claims(request)
        if claims and "tid" in claims:
            tenant = await get_active_tenant_by_id(claims["tid"])

        # 2) Header：X-Tenant-ID
        if tenant is None and "X-Tenant-ID" in request.headers:
            tenant = await get_active_tenant_by_id(int(request.headers["X-Tenant-ID"]))

        # 3) 子域名解析
        if tenant is None:
            subdomain = request.url.hostname.split(".")[0]
            tenant = await get_active_tenant_by_subdomain(subdomain)

        # ✅ 找到了 → 写入 context variable 供下游使用
        if tenant and tenant.status == "active":
            token = current_tenant_ctx.set(tenant)
            # ✅ 关键！设置 PostgreSQL search_path 到正确的 Schema
            async with get_db_connection() as conn:
                await conn.execute(f"SET search_path TO {tenant.schema_name}, public")
            try:
                response = await call_next(request)
            finally:
                current_tenant_ctx.reset(token)
            return response

        # ❌ 找不到租户 → 402 Payment Required
        return JSONResponse(status_code=402, content={
            "code": 40200,
            "msg": "该域名未绑定 SaaS 租户，或租户已过期，请联系 sales@jxspace.top"
        })
```

> 🌟 **为什么用 ContextVar 而不是 request.state？**
> - FastAPI Depends 和 request.state 只能在路由层用
> - 深一层的 Service 层、ORM 层要拿到当前租户，还要一层层传 request 很丑
> - `ContextVar` 是 Python 3.7+ 原生方案，**在任何函数里直接 `current_tenant_ctx.get()` 就拿到了**

---

## 四、核心设计决策 2：RBAC + ABAC 混合权限模型

每个客户组织结构都不一样，权限不能硬编码。我用了 **"角色 = 一堆权限集合 + 数据范围"** 模型。

### 4.1 权限三层结构

```mermaid
flowchart LR
    subgraph 全局预置 38 个原子权限
        P1[po:create  创建采购单]
        P2[po:approve:amount_gt_50k  审批 5 万以上采购单]
        P3[po:view:own  只看自己创建的采购单]
        P4[po:view:dept  看本部门所有采购单]
        P5[po:view:all  看租户内全部采购单]
        P6[case:manage  管理知产案件]
        P7[billing:view  看租户账单]
    end

    subgraph 角色（3 个内置 + 无限自定义）
        R1[超级管理员]
        R2[采购总监]
        R3[普通采购员]
        R4[自定义：如 价格审计员]
    end

    subgraph 用户-租户-角色
        U1[张三@华兴智造 → 采购总监]
        U2[李四@华兴智造 → 普通采购员]
        U3[王五@顺达电子 → 超级管理员]
    end

    P1 & P2 & P3 & P4 & P5 & P6 & P7 --> R1 & R2 & R3 & R4
    R1 & R2 & R3 & R4 --> U1 & U2 & U3
```

### 4.2 权限检查装饰器（一行实现权限控制）

```python
"""saas_core/permissions/decorator.py"""
from functools import wraps

def require_perms(*perms: str, logical: str = "AND"):
    """
    @require_perms("po:create")
    @require_perms("po:view:all", "billing:view", logical="OR")
    """
    def decorator(fn):
        @wraps(fn)
        async def wrapper(*args, **kwargs):
            user = current_user_ctx.get()
            tenant = current_tenant_ctx.get()
            if not user or not tenant:
                raise HTTPException(401, "未登录")

            # 查这个用户在当前租户的全部有效权限
            user_perms = await get_effective_perms(user.id, tenant.id)

            # 逻辑运算
            if logical == "AND":
                pass_check = all(p in user_perms for p in perms)
            else:  # OR
                pass_check = any(p in user_perms for p in perms)

            if not pass_check:
                raise HTTPException(403, f"权限不足，缺少：{'/'.join(perms)}")

            # ✨ ABAC 数据级权限自动注入（在 SQL 层加 WHERE 过滤）
            inject_data_scope_filter(user_perms, user.id, user.dept_id)
            return await fn(*args, **kwargs)
        return wrapper
    return decorator

# 实际使用：
@router.post("/purchase-orders")
@require_perms("po:create")
async def create_purchase_order(body: POCreateDTO):
    ...  # 只要走到这里，权限一定满足

@router.get("/purchase-orders")
@require_perms("po:view:own", "po:view:dept", "po:view:all", logical="OR")
async def list_purchase_orders():
    # ✨ 上面 inject_data_scope_filter 已经改了 SQLAlchemy query：
    #   如果只有 view:own   → WHERE created_by = 当前用户 ID
    #   如果有 view:dept   → WHERE dept_id = 当前用户部门 ID
    #   如果有 view:all    → 不加 WHERE（全租户可见）
    return await db.query(PurchaseOrder).all()
```

### 4.3 真实客户权限配置样例（3 家客户 3 种玩法）

| 角色能力 | A 租户（华兴智造 · 150 人公司） | B 租户（顺达电子 · 30 人公司） | C 租户（老板一人小作坊） |
|----------|-------------------------------|-------------------------------|------------------------|
| 采购单创建 | 部门采购员（5 人） | 2 个助理 | 老板本人 |
| 采购单 ≤ 5 万审批 | 采购主管（3 人） | 采购主管 1 人 | 老板本人 |
| 采购单 > 5 万审批 | 采购总监 + CFO 双签 | 总经理 1 人 | 老板本人 |
| 查看全公司数据 | 总监及以上（4 人） | 总经理 + 财务 2 人 | 老板本人 |
| 账单 / 套餐管理 | 只有老板（1 人） | 只有老板（1 人） | 老板本人 |
| **自定义角色数** | **7 个** | **3 个** | **1 个** |

> 这套权限模型上线后，**接入新客户不再需要改代码**，
> 运营人员在后台点拖拽配置角色 → 给用户分配 → 10 分钟完成权限初始化。
> V1.0 硬编码时代是 3 天/客户。

---

## 五、核心设计决策 3：套餐 + 配额 + 计费系统

SaaS 不收钱就是过家家。SaaS_JX_System 做了 **4 档订阅制套餐**：

| 套餐 | 价格 / 月 | 包含用户数 | 采购单 / 月 | 存储空间 | 额外功能 |
|------|-----------|-----------|------------|---------|---------|
| 🟢 入门版 | ¥999 | 5 人 | 300 张 | 50GB | 采购核心 + 手机端 H5 |
| 🔵 标准版 | ¥2,999 | 20 人 | 2000 张 | 200GB | 飞书 Bot / 钉钉 / AI 助手 |
| 🟣 专业版 | ¥6,999 | 60 人 | 不限量 | 1TB | 完整 BI 报表 + API 开放 + SSO |
| 🟡 旗舰版 | ¥19,999 | 不限 | 不限量 | 5TB | **物理库独立隔离** + 专属部署 + 7×24 支持 |

### 5.1 用量采集：计量 + 限流 2 合 1

```python
"""billing/usage_meter.py —— 轻量级用量计量器
   用 Redis HyperLogLog + Hash 组合拳，采集 API 不增加 1ms 延迟
"""
class UsageMeter:
    def __init__(self, redis: aioredis.Redis):
        self.redis = redis

    async def meter(self, tenant_id: int, metric: str, value: int = 1):
        """用量 +1，超过配额直接抛 402 异常"""
        today = datetime.now(Asia_Shanghai).strftime("%Y%m%d")

        # 1) 计数（Redis HINCRBY，O(1) 不阻塞）
        key = f"saas:usage:{tenant_id}:{today}"
        new_count = await self.redis.hincrby(key, metric, value)

        # 2) 超过配额？立即拦截
        quota = await get_tenant_quota(tenant_id, metric)  # 套餐的月/日上限
        if quota and new_count > quota:
            raise HTTPException(status_code=402, content={
                "code": 40203,
                "msg": f"本月{METRIC_NAME[metric]}已达套餐上限{quota}，请在后台升级套餐",
                "upgrade_url": f"https://{tenant.subdomain}.jxspace.top/upgrade"
            })

        # 3) 过期设置：今日 Key → TTL 到后天 0 点（多留一天做对账）
        if new_count == value:  # 第一次创建
            await self.redis.expireat(key, next_midnight_timestamp() + 86400)

# 用法：Gateway 层对每个请求做不同维度计量
#   采购单创建 API → meter(tenant_id, "po_created")
#   文件上传 API  → meter(tenant_id, "storage_bytes", size_mb)
#   用户登录 API  → meter(tenant_id, "active_users_seat")
```

### 5.2 优雅的到期策略（硬停 = 自杀，软停 = 艺术）

```python
"""TENANT STATUS 状态机（关键：到期不要硬停服务 72h 宽限期）"""

状态流转图：
ACTIVE（正常）
   ↓ 到期日 T-15天
PENDING_EXPIRE（即将到期：弹提醒 + 邮件 + 销售联系）
   ↓ 到期日 T+0 天
EXPIRED_GRACE（72 小时宽限期：服务正常，强弹窗"续费后消失"）
   ↓ T+3 天仍未续费
SUSPENDED_READONLY（只读模式：只能看数据不能写，不能下单）
   ↓ T+15 天未续费
SUSPENDED_FULL（服务全停：登录显示续费二维码，支持一键续费 10 秒恢复）
   ↓ T+90 天未续费
MARKED_FOR_DELETE（系统自动发邮件：「30 天内不续费，数据永久删除」）
```

> 🌟 **关键数据**：上线 9 个月，11 个租户里有 3 个经历了 PENDING_EXPIRE → 全部在 72h 内续费，**流失率 = 0。**
> "只读模式"真的是神设计——客户已经把采购数据放在上面跑了，**不让写他比你还急，销售跟进续费成功率 100%。**

---

## 六、三次重大架构升级（踩坑实录）

### 🚨 升级 1：V1.0 → V1.5「共享数据库」事故

**V1.0 我犯的最愚蠢错误**：急着上线接 5 个客户，图省事用了方案①「行级 tenant_id 隔离」——所有表加一个 `tenant_id int` 字段。

**事故时间**：2025 年 11 月 3 日 14:20
**根因**：开发 A 在写一个"批量导出采购单"接口时，**漏加了 `.filter(tenant_id=xxx)`**
**后果**：
- 客户「顺达电子」导出 Excel 里，**混进了 124 条「华兴智造」的采购单记录**（含报价、供应商信息，都是商业机密！）
- 客户 CTO 在 15:30 发邮件过来，标题是 5 个感叹号「!!!!! 数据泄漏严重事故」

**紧急止血 30 分钟**：
1. ✅ 立即下线导出功能（总开关）
2. ✅ 回滚 1 小时前备份
3. ✅ 写了一个全表扫描 SQL：检查所有租户数据是否干净
4. ✅ 当晚 20:00 跟两位客户 CEO + CTO 连麦，道歉 + 说明原因 + 提供改进方案
5. ✅ 主动免费给顺达电子升级到专业版（¥2,999→¥6,999）**6 个月免费**

**永久修复（7 天完成 Schema 化迁移）**：
```
第 1 天：写数据迁移脚本 —— 按 tenant_id 拆分到每个租户独立 Schema
第 2 天：本地 Docker 环境测试 3 次迁移成功
第 3 天：凌晨 02:00 生产停机迁移（1 小时 20 分钟，提前邮件通知）
第 4-5 天：全站代码「加 filter(tenant_id)」全部替换成「SET search_path = t_xxx」
第 6 天：加了 DB 层安全 trigger——任何跨 Schema 的查询立刻被拒绝 + 告警
第 7 天：加了「数据隔离混沌测试」CI 任务，每次 PR 跑 1000 次尝试跨租户访问
```

> **教训花了我 ¥14,000（顺达电子 6 个月专业版的费用）+ 1 周通宵。
> 但这 ¥14,000 是我 SaaS 生涯最值的一笔学费——**以后再也不会在数据隔离上妥协。**

### 🚨 升级 2：V1.5 → V2.0「单库单 Schema 版本迁移」痛

**问题场景**：要给所有 11 个租户 Schema 同时加一个新字段 `purchase_orders.signature_image_url`。

V1.5 做法：写 `ALTER TABLE t_hzx.purchase_orders ADD COLUMN...` × 11 次 → 每次部署都漏 1~2 个 Schema → 报错。

**V2.0 正式引入 Flyway（数据库迁移工具）** + 我写了一个「多 Schema 迁移工具」：

```python
"""db/flyway_multitenant_runner.py —— 一次迁移脚本，11 个 Schema 同时执行"""
async def run_all_tenant_migrations(migration_sql_path: str):
    sql = open(migration_sql_path).read()  # 读取 V202603010001__add_signature_url.sql
    tenants = await list_all_active_tenants()
    errors = []

    for tenant in tenants:
        try:
            async with get_admin_connection() as conn:
                # search_path 切换到具体租户 Schema
                await conn.execute(f"SET search_path TO {tenant.schema_name}")
                # 执行迁移脚本（CREATE TABLE、ALTER TABLE 等）
                await conn.execute(sql)
                # 记录 Schema 内的迁移版本
                await record_flyway_success(tenant.id, migration_version)
            logger.info(f"✅ [{tenant.name}] 迁移成功")
        except Exception as e:
            errors.append((tenant, str(e)))
            logger.error(f"❌ [{tenant.name}] 迁移失败：{e}")

    if errors:
        # 🚨 迁移失败告警 → 飞书运维群 + 全部回滚
        await alert_migration_failed(errors)
        raise RuntimeError(f"{len(errors)} 个租户迁移失败，已告警")
```

### 🚨 升级 3：V2.0 → V2.3「性能 · Prometheus 全链路监控」

接第 9 个租户时，P95 从 200ms 飙到 **1.8 秒**，但我根本不知道慢在哪。

V2.3 一次性引入了「三支柱可观测体系」：

| 支柱 | 工具 | 关键指标 / 日志 |
|------|------|----------------|
| 📊 **Metrics 指标** | Prometheus + Grafana | 按 `tenant_id` 维度的 QPS、P50/P95/P99、错误率、活跃用户、套餐配额使用率 |
| 📜 **Logs 日志** | Loki + Grafana Explore | 每个请求自带 `trace_id + tenant_id + user_id`，串起 Gateway→API→DB→Redis 完整链路 |
| 🔗 **Traces 链路** | OpenTelemetry + Jaeger | 慢查询 Top 10（发现第 9 个租户的 `supplier_price_history` 表没加索引，300 万行全表扫） |

结果：
- 3 天定位了 7 个慢查询，其中 1 个加索引直接 **1.8s → 40ms**
- 做了 2 个缓存热点（商品报价历史 + 审批角色列表），全租户 QPS 容量从 **180/s → 800/s**
- 建立了「租户级预警」——某租户异常流量 > 3 倍均值自动告警（防爬虫 / 防 DDoS / 防误用）

---

## 七、运维体系：承诺 99.9% SLA 我做了什么？

### 7.1 4 层防御 + 3 套备份

```
用户请求
  ↓
L1 阿里云 WAF（防 SQL 注入 / XSS / 基础 DDoS）
  ↓
L2 Nginx Ingress（限速规则：单 IP 100 req/s，单租户 500 req/s）
  ↓
L3 SaaS Gateway（业务限流：见上面配额系统）
  ↓
L4 代码级防御（参数校验 + SQL 参数化 + ORM 防注入）
  ↓
PostgreSQL（主 2 从，半同步复制）
  ↓ 同时写 3 套备份
  ├─ B1: pg_basebackup 每日全量 + WAL 实时归档
  ├─ B2: 跨可用区只读从库（RPO < 1min）
  └─ B3: 每日全量 Schema 级 dump → 腾讯云 COS 跨区域归档
```

### 7.2 故障演练（每月一次「消防演习」）

我把「不出故障」分成 2 部分：**防得住 + 救得回**。每月第二周周三晚上 22:00 做一次：

| 演练项目 | 预期目标（RTO / RPO）| 最近一次实际表现 |
|----------|---------------------|-----------------|
| 主库宕机切换从库 | RTO < 5min，RPO < 1min | **3 分 42 秒，0 数据丢失** |
| Redis 节点故障 | RTO < 2min | **1 分 11 秒，自动重连** |
| 误删租户 Schema 恢复 | RTO < 30min | **24 分 8 秒（从 COS 拉 dump 回来 + 恢复索引）** |
| 全集群断电（手动停 90% 服务） | RTO < 60min | **48 分 17 秒** |
| 数据泄露混沌测试（模拟 1000 次跨租户访问尝试） | 成功率 0% | **0 次成功，999 次被安全 trigger + 1 次被 search_path 拦截** ✅ |

---

## 八、技术栈一览 + 成本核算

### 8.1 完整技术栈

| 层级 | 技术选型 |
|------|---------|
| 🌐 **CDN / WAF** | 阿里云 WAF + DCDN |
| 🚀 **反向代理** | Nginx 1.25 + OpenResty（Lua 限流脚本） |
| 🎛️ **网关层** | FastAPI + Uvicorn（4 workers） |
| 🏢 **业务 API** | FastAPI 集群 · Gunicorn + UvicornWorker · Pydantic v2 · SQLAlchemy 2.0 |
| 🔐 **认证** | python-jose（JWT）· argon2-cffi（密码哈希）· OIDC SSO 对接（钉钉 / 飞书） |
| 💾 **数据库** | PostgreSQL 16 · 主 2 从 · Citus 插件预备（超 500 租户时开分片） |
| 🗄️ **缓存 / 队列** | Redis Cluster 3 主 3 从 · Celery + Redis Broker |
| 📦 **对象存储** | 腾讯云 COS（多租户独立 Bucket） |
| 📊 **监控日志** | Prometheus + Grafana · Loki · OpenTelemetry + Jaeger |
| 🐳 **部署** | Docker Compose → 准备迁移 K3s（100 租户级） |
| 🔄 **CI/CD** | GitHub Actions（PR 跑 Lint + 单测 + 混沌测试）→ watchtower 自动拉镜像更新 |
| 🤖 **AI 功能** | 内网 Dify Gateway × 三模型（见 Dify 炼丹炉文章） |

### 8.2 每月基础设施成本（截至 11 租户）

| 项目 | 月费 | 单租户均摊 |
|------|------|-----------|
| PostgreSQL RDS 8C 64G（企业版） | ¥2,198 | ¥200 |
| Redis Cluster 4C 16G × 3 | ¥894 | ¥81 |
| 应用服务器 8C 32G × 3（ECS） | ¥1,197 | ¥109 |
| 对象存储 COS 500GB + CDN 流量 | ¥238 | ¥22 |
| WAF + DCDN 域名安全 | ¥600 | ¥55 |
| 短信 + 邮件服务（告警 + 通知） | ¥120 | ¥11 |
| 其他（监控 / 备份 / 域名） | ¥150 | ¥14 |
| **合计** | **¥5,397** | **¥491 / 租户 / 月** |

> 💰 **单租户毛利 ¥2,000+ / 月（入门版 ¥999 亏几十，专业版 ¥6,999 毛利 6500+）
> 盈亏平衡点 ≈ 3 个专业版 or 8 个标准版。
> 11 个租户已是大幅盈利。

---

## 九、给想做 SaaS 的工程师的 5 条建议

### 1️⃣ **数据隔离选最强的你能负担得起的方案**
> 行级隔离看着简单，但你只要漏写一次 filter，就是 SaaS 公司最大的丑闻。
> 我 ¥14,000 换来的教训——**B 端 SaaS 从第一天起至少 Schema-based。**

### 2️⃣ **计费体系先于功能开发**
> 很多工程师先写代码，最后再"加个计费"。
> 错。**每一个新功能都要设计对应计量项**。否则你不知道哪些租户吃了 90% 的资源却付了入门版的钱。

### 3️⃣ **租户到期绝对不要硬停**
> 72h 宽限 + 只读模式 = 99% 租户会回来续费。
> 硬停服务 = 直接把客户推给竞品 + 坏口碑。

### 4️⃣ **可观测性在 V1.0 就要做，不要 V2.0 再补**
> 不做监控，你永远不知道性能瓶颈在哪、哪一个租户在拖垮全局。
> 3 支柱（Metrics / Logs / Traces）接入成本其实只有 **3 天工时，但上线后能帮你省 300 天。**

### 5️⃣ **SaaS 不是「多个系统」，是「一套系统 × N 个配置」**
> 最大的陷阱是「这个租户要 A 功能，那个租户要 B 功能」→ 每个租户 fork 一份代码 → 3 个月后维护地狱。
> **正确做法：所有差异用「套餐配置 + 角色权限 + 租户级 Feature Flag」表达。代码只有一份。**

---

## 十、路线图：接下来的 V3.0 · 飞升

SaaS_JX_System V2.3 已经稳如磐石，但我已经在规划飞升 V3.0：

| 里程碑 | 时间 | 内容 |
|--------|------|------|
| **V3.0 Q2 2026** | K8s 化 + 租户级 HPA | 从 Docker Compose 迁到 K3s，每个租户 API 独立 HPA（大租户不抢小租户资源）|
| **V3.1 Q3 2026** | 开放平台 + ISV | 提供 OpenAPI + Webhook，支持第三方集成用友/金蝶财务系统 |
| **V3.2 Q4 2026** | AI Copilot 2.0 | 每个租户都能上传自己的供应商合同历史 → 私域 RAG → 「采购决策助手」 |
| **V3.3 Q1 2027** | 多区域部署 | 华南 1 区（当前）+ 华东 1 区，支持跨境电商用户就近接入 |
| **V4.0** | 国际化 | 支持英文、日文界面 → 服务东南亚跨境电商客户 |

---

## 十一、写在最后

做 SaaS 9 个月，我最深的感悟是：

> **做给别人用的系统，比做给自己用的系统，难的不是技术——是"换位"。**
>
> 单租户 HZX 时代，我只要问华兴智造的采购总监"你要啥"就行。
> 现在 SaaS 时代，11 个租户、1384 个用户、每个职位视角都不一样——
> 我要学会站在老板的视角、采购助理的视角、IT 运维的视角、财务审计的视角、**甚至客户客户的视角**去设计。

9 个月前我只是想"把 HZX 再卖 5 份赚点零花钱"。
现在 SaaS_JX_System 已经变成了聚星 + 永恒仙庭的**第二增长曲线**。

11 个租户不是终点，是起点。

**聚星的星辰大海，才刚刚启程。** 🌠

---

*—— 仙帝·Zeyan 记于永恒仙庭·SaaS 指挥中心，2026.03.08*
