'use client'

import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * Video Background Component
 * 白天显示视频背景，夜间模式自动隐藏（让星空特效显示）
 *
 * 性能优化：
 *  - 只在首页挂载（其余页面纯静态）
 *  - 移动端 / 省流量 / 2G / prefers-reduced-motion 不加载视频，只保留 poster 静帧
 *  - preload='none'，不抢首屏带宽
 */
const VideoBackground = () => {
  const { isDarkMode } = useGlobal()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [allowVideo, setAllowVideo] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return

    // 移动端不加载视频
    if (window.innerWidth < 768) return

    // 系统开启「减少动态效果」
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    // 省流量模式 / 2G
    const connection = navigator.connection
    if (
      connection &&
      (connection.saveData || /2g/.test(connection.effectiveType || ''))
    ) {
      return
    }

    setAllowVideo(true)
  }, [])

  const isHome = router.pathname === '/'
  if (!mounted || isDarkMode || !isHome) return null

  return (
    <div className='pointer-events-none fixed inset-0 z-0 overflow-hidden'>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload='none'
        poster='/bg_image.jpg'
        aria-hidden='true'
        className={`h-full w-full object-cover ${allowVideo ? 'opacity-40' : 'opacity-25'}`}
        style={{ filter: 'scale(1.05)' }}
      >
        {allowVideo && (
          <source
            src={process.env.NEXT_PUBLIC_BG_VIDEO || '/bg-video.mp4'}
            type='video/mp4'
          />
        )}
      </video>
    </div>
  )
}

export default VideoBackground
