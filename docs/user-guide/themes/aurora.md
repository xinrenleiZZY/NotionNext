# Aurora（极光玻璃主题）

> 主题 ID：`aurora` ｜ 类型：内置自定义主题（不修改 `endspace`，可随时切回）

## 适用场景

想要「深空 + 极光渐变 + 玻璃拟态」的现代感，又不牺牲阅读体验。首页有主视觉与视频氛围，内页保持静态渐变以保证性能。

## 设计语言

| 维度 | 取值 |
| --- | --- |
| 主色 | 紫罗兰 `#6D4DFF`，辅色青 `#12B8CC`、粉 `#E8508F` |
| 底色 | 浅色 `#F4F5FA` / 深色 `#06070E` |
| 卡片 | 半透明 + `backdrop-blur(18px)` + 1px 冷光描边 |
| 圆角 | 卡片 20px，控件 12px |
| 排版 | 无衬线，标题紧字距，正文 16px / 1.85 行高 |
| 动效 | 仅 200ms 位移与透明度，`prefers-reduced-motion` 下全部关闭 |

## 启用方式

任选其一：

1. Vercel / 本地环境变量：`NEXT_PUBLIC_THEME=aurora`
2. Notion 配置表：`THEME` 设为 `aurora`
3. 临时预览（无需发版）：`https://你的域名/?theme=aurora`

切回原主题：把上述值改回 `endspace`，或访问 `/?theme=endspace`。

## 配置项

均在 `themes/aurora/config.js`，可被 Notion 同名配置覆盖：

| 配置项 | 默认 | 说明 |
| --- | --- | --- |
| `AURORA_HOME_VIDEO` | `true` | 仅首页播放背景视频 |
| `AURORA_HERO_TAGLINE` | `''` | 首页主视觉自定义文案 |
| `AURORA_POST_COVER` | `true` | 列表显示封面 |
| `AURORA_POST_EXCERPT` | `true` | 列表显示摘要 |
| `AURORA_TOC` | `true` | 文章页右侧目录 |
| `AURORA_GRAIN` | `true` | 背景噪点 |
| `AURORA_HERO_STATS` | `true` | 首页统计胶囊 |

## 覆盖的路由

`/`、`/page/[page]`、`/category/*`、`/tag/*`、`/archive`、`/search/*`、`/[prefix]/[slug]`、`/404`，另有 `LayoutDashboard` / `LayoutSignIn` / `LayoutSignUp` / `LayoutAuth` 占位实现。

## 已知限制

- 主题预览图暂用 `/bg_image.jpg`，正式图放在 `public/images/themes-preview/aurora.png` 后在 `conf/themeSwitch.manifest.js` 里去掉 `cover` 字段即可。
- 目录（TOC）依赖 Notion 标题块，正文无标题时不显示。
- 视频只在首页加载，其余页面为纯 CSS 渐变，不额外消耗带宽。
