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

  if (!mounted || isDarkMode) return null

  return (
    <div className='pointer-events-none fixed inset-0 z-0 overflow-hidden'>
      <video
        autoPlay
        muted
        loop
        playsInline
        className='h-full w-full object-cover opacity-40'
        style={{ filter: 'blur(3px) scale(1.05)' }}
      >
        <source
          src={process.env.NEXT_PUBLIC_BG_VIDEO || '/bg-video.mp4'}
          type='video/mp4'
        />
      </video>
    </div>
  )
}

export default VideoBackground
