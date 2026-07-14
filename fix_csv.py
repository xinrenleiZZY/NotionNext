import csv

# Proper data: 10 columns per row
HEADER = ['type','title','summary','status','category','tags','slug','date','password','icon']

DATA = [
    ['Post','聚星空间站：当修仙世界遇上数据洪流','聚星空间站（Juxing Space Station）——一个庞大的空间知识锚点站，由天才第一席位钟元缔造。服务器内核未知，地址未知，体量未知。某年一道数据流星划过空间，被地面 xinrenleiZZY 捕抓到，并连接。上传意识后发现了此处空间。2025年8月22日留下一个裂隙，公于大众，欢迎广大修士前来开拓。','Published','仙术展示','推荐, Python, AI, 空间站','juxing-space-station','2025/8/28','',''],
    ['Post','永恒仙庭仙尊的自我修养','放下本仙尊的阔乐！本仙尊乃永恒仙庭仙尊。从 GNU 到 Python，从 Dify 到 GPT，从 Claude 到 Deepseek，从 Codex 到 Hadoop —— 这是一位游走于数据星系与修仙世界的技术修士的自白。','Published','关于本尊','推荐, 仙帝, Zeyan, 永恒仙庭','eternal-celestial-emperor','2025/6/1','',''],
    ['Post','数据知识产权：为企业数据价值保驾护航','作为广州聚星知识产权有限公司的一员，深入探讨数据知识产权的价值。数据有价，知识产权有方。在数字经济时代，如何为企业数据资产确权、布局知识产权、做好数据合规风控与维权服务。','Published','聚星公告','推荐, 知识产权, 数据合规, 企业服务','data-ip-rights','2025/9/1','',''],
    ['Post','亚马逊采集系统 V1 到 V4.2：架构演进全记录','从单机爬虫到分布式采集集群，从基础数据抓取到准生产级稳定运营。amazon_scraper_system 历经多次架构迭代，本文完整记录了 Docker 容器化部署、Worker 多进程架构、反爬策略升级等实战经验。','Published','功法阁','Python, Docker, 爬虫, 架构, 亚马逊','amazon-scraper-v1-to-v42','2025/9/15','',''],
    ['Post','Dify + GPT + Claude：AI 工作流搭建实战','当 Dify 遇上 GPT 和 Claude，会擦出怎样的火花？本文记录用 Dify 搭建 AI 工作流、接入多模型（GPT-4、Claude、Deepseek）的实践经验，涵盖知识库构建、对话流程设计、API 集成等场景。','Published','功法阁','推荐, AI, Dify, GPT, Claude, Deepseek, 工作流','dify-gpt-claude-workflow','2025/10/1','',''],
    ['Post','Hadoop 3.1.3 Windows 编译踩坑记','apache-hadoop-3.1.3-winutils 仓库记录了 Hadoop 在 Windows 平台上的完整编译过程。VC142 编译环境配置、WinUtils 编译踩坑、本地模式与伪分布式部署——本文为在 Windows 上跑 Hadoop 的勇士们指路。','Published','功法阁','Hadoop, Winutils, 大数据, 编译, Windows','hadoop-windows-compile','2025/11/20','',''],
    ['Post','NotionNext + Vercel：30 分钟搭建个人博客','基于 NotionNext 开源项目，以 Notion 为 CMS、Vercel 为部署平台，搭建全静态个人博客。支持 20+ 主题切换、深色模式、评论系统、RSS 订阅等特性。本文从零开始记录完整搭建过程和踩坑记录。','Published','功法阁','Notion, 博客, Vercel, Next.js, 部署','notionnext-vercel-blog','2025/12/10','',''],
    ['Post','Docker Compose 编排的艺术：HZX 管理系统全栈设计','HZX 采购管理系统是一套完整的全栈解决方案：FastAPI 后端 + Next.js 15 前端 + 飞书 Bot 监控，三服务通过 Docker Compose 统一编排。本文详解系统架构设计、容器间通信、健康检查、数据持久化等核心实践。','Published','功法阁','Docker, FastAPI, Next.js, 飞书, 全栈','hzx-docker-compose','2026/1/15','',''],
    ['Post','飞书 API 接入实战：从 Bot 到自动化工作流','从 feishu_bot 到 feishu_api_bot，从简单消息推送到复杂任务调度。本文记录飞书开放平台 API 的完整接入过程，包括自定义 Bot 开发、群消息监控、任务自动触发、Wiki 文档同步等实战案例。','Published','功法阁','Python, 飞书, Bot, API, 自动化','feishu-bot-api-guide','2026/2/1','',''],
    ['Post','Jupyter + Nginx 网关：搭建安全的在线编程环境','基于 Docker 搭建 Jupyter 网关服务，通过 Nginx 反代实现访问控制和 SSL 加密。适合团队内部署在线编程环境，支持多用户隔离、资源限制、持久化存储等特性。一篇搞定 Jupyter 网关搭建。','Published','法宝推荐','推荐, Docker, Jupyter, Nginx, 网关','jupyter-nginx-gateway','2026/1/20','',''],
    ['Post','七夕特辑：当代码写满浪漫——qixi-sur 项目揭秘','一个用 HTML 写成的浪漫七夕项目。不需要复杂技术栈，不需要华丽框架，纯粹的前端页面就能表达心意。有时最好的代码，是写给心爱的人看的。本文附源码解析。','Published','次元漫谈','HTML, 七夕, 浪漫, 前端','qixi-sur','2025/8/29','',''],
    ['Post','AI 代码助手横评：Codex vs Claude vs Deepseek','在编码效率提升上，AI 代码助手已成为程序员标配。本文从实际项目出发，横向对比 OpenAI Codex、Anthropic Claude、Deepseek 三款 AI 工具在代码生成、Debug、代码重构等场景下的真实表现。','Published','法宝推荐','AI, Codex, Claude, Deepseek, 评测','ai-coder-comparison','2025/12/20','',''],
    ['Post','OpenClaw 云函数平台部署实战','基于 openclaw-deploy 项目，记录云函数平台的完整搭建过程。从 Docker 部署到函数管理，从触发配置到日志监控，手把手教你打造属于自己的 Serverless 基础设施。','Published','功法阁','OpenClaw, 云函数, Serverless, Docker','openclaw-deploy-guide','2026/3/1','',''],
    ['Post','我的 GitHub 星盘：开源项目与技术栈一览','盘点个人 GitHub 上的开源项目和技术栈：Python 数据采集、Docker 容器化、AI 工作流、知识产权数据服务……每个仓库都是一块拼图，拼凑出我的技术世界观。本文长期更新。','Published','法宝推荐','GitHub, 开源, 项目汇总, 技术栈','github-portfolio','2025/12/15','',''],
    ['Post','永恒仙庭技术栈图谱：从入门到飞升','从 Python 到 Hadoop，从 GPT 到 Claude，从 Docker 到 K8s —— 绘制一幅属于永恒仙庭仙尊的技术能力图谱。无论你是刚入门的修士，还是寻求突破的老手，希望这份图谱能给你一些启发。','Published','功法阁','推荐, 技术栈, Python, AI, 大数据, 修仙','tech-stack-map','2025/10/15','',''],
    ['Post','聚星公告：数据知识产权服务的现在与未来','聚星数据知识产权，专注企业数据资产确权、知识产权布局、数据合规风控与维权服务。200+ 服务企业，1000+ 知识产权案件经验。我们用技术和法律的双重视角，为企业数据价值保驾护航。','Published','聚星公告','知识产权, 数据, 企业服务, 合规','juxing-ip-future','2025/9/10','',''],
    ['Post','GPT + Claude 双模型协作：效率翻倍的秘密','单一 AI 模型总有局限：GPT 擅长创意发散，Claude 擅长逻辑推理。将两者结合，用 GPT 生成思路，用 Claude 完善细节，效率翻倍不是梦。本文分享双模型协作的实际案例和 Prompt 设计技巧。','Published','法宝推荐','推荐, GPT, Claude, AI, Prompt, 协作','gpt-claude-duo','2026/2/15','',''],
    ['Post','跨境数据合规：电商数据采集的法律边界','在跨境电商领域，数据采集与合规的边界在哪里？结合亚马逊采集系统的开发经验，探讨数据采集的法律合规问题，包括 Robots 协议、数据使用范围、GDPR 合规、隐私保护等关键议题。','Published','聚星公告','数据合规, 跨境电商, 法律, 爬虫, GDPR','cross-border-data-compliance','2026/3/10','',''],
    ['Post','Nginx 网关在微服务架构中的核心作用','从 docker-Jupyter-nginx 网关到 HZX 系统的 API 网关，Nginx 在微服务架构中扮演着流量入口、负载均衡、安全防护的关键角色。本文总结 Nginx 反向代理、SSL 终止、限流配置的最佳实践。','Published','功法阁','Nginx, 网关, 微服务, Docker, 反向代理','nginx-microservice-gateway','2026/2/20','',''],
    ['Post','给 TA 写个浪漫网页：七夕表白页制作教程','延续 qixi-sur 项目的思路，手把手教你用纯前端技术制作一个浪漫的七夕表白页。包含粒子爱心动画、情书滚动效果、背景音乐播放等特性，代码开源，欢迎 fork 改造送给心爱的 TA。','Published','次元漫谈','HTML, CSS, 七夕, 浪漫, 前端','valentine-web-tutorial','2026/2/14','',''],
    ['Post','Python 数据采集：从入门到准生产级','数据采集是 Python 最经典的应用场景之一。本文从 requests + BeautifulSoup 入门，到 Scrapy 分布式采集，再到 Amazon 商品页面的准生产级采集方案，一条龙带你掌握 Python 爬虫技能。','Published','功法阁','Python, 爬虫, Scrapy, 数据采集, 入门','python-scraping-guide','2025/10/20','',''],
    ['Post','Docker 容器化部署实战：从开发到生产','从 docker-compose.yml 编写到多环境部署，从数据卷挂载到网络配置，从健康检查到日志收集。本文基于多个实际项目的 Docker 部署经验，总结容器化部署的全流程最佳实践。','Published','功法阁','Docker, DevOps, 部署, 容器化','docker-deployment-guide','2025/11/5','',''],
    ['Post','GPT API 接入指南：从对话到函数调用','OpenAI GPT API 的完整接入教程，涵盖 Text Completion、Chat Completion、Function Calling、Stream 模式等核心功能。配合 Python 代码示例，快速上手 GPT 集成开发。','Published','法宝推荐','推荐, GPT, API, OpenAI, Python, 教程','gpt-api-guide','2025/12/1','',''],
    ['Post','Claude API 接入指南：长文档处理的利器','Anthropic Claude API 以其超长上下文窗口（100K+ tokens）著称，特别适合文档分析、代码审查、长文本生成等场景。本文详解 Claude API 的接入方法和最佳实践。','Published','法宝推荐','Claude, API, Anthropic, 长文本, Python','claude-api-guide','2025/12/25','',''],
    ['Post','Deepseek API 接入：国产大模型的选择','Deepseek 作为国产大模型的代表之一，在代码生成和逻辑推理方面表现优异。本文详解 Deepseek API 的接入方式、定价策略、性能对比和实际应用案例。','Published','法宝推荐','Deepseek, API, 国产大模型, Python, AI','deepseek-api-guide','2026/1/5','',''],
    ['Post','Notion API 实战：打造自动化内容管理系统','基于 notion-api-worker 项目，利用 Notion API 将 Notion 打造成自动化内容管理系统。实现自动发布、定时更新、多语言同步等高级功能。','Published','功法阁','Notion, API, CMS, 自动化','notion-api-cms','2026/3/5','',''],
    ['Post','Python 定时任务框架选型与实践','从 cron 到 APScheduler，从 Celery 到 HZX 自定义任务引擎。本文对比主流 Python 定时任务框架的优缺点，并结合实际项目分享任务调度系统的设计经验。','Published','功法阁','Python, 定时任务, APScheduler, Celery, 调度','python-scheduler-guide','2026/2/10','',''],
    ['Post','广州聚星知识产权：我们的技术护城河','作为一家数据知识产权服务商，我们在技术层面构建了怎样的护城河？从自动化确权系统到智能合规审查，从数据资产估值模型到侵权监测引擎——技术正在重新定义知识产权服务。','Published','聚星公告','知识产权, 技术, 创新, 广州, 数据资产','juxing-tech-moat','2026/3/15','',''],
    ['Post','用 Docker 搭建私有 Wiki 知识库系统','基于飞书 Wiki 和 Docker，搭建团队私有的知识库系统。支持文档协作、版本管理、全文搜索，适合中小团队构建内部知识管理体系。','Published','功法阁','Docker, Wiki, 知识库, 飞书, 团队协作','docker-wiki-knowledge-base','2026/3/20','',''],
    ['Post','2026 年度技术复盘与修仙感悟','回望 2025-2026，从第一个开源项目到完整的全栈系统，从跟着教程走到独立架构设计。技术之路如同修仙，筑基、金丹、元婴，每一步都需要时间的沉淀。这是一份技术复盘，也是一段修仙感悟。','Published','关于本尊','推荐, 年度复盘, 感悟, 成长, 技术','annual-review-2026','2026/4/1','',''],
    ['Post','永恒仙庭的宝藏：那些值得收藏的技术资源','从学习路线到实战项目，从工具推荐到电子书资源，本文汇总了永恒仙庭仙尊多年收藏的优质技术资源，助你在修仙路上少走弯路。长期更新。','Published','法宝推荐','推荐, 资源, 学习, 收藏, 书单','tech-resources-collection','2026/3/25','',''],
]

HEADER = ['type','title','summary','status','category','tags','slug','date']

with open('articles_import.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
    writer.writerow(HEADER)
    for row in DATA:
        # Skip last 2 empty password/icon columns
        writer.writerow(row[:8])

# Verify
count = 0
with open('articles_import.csv', encoding='utf-8') as f:
    reader = csv.reader(f)
    for i, row in enumerate(reader):
        if i > 0:
            count += 1
            if len(row) != 8:
                print(f'ERROR Row {i}: {len(row)} cols - {row[1][:30]}')
    print(f'OK! Total: {count} rows, all 8 columns.')
