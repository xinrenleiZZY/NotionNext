/**
 * Firefly 主题样式
 *
 * Token 直接翻译自 Firefly 源码 src/styles/variables.styl：
 *   --primary: oklch(0.70 0.14 var(--hue))
 *   --page-bg: oklch(0.95 0.01 var(--hue)) / 暗色 oklch(0.16 0.014 var(--hue))
 *   --card-bg: white / 暗色 oklch(0.23 0.015 var(--hue))
 *   --radius-large: 1rem，navbar 玻璃 blur 20px + highlight/hairline 发丝线
 * 另加：banner 底部水波纹、卡片、标签、Notion 正文覆写。
 */

export const Style = () => {
  return (
    <style jsx global>{`
      :root {
        --hue: 165;
        --radius-large: 1rem;
        --page-width: 1280px;

        --primary: oklch(0.7 0.14 var(--hue));
        --page-bg: oklch(0.95 0.01 var(--hue));
        --card-bg: #ffffff;
        --card-bg-transparent: rgba(255, 255, 255, 0.6);
        --float-panel-bg: #ffffff;

        --btn-content: oklch(0.55 0.12 var(--hue));
        --btn-regular-bg: oklch(0.95 0.025 var(--hue));
        --btn-regular-bg-hover: oklch(0.9 0.05 var(--hue));
        --btn-regular-bg-active: oklch(0.85 0.08 var(--hue));
        --btn-plain-bg-hover: oklch(0.95 0.025 var(--hue));
        --btn-plain-bg-active: oklch(0.98 0.01 var(--hue));

        --deep-text: oklch(0.25 0.02 var(--hue));
        --line-divider: rgba(0, 0, 0, 0.08);
        --line-color: rgba(0, 0, 0, 0.1);
        --content-meta: rgba(0, 0, 0, 0.7);
        --muted: oklch(0.93 0.015 var(--hue));

        --selection-bg: oklch(0.9 0.05 var(--hue));
        --codeblock-bg: oklch(0.17 0.015 var(--hue));
        --inline-code-bg: var(--btn-regular-bg);
        --inline-code-color: var(--btn-content);
        --link-underline: oklch(0.93 0.04 var(--hue));
        --link-hover: oklch(0.95 0.025 var(--hue));

        --toc-badge-bg: oklch(0.9 0.045 var(--hue));
        --toc-item-active: oklch(0.7 0.13 var(--hue));

        --shadow-navbar: 0 4px 16px rgba(0, 0, 0, 0.1);
        --navbar-glass-highlight: rgba(255, 255, 255, 0.18);
        --navbar-glass-hairline: rgba(0, 0, 0, 0.06);
        --navbar-glass-blur: 20px;

        --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
        --duration-medium: 200ms;

        /* 旧组件别名映射 */
        --ff-on-surface: var(--deep-text);
        --ff-on-surface-variant: var(--content-meta);
        --ff-surface: var(--card-bg);
        --ff-surface-high: var(--btn-regular-bg);
        --ff-outline: var(--line-color);
      }

      .dark {
        --primary: oklch(0.75 0.14 var(--hue));
        --page-bg: oklch(0.16 0.014 var(--hue));
        --card-bg: oklch(0.23 0.015 var(--hue));
        --card-bg-transparent: rgba(23, 23, 23, 0.6);
        --float-panel-bg: oklch(0.19 0.015 var(--hue));

        --btn-content: oklch(0.75 0.1 var(--hue));
        --btn-regular-bg: oklch(0.33 0.035 var(--hue));
        --btn-regular-bg-hover: oklch(0.38 0.04 var(--hue));
        --btn-regular-bg-active: oklch(0.43 0.045 var(--hue));
        --btn-plain-bg-hover: oklch(0.3 0.035 var(--hue));
        --btn-plain-bg-active: oklch(0.27 0.025 var(--hue));

        --deep-text: oklch(0.95 0.01 var(--hue));
        --line-divider: rgba(255, 255, 255, 0.08);
        --line-color: rgba(255, 255, 255, 0.1);
        --content-meta: rgba(255, 255, 255, 0.6);
        --muted: oklch(0.25 0.015 var(--hue));

        --selection-bg: oklch(0.4 0.08 var(--hue));
        --codeblock-bg: oklch(0.17 0.015 var(--hue));
        --link-underline: oklch(0.4 0.08 var(--hue));
        --link-hover: oklch(0.4 0.08 var(--hue));

        --toc-badge-bg: var(--btn-regular-bg);
        --toc-item-active: oklch(0.35 0.07 var(--hue));

        --shadow-navbar: 0 4px 16px rgba(0, 0, 0, 0.2);
        --navbar-glass-highlight: rgba(255, 255, 255, 0.06);
        --navbar-glass-hairline: rgba(255, 255, 255, 0.1);
      }

      html {
        scroll-behavior: smooth;
        scroll-padding-top: 6rem;
      }

      #theme-firefly {
        position: relative;
        min-height: 100vh;
        background-color: var(--page-bg);
        color: var(--deep-text);
        font-family: 'Roboto', 'Inter', 'HarmonyOS Sans SC', 'PingFang SC',
          'Microsoft YaHei', -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
        overflow-x: clip;
      }

      #theme-firefly ::selection {
        background: var(--selection-bg);
      }

      /* ============================
         Navbar（源码 navbar.css：玻璃胶囊）
         ============================ */
      #theme-firefly .ff-navbar {
        position: fixed;
        top: 0.75rem;
        left: 0;
        right: 0;
        z-index: 50;
        margin-inline: auto;
        max-width: calc(var(--page-width) - 2rem);
        width: calc(100% - 1.5rem);
        height: 3.5rem;
        display: flex;
        align-items: center;
        border-radius: var(--radius-large);
        background: var(--card-bg-transparent);
        -webkit-backdrop-filter: blur(var(--navbar-glass-blur)) saturate(160%);
        backdrop-filter: blur(var(--navbar-glass-blur)) saturate(160%);
        box-shadow:
          inset 0 1px 0 var(--navbar-glass-highlight),
          0 0 0 1px var(--navbar-glass-hairline),
          var(--shadow-navbar);
        transition: background-color var(--duration-medium) var(--ease-standard);
      }

      #theme-firefly .ff-navbar-transparent {
        background: transparent;
        box-shadow: none;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }

      #theme-firefly .ff-btn-plain {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        border-radius: 0.75rem;
        transition:
          background-color var(--duration-medium) var(--ease-standard),
          color var(--duration-medium) var(--ease-standard);
      }

      #theme-firefly .ff-btn-plain:hover {
        background: var(--btn-plain-bg-hover);
        color: var(--primary);
      }

      #theme-firefly .ff-btn-regular {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        border-radius: 0.75rem;
        background: var(--btn-regular-bg);
        color: var(--btn-content);
        transition: background-color var(--duration-medium) var(--ease-standard);
      }

      #theme-firefly .ff-btn-regular:hover {
        background: var(--btn-regular-bg-hover);
        color: var(--primary);
      }

      /* ============================
         卡片 / 面板
         ============================ */
      #theme-firefly .card-base {
        background: var(--card-bg);
        border-radius: var(--radius-large);
        overflow: hidden;
        transition: background-color 0.15s;
      }

      #theme-firefly .ff-card-shadow {
        box-shadow:
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 8px 24px rgba(0, 0, 0, 0.05);
      }

      .dark #theme-firefly .ff-card-shadow {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04);
      }

      #theme-firefly .ff-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        height: 1.5rem;
        padding: 0 0.625rem;
        border-radius: 9999px;
        background: var(--btn-regular-bg);
        color: var(--btn-content);
        font-size: 0.75rem;
        font-weight: 500;
        white-space: nowrap;
        transition: background-color 0.15s;
      }

      #theme-firefly .ff-chip:hover {
        background: var(--btn-regular-bg-hover);
      }

      #theme-firefly .ff-chip-primary {
        background: color-mix(in oklch, var(--primary) 16%, transparent);
        color: var(--primary);
      }

      #theme-firefly .ff-section-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9375rem;
        font-weight: 700;
        color: var(--deep-text);
      }

      #theme-firefly .ff-section-title::before {
        content: '';
        width: 0.25rem;
        height: 1rem;
        border-radius: 9999px;
        background: var(--primary);
      }

      /* 分类 Tab 行 */
      #theme-firefly .ff-tab {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        height: 2rem;
        padding: 0 0.875rem;
        border-radius: 0.75rem;
        font-size: 0.8125rem;
        color: var(--content-meta);
        transition:
          background-color 0.15s,
          color 0.15s;
      }

      #theme-firefly .ff-tab-active {
        background: var(--primary);
        color: #0b1a16;
        font-weight: 600;
      }

      /* ============================
         入场动画层（域名打字 → 标题 → 进度 → 上拉）
         ============================ */
      .ff-intro {
        display: flex;
        position: fixed;
        inset: 0;
        z-index: 200;
        align-items: center;
        justify-content: center;
        background: var(--page-bg, #f6fffb);
        overflow: hidden;
        will-change: transform;
      }

      .ff-intro.is-on {
        display: flex;
      }

      .ff-intro-inner {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 40vh;
        padding: 0 6vw;
        text-align: center;
      }

      /* 域名打字 */
      .ff-intro-domain {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-family: ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace;
        font-size: clamp(1.15rem, 2.4vw, 1.85rem);
        letter-spacing: 0.06em;
        color: var(--deep-text, #3a1f2b);
        min-height: 2em;
      }

      .ff-intro-caret {
        display: inline-block;
        width: 2px;
        height: 1.15em;
        margin-left: 3px;
        background: var(--deep-text, #3a1f2b);
        animation: ff-caret-blink 0.9s steps(2, start) infinite;
      }

      @keyframes ff-caret-blink {
        0%,
        49% {
          opacity: 1;
        }
        50%,
        100% {
          opacity: 0;
        }
      }

      /* 标题 */
      .ff-intro-title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: min(88%, 1080px);
        margin: 0;
        opacity: 0;
        font-size: clamp(1.7rem, 4.4vw, 3.4rem);
        font-weight: 900;
        line-height: 1.12;
        letter-spacing: -0.015em;
        color: var(--deep-text, #3a1f2b);
        text-align: center;
        will-change: transform, opacity, filter;
      }

      /* 底部：进度文案 + 位置时间 */
      .ff-intro-foot {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 46px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
        padding: 0 5vw;
        font-family: ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace;
        font-size: clamp(0.6rem, 1.1vw, 0.78rem);
        letter-spacing: 0.06em;
        text-transform: none;
        color: var(--content-meta, rgba(58, 31, 43, 0.6));
      }

      /* 底部进度条 */
      .ff-intro-progress {
        position: absolute;
        left: 5vw;
        right: 5vw;
        bottom: 34px;
        height: 1px;
        background: var(--line-color, rgba(58, 31, 43, 0.14));
        overflow: hidden;
      }

      .ff-intro-progress i {
        display: block;
        width: 100%;
        height: 100%;
        transform-origin: left center;
        transform: scaleX(0);
        background: var(--deep-text, #3a1f2b);
      }

      @media (max-width: 640px) {
        .ff-intro-foot {
          bottom: 34px;
        }
        .ff-intro-progress {
          bottom: 24px;
        }
      }

      /* Lenis 平滑滚动配套样式 */
      html.lenis,
      html.lenis body {
        height: auto;
      }

      .lenis.lenis-smooth {
        scroll-behavior: auto !important;
      }

      .lenis.lenis-smooth [data-lenis-prevent] {
        overscroll-behavior: contain;
      }

      .lenis.lenis-stopped {
        overflow: hidden;
      }

      .lenis.lenis-scrolling iframe {
        pointer-events: none;
      }


      /* 轻量花瓣（CSS only，不用 canvas；替代原樱花特效） */
      .ff-petals {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 4;
      }

      .ff-petal {
        position: absolute;
        top: -8vh;
        width: 14px;
        height: 11px;
        border-radius: 62% 38% 55% 45% / 60% 55% 45% 40%;
        background: linear-gradient(160deg, #ffd7e6, #ff9dbb);
        opacity: 0.75;
        will-change: transform;
        animation: ff-petal-fall linear infinite;
      }

      @keyframes ff-petal-fall {
        0% {
          transform: translate3d(0, -10vh, 0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 0.8;
        }
        100% {
          transform: translate3d(6vw, 74vh, 0) rotate(420deg);
          opacity: 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .ff-petal {
          animation: none !important;
          display: none;
        }
      }
      /* ============================
         Banner + 水波纹（Canvas）
         ============================ */
      .ff-waves-canvas {
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 12vh;
        min-height: 64px;
        max-height: 160px;
        pointer-events: none;
        z-index: 5;
        display: block;
        /* 让 canvas 能读到主题的 --page-bg（用于取色绘制） */
        color: var(--page-bg);
      }

      /* 可替换的全站背景图（固定层，不遮挡内容） */
      #theme-firefly .ff-wallpaper {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
      }

      #theme-firefly .ff-wallpaper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1.04);
      }

      @keyframes ff-fade-up {
        from {
          opacity: 0;
          transform: translateY(24px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .ff-banner-title {
        animation: ff-fade-up 0.8s var(--ease-standard) both;
        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.55);
      }

      .ff-banner-subtitle {
        animation: ff-fade-up 0.8s var(--ease-standard) 0.15s both;
        text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
      }

      .ff-kenburns {
        animation: ff-kenburns 14s ease-out both;
      }

      @keyframes ff-kenburns {
        from {
          transform: scale(1) translate3d(0, 0, 0);
        }
        to {
          transform: scale(1.07) translate3d(0, -1%, 0);
        }
      }

      /* ============================
         Notion 正文
         ============================ */
      #theme-firefly .notion {
        color: var(--deep-text);
      }

      #theme-firefly .notion-title,
      #theme-firefly .notion-h,
      #theme-firefly .notion-h1,
      #theme-firefly .notion-h2,
      #theme-firefly .notion-h3 {
        color: var(--deep-text);
        font-weight: 700;
      }

      #theme-firefly .notion-text {
        color: var(--deep-text);
        font-size: 16px;
        line-height: 1.9;
      }

      #theme-firefly .notion-link {
        color: var(--primary);
        text-decoration: none;
        border-bottom: 2px solid var(--link-underline);
      }

      #theme-firefly .notion-link:hover {
        background: var(--link-hover);
      }

      #theme-firefly .notion-quote {
        border: none;
        border-left: 4px solid var(--primary);
        background: var(--btn-regular-bg);
        border-radius: 0 0.5rem 0.5rem 0;
        padding: 12px 16px;
        font-style: normal;
        color: var(--deep-text);
      }

      #theme-firefly .notion-callout {
        background: var(--btn-regular-bg);
        border-radius: 0.5rem;
      }

      #theme-firefly .notion-code {
        background: var(--codeblock-bg);
        border-radius: 0.5rem;
      }

      #theme-firefly :not(pre) > code {
        background: var(--inline-code-bg);
        color: var(--inline-code-color);
        border-radius: 0.375rem;
        padding: 1px 6px;
        font-size: 0.9em;
      }

      #theme-firefly .notion-image img,
      #theme-firefly .notion-asset-wrapper img {
        border-radius: 0.75rem;
      }

      #theme-firefly .notion-bookmark,
      #theme-firefly .notion-collection-card,
      #theme-firefly .notion-table,
      #theme-firefly .notion-simple-table {
        border-radius: 0.75rem;
      }

      #theme-firefly .notion-collection-card {
        background: var(--card-bg);
      }

      @media (prefers-reduced-motion: reduce) {
        #theme-firefly *,
        .ff-kenburns,
        .ff-banner-title,
        .ff-banner-subtitle {
          animation: none !important;
          transition: none !important;
        }
      }
    `}</style>
  )
}
