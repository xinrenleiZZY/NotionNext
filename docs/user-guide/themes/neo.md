# Neo Brutal（贴纸粗野风主题）

> 主题 ID：`neo` ｜ 类型：内置自定义主题（不改动 `endspace` / `aurora`，可随时切回）

## 为什么会有这个主题

`endspace` 是细线工业风、`aurora` 是玻璃拟态，两者都偏"柔和"。`neo` 走完全相反的路子：**硬边、硬投影、高饱和贴纸色块**，和它们放在一起不会有任何相似感。

## 视觉规则

| 维度 | 取值 |
| --- | --- |
| 边框 | 统一 3px 实心黑（`--neo-ink`） |
| 投影 | 硬投影，无模糊：`6px 6px 0`（暗色模式投影变黄 `#FFD84D`） |
| 底色 | 浅色 `#F6F2E8` 纸感 + 22px 网点；深色 `#0D0D0D` |
| 色块 | 黄 `#FFD84D` / 蓝 `#2F5BFF` / 粉 `#FF5CA8` / 绿 `#2FD36B` |
| 圆角 | 4–6px（近似直角） |
| 字体 | 超粗 800/900 + 大写字母间距，标签用等宽感小字 |
| 交互 | hover 整体左上位移 3px、投影加深；active 反向压回 |
| 性能 | **无 blur、无 backdrop-filter、无大图**，纯 CSS，Lighthouse 友好 |

## 启用方式

1. 环境变量：`NEXT_PUBLIC_THEME=neo`
2. Notion Config 表：`THEME` = `neo`
3. 临时预览（部署后用，无需改配置）：`https://www.juxingspacestation.top/?theme=neo`

切回：`/?theme=endspace` 或 `/?theme=aurora`。

## 配置项（`themes/neo/config.js`）

| 配置项 | 默认 | 说明 |
| --- | --- | --- |
| `NEO_POST_COVER` | `true` | 列表显示封面 |
| `NEO_POST_EXCERPT` | `true` | 列表显示摘要 |
| `NEO_TOC` | `true` | 文章页右侧目录（INDEX 便签） |
| `NEO_HERO_STATS` | `true` | 首页统计贴纸 |
| `NEO_HOME_VIDEO` | `false` | 首页视频背景（粗野风默认关，开了会与硬边风格冲突） |

## 覆盖的路由

`/`、`/page/[page]`、`/category/*`、`/tag/*`、`/archive`、`/search/*`、`/[prefix]/[slug]`、`/404`，另有 `LayoutDashboard` / `LayoutSignIn` / `LayoutSignUp` / `LayoutAuth` 占位。

## 已知限制

- 预览图暂用 `/bg_image.jpg`，换成实拍截图后放到 `public/images/themes-preview/neo.png`，并在 `conf/themeSwitch.manifest.js` 删掉 `cover` 字段即可。
- 用了 emoji 图标（🔍 ☾ ☰ ↑）做控件，若想统一换成 SVG，改 `Header.js` 与 `BackToTop.js` 即可。
- 深色模式下硬投影是黄色，属于刻意的"霓虹描边"效果；不喜欢把 `style.js` 里 `.dark` 的 `--neo-shadow-color` 改成 `#000000`。
