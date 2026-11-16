# 文章一键发布到 Notion

`article-contents/*.md` 是你本地撰写文章的暂存区。`scripts/article-to-notion.mjs` 会读 front-matter，把文章写进 Notion 数据库（NotionNext 的内容源），正文自动转成 Notion blocks。

## 一次性配置

### 1. 建一个内部集成（写入用）

1. 打开 https://www.notion.so/my-integrations → **New integration**
2. 类型选 **Internal**，权限勾上：
   - Read content
   - Update content
   - Insert content
3. 复制生成的 `secret_xxx` Token

> 这和只读用的 `NOTION_TOKEN_V2`（浏览器 cookie 里的 `token_v2`）不是一回事：本脚本走官方 API，需要 Integrations Token。

### 2. 把数据库分享给这个集成

打开你的**文章数据库页面**（不是站点根页面）→ 右上角 `···` → **Connections / 连接** → 添加刚建的集成。

### 3. 配置 `.env.local`

```bash
# 必填
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxx
# 可选：不填则自动在 NOTION_PAGE_ID 下查找 child_database
NOTION_DATABASE_ID=
# 可选：pin: true 时注入的置顶标签，要和站点 TOP_TAG 一致
TOP_TAG=置顶
```

## 日常用法

```bash
# 1. 先预览（不需要 Token，能看到解析出的标题/slug/属性/block 统计）
yarn article:publish article-contents/foo.md --dry-run
# 或 node scripts/article-to-notion.mjs article-contents/foo.md --dry-run

# 2. 发布（新建页面）
yarn article:publish article-contents/foo.md

# 3. 更新已发布文章（按 slug 查找，只更新属性，正文追加）
yarn article:publish article-contents/foo.md --update

# 4. 更新并重写正文（先清空旧 block，再写入；危险，会删掉 Notion 里手改的内容）
yarn article:publish article-contents/foo.md --update --replace

# 5. 批量发布
yarn article:publish article-contents/a.md article-contents/b.md

# 6. 看不到数据库？列出根页面下的 child_database
node scripts/article-to-notion.mjs --list-databases

# 7. 指定数据库 / 改状态
yarn article:publish article-contents/foo.md --database <db-id> --status Published --type Post
```

## front-matter 约定

```yaml
---
title: 文章标题                  # 必填
date: 2026-11-16                 # 支持 2026-11-16 / 2026/11/16 / 2026年11月16日
category: 工程札记
tags: GitHub, 架构设计, Docker    # 逗号分隔
summary: 摘要，出现在列表与 SEO 描述
author: 仙帝·Zeyan
slug: github-to-ops-system       # 必填，文章 URL 与更新时的匹配键
pin: false                       # true 时自动加上 TOP_TAG 标签（NotionNext 用标签实现置顶）
---
```

## 属性自动映射规则

脚本读取数据库 schema，按「类型 + 名称别名」匹配，默认对齐 `conf/notion.config.js` 的 `NOTION_PROPERTY_NAME`：

| 字段 | 别名 | 目标属性类型 |
| --- | --- | --- |
| title | title / 标题 / 名称 | title |
| slug | slug / 别名 / 路径 | rich_text / select / url |
| date | date / 日期 / 发布时间 | date |
| category | category / 分类 | select / rich_text |
| tags | tags / 标签 | multi_select |
| summary | summary / 摘要 / 描述 | rich_text |
| type | type / 类型 | select（默认 `Post`） |
| status | status / 状态 | select / status（默认 `Published`） |
| icon | icon / 图标 | rich_text |
| password | password / 密码 | rich_text |

- 库里没有对应属性时**跳过并打印警告**，不会中断发布。
- `type` 必须是 `Post`、`status` 必须是 `Published`，前台才会展示（可在 `conf/notion.config.js` 改映射值）。

## Markdown 支持范围

`#/##/###` 标题、段落、`-`/`1.` 列表、`>` 引用、``` 代码块（语言自动映射）、`---` 分隔线、`|` 表格（首行表头）、`![alt](url)` 图片、行内 `**粗体**` / `*斜体*` / `` `代码` `` / `[链接](url)`。

不支持（会退化成段落）：HTML 标签、Mermaid、脚注、嵌套列表深层缩进。

## 排障

| 现象 | 原因 / 处理 |
| --- | --- |
| `缺少 NOTION_API_KEY` | 没配 `.env.local`，或变量名写错 |
| `页面下发现多个数据库` | 用 `--database <id>` 指定，先跑 `--list-databases` |
| `Notion API ... 404` | 数据库没分享给集成，或 ID 写错 |
| `403 restricted_resource` | 集成权限不足，重新勾选 Insert/Update content |
| 发布成功但前台看不到 | `type`/`status` 值不对（要 `Post` / `Published`），或 ISR 还没刷新（等 60s 或用 REVALIDATION_TOKEN 触发） |
| 表格没出来 | 表格必须是标准 `| a | b |` + 分隔行 `| --- | --- |` |
