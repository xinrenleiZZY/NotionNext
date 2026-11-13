'use client'

import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

// 固定参数，避免 SSR 与客户端随机值不一致导致 hydration 警告
const PETALS = [
  { left: '6%', size: 11, duration: 13, delay: 0, opacity: 0.8 },
  { left: '14%', size: 8, duration: 17, delay: -3, opacity: 0.6 },
  { left: '23%', size: 13, duration: 11, delay: -7, opacity: 0.75 },
  { left: '31%', size: 9, duration: 19, delay: -1, opacity: 0.55 },
  { left: '39%', size: 12, duration: 14, delay: -9, opacity: 0.7 },
  { left: '47%', size: 7, duration: 16, delay: -5, opacity: 0.5 },
  { left: '55%', size: 12, duration: 12, delay: -11, opacity: 0.72 },
  { left: '63%', size: 10, duration: 18, delay: -2, opacity: 0.62 },
  { left: '71%', size: 14, duration: 15, delay: -8, opacity: 0.78 },
  { left: '79%', size: 8, duration: 20, delay: -4, opacity: 0.5 },
  { left: '86%', size: 11, duration: 13, delay: -10, opacity: 0.68 },
  { left: '93%', size: 9, duration: 17, delay: -6, opacity: 0.58 }
]

/**
 * 樱花飘落（纯 CSS，性能友好，可在 config 里关掉）
 */
export default function Sakura() {
  if (!siteConfig('MIZUKI_SAKURA', true, CONFIG)) return null

  return (
    <div className='mz-sakura' aria-hidden='true'>
      {PETALS.map((petal, index) => (
        <span
          key={index}
          className='mz-petal'
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`
          }}
        />
      ))}
    </div>
  )
}
