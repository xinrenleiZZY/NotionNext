# Firefly-Y（Firefly 粉紫版）

> 主题 ID：`firefly-y` ｜ 由 `themes/firefly` 复制而来，仅替换配色与细节，布局/组件完全一致
> 配色参考：局域网站点「LyuTing 的学习小站」(`192.168.0.186:4321`)

## 与 Firefly 的差异

| 项 | Firefly | Firefly-Y |
| --- | --- | --- |
| 主色 | OKLCH `0.70 0.14 hue`（默认青绿 165） | **玫瑰粉 `#d6336c`** |
| 页面底色 | `oklch(0.95 0.01 hue)` | **`#fff7fa`（淡粉白）** |
| 卡片 | 纯白/深灰 | **粉紫毛玻璃**：`linear-gradient(#fff 90% → #fff6fa 82%)` + `blur(14px)` |
| 强调渐变 | 无 | **`#d6336c → #ff6b8a → #c9a8ff`**（tab 激活、chip、标题） |
| 圆角 | 1rem | **1.25rem** |
| 导航玻璃 | blur 20px | blur 22px + 粉色投影 `rgba(214,51,108,.14)` |
| 深色 | 深青灰 | **深梅紫** `#171016` / 卡片 `#241a22` |

## 启用方式

1. 预览：`https://www.juxingspacestation.top/?theme=firefly-y`
2. 设为默认：`blog.config.js` 的 `THEME = 'firefly-y'`（或环境变量 `NEXT_PUBLIC_THEME=firefly-y`）

## 配置

与 Firefly 共用 `FIREFLY_*` 配置项（`themes/firefly-y/config.js`），例如 `FIREFLY_BANNER`、`FIREFLY_WAVES`、`FIREFLY_SIDEBAR`、`FIREFLY_POST_COVER` 等。

## 维护说明

- 两份主题是「同源双色」：改布局/组件时两边都要改；只改配色时只动 `themes/firefly-y/style.js` 末尾的 palette 覆盖块。
- 若后续要完全独立演进，建议把共享逻辑抽成 `themes/_shared-firefly`，这里暂不重构。
