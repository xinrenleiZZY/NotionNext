/**
 * Aurora 主题 - 设计 token 与全局样式
 * 设计语言：极光玻璃（Aurora Glass）
 *  - 深空底 + 三条极光渐变光斑
 *  - 半透明玻璃卡片 + 1px 冷光描边
 *  - 大标题紧字距、正文 1.85 行高
 *  - 动效只用 200ms 的位移/透明度，尊重 prefers-reduced-motion
 */

export const Style = () => {
  return (
    <style jsx global>{`
      /* ============================================
         Design Tokens
         ============================================ */
      :root {
        --aurora-bg: #f4f5fa;
        --aurora-bg-deep: #eceefa;
        --aurora-surface: rgba(255, 255, 255, 0.72);
        --aurora-surface-2: rgba(255, 255, 255, 0.88);
        --aurora-surface-hover: rgba(255, 255, 255, 0.95);
        --aurora-border: rgba(20, 24, 52, 0.08);
        --aurora-border-strong: rgba(20, 24, 52, 0.14);

        --aurora-text: #131521;
        --aurora-text-soft: #565d75;
        --aurora-text-mute: #8b93a9;

        --aurora-accent: #6d4dff;
        --aurora-accent-soft: rgba(109, 77, 255, 0.12);
        --aurora-accent-2: #12b8cc;
        --aurora-accent-3: #e8508f;

        --aurora-shadow: 0 12px 32px -14px rgba(24, 28, 64, 0.28);
        --aurora-shadow-hover: 0 22px 48px -18px rgba(109, 77, 255, 0.42);
        --aurora-radius: 20px;
        --aurora-radius-sm: 12px;
        --aurora-blur: 18px;
      }

      .dark {
        --aurora-bg: #06070e;
        --aurora-bg-deep: #0a0c18;
        --aurora-surface: rgba(22, 26, 42, 0.55);
        --aurora-surface-2: rgba(28, 33, 52, 0.72);
        --aurora-surface-hover: rgba(34, 40, 62, 0.82);
        --aurora-border: rgba(255, 255, 255, 0.09);
        --aurora-border-strong: rgba(255, 255, 255, 0.16);

        --aurora-text: #e9ecf7;
        --aurora-text-soft: #a7aec4;
        --aurora-text-mute: #737b93;

        --aurora-accent: #9d86ff;
        --aurora-accent-soft: rgba(157, 134, 255, 0.16);
        --aurora-accent-2: #3ed6e8;
        --aurora-accent-3: #f472b6;

        --aurora-shadow: 0 14px 34px -16px rgba(0, 0, 0, 0.75);
        --aurora-shadow-hover: 0 24px 56px -20px rgba(157, 134, 255, 0.45);
      }

      /* ============================================
         Base
         ============================================ */
      html {
        scroll-behavior: smooth;
        scroll-padding-top: 88px;
      }

      #theme-aurora {
        position: relative;
        min-height: 100vh;
        background-color: var(--aurora-bg);
        color: var(--aurora-text);
        font-family: 'Inter', 'HarmonyOS Sans SC', 'PingFang SC',
          'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* 用 clip 而不是 hidden：hidden 会创建滚动容器，导致 sticky 吸顶失效 */
        overflow-x: clip;
      }

      #theme-aurora ::selection {
        background: var(--aurora-accent-soft);
        color: var(--aurora-text);
      }

      #theme-aurora a {
        color: inherit;
        transition: color 0.2s ease;
      }

      /* ============================================
         Glass primitives
         ============================================ */
      #theme-aurora .aurora-glass {
        background: var(--aurora-surface);
        border: 1px solid var(--aurora-border);
        border-radius: var(--aurora-radius);
        -webkit-backdrop-filter: blur(var(--aurora-blur)) saturate(150%);
        backdrop-filter: blur(var(--aurora-blur)) saturate(150%);
        box-shadow: var(--aurora-shadow);
      }

      #theme-aurora .aurora-glass-hover {
        transition:
          transform 0.2s ease,
          border-color 0.2s ease,
          box-shadow 0.2s ease,
          background 0.2s ease;
      }

      #theme-aurora .aurora-glass-hover:hover {
        transform: translateY(-2px);
        border-color: var(--aurora-border-strong);
        box-shadow: var(--aurora-shadow-hover);
        background: var(--aurora-surface-hover);
      }

      #theme-aurora .aurora-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 12px;
        line-height: 20px;
        letter-spacing: 0.02em;
        color: var(--aurora-text-soft);
        background: var(--aurora-surface);
        border: 1px solid var(--aurora-border);
      }

      #theme-aurora .aurora-accent-text {
        background: linear-gradient(
          100deg,
          var(--aurora-accent) 0%,
          var(--aurora-accent-2) 55%,
          var(--aurora-accent-3) 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      #theme-aurora .aurora-divider {
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          var(--aurora-border-strong),
          transparent
        );
      }

      /* ============================================
         Background layers
         ============================================ */
      .aurora-bg-root {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
        background:
          radial-gradient(
            120% 80% at 50% -10%,
            var(--aurora-bg-deep) 0%,
            var(--aurora-bg) 60%
          ),
          var(--aurora-bg);
      }

      .aurora-blob {
        position: absolute;
        border-radius: 999px;
        filter: blur(90px);
        opacity: 0.55;
        animation: aurora-drift 22s ease-in-out infinite alternate;
      }

      .aurora-blob-1 {
        width: 52vw;
        height: 52vw;
        top: -18vw;
        left: -10vw;
        background: radial-gradient(
          circle,
          rgba(109, 77, 255, 0.42),
          transparent 70%
        );
      }

      .aurora-blob-2 {
        width: 46vw;
        height: 46vw;
        top: 8vh;
        right: -14vw;
        background: radial-gradient(
          circle,
          rgba(18, 184, 204, 0.34),
          transparent 70%
        );
        animation-delay: -7s;
      }

      .aurora-blob-3 {
        width: 40vw;
        height: 40vw;
        bottom: -16vw;
        left: 28vw;
        background: radial-gradient(
          circle,
          rgba(232, 80, 143, 0.26),
          transparent 70%
        );
        animation-delay: -14s;
      }

      .dark .aurora-blob-1 {
        background: radial-gradient(
          circle,
          rgba(109, 77, 255, 0.34),
          transparent 70%
        );
      }

      .dark .aurora-blob-2 {
        background: radial-gradient(
          circle,
          rgba(18, 184, 204, 0.26),
          transparent 70%
        );
      }

      .dark .aurora-blob-3 {
        background: radial-gradient(
          circle,
          rgba(232, 80, 143, 0.2),
          transparent 70%
        );
      }

      .aurora-grain {
        position: absolute;
        inset: 0;
        opacity: 0.035;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
      }

      .dark .aurora-grain {
        opacity: 0.06;
      }

      .aurora-video {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.16;
        filter: saturate(120%);
        -webkit-mask-image: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.9) 0%,
          rgba(0, 0, 0, 0.5) 55%,
          transparent 100%
        );
        mask-image: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.9) 0%,
          rgba(0, 0, 0, 0.5) 55%,
          transparent 100%
        );
      }

      .dark .aurora-video {
        opacity: 0.1;
      }

      @keyframes aurora-drift {
        0% {
          transform: translate3d(0, 0, 0) scale(1);
        }
        50% {
          transform: translate3d(3vw, 4vh, 0) scale(1.08);
        }
        100% {
          transform: translate3d(-2vw, -3vh, 0) scale(0.96);
        }
      }

      /* ============================================
         Notion 正文排版
         ============================================ */
      #theme-aurora .notion {
        color: var(--aurora-text);
      }

      #theme-aurora .notion-page {
        padding: 0;
      }

      #theme-aurora .notion-title {
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1.25;
      }

      #theme-aurora .notion-h,
      #theme-aurora .notion-h1,
      #theme-aurora .notion-h2,
      #theme-aurora .notion-h3 {
        font-weight: 700;
        letter-spacing: -0.015em;
        color: var(--aurora-text);
      }

      #theme-aurora .notion-text {
        font-size: 16px;
        line-height: 1.85;
        color: var(--aurora-text-soft);
      }

      #theme-aurora .notion-link {
        color: var(--aurora-accent);
        text-decoration: none;
        border-bottom: 1px solid var(--aurora-accent-soft);
        transition: border-color 0.2s ease;
      }

      #theme-aurora .notion-link:hover {
        border-bottom-color: var(--aurora-accent);
      }

      #theme-aurora .notion-quote {
        border-left: 3px solid var(--aurora-accent);
        background: var(--aurora-accent-soft);
        border-radius: 0 var(--aurora-radius-sm) var(--aurora-radius-sm) 0;
        padding: 14px 18px;
        font-style: normal;
        color: var(--aurora-text);
      }

      #theme-aurora .notion-callout {
        background: var(--aurora-surface);
        border: 1px solid var(--aurora-border);
        border-radius: var(--aurora-radius-sm);
      }

      #theme-aurora .notion-code {
        background: #0d0f19;
        border: 1px solid var(--aurora-border);
        border-radius: var(--aurora-radius-sm);
      }

      #theme-aurora :not(pre) > code {
        background: var(--aurora-accent-soft);
        color: var(--aurora-accent);
        border-radius: 6px;
        padding: 2px 6px;
        font-size: 0.9em;
      }

      #theme-aurora .notion-image img,
      #theme-aurora .notion-asset-wrapper img {
        border-radius: var(--aurora-radius-sm);
      }

      #theme-aurora .notion-bookmark,
      #theme-aurora .notion-collection-card,
      #theme-aurora .notion-table,
      #theme-aurora .notion-simple-table {
        border-radius: var(--aurora-radius-sm);
        border-color: var(--aurora-border);
      }

      #theme-aurora .notion-collection-card {
        background: var(--aurora-surface);
      }

      #theme-aurora .notion-hr {
        border-color: var(--aurora-border);
      }

      /* ============================================
         Motion preference
         ============================================ */
      @media (prefers-reduced-motion: reduce) {
        #theme-aurora *,
        .aurora-bg-root * {
          animation: none !important;
          transition: none !important;
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  )
}
