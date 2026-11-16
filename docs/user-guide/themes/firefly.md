# Firefly（复刻 CuteLeaf/Firefly）

> 主题 ID：`firefly` ｜ 源码参考：[CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly)（Astro + Tailwind 4，2.5k★，每日活跃）
> 本主题按源码设计 token 与布局在 NotionNext（React/Next Pages Router）内重写，不是移植。

## 从源码对齐的真实参数

| 源码位置 | 采用内容 |
| --- | --- |
| `src/styles/variables.styl` | OKLCH + `--hue` 色相驱动（原版默认 **165** 青绿）：`--primary: oklch(0.70 0.14 hue)`、`--page-bg: oklch(0.95 0.01 hue)` / 暗色 `oklch(0.16 0.014 hue)`、`--card-bg: white` / `oklch(0.23 0.015 hue)`、`--radius-large: 1rem`、`--btn-regular-*`、`--content-meta`、`--toc-*` |
| `src/styles/main.css` | `--navbar-glass-highlight` / `--navbar-glass-hairline` 发丝线、`--navbar-glass-blur: 20px`、`--shadow-navbar`、`--ease-standard` / `--duration-*`、`--radius-*` / `--spacing-*` 尺度 |
| `src/styles/navbar.css` | 玻璃胶囊导航（圆角 1rem、20px 模糊、inset 高光 + 外阴影） |
| `src/styles/waves.css` | banner 底部水波纹分层 |
| `src/components/layout/WallpaperSection.astro` | banner 轮播 + Ken Burns + 交叉淡入 + 底部波浪切口 |
| 首页布局 | 三栏：左资料卡（280px） / 中文章流（分类 Tab + 左文右图卡片） / 右 Widgets（最新动态 / 站点统计 / 分类 / 标签） |
| `src/config/siteConfig.ts` | `themeColor.hue = 165` |

## 与其它主题的区别

| | Aurora | Mizuki | **Firefly** |
| --- | --- | --- | --- |
| 底色 | 深空紫 | 樱花粉 | 青绿 hue 165（可改） |
| 布局 | 单栏 + 卡片流 | 双栏 + 大 banner | **三栏**（资料卡 + 文章流 + 动态） |
| 导航 | 玻璃胶囊（实底） | 胶囊（透明覆盖） | **玻璃胶囊 + 20px 模糊 + 发丝线** |
| 卡片 | 左图右文 | 上图下文 | **左文右图（40%）** |
| 特色 | 极光光斑 | MD3 樱花 | 分类 Tab、置顶徽标、动态/统计侧栏 |

## 启用方式

1. 预览（无需改配置）：`https://www.juxingspacestation.top/?theme=firefly`
2. 设为默认：Notion Config 表 `THEME` = `firefly`，或环境变量 `NEXT_PUBLIC_THEME=firefly`

## 配置项（`themes/firefly/config.js`）

| 配置项 | 默认 | 说明 |
| --- | --- | --- |
| `FIREFLY_HUE` | `165` | **主题色相 0–360**：165 青绿(原版) / 200 青 / 250 蓝 / 300 紫 / 345 粉 |
| `FIREFLY_BANNER` | `true` | 首页 banner |
| `FIREFLY_BANNER_HEIGHT` | `62` | banner 高度（vh） |
| `FIREFLY_BANNER_INTERVAL` | `6` | 轮播间隔（秒） |
| `FIREFLY_WAVES` | `true` | 底部水波纹 |
| `FIREFLY_LEFT_SIDEBAR` | `true` | 左资料卡 |
| `FIREFLY_RIGHT_SIDEBAR` | `true` | 右 Widgets |
| `FIREFLY_POST_COVER` | `true` | 列表封面 |
| `FIREFLY_POST_EXCERPT` | `true` | 列表摘要 |
| `FIREFLY_TOC` | `true` | 文章页目录 |
| `FIREFLY_BANNER_DESC` | `''` | banner 副标题（空则用站点描述） |

## 已知限制

- 原版特色页面（番剧/相册/动态/项目/音乐）依赖 Astro Content Collections，NotionNext 无对应数据结构，本主题只复刻**主站视觉外壳**。
- 图标用 FontAwesome（仓库已有 `public/vendor/fontawesome`），菜单图标沿用 Notion 菜单项的 `icon` 字段（`fas fa-xxx`）。
- 预览图暂用 `/bg_image.jpg`，换实拍截图后放 `public/images/themes-preview/firefly.png` 并删掉 manifest 里的 `cover` 字段。
