---
title: 永恒仙庭技术栈图谱：从入门到飞升
date: 2026-11-23
category: 功法阁
tags: 技术栈, 架构, Python, Next.js, Docker, 学习
summary: 把我这几年用过的技术按「数据层 / 服务层 / 展示层 / 运维层 / AI 层」画成一张图，并给出每个阶段该学什么、别学什么的判断标准。
author: 仙帝·Zeyan
slug: tech-stack-map
pin: false
---

# 永恒仙庭技术栈图谱：从入门到飞升

> 技术栈不是越宽越好，而是「能把你手上的问题解决掉的那一层，够厚」。

常有人问我用哪些技术。与其列名词，不如画一张图——按职责分层，每层只留主力。

## 一、五层图谱

```
展示层   Next.js · React · Tailwind · NotionNext
服务层   FastAPI · Node.js · Nginx
数据层   PostgreSQL · Redis · SQLite
运维层   Docker · Docker Compose · GitHub Actions
AI 层    Deepseek · OpenAI · Claude · Dify
```

每层的主力只有一个，备选一到两个。**同层不堆三套以上**，是这些年最值钱的一条纪律。

## 二、各层怎么选

| 层 | 主力 | 为什么 |
| --- | --- | --- |
| 展示层 | Next.js | SSR/SSG 一套解决，SEO 好 |
| 服务层 | FastAPI | 类型清晰、自动文档、异步够用 |
| 数据层 | PostgreSQL | 事务、JSON、扩展都强 |
| 缓存 | Redis | 会话、锁、限流 |
| 运维 | Docker Compose | 单机多服务的最优解 |
| AI | Deepseek 为主 | 便宜够用，接口兼容 |

## 三、学习路径：按「能交付」倒推

我把学习拆成四个阶段，每个阶段的标准是「能交付什么」：

**阶段一：能跑起来**
- Python 基础 + requests + SQL
- 一台服务器 + Docker
- 交付：一个能对外访问的小服务

**阶段二：能稳定跑**
- PostgreSQL 索引与事务
- FastAPI 分层（router / service / repo）
- Nginx 反代 + HTTPS + 日志
- 交付：一个有人用的系统

**阶段三：能拆开跑**
- Docker Compose 多服务
- 消息/缓存/定时任务
- 监控与告警（成功率、延迟、错误率）
- 交付：多服务协作的系统

**阶段四：能规模化**
- K8s / 云服务
- 可观测性（指标、链路、日志）
- 成本优化
- 交付：能承载增长的系统

## 四、别学的（至少现在别）

- 为了简历学框架：用不上的框架，学了就忘
- 过早微服务：单体没跑顺就拆，只会拆出更多故障
- 过早 K8s：单机 Docker Compose 能撑住的业务远比想象多
- 追逐每个新模型：接口都是 OpenAI 兼容的，换的是模型名，不是世界观

## 五、我的选型四条原则

1. **解决当前问题**：先有痛点，再选技术
2. **栈要收敛**：后端一个、前端一个、库一个，切换成本最低
3. **可部署优先**：本地能跑不算，`docker compose up` 能起才算
4. **可观测先行**：先能看见，再谈优化

## 六、这张图怎么用

遇到新需求，先问「它落在哪一层」，然后优先用该层的主力解决；只有主力确实不合适时，才引入备选。这样技术栈不会膨胀，人也不会被自己选的东西拖住。

## 结语

技术栈是工具，不是身份。真正的「飞升」，不是会的框架多，而是**面对一个新问题，能快速判断该用哪一层、哪一件工具，并且能把它交付上线**。

---

*相关：[Docker 容器化部署实战](https://www.juxingspacestation.top/article/docker-deployment-guide) · [NotionNext + Vercel 部署](https://www.juxingspacestation.top/article/notionnext-vercel-blog)*
