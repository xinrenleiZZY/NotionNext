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

      #theme-firefly-y {
        position: relative;
        min-height: 100vh;
        background-color: var(--page-bg);
        color: var(--deep-text);
        font-family: 'Roboto', 'Inter', 'HarmonyOS Sans SC', 'PingFang SC',
          'Microsoft YaHei', -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
        overflow-x: clip;
      }

      #theme-firefly-y ::selection {
        background: var(--selection-bg);
      }

      /* ============================
         Navbar（源码 navbar.css：玻璃胶囊）
         ============================ */
      #theme-firefly-y .ff-navbar {
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

      #theme-firefly-y .ff-navbar-transparent {
        background: transparent;
        box-shadow: none;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }

      #theme-firefly-y .ff-btn-plain {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        border-radius: 0.75rem;
        transition:
          background-color var(--duration-medium) var(--ease-standard),
          color var(--duration-medium) var(--ease-standard);
      }

      #theme-firefly-y .ff-btn-plain:hover {
        background: var(--btn-plain-bg-hover);
        color: var(--primary);
      }

      #theme-firefly-y .ff-btn-regular {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        border-radius: 0.75rem;
        background: var(--btn-regular-bg);
        color: var(--btn-content);
        transition: background-color var(--duration-medium) var(--ease-standard);
      }

      #theme-firefly-y .ff-btn-regular:hover {
        background: var(--btn-regular-bg-hover);
        color: var(--primary);
      }

      /* ============================
         卡片 / 面板
         ============================ */
      #theme-firefly-y .card-base {
        background: var(--card-bg);
        border-radius: var(--radius-large);
        overflow: hidden;
        transition: background-color 0.15s;
      }

      #theme-firefly-y .ff-card-shadow {
        box-shadow:
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 8px 24px rgba(0, 0, 0, 0.05);
      }

      .dark #theme-firefly-y .ff-card-shadow {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04);
      }

      #theme-firefly-y .ff-chip {
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

      #theme-firefly-y .ff-chip:hover {
        background: var(--btn-regular-bg-hover);
      }

      #theme-firefly-y .ff-chip-primary {
        background: color-mix(in oklch, var(--primary) 16%, transparent);
        color: var(--primary);
      }

      #theme-firefly-y .ff-section-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9375rem;
        font-weight: 700;
        color: var(--deep-text);
      }

      #theme-firefly-y .ff-section-title::before {
        content: '';
        width: 0.25rem;
        height: 1rem;
        border-radius: 9999px;
        background: var(--primary);
      }

      /* 分类 Tab 行 */
      #theme-firefly-y .ff-tab {
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

      #theme-firefly-y .ff-tab-active {
        background: var(--primary);
        color: #0b1a16;
        font-weight: 600;
      }

      /* ============================
         Banner + 水波纹
         ============================ */
      .ff-waves {
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 10vh;
        min-height: 52px;
        max-height: 140px;
        pointer-events: none;
        z-index: 5;
        overflow: hidden;
        display: block;
      }

      .ff-waves path {
        fill: var(--page-bg);
        transition: fill 0.15s;
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
      }

      .ff-wave-1 {
        animation: ff-move-wave 14s linear infinite;
        opacity: 0.6;
      }
      .ff-wave-2 {
        animation: ff-move-wave 20s linear infinite reverse;
        opacity: 0.4;
      }
      .ff-wave-3 {
        animation: ff-move-wave 28s linear infinite;
        opacity: 0.24;
      }

      /* 路径本身宽 2880（两个完整周期），平移 -50% 正好一个周期，首尾无缝 */
      @keyframes ff-move-wave {
        from {
          transform: translate3d(0, 0, 0);
        }
        to {
          transform: translate3d(-50%, 0, 0);
        }
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
      #theme-firefly-y .notion {
        color: var(--deep-text);
      }

      #theme-firefly-y .notion-title,
      #theme-firefly-y .notion-h,
      #theme-firefly-y .notion-h1,
      #theme-firefly-y .notion-h2,
      #theme-firefly-y .notion-h3 {
        color: var(--deep-text);
        font-weight: 700;
      }

      #theme-firefly-y .notion-text {
        color: var(--deep-text);
        font-size: 16px;
        line-height: 1.9;
      }

      #theme-firefly-y .notion-link {
        color: var(--primary);
        text-decoration: none;
        border-bottom: 2px solid var(--link-underline);
      }

      #theme-firefly-y .notion-link:hover {
        background: var(--link-hover);
      }

      #theme-firefly-y .notion-quote {
        border: none;
        border-left: 4px solid var(--primary);
        background: var(--btn-regular-bg);
        border-radius: 0 0.5rem 0.5rem 0;
        padding: 12px 16px;
        font-style: normal;
        color: var(--deep-text);
      }

      #theme-firefly-y .notion-callout {
        background: var(--btn-regular-bg);
        border-radius: 0.5rem;
      }

      #theme-firefly-y .notion-code {
        background: var(--codeblock-bg);
        border-radius: 0.5rem;
      }

      #theme-firefly-y :not(pre) > code {
        background: var(--inline-code-bg);
        color: var(--inline-code-color);
        border-radius: 0.375rem;
        padding: 1px 6px;
        font-size: 0.9em;
      }

      #theme-firefly-y .notion-image img,
      #theme-firefly-y .notion-asset-wrapper img {
        border-radius: 0.75rem;
      }

      #theme-firefly-y .notion-bookmark,
      #theme-firefly-y .notion-collection-card,
      #theme-firefly-y .notion-table,
      #theme-firefly-y .notion-simple-table {
        border-radius: 0.75rem;
      }

      #theme-firefly-y .notion-collection-card {
        background: var(--card-bg);
      }

      @media (prefers-reduced-motion: reduce) {
        #theme-firefly-y *,
        .ff-waves path,
        .ff-kenburns,
        .ff-banner-title,
        .ff-banner-subtitle {
          animation: none !important;
          transition: none !important;
        }
      }

      /* ============================================================
         Firefly-Y · LyuTing 粉紫配色覆盖
         参考站色值：#fff7fa 背景 / #d6336c 主色 / #ffb3c6 #ff6b8a 粉
                    / #c9a8ff 淡紫 / #b06a83 次要文字
         ============================================================ */
      :root {
        --radius-large: 1.25rem;

        --primary: #d6336c;
        --page-bg: #fff7fa;
        --card-bg: #fffdfe;
        --card-bg-transparent: rgba(255, 255, 255, 0.64);
        --float-panel-bg: #fffdfe;

        --btn-content: #c2255c;
        --btn-regular-bg: #ffe7ef;
        --btn-regular-bg-hover: #ffd6e4;
        --btn-regular-bg-active: #ffc2d7;
        --btn-plain-bg-hover: #ffe7ef;
        --btn-plain-bg-active: #fff2f7;

        --deep-text: #3a1f2b;
        --line-divider: rgba(214, 51, 108, 0.12);
        --line-color: rgba(214, 51, 108, 0.16);
        --content-meta: rgba(58, 31, 43, 0.62);
        --muted: #f8e3ea;

        --selection-bg: #ffd6e4;
        --codeblock-bg: #2b1520;
        --inline-code-bg: #ffe7ef;
        --inline-code-color: #c2255c;
        --link-underline: #ffc2d7;
        --link-hover: #ffe7ef;

        --toc-badge-bg: #ffe0eb;
        --toc-item-active: #d6336c;

        --shadow-navbar: 0 10px 30px rgba(214, 51, 108, 0.14);
        --navbar-glass-highlight: rgba(255, 255, 255, 0.55);
        --navbar-glass-hairline: rgba(214, 51, 108, 0.12);
        --navbar-glass-blur: 22px;

        /* Firefly-Y 专属 */
        --fy-lilac: #c9a8ff;
        --fy-pink: #ffb3c6;
        --fy-rose: #ff6b8a;
        --fy-grad: linear-gradient(120deg, #d6336c 0%, #ff6b8a 45%, #c9a8ff 100%);
      }

      .dark {
        --primary: #ff8fb1;
        --page-bg: #171016;
        --card-bg: #241a22;
        --card-bg-transparent: rgba(36, 26, 34, 0.66);
        --float-panel-bg: #2a1d26;

        --btn-content: #ffc2d7;
        --btn-regular-bg: #3a2433;
        --btn-regular-bg-hover: #4a2d3f;
        --btn-regular-bg-active: #5a354b;
        --btn-plain-bg-hover: #3a2433;
        --btn-plain-bg-active: #2f1e29;

        --deep-text: #f7eaf1;
        --line-divider: rgba(255, 255, 255, 0.08);
        --line-color: rgba(255, 255, 255, 0.1);
        --content-meta: rgba(247, 234, 241, 0.62);
        --muted: #3a2433;

        --selection-bg: #6b2a45;
        --codeblock-bg: #140d12;
        --link-underline: #6b2a45;
        --link-hover: #4a2d3f;

        --shadow-navbar: 0 10px 30px rgba(0, 0, 0, 0.45);
        --navbar-glass-highlight: rgba(255, 255, 255, 0.06);
        --navbar-glass-hairline: rgba(255, 255, 255, 0.1);
      }

      /* 主色渐变：标题、激活 tab、按钮 */
      #theme-firefly-y .ff-tab-active,
      #theme-firefly-y .ff-chip-primary {
        background: var(--fy-grad);
        color: #fff;
      }

      #theme-firefly-y .ff-banner-title {
        background: linear-gradient(180deg, #ffffff 0%, #ffe3ee 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-shadow: 0 2px 18px rgba(214, 51, 108, 0.35);
      }

      #theme-firefly-y .ff-btn-regular:hover,
      #theme-firefly-y .ff-btn-plain:hover {
        color: var(--primary);
      }

      /* 卡片：粉紫毛玻璃 */
      #theme-firefly-y .card-base {
        background:
          linear-gradient(160deg, rgba(255, 255, 255, 0.9), rgba(255, 246, 250, 0.82));
        -webkit-backdrop-filter: blur(14px) saturate(140%);
        backdrop-filter: blur(14px) saturate(140%);
        border: 1px solid rgba(214, 51, 108, 0.08);
      }

      .dark #theme-firefly-y .card-base {
        background:
          linear-gradient(160deg, rgba(46, 31, 42, 0.92), rgba(32, 22, 30, 0.86));
        border-color: rgba(255, 255, 255, 0.06);
      }

      /* Banner 遮罩改为粉紫调 */
      #theme-firefly-y .ff-banner-mask {
        background: linear-gradient(
          180deg,
          rgba(214, 51, 108, 0.18) 0%,
          rgba(201, 168, 255, 0.22) 55%,
          rgba(23, 16, 22, 0.55) 100%
        );
      }
    `}</style>
  )
}
