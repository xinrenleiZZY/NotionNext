# Mizuki（二次元 MD3 主题 · 按源码复刻）

> 主题 ID：`mizuki` ｜ 源码参考：[matsuzaka-yuki/Mizuki](https://github.com/matsuzaka-yuki/Mizuki) v9（Astro 7 + Tailwind 4）
> 本主题不是移植，而是**按源码的设计 token 与组件结构在 NotionNext（React/Next Pages Router）里重写**。

## 从源码里对齐的真实参数

| 来源文件 | 采用的内容 |
| --- | --- |
| `src/styles/variables.styl` | **OKLCH + `--hue` 色相驱动**的整套色板：`--primary: oklch(0.70 0.14 hue)`、`--page-bg: oklch(0.95 0.01 hue)` / 暗色 `oklch(0.16 0.014 hue)`、`--card-bg: white` / `oklch(0.23 0.015 hue)`、`--radius-large: 1rem` |
| `src/styles/main.css` | `.top-gradient-highlight` 顶部渐变高光、`card-base`、`btn-plain` / `btn-regular` 交互色 |
| `src/styles/banner.css` | banner 标题 `text-shadow: 2px 2px 4px`、副标题 `1px 1px 2px`、`fadeInUp` 进入动画 |
| `src/components/layout/Banner.astro` | **底部 SVG 水波纹**（4 层，移动 10vh / 桌面 15vh）、Ken Burns + 交叉淡入轮播 |
| `src/components/features/posts/PostCard.astro` | 卡片 **圆角 1rem**、桌面端 **右侧 28% 封面**、移动端封面在上、标题 hover 变主色、竖向小色条 |
| `src/components/organisms/navigation/Navbar.astro` | 顶栏 **4.5rem**、首页覆盖 banner 时透明、滚动后变实底、按钮圆角 0.5rem、`btn-plain` hover |
| `src/config/siteConfig.ts` | `themeColor.hue` 默认 **240**（注释：粉色 345），本主题默认取 345，可配置 |

## 视觉规则

| 维度 | 取值 |
| --- | --- |
| 主色 | `oklch(0.70 0.14 var(--hue))`，改 `MIZUKI_HUE` 一个数字即整套换色 |
| 页面底 | 浅色 `oklch(0.95 0.01 hue)` / 深色 `oklch(0.16 0.014 hue)` |
| 卡片 | 白/深灰 + 圆角 1rem + 极轻阴影 |
| 字体 | 优先 Zen Maru Gothic（Mizuki 原版），回退 Inter / 鸿蒙 / 苹方 / 雅黑 |
| Banner | 全宽 62vh、Ken Burns 轮播、底部 4 层水波纹与页面底色同色 |
| 樱花 | 12 片 OKLCH 花瓣，纯 CSS，`prefers-reduced-motion` 下自动关 |

## 启用方式

1. 环境变量：`NEXT_PUBLIC_THEME=mizuki`
2. Notion Config 表：`THEME` = `mizuki`
3. 预览：`https://www.juxingspacestation.top/?theme=mizuki`

## 配置项（`themes/mizuki/config.js`）

| 配置项 | 默认 | 说明 |
| --- | --- | --- |
| `MIZUKI_HUE` | `345` | **主题色相 0–360**：0 红 / 200 青 / 240 蓝紫（Mizuki 原版默认）/ 345 粉 |
| `MIZUKI_BANNER` | `true` | 首页 banner |
| `MIZUKI_BANNER_INTERVAL` | `6` | 轮播间隔（秒） |
| `MIZUKI_BANNER_HEIGHT` | `62` | banner 高度（vh） |
| `MIZUKI_BANNER_WAVES` | `true` | 底部水波纹 |
| `MIZUKI_BANNER_TITLE` | `''` | banner 标题（空则用站点标题） |
| `MIZUKI_BANNER_SUBTITLE` | `''` | banner 副标题（空则用站点描述） |
| `MIZUKI_SAKURA` | `true` | 樱花飘落 |
| `MIZUKI_POST_COVER` | `true` | 列表封面 |
| `MIZUKI_POST_EXCERPT` | `true` | 列表摘要 |
| `MIZUKI_SIDEBAR` | `true` | 首页右侧栏 |
| `MIZUKI_TOC` | `true` | 文章页目录 |

## 素材建议

- Banner 优先用 Notion 站点页封面，其次最近 4 篇文章的封面；至少 2 张才会自动轮播。
- 想要「二次元感」，文章封面用横图（16:9 / 16:8）动漫插画，效果最接近原版。

## 已知限制

- 原版是 Astro Content Collections（anime / albums / diary / projects / music / timeline 等特色页面），NotionNext 没有对应数据结构，本主题只复刻**视觉外壳**（banner / 卡片 / 侧栏 / 顶栏 / 正文排版）。
- Zen Maru Gothic 未自托管（避免引 Google Fonts 影响国内速度），如需完全一致，把 woff2 放进 `public/fonts/` 并在 `style.js` 里加 `@font-face`。
- 樱花固定层 `z-index:1`，正文 `z-index:10`，不会挡点击。
