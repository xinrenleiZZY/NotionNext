'use client'

import { useEffect, useState } from 'react'

/**
 * BackgroundEffects Component - Endfield-Inspired Visual Enhancements
 * Includes: HUD corners, scan lines, crosshairs (pink / cute theme)
 * 配色全部走 --endspace-* 变量，因此自动适配亮/暗色模式
 */
const BackgroundEffects = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className='background-effects pointer-events-none fixed inset-0 z-[1] overflow-hidden'>
      {/* HUD Corner Markers */}
      <div className='hud-corner-tl' />
      <div className='hud-corner-tr' />
      <div className='hud-corner-bl' />
      <div className='hud-corner-br' />

      {/* Slow Vertical Scan Line */}
      <div className='scan-vertical' />

      {/* Slow Horizontal Scan Line */}
      <div className='scan-horizontal' />

      {/* Corner Crosshairs */}
      <div className='crosshair top-4 left-4' />
      <div className='crosshair bottom-4 right-4 rotate-180' />

      <style jsx>{`
        /* HUD Corners */
        .hud-corner-tl,
        .hud-corner-tr,
        .hud-corner-bl,
        .hud-corner-br {
          position: fixed;
          width: 30px;
          height: 30px;
          pointer-events: none;
          z-index: 2;
          opacity: 0.5;
        }

        .hud-corner-tl {
          top: 12px;
          left: 12px;
          border-top: 1px solid var(--endspace-accent-yellow);
          border-left: 1px solid var(--endspace-accent-yellow);
        }

        .hud-corner-tr {
          top: 12px;
          right: 12px;
          border-top: 1px solid var(--endspace-accent-yellow);
          border-right: 1px solid var(--endspace-accent-yellow);
        }

        .hud-corner-bl {
          bottom: 12px;
          left: 12px;
          border-bottom: 1px solid var(--endspace-accent-yellow);
          border-left: 1px solid var(--endspace-accent-yellow);
        }

        .hud-corner-br {
          bottom: 12px;
          right: 12px;
          border-bottom: 1px solid var(--endspace-accent-yellow);
          border-right: 1px solid var(--endspace-accent-yellow);
        }

        /* Vertical Scan Line - slow movement */
        .scan-vertical {
          position: fixed;
          top: 0;
          width: 1px;
          height: 100vh;
          background: linear-gradient(
            180deg,
            transparent 0%,
            var(--endspace-accent-cyan) 20%,
            var(--endspace-accent-yellow) 50%,
            var(--endspace-accent-cyan) 80%,
            transparent 100%
          );
          animation: scanVertical 8s linear infinite;
          opacity: 0.3;
        }

        @keyframes scanVertical {
          0% {
            left: 0;
            opacity: 0;
          }
          5% {
            opacity: 0.3;
          }
          95% {
            opacity: 0.3;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        /* Horizontal Scan Line */
        .scan-horizontal {
          position: fixed;
          left: 0;
          width: 100vw;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--endspace-accent-cyan) 20%,
            var(--endspace-accent-yellow) 50%,
            var(--endspace-accent-cyan) 80%,
            transparent 100%
          );
          animation: scanHorizontal 12s linear infinite;
          animation-delay: 3s;
          opacity: 0.2;
        }

        @keyframes scanHorizontal {
          0% {
            top: 0;
            opacity: 0;
          }
          5% {
            opacity: 0.2;
          }
          95% {
            opacity: 0.2;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        /* Crosshair decoration */
        .crosshair {
          position: fixed;
          width: 12px;
          height: 12px;
          opacity: 0.25;
        }

        .crosshair::before,
        .crosshair::after {
          content: '';
          position: absolute;
          background: var(--endspace-accent-yellow);
        }

        .crosshair::before {
          width: 12px;
          height: 1px;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }

        .crosshair::after {
          width: 1px;
          height: 12px;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }

        /* Hide on mobile for performance */
        @media (max-width: 768px) {
          .scan-vertical,
          .scan-horizontal {
            display: none;
          }

          .hud-corner-tl,
          .hud-corner-tr,
          .hud-corner-bl,
          .hud-corner-br {
            width: 20px;
            height: 20px;
          }

          .crosshair {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

export default BackgroundEffects
