'use client'

import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useEffect, useMemo, useState } from 'react'
import CONFIG from '../config'

/**
 * Mizuki 风格 Banner
 *  - 全宽、无圆角，Ken Burns + 交叉淡入轮播
 *  - 标题/副标题居中，带 text-shadow 与 fadeInUp（对应 banner.css）
 *  - 底部 SVG 水波纹，颜色与页面背景一致，形成波浪切口
 */
export default function Banner(props) {
  const { siteInfo } = useGlobal()
  const title =
    siteConfig('MIZUKI_BANNER_TITLE', '', CONFIG) ||
    siteInfo?.title ||
    siteConfig('TITLE') ||
    ''
  const subtitle =
    siteConfig('MIZUKI_BANNER_SUBTITLE', '', CONFIG) ||
    siteInfo?.description ||
    siteConfig('BIO') ||
    ''
  const showWaves = siteConfig('MIZUKI_BANNER_WAVES', true, CONFIG)
  const height = Number(siteConfig('MIZUKI_BANNER_HEIGHT', 62, CONFIG)) || 62
  const intervalSec =
    Number(siteConfig('MIZUKI_BANNER_INTERVAL', 6, CONFIG)) || 6
  const intervalMs = Math.max(intervalSec * 1000, 1500)

  const posts = props.posts || props.allNavPages || []
  const images = useMemo(() => {
    const list = []
    if (siteInfo?.pageCover) list.push(siteInfo.pageCover)
    posts.slice(0, 4).forEach(post => {
      if (post?.pageCover && !list.includes(post.pageCover)) {
        list.push(post.pageCover)
      }
    })
    return list.slice(0, 4)
  }, [siteInfo, posts])

  const [active, setActive] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % images.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [images.length, intervalMs])

  return (
    <div
      id='banner-wrapper'
      className='relative z-0 w-full overflow-hidden'
      style={{ height: `${height}vh`, minHeight: 320, background: 'var(--primary)' }}>
      {/* 图片层 */}
      {images.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className='absolute inset-0 transition-opacity duration-700'
          style={{ opacity: index === active ? 1 : 0 }}>
          <LazyImage
            src={src}
            alt=''
            priority={index === 0}
            className={
              index === active
                ? 'mz-kenburns h-full w-full object-cover'
                : 'h-full w-full object-cover'
            }
          />
        </div>
      ))}

      {/* 压暗遮罩，保证文字可读 */}
      <div
        className='absolute inset-0'
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.55) 100%)'
        }}
      />

      {/* 文字层 */}
      <div className='relative z-10 flex h-full flex-col items-center justify-center px-6 text-center'>
        <h1 className='mz-banner-title text-3xl text-white md:text-5xl lg:text-6xl'>
          {title}
        </h1>
        {subtitle && (
          <p className='mz-banner-subtitle mt-4 max-w-3xl text-sm text-white/90 md:text-lg'>
            {subtitle}
          </p>
        )}

        {images.length > 1 && (
          <div className='mt-8 flex items-center gap-2'>
            {images.map((_, index) => (
              <button
                key={index}
                type='button'
                aria-label={`banner-${index + 1}`}
                onClick={() => setActive(index)}
                className='h-1.5 rounded-full transition-all duration-300'
                style={{
                  width: index === active ? 24 : 8,
                  background:
                    index === active ? '#ffffff' : 'rgba(255,255,255,0.5)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 水波纹 */}
      {showWaves && (
        <svg
          className='mz-waves'
          viewBox='0 0 1440 200'
          preserveAspectRatio='none'
          aria-hidden='true'>
          <path
            className='mz-wave-1'
            d='M0,96 C240,160 480,32 720,64 C960,96 1200,176 1440,112 L1440,200 L0,200 Z'
          />
          <path
            className='mz-wave-2'
            d='M0,128 C240,64 480,176 720,128 C960,80 1200,160 1440,128 L1440,200 L0,200 Z'
          />
          <path
            className='mz-wave-3'
            d='M0,160 C300,112 540,192 780,152 C1020,112 1260,176 1440,160 L1440,200 L0,200 Z'
          />
          <path
            className='mz-wave-4'
            d='M0,184 C320,152 640,200 960,180 C1200,166 1320,190 1440,182 L1440,200 L0,200 Z'
          />
        </svg>
      )}
    </div>
  )
}
