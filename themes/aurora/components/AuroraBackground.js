'use client'

import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 极光背景层
 * - 三条模糊光斑（CSS 动画，降低 GPU 开销用 transform）
 * - 可选噪点
 * - 仅在首页挂载视频，其余页面保持纯静态渐变（性能考虑）
 */
export default function AuroraBackground({ showVideo = false }) {
  const [mounted, setMounted] = useState(false)
  const grain = siteConfig('AURORA_GRAIN', true, CONFIG)
  const videoEnabled =
    showVideo && siteConfig('AURORA_HOME_VIDEO', true, CONFIG)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className='aurora-bg-root' aria-hidden='true'>
      <div className='aurora-blob aurora-blob-1' />
      <div className='aurora-blob aurora-blob-2' />
      <div className='aurora-blob aurora-blob-3' />
      {grain && <div className='aurora-grain' />}
      {mounted && videoEnabled && (
        <video
          className='aurora-video'
          autoPlay
          muted
          loop
          playsInline
          preload='none'
          poster='/bg_image.jpg'
          aria-hidden='true'>
          <source
            src={process.env.NEXT_PUBLIC_BG_VIDEO || '/bg-video.mp4'}
            type='video/mp4'
          />
        </video>
      )}
    </div>
  )
}
