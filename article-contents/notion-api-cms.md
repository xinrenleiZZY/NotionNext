---
title: Notion API 实战：打造自动化内容管理系统
date: 2026-11-23
category: 功法阁
tags: Notion, API, CMS, 自动化, Python
summary: 用 Notion 官方 API 把文章、配置、资源全部流程化：数据库查询、分页、属性写入、块操作与限流处理，附一个「Markdown 一键发布」的实战脚本思路。
author: 仙帝·Zeyan
slug: notion-api-cms
pin: false
---

# Notion API 实战：打造自动化内容管理系统

> 把 Notion 当 CMS 用，难点不在「读」，在「写得对」。

这个站就是用 Notion 当内容源的。为了让「写完文章 → 一键发布」自动化，我把 Notion API 摸了一遍，这篇记录关键点。

## 一、先把权限理清

Notion 有两套完全不同的访问方式：

| 方式 | 凭证 | 用途 |
| --- | --- | --- |
| 官方 API | Integration Token（`secret_` / `ntn_`） | 读写页面与数据库，稳定 |
| 非官方 `notion-client` | `token_v2` | 渲染页面块（NotionNext 用它） |

**写入必须用官方 Integration**，并且要把目标数据库「分享」给这个集成，否则一律 404/403。

## 二、查询数据库

```python
import os, requests

H = {
    "Authorization": f"Bearer {os.environ['NOTION_API_KEY']}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

def query(db_id, cursor=None):
    body = {"page_size": 100}
    if cursor:
        body["start_cursor"] = cursor
    r = requests.post(f"https://api.notion.com/v1/databases/{db_id}/query",
                      headers=H, json=body, timeout=30)
    r.raise_for_status()
    return r.json()
```

分页必须处理：`has_more` + `next_cursor`，100 条一页。

## 三、属性写入：按类型来

Notion 的属性值结构严格，写错一个字段整页 400：

```python
props = {
    "title":   {"title": [{"text": {"content": "文章标题"}}]},
    "slug":    {"rich_text": [{"text": {"content": "my-slug"}}]},
    "date":    {"date": {"start": "2026-11-23"}},
    "category":{"select": {"name": "功法阁"}},
    "tags":    {"multi_select": [{"name": "Notion"}, {"name": "API"}]},
    "type":    {"select": {"name": "Post"}},
    "status":  {"select": {"name": "Published"}},
}
requests.post("https://api.notion.com/v1/pages", headers=H,
              json={"parent": {"database_id": DB}, "properties": props})
```

**最容易踩的坑**：`select` 的选项如果不存在，API 会自动创建——但拼错就会多出一个错分类。

## 四、写正文：块操作

正文是 block 的树。常用类型：`paragraph`、`heading_2/3`、`bulleted_list_item`、`code`、`quote`、`table`、`divider`、`image`。

```python
children = [{
    "object": "block", "type": "paragraph",
    "paragraph": {"rich_text": [{"type": "text", "text": {"content": "正文"}}]}
}]
requests.patch(f"https://api.notion.com/v1/blocks/{page_id}/children",
               headers=H, json={"children": children[:100]})
```

两个限制：**单次最多 100 个 block**；嵌套表/列表要作为 children 一并提交。

## 五、三个实战坑

1. **非法链接整块失败**：`link.url` 必须是 `http(s)/mailto/tel`，相对路径会让整个请求 400。我在脚本里做了 `sanitizeUrl()` 降级。
2. **富文本 2000 字上限**：超长段落要拆成多个 `rich_text` 元素。
3. **限流**：平均 3 req/s，突发会 429。指数退避 + 串行提交最稳。

## 六、我的发布流水线

```
Markdown（front-matter） → 解析 → 映射属性 → 创建页面 → 追加块 → 校验
```

封装成 `article-to-notion.mjs` 后，发布一篇文章只要一条命令：

```bash
yarn article:publish article-contents/xxx.md
```

顺带支持 `--dry-run`（不写库预览）、`--update`（按 slug 更新）、`--page`（只灌正文到已有页面）。

## 结语

Notion API 不难，难在「类型严格 + 限流 + 失败重试」。把这三件事处理掉，你就能把一个笔记工具变成真正的内容管理系统。

---

*相关：[NotionNext + Vercel 部署](https://www.juxingspacestation.top/article/notionnext-vercel-blog)*
