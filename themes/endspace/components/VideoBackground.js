'use client'

import { useState, useEffect } from 'react'
import { useGlobal } from '@/lib/global'

/**
 * Video Background Component
 * 白天显示视频背景，夜间模式自动隐藏（让星空特效显示）
 */
const VideoBackground = () => {
  const { isDarkMode } = useGlobal()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* 视频背景 - 只在白天模式显示 */}
      {!isDarkMode && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className='pointer-events-none fixed inset-0 z-0 h-full w-full object-cover opacity-60'
          style={{ filter: 'blur(2px)' }}
        >
          <source
            src={process.env.NEXT_PUBLIC_BG_VIDEO || '/bg-video.mp4'}
            type='video/mp4'
          />
        </video>
      )}
      {/* 暗色遮罩层 - 确保文字可读性 */}
      <div className='pointer-events-none fixed inset-0 z-[1] h-full w-full bg-black/10' />
    </>
  )
}

export default VideoBackground
