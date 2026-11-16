---
title: 90 个仓库之后：我把个人 GitHub 练成了一套「运维系统」
date: 2026-11-16
category: 技术分享
tags: GitHub, 架构, FastAPI, Next.js, Docker, 自动化, 爬虫, 可观测性
summary: 从亚马逊爬虫到模型用量监控中心，从自动补货决策到飞书定时任务——复盘 90 个公开仓库背后的一条主线：每个项目只解决一个真实痛点，最后拼成一套能自我运转的个人工程体系。
author: 仙帝·Zeyan
slug: github-to-ops-system
pin: false
---

# 90 个仓库之后：我把个人 GitHub 练成了一套「运维系统」

> 修行讲究「日拱一卒」。九十座山头，不是什么壮举，只是每天解决一个真实问题，四年下来回头看，山与山之间已经连成了山脉。

前几天整理 GitHub，发现公开仓库已经到 **90 个**。这个数字本身没有意义——真正有意思的是，它们不再是散落的脚本，而是拼成了一套能自我运转的体系：**采集 → 决策 → 执行 → 观测**，四个环节各有一批项目在跑。

这篇就把这套体系拆开讲讲，也给正在「一个人活成一支队伍」的同道做个参考。

## 一、仓库地图：四层结构

把 90 个仓库按职责归类，其实是这么四层：

| 层级 | 职责 | 代表仓库 |
|------|------|----------|
| 📥 数据采集层 | 把外部世界搬进数据库 | `anti_scraping`（亚马逊爬虫系统）、`image_upload_monitoring_system` |
| 🧠 决策层 | 把数据变成可执行建议 | `AutoReplenishment`（自动补货决策系统）、`Real-time-Logistics-Tracking-Database` |
| ⚙️ 自动化层 | 把建议变成动作 | `Scheduled-Task-System`（飞书定时任务）、`hzx_updater`、`docker_wiki_feishu_bot` |
| 📊 观测层 | 让一切可被看见、可被成本核算 | `openclaw-sync-tray`（模型健康监控中心 MHC） |
| ✍️ 内容层 | 对外表达与技术沉淀 | `NotionNext`（本站）、`Mizuki` 主题、`JuXing_Think_Tank` |

这套分层不是一开始就设计好的，是踩坑踩出来的：**没有采集层，决策就是拍脑袋；没有观测层，跑飞的系统你两周后才发现。**

## 二、案例一：从爬虫脚本到分层服务

最早做亚马逊数据采集，就是一个 `scraper.py`，几百行，能跑就行。版本迭代到 v4 之后彻底重构，变成现在 `anti_scraping` 里的 `amazon_scraper_system`：

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
└── scraper_config.json      # 关键词列表等爬取配置
```

这次重构的关键不是「用上了 FastAPI」，而是三件事：

1. **采集与存储解耦**：爬虫只负责产出结构化数据，入库交给 `crud.py`，换数据源不用动数据库。
2. **配置外置**：关键词、目标站点全放 `scraper_config.json` 和 `.env`，改配置不重新发版。
3. **模型即契约**：`schemas.py` 用 Pydantic 定义了接口契约，前端调用再也不会拿到一个字段忽有忽无的 JSON。

顺带说一句反爬这件事：**真正决定爬虫寿命的不是技术，而是节奏。**请求频率、User-Agent 池、失败退避、代理轮换，这四件事做好，比任何「破解技巧」都扛用。

## 三、案例二：模型健康监控中心（MHC）

这半年最大的变化是：我的代码越来越多是 AI 写的。于是就冒出一个新问题——**我根本不知道这些模型调用花了多少钱、还剩多少额度。**

`openclaw-sync-tray` 就是为解决这个问题建的「模型健康监控中心」：

- 各虚拟机上的采集端 `openclaw_usage_stats.py` 读 OpenClaw 网关的用量缓存（`.usage-cost-cache.json` 和会话 `.jsonl`）；
- 统计真实 token 用量与成本，通过局域网 `--push` 推到本机 `:7601`；
- 后端入库、去重，前端做多维可视化。

技术栈是刻意选的「熟面孔」：

| 层 | 技术 |
|----|------|
| 前端 | Next.js 15（App Router）· React 19 · TypeScript · Tailwind CSS 4 · ECharts 6 |
| 后端 | FastAPI · SQLAlchemy 2 · Pydantic 2 · Uvicorn |
| 数据库 | PostgreSQL 16 |
| 部署 | Docker Compose |
| 采集端 | Python（`openclaw_usage_stats.py --push`） |
| 托盘工具 | PowerShell + WinForms |

端口也做了规划，因为本机 7500/7502 早被旧 HZX 系统占了：

| 服务 | 端口 | 用途 |
|------|------|------|
| mhc-web | 7600 | Web 前端 |
| mhc-api | 7601 | API 后端 / 虚拟机推送入口 |
| mhc-db | 7602 | PostgreSQL |

整套一个命令起停：

```bash
docker compose up -d --build
# 管理界面 http://<MHC_HOST>:7600
# API 文档 http://<MHC_HOST>:7601/docs
```

**这个项目改变了我对自己代码的认知**：以前只管「跑通」，现在先问「能不能被观测」。没有成本数据，所谓 AI 提效就是一笔糊涂账。

## 四、案例三：自动补货决策系统

`AutoReplenishment` 是这批项目里业务价值最直接的一个：把运营从繁琐的人工计算里解放出来。

它要跑完一条完整的决策链：

```
数据采集 → 分析预测 → 决策评分 → 建议输出
```

运营同学只需要：**看建议 → 判断 → 确认采购**。

这里面最有价值的不是预测模型，而是「可解释」：每条建议都要能回答「为什么是它、为什么是这个量、如果不补会怎样」。一个运营看不懂的建议，等于没有建议。

## 五、案例四：把重复动作交给机器人

剩下的自动化层项目，解决的都是一类问题：**有些事情每天必须做，但它不该消耗人的注意力。**

- `Scheduled-Task-System`：定时任务触发，结果直接推到飞书；
- `docker_wiki_feishu_bot`：把知识库查询接进飞书，群里直接问；
- `hzx_updater`：版本更新自动检查。

这些项目的共同特征是「短小」，但**投入产出比极高**——写一次，省下的是每天十分钟，一年就是四十个小时。

## 六、踩过的三个坑

**1. 端口不规划，迟早打架。**
MHC 起服务时就撞上旧 HZX 系统占用的 7500/7502，最后改成 7600-7602 段。现在我的习惯是：新系统先定端口段，写进 README。

**2. 采集端的网络比你想的脆。**
批量拉 README、批量调 API 时经常遇到 `SSL connection could not be established` 这种偶发失败。结论很简单：**任何批量外部请求都必须有重试与失败清单**，否则你会漏数据还浑然不觉。

**3. 没有 Observability 的系统等于没有系统。**
早期爬虫挂了三天我才发现。现在每个常驻服务至少要有：健康检查接口、日志、一条能报警的推送。

## 七、沉淀下来的四条方法论

1. **一个项目只解决一个真实痛点。** 别为了学技术造项目，为解决问题选技术。
2. **技术栈收敛。** 我的后端基本就 Python/FastAPI，前端 Next.js，库 PostgreSQL，部署 Docker Compose。栈越少，切换成本越低。
3. **可部署优先。** 一个只能在自己电脑上 `python main.py` 跑的系统，不算交付。能 `docker compose up` 才算。
4. **观测先行。** 先能看见，再谈优化。

## 结语

90 个仓库里，真正能长期跑的大概不到二十个，剩下的是一堆「走过路过」的尝试——这很正常，**探索本来就要允许浪费**。

但如果让我只留一句话给四年前的自己，会是这句：

> 别急着追新技术，先把手头那个每天烦你的小问题，做成一个能跑、能看、能告警的系统。

山不在高，有仙则名；仓库不在多，能跑则灵。

---

*本文写于 2026 年 11 月，仓库清单见 [github.com/xinrenleiZZY](https://github.com/xinrenleiZZY)。*
