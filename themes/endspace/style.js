/**
 * Endspace Theme - Global Styles (JSX)
 * Pastel Pink / Cute (Kawaii) aesthetic
 */

export const Style = () => {
  return (
    <style jsx global>{`
      /* ============================================
         CSS Custom Properties - Pastel Pink / Cute Theme
         ============================================ */
      :root {
        /* Semi-transparent backgrounds to show wallpaper (kept fairly opaque for crisp text) */
        --endspace-bg-base: rgba(255, 246, 250, 0.94);
        --endspace-bg-primary: rgba(255, 255, 255, 0.94);
        --endspace-bg-secondary: rgba(255, 240, 246, 0.92);
        --endspace-bg-tertiary: rgba(255, 227, 239, 0.92);

        /* Warm Text (High Contrast, pink-tinted neutrals) */
        --endspace-text-primary: #4b3a43;
        --endspace-text-secondary: #8a7280;
        --endspace-text-muted: #bca6b1;

        /* Accents - 粉色调品牌强调色 */
        --endspace-accent-yellow: #ff7fa8;
        --endspace-accent-yellow-dim: rgba(255, 127, 168, 0.18);
        --endspace-accent-cyan: #ff9ec4;
        --endspace-accent-cyan-dim: rgba(255, 158, 196, 0.14);
        /* 播放器专用：粉色渐变 + 柔和薄荷绿 */
        --endspace-brand-purple-from: #ffa8cb;
        --endspace-brand-purple-to: #ff6fa5;
        --endspace-status-green: #7fd8a6;

        /* Borders & Lines */
        --endspace-border-base: #ffdce8;
        --endspace-border-active: #ff7fa8;
        --endspace-grid-color: rgba(255, 127, 168, 0.06);

        /* Shadows - soft pink glow */
        --endspace-shadow-base:
          0 2px 6px rgba(255, 127, 168, 0.1),
          0 6px 16px rgba(255, 127, 168, 0.08);
        --endspace-shadow-hover:
          0 6px 14px rgba(255, 127, 168, 0.18),
          0 14px 30px rgba(255, 127, 168, 0.14),
          0 0 0 1px var(--endspace-accent-yellow);
      }

      /* Dark Mode Variables */
      .dark {
        --endspace-bg-base: rgba(38, 26, 33, 0.92);
        --endspace-bg-primary: rgba(48, 33, 41, 0.92);
        --endspace-bg-secondary: rgba(60, 42, 52, 0.92);
        --endspace-bg-tertiary: rgba(76, 52, 64, 0.92);

        --endspace-text-primary: #fff1f6;
        --endspace-text-secondary: #e3c2d0;
        --endspace-text-muted: #b78ca1;

        --endspace-accent-yellow: #ff8fb5;
        --endspace-accent-yellow-dim: rgba(255, 143, 181, 0.22);
        --endspace-accent-cyan: #ffa8cb;
        --endspace-accent-cyan-dim: rgba(255, 168, 203, 0.16);
        --endspace-brand-purple-from: #ff9ec4;
        --endspace-brand-purple-to: #ff6fa5;
        --endspace-status-green: #7fd8a6;

        --endspace-border-base: #5b3f4b;
        --endspace-border-active: #ff8fb5;
        --endspace-grid-color: rgba(255, 143, 181, 0.05);

        --endspace-shadow-base:
          0 2px 6px rgba(0, 0, 0, 0.25), 0 6px 16px rgba(0, 0, 0, 0.2);
        --endspace-shadow-hover:
          0 6px 14px rgba(0, 0, 0, 0.35), 0 14px 30px rgba(0, 0, 0, 0.3),
          0 0 0 1px var(--endspace-accent-yellow);
      }

      /* ============================================
         Viewport Scaling - discrete INTEGER font sizes
         (prevents fractional rem sizes that look blurry)
         ============================================ */
      html {
        font-size: 16px;
      }
      @media (max-width: 1439px) {
        html {
          font-size: 15px;
        }
      }
      @media (max-width: 1200px) {
        html {
          font-size: 14px;
        }
      }
      @media (min-width: 1600px) {
        html {
          font-size: 18px;
        }
      }
      @media (min-width: 1780px) {
        html {
          font-size: 20px;
        }
      }
      @media (min-width: 2000px) {
        html {
          font-size: 22px;
        }
      }
      @media (min-width: 2300px) {
        html {
          font-size: 24px;
        }
      }

      /* Portrait/Mobile orientation: different scaling base */
      @media (orientation: portrait), (max-width: 767px) {
        html {
          font-size: 16px;
        }
      }
      @media (max-width: 360px) {
        html {
          font-size: 15px;
        }
      }

      /* ============================================
         Global Base Styles
         ============================================ */
      #theme-endspace {
        background-color: var(--endspace-bg-base);
        color: var(--endspace-text-primary);
        font-family:
          'Quicksand',
          'PingFang SC',
          -apple-system,
          BlinkMacSystemFont,
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Noto Sans SC',
          'Segoe UI',
          sans-serif;
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        /* Custom Cute Cursor - Pink Spearhead */
        cursor:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M6 6 L16 32 L20 22 L30 18 L6 6 Z' fill='%23FF7FA8' opacity='0.35'/%3E%3Cpath d='M2 2 L12 28 L16 18 L26 14 L2 2 Z' fill='%23FF7FA8' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")
            2 2,
          auto;
      }

      #theme-endspace a,
      #theme-endspace button,
      #theme-endspace [role='button'],
      #theme-endspace .cursor-pointer {
        /* Pointer Cursor - Pink Reticle */
        cursor:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M6 6 L16 32 L20 22 L30 18 L6 6 Z' fill='%23FF6FA5' opacity='0.35'/%3E%3Cpath d='M2 2 L12 28 L16 18 L26 14 L2 2 Z' fill='%23FF6FA5' stroke='%23ffffff' stroke-width='1.5'/%3E%3Ccircle cx='24' cy='24' r='4' fill='none' stroke='%23FFA8CB' stroke-width='2'/%3E%3C/svg%3E")
            2 2,
          pointer;
      }

      /* Technical Grid Background (soft pink) */
      #theme-endspace::before {
        content: '';
        position: fixed;
        inset: 0;
        background-image:
          linear-gradient(var(--endspace-grid-color) 1px, transparent 1px),
          linear-gradient(
            90deg,
            var(--endspace-grid-color) 1px,
            transparent 1px
          );
        background-size: 40px 40px;
        z-index: -1;
        pointer-events: none;
      }

      /* ============================================
         Typography & Technical Text
         ============================================ */
      .tech-text {
        font-family: 'Quicksand', 'PingFang SC', 'Microsoft YaHei', sans-serif;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        font-weight: 600;
      }

      .tech-num {
        font-family: 'Quicksand', 'PingFang SC', sans-serif;
        letter-spacing: 1px;
      }

      /* ============================================
         "Float" Container Styles
         ============================================ */
      .endspace-frame {
        background: var(--endspace-bg-primary);
        border: 1px solid var(--endspace-border-base);
        border-radius: 20px;
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: var(--endspace-shadow-base);
        z-index: 10;
      }

      .dark .endspace-frame {
        background: rgba(48, 33, 41, 0.92);
        border-color: var(--endspace-border-base);
      }

      /* Corner Accents (soft rounded pink markers) */
      .endspace-frame::before {
        content: '';
        position: absolute;
        top: 8px;
        left: 8px;
        width: 0;
        height: 0;
        border-top: 3px solid var(--endspace-accent-yellow);
        border-left: 3px solid var(--endspace-accent-yellow);
        border-top-left-radius: 8px;
        transition: all 0.3s ease;
        opacity: 0;
        z-index: 20;
      }
      .endspace-frame::after {
        content: '';
        position: absolute;
        bottom: 8px;
        right: 8px;
        width: 0;
        height: 0;
        border-bottom: 3px solid var(--endspace-accent-yellow);
        border-right: 3px solid var(--endspace-accent-yellow);
        border-bottom-right-radius: 8px;
        transition: all 0.3s ease;
        opacity: 0;
        z-index: 20;
      }

      /* Active State: corners appear */
      .endspace-frame:hover {
        border-color: var(--endspace-border-active);
        box-shadow: var(--endspace-shadow-hover);
        transform: translateY(-2px);
      }
      .endspace-frame:hover::before,
      .endspace-frame:hover::after {
        opacity: 1;
        width: 16px;
        height: 16px;
      }

      /* ============================================
         Card Styles - Soft Rounded
         ============================================ */
      .endspace-card {
        background: var(--endspace-bg-primary);
        border: 1px solid var(--endspace-border-base);
        border-radius: 20px;
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: var(--endspace-shadow-base);
      }

      .endspace-card:hover {
        border-color: var(--endspace-border-active);
        box-shadow:
          0 20px 30px -8px rgba(255, 127, 168, 0.2),
          0 10px 12px -6px rgba(255, 127, 168, 0.12),
          0 0 0 1px var(--endspace-accent-yellow);
        transform: translateY(-4px) scale(1.01);
        z-index: 20;
      }

      .dark .endspace-card {
        background: rgba(48, 33, 41, 0.95);
      }

      /* ============================================
         Notion Content Overrides (Light Mode)
         ============================================ */
      #notion-article {
        color: var(--endspace-text-primary);
        font-size: 1.05rem;
        line-height: 1.75;
      }

      /* Headers - soft pastel pink drop shadow */
      #notion-article h1,
      #notion-article h2,
      #notion-article h3 {
        color: var(--endspace-text-primary);
        font-weight: 800;
        margin-top: 2.5em;
        margin-bottom: 1em;
        position: relative;
        padding-left: 1rem;
        letter-spacing: 0.02em;
        transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);

        /* Default: soft pink layered shadow */
        text-shadow:
          -3px -2px 0 rgba(255, 158, 196, 0.45),
          3px 2px 0 rgba(255, 127, 168, 0.25);

        opacity: 0.92;
      }

      /* Hover: merge / snap to focus */
      #notion-article h1:hover,
      #notion-article h2:hover,
      #notion-article h3:hover {
        text-shadow:
          0 0 0 rgba(255, 158, 196, 0),
          0 0 0 rgba(255, 127, 168, 0);
        opacity: 1;
        transform: translateX(2px);
      }

      .dark #notion-article h1,
      .dark #notion-article h2,
      .dark #notion-article h3 {
        text-shadow:
          -3px -2px 0 rgba(255, 158, 196, 0.35),
          3px 2px 0 rgba(255, 111, 165, 0.35);
      }

      .dark #notion-article h1:hover,
      .dark #notion-article h2:hover,
      .dark #notion-article h3:hover {
        text-shadow: none;
      }

      #notion-article h1::before,
      #notion-article h2::before,
      #notion-article h3::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.2em;
        bottom: 0.2em;
        width: 6px;
        border-radius: 9999px;
        background: var(--endspace-accent-yellow);
        box-shadow: 2px 2px 0px rgba(255, 127, 168, 0.2);
        transition: all 0.3s ease;
      }

      /* Bar also reacts to hover */
      #notion-article h1:hover::before,
      #notion-article h2:hover::before,
      #notion-article h3:hover::before {
        background: var(--endspace-accent-cyan);
        width: 8px;
        box-shadow: none;
      }

      /* Quotes */
      #notion-article blockquote {
        background: var(--endspace-bg-secondary);
        border-left: 3px solid var(--endspace-accent-yellow);
        border-radius: 0 12px 12px 0;
        color: var(--endspace-text-secondary);
        padding: 1.2rem 1.5rem;
        margin: 2rem 0;
        font-style: italic;
      }

      /* Lists */
      #notion-article ul li,
      #notion-article ol li {
        margin-bottom: 0.5em;
        color: var(--endspace-text-secondary);
      }
      #notion-article ul li::marker {
        color: var(--endspace-accent-cyan);
        font-weight: bold;
      }

      /* Links in Content */
      #notion-article a {
        color: var(--endspace-accent-yellow);
        text-decoration: none;
        border-bottom: 2px solid var(--endspace-accent-cyan-dim);
        transition: all 0.2s;
        font-weight: 600;
      }
      #notion-article a:hover {
        background: var(--endspace-accent-cyan-dim);
        border-bottom-color: var(--endspace-accent-cyan);
      }

      /* Code Blocks */
      #notion-article pre {
        background: #3a2831 !important;
        border: 1px solid rgba(255, 127, 168, 0.15);
        border-radius: 14px !important;
        box-shadow: var(--endspace-shadow-base);
      }

      /* ============================================
         Buttons (Cute Pill)
         ============================================ */
      .endspace-btn {
        background: transparent;
        border: 2px solid var(--endspace-border-active);
        color: var(--endspace-accent-yellow);
        border-radius: 9999px;
        padding: 0.6rem 1.5rem;
        font-family: 'Quicksand', 'PingFang SC', sans-serif;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.85em;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.2s;
      }

      .endspace-btn:hover {
        background: var(--endspace-border-active);
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(255, 127, 168, 0.35);
      }

      .endspace-button-primary {
        background: linear-gradient(
          135deg,
          var(--endspace-brand-purple-from),
          var(--endspace-brand-purple-to)
        );
        border: none;
        color: white;
        border-radius: 9999px;
        padding: 0.75rem 1.5rem;
        font-family: 'Quicksand', 'PingFang SC', sans-serif;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.85em;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        overflow: hidden;
        box-shadow: 0 6px 16px rgba(255, 111, 165, 0.35);
      }

      .endspace-button-primary:hover {
        background: #ff5c93;
        transform: translateY(-1px);
        box-shadow: 0 8px 22px rgba(255, 92, 147, 0.45);
      }

      /* ============================================
         Tech Decorations Utilities (Minimalist)
         ============================================ */
      .scan-line {
        width: 100%;
        height: 1px;
        background: var(--endspace-border-base);
        margin: 1rem 0;
      }

      /* Spectrum bar decoration */
      .spectrum-bar {
        height: 3px;
        border-radius: 9999px;
        background: linear-gradient(
          90deg,
          var(--endspace-accent-cyan) 0%,
          var(--endspace-accent-yellow) 50%,
          var(--endspace-accent-cyan) 100%
        );
      }

      /* Loading Animation (Spinner) */
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .loading-radar {
        width: 24px;
        height: 24px;
        border: 2px solid var(--endspace-border-base);
        border-top-color: var(--endspace-accent-yellow);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      /* Tech corner decoration */
      .tech-corner {
        position: relative;
      }
      .tech-corner::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 10px;
        height: 10px;
        border-top: 2px solid var(--endspace-accent-cyan);
        border-left: 2px solid var(--endspace-accent-cyan);
        border-top-left-radius: 10px;
      }
      .tech-corner::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        border-bottom: 2px solid var(--endspace-accent-cyan);
        border-right: 2px solid var(--endspace-accent-cyan);
        border-bottom-right-radius: 10px;
      }

      /* ============================================
         Mobile Responsive Styles
         ============================================ */

      /* Safe area support for notched devices */
      .safe-area-bottom {
        padding-bottom: env(safe-area-inset-bottom);
      }
      .safe-area-top {
        padding-top: env(safe-area-inset-top);
      }

      /* Mobile-specific adjustments */
      @media (max-width: 767px) {
        /* Smaller grid on mobile */
        #theme-endspace::before {
          background-size: 30px 30px;
        }

        /* Reduce padding on mobile */
        .endspace-frame {
          padding: 1rem !important;
        }

        /* Smaller technical text */
        .tech-text {
          font-size: 0.75rem;
          letter-spacing: 0.3px;
        }

        /* Ensure minimum touch targets */
        button,
        a,
        [role='button'] {
          min-height: 44px;
        }

        /* Notion content adjustments */
        #notion-article {
          font-size: 1.1rem;
          line-height: 1.75;
        }

        #notion-article p {
          margin-bottom: 1.25em;
        }
      }

      /* ============================================
         Player Styles - 粉色圆角卡片 + 粉色渐变按钮 + 薄荷绿标签
         ============================================ */
      /* 播放器浮层卡片：圆角 + 白底 + 柔和粉色阴影 */
      .endspace-player-card {
        background: var(--endspace-bg-primary);
        border-radius: 20px;
        box-shadow:
          0 -4px 20px rgba(255, 127, 168, 0.16),
          0 2px 8px rgba(255, 127, 168, 0.1);
        border: 1px solid var(--endspace-border-base);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .endspace-player-card:hover {
        box-shadow:
          0 -6px 28px rgba(255, 127, 168, 0.22),
          0 4px 12px rgba(255, 127, 168, 0.12);
      }
      .dark .endspace-player-card {
        background: rgba(60, 42, 52, 0.92);
        box-shadow:
          0 -4px 20px rgba(0, 0, 0, 0.4),
          0 2px 8px rgba(0, 0, 0, 0.2);
      }

      /* 粉色渐变播放按钮（核心视觉） */
      .endspace-player-btn-purple {
        background: linear-gradient(
          135deg,
          var(--endspace-brand-purple-from),
          var(--endspace-brand-purple-to)
        );
        color: #fff;
        border-radius: 9999px;
        box-shadow: 0 4px 14px rgba(255, 111, 165, 0.4);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .endspace-player-btn-purple:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 20px rgba(255, 111, 165, 0.55);
      }
      .endspace-player-btn-purple:active {
        transform: scale(0.96);
      }

      /* 专辑封面圆角矩形 */
      .endspace-player-cover {
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(255, 127, 168, 0.18);
      }

      /* 进度条粉色填充 */
      .endspace-player-progress {
        background: linear-gradient(
          90deg,
          var(--endspace-brand-purple-from),
          var(--endspace-brand-purple-to)
        );
        border-radius: 9999px;
        transition: width 0.2s linear;
      }
      .endspace-player-progress-track {
        background: var(--endspace-bg-tertiary);
        border-radius: 9999px;
        overflow: hidden;
      }

      /* 薄荷绿"免费/状态"胶囊标签 */
      .endspace-tag-green {
        background: var(--endspace-status-green);
        color: #fff;
        border-radius: 9999px;
        font-size: 0.6rem;
        font-weight: 600;
        padding: 0.1rem 0.5rem;
        letter-spacing: 0.05em;
      }

      .endspace-player-glow {
        box-shadow: 0 0 12px rgba(255, 127, 168, 0.7);
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .endspace-player-rotating {
        animation: rotate 8s linear infinite;
      }

      /* ============================================
         Scan Line & HUD Animations
         ============================================ */

      /* Horizontal Scan Line */
      @keyframes ef-scan-horizontal {
        0% {
          transform: translateY(-100%);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(100vh);
          opacity: 0;
        }
      }

      .ef-scan-line {
        position: absolute;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent,
          var(--endspace-accent-cyan) 20%,
          var(--endspace-accent-cyan) 80%,
          transparent
        );
        animation: ef-scan-horizontal 4s linear infinite;
        pointer-events: none;
        opacity: 0.5;
      }

      /* Vertical Scan Line */
      @keyframes ef-scan-vertical {
        0% {
          transform: translateX(-100%);
          opacity: 0;
        }
        10% {
          opacity: 0.8;
        }
        90% {
          opacity: 0.8;
        }
        100% {
          transform: translateX(100vw);
          opacity: 0;
        }
      }

      .ef-scan-line-v {
        position: absolute;
        top: 0;
        width: 1px;
        height: 100%;
        background: linear-gradient(
          180deg,
          transparent,
          var(--endspace-accent-cyan) 30%,
          var(--endspace-accent-cyan) 70%,
          transparent
        );
        animation: ef-scan-vertical 6s linear infinite;
        pointer-events: none;
        opacity: 0.3;
      }

      /* Pulse Glow Animation */
      @keyframes ef-pulse-glow {
        0%,
        100% {
          box-shadow: 0 0 5px rgba(255, 127, 168, 0.35);
        }
        50% {
          box-shadow:
            0 0 15px rgba(255, 127, 168, 0.6),
            0 0 30px rgba(255, 127, 168, 0.3);
        }
      }

      .ef-pulse-glow {
        animation: ef-pulse-glow 3s ease-in-out infinite;
      }

      /* ============================================
         Endfield Button Styles
         ============================================ */

      /* Button with Left Highlight Bar */
      .ef-button {
        position: relative;
        background: var(--endspace-bg-primary);
        border: 1px solid var(--endspace-border-base);
        border-radius: 9999px;
        padding: 0.75rem 1.5rem 0.75rem 2rem;
        font-family: 'Quicksand', 'PingFang SC', sans-serif;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.85em;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.2s ease;
      }

      .ef-button::before {
        content: '';
        position: absolute;
        left: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 55%;
        border-radius: 9999px;
        background-color: var(--endspace-accent-yellow);
        transition: all 0.2s ease;
      }

      .ef-button:hover {
        background: var(--endspace-border-active);
        color: white;
        border-color: var(--endspace-border-active);
      }

      .ef-button:hover::before {
        height: 70%;
        background-color: #ffffff;
      }

      /* ============================================
         Card Enhancement Styles
         ============================================ */

      /* Enhanced Card with texture */
      .ef-card {
        position: relative;
        background: var(--endspace-bg-primary);
        border: 1px solid var(--endspace-border-base);
        border-radius: 18px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .ef-card:hover {
        border-color: var(--endspace-accent-yellow);
        box-shadow: 0 8px 32px rgba(255, 127, 168, 0.22);
        transform: translateY(-2px);
      }

      /* Index Number Badge - Cute Pill */
      .ef-index-badge {
        position: absolute;
        top: -1px;
        left: -1px;
        padding: 0.25rem 0.6rem;
        background: var(--endspace-accent-yellow);
        color: #fff;
        border-radius: 9999px;
        font-family: 'Quicksand', 'PingFang SC', sans-serif;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      /* ============================================
         HUD Corner Decorations
         ============================================ */

      .ef-hud-corners {
        position: relative;
      }

      /* Top Left HUD */
      .ef-hud-tl::before {
        content: '';
        position: fixed;
        top: 1rem;
        left: 1rem;
        width: 3rem;
        height: 3rem;
        border-top: 2px solid rgba(255, 127, 168, 0.45);
        border-left: 2px solid rgba(255, 127, 168, 0.45);
        border-top-left-radius: 16px;
        pointer-events: none;
        z-index: 50;
      }

      /* Bottom Right HUD */
      .ef-hud-br::after {
        content: '';
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        width: 3rem;
        height: 3rem;
        border-bottom: 2px solid rgba(255, 127, 168, 0.45);
        border-right: 2px solid rgba(255, 127, 168, 0.45);
        border-bottom-right-radius: 16px;
        pointer-events: none;
        z-index: 50;
      }

      /* ============================================
         Glowing Border Animation
         ============================================ */

      @keyframes ef-border-glow {
        0%,
        100% {
          border-color: var(--endspace-border-base);
          box-shadow: none;
        }
        50% {
          border-color: var(--endspace-accent-cyan);
          box-shadow: 0 0 12px rgba(255, 127, 168, 0.35);
        }
      }

      .ef-glow-border:hover {
        animation: ef-border-glow 2s ease-in-out infinite;
      }

      /* ============================================
         Cute Title (Reusable)
         ============================================ */
      .nier-title {
        position: relative;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-shadow:
          2px 2px 0 rgba(255, 158, 196, 0.4),
          4px 4px 0 rgba(255, 158, 196, 0.22),
          6px 6px 12px rgba(255, 127, 168, 0.2);
      }

      .dark .nier-title {
        text-shadow:
          2px 2px 0 rgba(255, 158, 196, 0.45),
          4px 4px 0 rgba(255, 158, 196, 0.25),
          6px 6px 15px rgba(255, 111, 165, 0.3);
      }

      /* ============================================
         3D Button Effects
         ============================================ */
      .endspace-btn-3d {
        position: relative;
        background: var(--endspace-bg-primary);
        border: 2px solid var(--endspace-accent-yellow);
        color: var(--endspace-accent-yellow);
        border-radius: 9999px;
        padding: 0.75rem 1.5rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow:
          0 4px 0 rgba(255, 127, 168, 0.6),
          0 6px 12px rgba(255, 127, 168, 0.18);
      }

      .endspace-btn-3d:hover {
        transform: translateY(-2px);
        box-shadow:
          0 6px 0 rgba(255, 127, 168, 0.7),
          0 10px 20px rgba(255, 127, 168, 0.25);
      }

      .endspace-btn-3d:active {
        transform: translateY(2px);
        box-shadow:
          0 2px 0 rgba(255, 127, 168, 0.5),
          0 3px 6px rgba(255, 127, 168, 0.15);
      }

      /* ============================================
         Sidebar & Navigation 3D Depth
         ============================================ */
      .endspace-sidebar-3d {
        box-shadow:
          4px 0 12px rgba(255, 127, 168, 0.1),
          8px 0 20px rgba(255, 127, 168, 0.06);
      }

      .dark .endspace-sidebar-3d {
        box-shadow:
          4px 0 8px rgba(0, 0, 0, 0.3),
          8px 0 16px rgba(0, 0, 0, 0.2);
      }
      /* ============================================
         Cute Navigation Transition
         ============================================ */
      .nier-nav-item {
        position: relative;
        overflow: hidden;
        transition: color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: 1;
        /* Default Text Color */
        color: var(--endspace-text-secondary);
        border-radius: 14px;
        margin-bottom: 2px;
      }

      /* Sliding Background Layer (soft pink) */
      .nier-nav-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 0%;
        height: 100%;
        background: rgba(255, 127, 168, 0.16);
        border-radius: 14px;
        transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: -1;
      }

      /* Active / Hover State Text Color */
      .nier-nav-item:hover,
      .nier-nav-item.active {
        color: var(--endspace-accent-yellow) !important;
      }

      /* Hover State: Slide to full width */
      .nier-nav-item:hover::before {
        width: 100%;
      }

      /* Active State: Always full width with Distinct Color */
      .nier-nav-item.active::before {
        width: 100%;
        background: rgba(255, 127, 168, 0.24);
      }

      /* Target the icon specifically if needed to ensure color fill */
      .nier-nav-item svg,
      .nier-nav-item .icon-container {
        transition: color 0.3s ease;
        z-index: 2;
      }

      .dark .nier-nav-item::before {
        background: rgba(255, 143, 181, 0.22);
      }
      .dark .nier-nav-item:hover,
      .dark .nier-nav-item.active {
        color: #ff8fb5 !important;
      }

      /* ============================================
         Endfield Unified Button Styles
         ============================================ */
      .ef-btn {
        display: inline-flex !important;
        align-items: center;
        gap: 0.75rem; /* Space between indicator and text */
        padding: 0.5rem 1.1rem 0.5rem 0.75rem;
        background-color: var(
          --endspace-accent-yellow
        ) !important; /* Cute pink */
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        width: fit-content;
        min-width: min-content;
        border: 1px solid transparent;
        text-decoration: none !important;
        position: relative;
        z-index: 10;
      }

      .ef-btn:hover {
        background-color: var(
          --endspace-brand-purple-to
        ) !important; /* Deeper pink */
        box-shadow: 0 6px 16px rgba(255, 111, 165, 0.4);
        transform: translateY(-1px);
      }

      /* Indicator Element */
      .ef-btn-indicator {
        display: block;
        width: 4px;
        height: 18px;
        background-color: #ffffff;
        border-radius: 9999px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      }

      .ef-btn:hover .ef-btn-indicator {
        width: 12px;
        height: 12px;
        background-color: #ffffff;
        border-radius: 9999px;
        clip-path: polygon(0 0, 100% 50%, 0 100%);
      }

      /* Text Styles */
      .ef-btn-text {
        color: #ffffff !important;
        font-weight: 700;
        font-size: 0.95rem;
        letter-spacing: 0.05em;
        white-space: nowrap;
        transition: color 0.3s ease;
      }

      .ef-btn:hover .ef-btn-text {
        color: #ffffff !important;
      }

      /* ============================================
         Artistic Gradient Title (粉色艺术渐变流光字)
         参考「模型健康监控中心」的逐字渐变标题，替换成粉色系
         ============================================ */
      .artistic-title {
        cursor: pointer;
        user-select: none;
        line-height: 1.15;
      }

      .artistic-char {
        display: inline-block;
        background: linear-gradient(
          120deg,
          #ffb3d1,
          #ff7fa8,
          #ffd4e6,
          #ff6fa5,
          #ffc2dd,
          #ffb3d1
        );
        background-size: 300% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent !important;
        text-shadow: 0 0 18px rgba(255, 127, 168, 0.35);
        animation: artisticFlow 5s linear infinite;
        transition:
          transform 0.25s ease,
          filter 0.25s ease;
      }

      .artistic-title:hover .artistic-char {
        transform: translateY(-3px) scale(1.12);
        filter: brightness(1.15) drop-shadow(0 0 12px rgba(255, 111, 165, 0.9));
      }

      @keyframes artisticFlow {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 300% 50%;
        }
      }

      /* 侧边栏/小标题用的粉色艺术渐变字 */
      .artistic-nav {
        background: linear-gradient(120deg, #ffb3d1, #ff7fa8, #ff6fa5);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        font-weight: 700;
      }

      /* ============================================
         HZX Tech Card / Button (科技化卡片与按钮)
         ============================================ */
      .hzx-card {
        background: var(--endspace-bg-primary);
        border: 1px solid var(--endspace-border-base);
        border-radius: 16px;
        padding: 1.25rem;
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: var(--endspace-shadow-base);
      }

      .hzx-card:hover {
        border-color: var(--endspace-border-active);
        box-shadow:
          var(--endspace-shadow-hover),
          0 0 0 1px var(--endspace-accent-yellow-dim);
        transform: translateY(-2px);
      }

      .hzx-btn {
        background: transparent;
        border: 1.5px solid var(--endspace-accent-yellow);
        color: var(--endspace-accent-yellow);
        padding: 0.5rem 1.25rem;
        font-family: 'Quicksand', 'PingFang SC', sans-serif;
        font-weight: 600;
        font-size: 0.85em;
        border-radius: 10px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.2s;
      }

      .hzx-btn:hover {
        background: var(--endspace-accent-yellow);
        color: #ffffff;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px var(--endspace-accent-yellow-dim);
      }

      .hzx-divider {
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--endspace-accent-yellow) 50%,
          transparent 100%
        );
        opacity: 0.3;
        margin: 1rem 0;
      }

      /* 科技化按钮：光泽扫过 + accent 描边（叠加在粉色胶囊按钮上） */
      .endspace-btn::after,
      .endspace-button-primary::after {
        content: '';
        position: absolute;
        top: 0;
        left: -120%;
        width: 60%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.55),
          transparent
        );
        transform: skewX(-20deg);
        pointer-events: none;
        transition: left 0.5s ease;
      }

      .endspace-btn:hover::after,
      .endspace-button-primary:hover::after {
        left: 130%;
      }
    `}</style>
  )
}
