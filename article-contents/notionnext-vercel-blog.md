# NotionNext + Vercel：30 分钟搭建个人博客

## 什么是 NotionNext？

[NotionNext](https://github.com/tangly1024/NotionNext) 是一个基于 Next.js 的博客系统，使用 Notion 作为 CMS（内容管理系统）。

### 核心优势

- 📝 **Notion 写文章** — 直接在 Notion 编辑，不需要后台
- ⚡ **Vercel 部署** — 一键部署，全球 CDN
- 🎨 **20+ 主题** — 多种风格可选
- 🆓 **完全免费** — 只要 Notion 和 Vercel 的免费额度

## 搭建步骤

### 1. 复制 Notion 模板

1. 打开 [NotionNext 模板](https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5)
2. 点击右上角 **Duplicate**
3. 获取页面 ID

### 2. Fork 项目

```bash
git clone https://github.com/xinrenleiZZY/NotionNext.git
```

### 3. 修改配置

编辑 `blog.config.js`：

```javascript
NOTION_PAGE_ID: '你的页面ID',
THEME: 'endspace',  // 当前使用的主题
AUTHOR: '仙帝(Zeyan)',
LINK: 'https://jxspace.top',
```

### 4. 部署到 Vercel

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量 `NOTION_PAGE_ID`
4. 自动部署完成 🎉

## 踩坑记录

### ❌ 问题：构建时报错 `Cannot convert undefined or null to object`

**原因：** Notion 数据未公开，Vercel 无法读取

**解决：** 在 Notion 中开启 Share to Web

### ❌ 问题：自定义光标不生效

**原因：** SVG Data URL 中使用了 `;utf8` 标记，浏览器不支持

**解决：** 移除 `;utf8`，改为 `data:image/svg+xml,`

### ❌ 问题：视频背景加载慢

**原因：** 视频文件 18MB 太大

**解决：** 压缩到 3-5MB，或用环境变量控制

## 当前配置

| 配置项 | 值 |
|--------|-----|
| 主题 | endspace（科技风） |
| 部署 | Vercel |
| 域名 | jxspace.top |
| 评论 | 暂未开启 |
| 特效 | 加载动画 + 视频背景 + HUD |

---

*从零到一，30 分钟拥有一个属于自己的博客。*
