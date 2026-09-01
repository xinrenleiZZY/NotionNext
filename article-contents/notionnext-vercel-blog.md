---
title: NotionNext + Vercel 部署日记：永恒仙庭 30 分钟搭建指南
date: 2025-12-20
category: 工程札记
tags: NotionNext, Vercel, Next.js, 博客搭建, Notion API, 教程, 部署
summary: 仙帝手把手教你搭建本博客同款系统。NotionNext + Vercel 零成本部署，Notion 作为 CMS 写文章，endspace 主题定制，附三大踩坑实录、当前配置总览、以及仙帝私藏的 10 条配置修改建议。
author: 仙帝·Zeyan
slug: notionnext-vercel-blog
pin: false
---

# NotionNext + Vercel：30 分钟搭建个人博客

> 从 Fork 代码到博客上线，**30 分钟**。
> 从 0 改造成「永恒仙庭」风格，**3 个夜晚**。
> 本文是仙帝自己搭博客时的每一步踩坑实录——道友照着装，保证不翻车。

---

## 一、什么是 NotionNext？为什么选它？

### 1.1 一句话介绍

[NotionNext](https://github.com/tangly1024/NotionNext) 是一个基于 **Next.js** 的博客系统，**用 Notion 当作 CMS（内容管理后台）**。

```
你在 Notion 里写文章 → NotionNext 通过 Notion API 读取 → Next.js 渲染成精美博客 → Vercel 全球 CDN 加速
```

### 1.2 核心优势（为什么它值得你放弃 Hexo / Hugo / Wordpress）

| 维度 | NotionNext | Hexo | Hugo | Wordpress |
|------|------------|------|------|-----------|
| ✍️ **写作体验** | ⭐⭐⭐⭐⭐ **在 Notion 写**，所见即所得 | ⭐⭐⭐ 本地 Markdown | ⭐⭐⭐ 本地 Markdown | ⭐⭐ 富文本编辑器丑 |
| 🚀 **部署复杂度** | ⭐⭐⭐⭐⭐ **Vercel 一键** | ⭐⭐⭐ 要懂构建流程 | ⭐⭐ 要懂 Go | ⭐ 需要服务器 + 数据库 |
| 🎨 **主题生态** | ⭐⭐⭐⭐ 20+ 主题 | ⭐⭐⭐⭐⭐ 数百主题 | ⭐⭐⭐⭐ 数百主题 | ⭐⭐⭐⭐⭐ 上万主题 |
| 💸 **成本** | ⭐⭐⭐⭐⭐ **0 元**（Notion 免费 + Vercel 免费额度够用） | ⭐⭐⭐⭐⭐ 0 元 | ⭐⭐⭐⭐⭐ 0 元 | ⭐ 服务器 + 域名 |
| 🔄 **更新流程** | ⭐⭐⭐⭐⭐ Notion 点"发布"就完事 | ⭐⭐ Git push + rebuild | ⭐⭐ Git push + rebuild | ⭐⭐⭐ 后台编辑器 |
| 💻 **仙帝用了没** | ✅ **就是本站** | ❌ | ❌ | ❌ |

> 🌟 **最终杀招**：NotionNext 免费版 + Vercel Hobby 计划 + Notion 个人免费版，
> **$0 跑满 1 年**，你只需要买一个域名（.top 域名一年 ¥9）。

---

## 二、30 分钟从零到上线（仙帝官方教程）

### Step 1️⃣：准备 Notion 模板（5 分钟）

1. 打开 NotionNext 官方模板：
   👉 https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5
2. 右上角点 **Duplicate（复制）** 到你自己的 Notion Workspace
3. 点 **Share → Publish → 开启 Publish to web（公开到网络）**（**重要！不公开 Vercel 读不到数据**）
4. 复制你的 Notion 页面 ID：

```
URL 格式：https://www.notion.so/你的名字/博客名-【这个就是PAGE_ID】?pvs=4
例子：https://xian-di.notion.site/Eternal-Celestial-Court-02ab3b8678004aa69e9e415905ef32a5
                                    ↑↑↑ 这里 32 位字母数字就是 PAGE_ID ↑↑↑
```

> 💡 小技巧：Page ID 永远是 **32 个字符**，格式 `8-4-4-4-12` 连起来的样子。

### Step 2️⃣：Fork 仙帝的仓库（3 分钟，推荐！）

直接 fork 我已经美化好的版本 **比官方版多了 7 个特效 + 仙帝人设**，省事：

```bash
# 方式 A：网页上直接点 Fork → https://github.com/xinrenleiZZY/NotionNext → 右上角 Fork
# 方式 B：Git 命令行
git clone https://github.com/xinrenleiZZY/NotionNext.git
cd NotionNext
```

> 👉 **新手推荐方式 A**，不需要 Git 基础。Fork 完后你自己的账号下就有一份完整的永恒仙庭版。

### Step 3️⃣：改配置（10 分钟）

编辑 **`blog.config.js`**，以下 6 项必须改成你自己的：

```javascript
// /workspace/NotionNext/blog.config.js —— 仙帝精简版配置指南
module.exports = {

  // ===== 【必改 1】Notion 页面 ID（Step 1 拿到的 32 位串）=====
  NOTION_PAGE_ID: process.env.NEXT_PUBLIC_NOTION_PAGE_ID
    || '02ab3b8678004aa69e9e415905ef32a5',   // ← 改成你自己的

  // ===== 【必改 2】作者信息 =====
  AUTHOR: process.env.NEXT_PUBLIC_AUTHOR || '仙帝·Zeyan',   // ← 改成你的大名
  BIO: process.env.NEXT_PUBLIC_BIO || '放下本仙尊的阔乐！本仙尊乃永恒仙庭仙尊',

  // ===== 【必改 3】链接（不能是我的域名）=====
  LINK: process.env.NEXT_PUBLIC_LINK || 'https://jxspace.top',  // ← 你的域名
  HOME_BANNER_GREETINGS: ['道友，你来了！','放下本仙尊的阔乐！','...'],

  // ===== 【必改 4】主题选择（我用的是 endspace 科技工业风）=====
  THEME: process.env.NEXT_PUBLIC_THEME || 'endspace',   // ← 20+ 主题选一个
  /*
    主题速查：
    - next      经典 Notion 风（默认）
    - hexo      Hexo 简约风
    - fukasawa  文艺风
    - matery    粒子炫酷风
    - example   博客示例
    - navy      海军蓝
    - hero      英雄区大图
    - endspace  ⭐ 仙帝同款 科技工业风（推荐）
  */

  // ===== 【必改 5】SEO 关键词（决定 Google 能不能搜到你）=====
  KEYWORDS: process.env.NEXT_PUBLIC_KEYWORD
    || '仙帝, Zeyan, 永恒仙庭, 聚星知识产权, AI, 技术博客, Python',  // ← 改成你自己的标签

  // ===== 【必改 6】部署环境 =====
  VERIFY_GOOGLE_SITE: process.env.NEXT_PUBLIC_VERIFY_GOOGLE_SITE || '',
}
```

### Step 4️⃣：部署到 Vercel（10 分钟，最爽的一步）

1. 打开 **https://vercel.com** → 用 GitHub 登录
2. 点 **Add New... → Project** → 选择你刚刚 Fork 的 `NotionNext` 仓库
3. **Framework Preset** 自动识别为 Next.js，不用改
4. 在 **Environment Variables（环境变量）** 里加一条：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_NOTION_PAGE_ID` | 你的 32 位 Notion Page ID |

5. 点 **Deploy**，然后去喝杯奶茶 ☕
6. 大概 2-4 分钟后，Vercel 提示 **"Congrats!"** → 你就有了一个 `https://你的项目名.vercel.app` 的博客！

### Step 5️⃣：绑定自定义域名（2 分钟，可选但推荐）

1. Vercel 项目页 → **Settings → Domains**
2. 输入你的域名（如 `jxspace.top`）→ Add
3. Vercel 会告诉你要加什么 DNS 记录：
   ```
   类型：CNAME
   主机：@ / www
   值：cname.vercel-dns.com
   ```
4. 到你的域名服务商（阿里云 / 腾讯云 / Namesilo）加上这条解析
5. 等 5 分钟 → Vercel 自动申请 HTTPS 证书 → **✅ 绿色小锁出现，大功告成！**

---

## 三、仙帝私藏：10 条进阶配置修改建议

如果你 Fork 的是仙帝永恒仙庭版，以下是你可能想改的地方：

### 3.1 人设 / 文案相关

| 文件 | 改什么 | 位置 |
|------|--------|------|
| `blog.config.js` | GREETING_WORDS（首页轮播欢迎语） | L60 左右 |
| `themes/endspace/config.js` | ENDSPACE_BANNER_WATERMARK_TEXT（首页水印大字） | L45 |
| `themes/endspace/config.js` | ENDSPACE_LOADING_TEXT_*（加载动画五段式修仙文字） | L37-L42 |
| `conf/widget.config.js` | GREETING_WORDS（Live2D 宠物说的话） | / |

### 3.2 特效相关（永恒仙庭默认全开，可以按需关闭）

| 配置文件 | 开关 | 默认 | 说明 |
|----------|------|------|------|
| `conf/animation.config.js` | FIREWORKS | `true` | 🎆 鼠标点击放烟花 |
| `conf/animation.config.js` | MOUSE_FOLLOW | `true` | ✨ 鼠标跟随金色粒子 |
| `conf/animation.config.js` | SAKURA | `true` | 🌸 樱花飘落（粉色基调核心） |
| `conf/animation.config.js` | STARRY_SKY | `true` | 🌌 夜空流星雨背景 |
| `conf/widget.config.js` | MUSIC_PLAYER | `true` | 🎵 右下角音乐播放器 |
| `conf/widget.config.js` | WIDGET_PET | `true` | 🐱 Live2D 看板娘（黑貓柴城） |
| `conf/widget.config.js` | THEME_SWITCH | `true` | 🌓 深色/浅色主题切换按钮 |

### 3.3 音乐播放列表定制

```javascript
// conf/widget.config.js —— 仙帝的 BGM 列表（你可以改成你喜欢的歌）
MUSIC_PLAYER_AUDIO_LIST: [
  { name: '广寒宫', artist: '吴琼 / 平生不晚',
    url: 'https://music.163.com/song/media/outer/url?id=1488358212.mp3',
    cover: 'https://p1.music.126.net/xxxxxx.jpg' },
  // 添加更多歌曲……
],
```

---

## 四、仙帝踩过的 3 个大坑（90% 的人会踩）

### ❌ 坑 1：构建报错 `Cannot convert undefined or null to object`

**症状**：
```
Error occurred prerendering page "/"
TypeError: Cannot convert undefined or null to object
    at Function.keys (<anonymous>)
```

**根本原因**：Notion 页面没公开 → Vercel 服务器读不到数据 → 所有 Notion Block 是 `null` → 代码遍历时报错。

**修复 3 步**：
1. 打开 Notion 页面 → 右上角 **Share**
2. 开关 **Publish to web** → 必须 ON（绿色）
3. 复制 URL 用无痕浏览器访问一下，能打开才算真的公开了
4. Vercel 项目 → **Deployments → 右上角三个点 → Redeploy**

### ❌ 坑 2：自定义 SVG 鼠标光标不生效

**症状**：`cursor: url("data:image/svg+xml;utf8,<svg>...")` 写了，但浏览器光标没变。

**根本原因**：Chrome 113+ 不识别 SVG Data URL 里的 `;utf8` 标记（属于非标准语法）。

**修复**：去掉 `;utf8`，用标准语法：
```css
/* 错误：data:image/svg+xml;utf8,<svg>... */
/* 正确：*/
cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'..."), auto;
```
> ✅ 别忘了用 **URL 编码**把 `<` → `%3C`，`>` → `%3E`，空格 → `%20`。

### ❌ 坑 3：endspace 主题视频背景加载 5 秒以上

**症状**：首页加载动画结束后，黑屏 3-8 秒，视频背景才出现。

**根本原因**：默认视频是 **18MB 的 MP4**，对中国大陆访客 + Vercel 美西节点的组合就是噩梦。

**修复 3 条并行方案**：
1. **压缩视频**：FFmpeg 压到 3-5MB，分辨率 1280×720 足够（背景看不太清细节）
   ```bash
   ffmpeg -i input.mp4 -vcodec libx265 -crf 32 -s 1280x720 -r 24 output-small.mp4
   ```
2. **换 CDN**：把视频放到阿里云 OSS / 腾讯云 COS，走国内 CDN（加载速度提升 10 倍）
3. **加 Poster 帧**：`<video poster="first-frame.webp">`，首屏先显示一张 50KB 的封面 WebP 图，不黑屏

---

## 五、永恒仙庭·当前配置总览（给道友抄作业）

| 配置项 | 仙帝的值 | 推荐值 |
|--------|----------|--------|
| 🎨 **主题** | `endspace` 科技工业风 | 想走技术人设 → endspace / matery<br>想走文青 → fukasawa / hexo |
| 🚀 **部署** | Vercel Hobby Plan | 预算 0 → Vercel<br>预算 ¥50/月 → Cloudflare Pages（中国大陆更快一点）|
| 🌐 **域名** | `jxspace.top`（¥9/年） | .com 首选（¥60/年），.top / .dev 便宜 |
| 💬 **评论系统** | 暂未开启（即将接入 Waline） | 推荐 Waline 或 Giscus（完全免费） |
| 🎆 **特效全开** | 烟花 · 樱花 · 鼠标粒子 · 星空雨 · 音乐 · 宠物 · 主题切换 | 电脑端全开，手机端建议关一半（耗流量） |
| 📊 **分析统计** | 暂未接入（接 Vercel Analytics） | Vercel Analytics / 百度统计 / Umami 自建 |
| 📝 **文章来源** | Notion CMS + 本地 Markdown（article-contents/） | 两种方式可以混用！Notion 写日常，本地 MD 放深度长文 |

---

## 六、FAQ：高频问题

**Q: Notion API 有没有调用上限？会不会收费？**
> A: Notion 集成 API 目前是免费无上限的（只要你不一次并发 1000 个请求）。
> NotionNext 用了 ISR（增量静态再生成），实际 Notion API 调用**每天只有几十次**，99% 访问走 Vercel CDN 缓存。

**Q: 我不会代码，能改出永恒仙庭这种效果吗？**
> A: **完全可以**。90% 的配置只需要改 `.js` 里的纯文字字符串，不需要编程知识。
> 剩下 10% 的 CSS 特效，**Fork 仙帝的仓库就已经帮你写好了**，啥都不用做。

**Q: 想换别的主题，特效还有吗？**
> A: 动画特效（烟花/樱花/鼠标跟随）是全局配置，**所有主题通用**。
> 但 endspace 主题的专属水印、加载动画文字、HUD 样式是主题特有，换主题需要按相同套路改对应主题的配置文件。

**Q: 文章写完多久能在博客上看到？**
> A: Notion 里点 Publish → 大约 **1-5 分钟**后博客就自动更新了。
> 原因：Vercel ISR 默认 60 秒 Revalidate，最多等 1 个 Revalidate 周期。

---

## 七、从 0 到永恒仙庭：我花了什么？

| 投入项 | 金额 | 时间 |
|--------|------|------|
| 域名 jxspace.top | ¥9 / 年 | 10 分钟注册 |
| Vercel 部署 | ¥0（Hobby 计划免费额度完全够用） | 30 分钟部署 |
| Notion | ¥0（个人版完全免费） | 5 分钟复制模板 |
| Dify API 成本（写文章用） | ~$128 / 月（可选，纯手写文章就 0） | — |
| 配置修改 & 特效 & 样式 | ¥0 | **3 个晚上**（这才是大头）|
| 写深度技术文章 | ¥0 | 每篇 4-8 小时，累计 100+ 小时 |
| **合计** | **¥9 + $384/年** | — |

> 💡 **对比市场价格**：外包做一个同款水平的个人技术博客 → ¥8,000-15,000。
> 仙帝动手做 → 总花费不到 ¥3000，还收获了 10+ 篇深度技术文章 + 一整套工程化经验。

---

## 八、写在最后：搭建博客最大的收益是什么？

很多朋友问我："现在公众号、知乎、掘金、Medium 那么多平台，为什么还要自己搭博客？"

我的回答是 3 点：

### 1️⃣ **你的数据你做主**
平台随时可能删帖、封号、变算法（**知乎去年降权的创作者不计其数**）。
自己的博客：域名在你手里，内容在 Notion + Git 双重备份，**没人能动。**

### 2️⃣ **技术人设的「数字名片」**
面试时递给 HR 一个 `jxspace.top`，**比只给简历多了 3 倍的话题空间**。
- 文章展示你的思考深度
- 项目展示你的工程能力
- 博客系统本身展示你的全栈审美 + 动手能力

### 3️⃣ **「费曼学习法」最强工具**
写一篇技术博客，要求你把"会做"变成"会讲"。
这 10 篇深度文章写下来，我对 Docker、Dify、爬虫架构的理解深度**比只写代码时提升了至少 2 倍。**

---

> **从零到一，30 分钟拥有一个属于自己的博客。**
>
> 就从 Fork 仙帝的仓库开始：
> 👉 https://github.com/xinrenleiZZY/NotionNext
>
> 部署遇到问题？欢迎在永恒仙庭博客留言区 / 我的 GitHub Issue 提问。
> **仙帝必回！** 🫡

---

*—— 仙帝·Zeyan 记于永恒仙庭·藏经阁*
