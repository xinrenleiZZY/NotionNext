/**
 * Mizuki 主题 - 设计 token 与全局样式
 *
 * 参数取自 Mizuki 源码（matsuzaka-yuki/Mizuki）：
 *  - src/styles/variables.styl：OKLCH + --hue 色相驱动的整套色板
 *  - src/styles/main.css：--radius-large / .top-gradient-highlight / card-base
 *  - src/styles/banner.css：banner 文字阴影、fadeInUp、水波纹
 *  - src/config/siteConfig.ts：themeColor.hue（默认 240，粉色 345）
 *
 * 说明：这里是 NotionNext 的 CSS 变量重写，不依赖 Tailwind v4 / Stylus。
 */

export const Style = () => {
  return (
    <style jsx global>{`
      /* ============================================================
         Token：OKLCH + 色相驱动（改 --hue 即换整套主题色）
         ============================================================ */
      :root {
        --hue: 345;
        --radius-large: 1rem;
        --layout-page-width: 1200px;

        --primary: oklch(0.7 0.14 var(--hue));
        --page-bg: oklch(0.95 0.01 var(--hue));
        --card-bg: #ffffff;
        --card-bg-transparent: rgba(255, 255, 255, 0.8);
        --float-panel-bg: #ffffff;

        --btn-content: oklch(0.55 0.12 var(--hue));
        --btn-regular-bg: oklch(0.95 0.025 var(--hue));
        --btn-regular-bg-hover: oklch(0.9 0.05 var(--hue));
        --btn-regular-bg-active: oklch(0.85 0.08 var(--hue));
        --btn-plain-bg-hover: oklch(0.95 0.025 var(--hue));
        --btn-plain-bg-active: oklch(0.98 0.01 var(--hue));

        --deep-text: oklch(0.25 0.02 var(--hue));
        --title-active: oklch(0.6 0.1 var(--hue));
        --line-divider: rgba(0, 0, 0, 0.08);
        --line-color: rgba(0, 0, 0, 0.1);
        --meta-divider: rgba(0, 0, 0, 0.2);
        --content-meta: rgba(0, 0, 0, 0.7);

        --inline-code-bg: var(--btn-regular-bg);
        --inline-code-color: var(--btn-content);
        --selection-bg: oklch(0.9 0.05 var(--hue));
        --codeblock-bg: oklch(0.97 0.005 var(--hue));
        --codeblock-topbar-bg: oklch(0.94 0.01 var(--hue));

        --link-underline: oklch(0.93 0.04 var(--hue));
        --link-hover: oklch(0.95 0.025 var(--hue));

        --toc-badge-bg: oklch(0.9 0.045 var(--hue));
        --toc-btn-hover: oklch(0.92 0.015 var(--hue));
        --toc-item-active: oklch(0.7 0.13 var(--hue));
      }

      .dark {
        --primary: oklch(0.75 0.14 var(--hue));
        --page-bg: oklch(0.16 0.014 var(--hue));
        --card-bg: oklch(0.23 0.015 var(--hue));
        --card-bg-transparent: rgba(23, 23, 23, 0.8);
        --float-panel-bg: oklch(0.19 0.015 var(--hue));

        --btn-content: oklch(0.75 0.1 var(--hue));
        --btn-regular-bg: oklch(0.33 0.035 var(--hue));
        --btn-regular-bg-hover: oklch(0.38 0.04 var(--hue));
        --btn-regular-bg-active: oklch(0.43 0.045 var(--hue));
        --btn-plain-bg-hover: oklch(0.3 0.035 var(--hue));
        --btn-plain-bg-active: oklch(0.27 0.025 var(--hue));

        --deep-text: oklch(0.95 0.01 var(--hue));
        --title-active: oklch(0.75 0.12 var(--hue));
        --line-divider: rgba(255, 255, 255, 0.08);
        --line-color: rgba(255, 255, 255, 0.1);
        --meta-divider: rgba(255, 255, 255, 0.2);
        --content-meta: rgba(255, 255, 255, 0.6);

        --selection-bg: oklch(0.4 0.08 var(--hue));
        --codeblock-bg: oklch(0.17 0.015 var(--hue));
        --codeblock-topbar-bg: oklch(0.12 0.015 var(--hue));

        --link-underline: oklch(0.4 0.08 var(--hue));
        --link-hover: oklch(0.4 0.08 var(--hue));

        --toc-badge-bg: var(--btn-regular-bg);
        --toc-btn-hover: oklch(0.22 0.02 var(--hue));
        --toc-item-active: oklch(0.35 0.07 var(--hue));
      }

      html {
        scroll-behavior: smooth;
        scrollbar-gutter: stable;
        scroll-padding-top: 5.5rem;
      }

      #theme-mizuki {
        position: relative;
        min-height: 100vh;
        background-color: var(--page-bg);
        color: var(--deep-text);
        font-family: 'Zen Maru Gothic', 'Inter', 'HarmonyOS Sans SC',
          'PingFang SC', 'Microsoft YaHei', -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
        overflow-x: clip;
      }

      #theme-mizuki ::selection {
        background: var(--selection-bg);
        color: inherit;
      }

      /* 页面顶部渐变高光（Mizuki main.css .top-gradient-highlight） */
      #theme-mizuki .mz-top-highlight {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 180px;
        pointer-events: none;
        z-index: 20;
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.3) 30%,
          rgba(255, 255, 255, 0.15) 60%,
          rgba(255, 255, 255, 0.05) 80%,
          transparent 100%
        );
      }

      .dark #theme-mizuki .mz-top-highlight {
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.5) 0%,
          rgba(0, 0, 0, 0.3) 30%,
          rgba(0, 0, 0, 0.15) 60%,
          rgba(0, 0, 0, 0.05) 80%,
          transparent 100%
        );
      }

      /* ============================================================
         卡片 / 按钮（对应 main.css 的 card-base / btn-* 工具类）
         ============================================================ */
      #theme-mizuki .card-base {
        background: var(--card-bg);
        border-radius: var(--radius-large);
        overflow: hidden;
        transition: background-color 0.15s;
      }

      #theme-mizuki .card-transparent {
        background: var(--card-bg-transparent);
        -webkit-backdrop-filter: blur(8px) saturate(140%);
        backdrop-filter: blur(8px) saturate(140%);
        border-radius: var(--radius-large);
        overflow: hidden;
      }

      #theme-mizuki .card-shadow {
        box-shadow:
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 2px 6px rgba(0, 0, 0, 0.04),
          0 12px 32px rgba(0, 0, 0, 0.06);
      }

      .dark #theme-mizuki .card-shadow {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04);
      }

      #theme-mizuki .btn-plain {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        transition:
          background-color 0.15s,
          color 0.15s,
          transform 0.15s;
      }

      #theme-mizuki .btn-plain:hover {
        background: var(--btn-plain-bg-hover);
        color: var(--primary);
      }

      #theme-mizuki .btn-regular {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: 0.75rem;
        background: var(--btn-regular-bg);
        color: var(--btn-content);
        font-weight: 500;
        transition:
          background-color 0.15s,
          color 0.15s;
      }

      #theme-mizuki .btn-regular:hover {
        background: var(--btn-regular-bg-hover);
        color: var(--primary);
      }

      #theme-mizuki .mz-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 24px;
        padding: 0 10px;
        border-radius: 999px;
        background: var(--btn-regular-bg);
        color: var(--btn-content);
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
        transition: background-color 0.15s;
      }

      #theme-mizuki .mz-chip:hover {
        background: var(--btn-regular-bg-hover);
      }

      #theme-mizuki .mz-fab {
        display: grid;
        place-items: center;
        border-radius: 0.75rem;
        background: var(--card-bg);
        color: var(--primary);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        transition:
          transform 0.15s,
          background-color 0.15s;
      }

      #theme-mizuki .mz-fab:hover {
        transform: translateY(-2px);
        background: var(--btn-plain-bg-hover);
      }

      /* ============================================================
         旧 token 别名（组件里用的是这套命名，映射到 Mizuki 真 token）
         ============================================================ */
      :root {
        --mz-primary: var(--primary);
        --mz-on-primary: #ffffff;
        --mz-primary-container: var(--btn-regular-bg);
        --mz-on-primary-container: var(--btn-content);
        --mz-secondary: var(--primary);
        --mz-tertiary: var(--primary);
        --mz-surface: var(--page-bg);
        --mz-surface-container: var(--card-bg);
        --mz-surface-container-high: var(--btn-plain-bg-hover);
        --mz-surface-variant: var(--btn-regular-bg);
        --mz-outline: var(--line-color);
        --mz-on-surface: var(--deep-text);
        --mz-on-surface-variant: var(--content-meta);
        --mz-radius-sm: 0.5rem;
        --mz-radius: 0.75rem;
        --mz-radius-lg: var(--radius-large);
      }

      #theme-mizuki .card-base,
      #theme-mizuki .mz-surface {
        background: var(--card-bg);
        border-radius: var(--radius-large);
        overflow: hidden;
        transition: background-color 0.15s;
      }

      #theme-mizuki .mz-card {
        background: var(--card-bg);
        border-radius: var(--radius-large);
        overflow: hidden;
        box-shadow:
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 2px 6px rgba(0, 0, 0, 0.04),
          0 12px 32px rgba(0, 0, 0, 0.06);
        transition: background-color 0.15s;
      }

      .dark #theme-mizuki .mz-card {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04);
      }

      /* ============================================================
         Banner：文字阴影 + fadeInUp + 水波纹
         ============================================================ */
      .mz-banner-title {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        animation: mz-fadeInUp 1s ease-out;
        font-weight: bold;
      }

      .mz-banner-subtitle {
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
        animation: mz-fadeInUp 1s ease-out 0.3s both;
        min-height: 1.5em;
        line-height: 1.2;
      }

      @keyframes mz-fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Ken Burns 轮播（参考 Mizuki Banner.astro） */
      .mz-kenburns {
        animation: mz-kenburns 12s ease-out both;
      }

      @keyframes mz-kenburns {
        from {
          transform: scale(1) translate3d(0, 0, 0);
        }
        to {
          transform: scale(1.08) translate3d(0, -1%, 0);
        }
      }

      /* 水波纹：底部与页面背景同色，形成"波浪切口" */
      .mz-waves {
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 10vh;
        min-height: 50px;
        max-height: 150px;
        z-index: 5;
        pointer-events: none;
      }

      @media (min-width: 768px) {
        .mz-waves {
          height: 15vh;
        }
      }

      .mz-waves path {
        fill: var(--page-bg);
        transition: fill 0.15s;
      }

      .mz-wave-1 {
        animation: mz-move-wave 12s linear infinite;
        opacity: 0.6;
      }
      .mz-wave-2 {
        animation: mz-move-wave 18s linear infinite reverse;
        opacity: 0.4;
      }
      .mz-wave-3 {
        animation: mz-move-wave 24s linear infinite;
        opacity: 0.25;
      }
      .mz-wave-4 {
        animation: mz-move-wave 30s linear infinite reverse;
        opacity: 0.12;
      }

      @keyframes mz-move-wave {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-50%);
        }
      }

      /* ============================================================
         Notion 正文
         ============================================================ */
      #theme-mizuki .notion {
        color: var(--deep-text);
      }

      #theme-mizuki .notion-title,
      #theme-mizuki .notion-h,
      #theme-mizuki .notion-h1,
      #theme-mizuki .notion-h2,
      #theme-mizuki .notion-h3 {
        color: var(--deep-text);
        font-weight: 700;
      }

      #theme-mizuki .notion-text {
        color: var(--deep-text);
        font-size: 16px;
        line-height: 1.9;
      }

      #theme-mizuki .notion-link {
        color: var(--primary);
        text-decoration: none;
        border-bottom: 2px solid var(--link-underline);
      }

      #theme-mizuki .notion-link:hover {
        background: var(--link-hover);
      }

      #theme-mizuki .notion-quote {
        border: none;
        border-left: 4px solid var(--primary);
        background: var(--btn-regular-bg);
        border-radius: 0 0.5rem 0.5rem 0;
        padding: 12px 16px;
        font-style: normal;
        color: var(--deep-text);
      }

      #theme-mizuki .notion-callout {
        background: var(--btn-regular-bg);
        border-radius: 0.5rem;
      }

      #theme-mizuki .notion-code {
        background: var(--codeblock-bg);
        border-radius: 0.5rem;
      }

      #theme-mizuki :not(pre) > code {
        background: var(--inline-code-bg);
        color: var(--inline-code-color);
        border-radius: 0.375rem;
        padding: 1px 6px;
        font-size: 0.9em;
      }

      #theme-mizuki .notion-image img,
      #theme-mizuki .notion-asset-wrapper img {
        border-radius: 0.5rem;
      }

      #theme-mizuki .notion-bookmark,
      #theme-mizuki .notion-collection-card,
      #theme-mizuki .notion-table,
      #theme-mizuki .notion-simple-table {
        border-radius: 0.75rem;
      }

      #theme-mizuki .notion-collection-card {
        background: var(--card-bg);
      }

      /* ============================================================
         樱花飘落
         ============================================================ */
      .mz-sakura {
        position: fixed;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        overflow: hidden;
      }

      .mz-petal {
        position: absolute;
        top: -6vh;
        border-radius: 12px 0 12px 0;
        background: linear-gradient(
          135deg,
          oklch(0.88 0.1 var(--hue)),
          oklch(0.78 0.14 var(--hue))
        );
        opacity: 0.6;
        animation-name: mz-sakura-fall;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }

      .dark .mz-petal {
        opacity: 0.35;
      }

      @keyframes mz-sakura-fall {
        0% {
          transform: translate3d(0, -10vh, 0) rotate(0deg);
        }
        50% {
          transform: translate3d(6vw, 50vh, 0) rotate(220deg);
        }
        100% {
          transform: translate3d(-2vw, 110vh, 0) rotate(480deg);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #theme-mizuki *,
        .mz-waves path,
        .mz-kenburns,
        .mz-petal {
          animation: none !important;
          transition: none !important;
        }
        .mz-sakura {
          display: none;
        }
      }
    `}</style>
  )
}
