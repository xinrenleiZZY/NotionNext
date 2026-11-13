/**
 * Neo 主题 - Neo-Brutalism（贴纸粗野风）
 * 规则：
 *  - 3px 硬黑边 + 硬投影（无模糊）
 *  - 四色贴纸：黄 / 蓝 / 粉 / 绿
 *  - 纸感网点底纹
 *  - 只做位移与颜色过渡，不做渐变模糊
 */

export const Style = () => {
  return (
    <style jsx global>{`
      :root {
        --neo-paper: #f6f2e8;
        --neo-paper-2: #efe8d8;
        --neo-card: #fffdf7;
        --neo-ink: #111111;
        --neo-ink-soft: #454545;
        --neo-ink-mute: #7c776b;
        --neo-yellow: #ffd84d;
        --neo-blue: #2f5bff;
        --neo-pink: #ff5ca8;
        --neo-green: #2fd36b;
        --neo-shadow-color: #111111;
        --neo-shadow: 6px 6px 0 var(--neo-shadow-color);
        --neo-shadow-lg: 10px 10px 0 var(--neo-shadow-color);
        --neo-radius: 6px;
      }

      .dark {
        --neo-paper: #0d0d0d;
        --neo-paper-2: #151515;
        --neo-card: #191919;
        --neo-ink: #f5f2e8;
        --neo-ink-soft: #cfcabc;
        --neo-ink-mute: #948f82;
        --neo-shadow-color: #ffd84d;
      }

      html {
        scroll-padding-top: 92px;
      }

      #theme-neo {
        position: relative;
        min-height: 100vh;
        background-color: var(--neo-paper);
        color: var(--neo-ink);
        font-family: 'Inter', 'HarmonyOS Sans SC', 'PingFang SC',
          'Microsoft YaHei', -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
        overflow-x: clip;
      }

      /* 纸感网点底纹 */
      #theme-neo::before {
        content: '';
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-image: radial-gradient(
          var(--neo-ink) 1px,
          transparent 1px
        );
        background-size: 22px 22px;
        opacity: 0.07;
      }

      .dark #theme-neo::before {
        opacity: 0.12;
      }

      #theme-neo ::selection {
        background: var(--neo-yellow);
        color: #111;
      }

      /* ============================================
         硬边卡片
         ============================================ */
      #theme-neo .neo-card {
        background: var(--neo-card);
        border: 3px solid var(--neo-ink);
        border-radius: var(--neo-radius);
        box-shadow: var(--neo-shadow);
      }

      #theme-neo .neo-hover {
        transition:
          transform 0.12s linear,
          box-shadow 0.12s linear;
      }

      #theme-neo .neo-hover:hover {
        transform: translate(-3px, -3px);
        box-shadow: 9px 9px 0 var(--neo-shadow-color);
      }

      /* 贴纸小标签 */
      #theme-neo .neo-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 10px;
        border: 2px solid var(--neo-ink);
        border-radius: 4px;
        background: var(--neo-card);
        color: var(--neo-ink);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      #theme-neo .neo-chip-yellow {
        background: var(--neo-yellow);
        color: #111;
      }
      #theme-neo .neo-chip-blue {
        background: var(--neo-blue);
        color: #fff;
      }
      #theme-neo .neo-chip-pink {
        background: var(--neo-pink);
        color: #111;
      }
      #theme-neo .neo-chip-green {
        background: var(--neo-green);
        color: #111;
      }

      /* 高亮马克笔 */
      #theme-neo .neo-mark {
        background: var(--neo-yellow);
        color: #111;
        padding: 0 6px;
        border: 2px solid var(--neo-ink);
        border-radius: 4px;
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
      }

      /* 按钮 */
      #theme-neo .neo-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 18px;
        border: 3px solid var(--neo-ink);
        border-radius: var(--neo-radius);
        background: var(--neo-card);
        color: var(--neo-ink);
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        box-shadow: 4px 4px 0 var(--neo-shadow-color);
        transition:
          transform 0.12s linear,
          box-shadow 0.12s linear,
          background 0.12s linear;
      }

      #theme-neo .neo-btn:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0 var(--neo-shadow-color);
        background: var(--neo-yellow);
        color: #111;
      }

      #theme-neo .neo-btn:active {
        transform: translate(2px, 2px);
        box-shadow: 1px 1px 0 var(--neo-shadow-color);
      }

      /* 分隔线 */
      #theme-neo .neo-rule {
        height: 3px;
        background: var(--neo-ink);
      }

      /* ============================================
         Notion 正文
         ============================================ */
      #theme-neo .notion {
        color: var(--neo-ink);
      }

      #theme-neo .notion-title,
      #theme-neo .notion-h,
      #theme-neo .notion-h1,
      #theme-neo .notion-h2,
      #theme-neo .notion-h3 {
        color: var(--neo-ink);
        font-weight: 800;
        letter-spacing: -0.01em;
      }

      #theme-neo .notion-text {
        color: var(--neo-ink-soft);
        font-size: 16px;
        line-height: 1.85;
      }

      #theme-neo .notion-link {
        color: var(--neo-blue);
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 3px;
      }

      .dark #theme-neo .notion-link {
        color: #8ea8ff;
      }

      #theme-neo .notion-quote {
        border: 3px solid var(--neo-ink);
        border-left-width: 10px;
        border-radius: var(--neo-radius);
        background: var(--neo-paper-2);
        padding: 12px 16px;
        font-style: normal;
        color: var(--neo-ink);
      }

      #theme-neo .notion-callout {
        border: 3px solid var(--neo-ink);
        border-radius: var(--neo-radius);
        background: var(--neo-card);
        box-shadow: 4px 4px 0 var(--neo-shadow-color);
      }

      #theme-neo .notion-code {
        border: 3px solid var(--neo-ink);
        border-radius: var(--neo-radius);
        background: #111111;
        color: #f5f2e8;
      }

      #theme-neo :not(pre) > code {
        background: var(--neo-yellow);
        color: #111;
        border: 2px solid var(--neo-ink);
        border-radius: 4px;
        padding: 1px 5px;
        font-size: 0.9em;
      }

      #theme-neo .notion-image img,
      #theme-neo .notion-asset-wrapper img {
        border: 3px solid var(--neo-ink);
        border-radius: var(--neo-radius);
      }

      #theme-neo .notion-bookmark,
      #theme-neo .notion-collection-card,
      #theme-neo .notion-table,
      #theme-neo .notion-simple-table {
        border: 2px solid var(--neo-ink);
        border-radius: var(--neo-radius);
      }

      #theme-neo .notion-hr {
        border-top: 3px solid var(--neo-ink);
        border-bottom: none;
      }

      @media (prefers-reduced-motion: reduce) {
        #theme-neo *,
        #theme-neo *::before,
        #theme-neo *::after {
          transition: none !important;
          animation: none !important;
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  )
}
