'use client'

import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useEffect, useMemo, useState } from 'react'
import CONFIG from '../config'

/**
 * Firefly 首页 Banner：
 * 全宽轮播（Ken Burns + 交叉淡入）+ 居中大标题 + 副标题 + 社交按钮 + 底部水波纹
 */
export default function Banner(props) {
  const { siteInfo } = useGlobal()
  const title = siteInfo?.title || siteConfig('TITLE') || ''
  const subtitle =
    siteConfig('FIREFLY_BANNER_DESC', '', CONFIG) ||
    siteInfo?.description ||
    siteConfig('BIO') ||
    ''
  const height = Number(siteConfig('FIREFLY_BANNER_HEIGHT', 62, CONFIG)) || 62
  const showWaves = siteConfig('FIREFLY_WAVES', true, CONFIG)
  const intervalMs =
    Math.max(Number(siteConfig('FIREFLY_BANNER_INTERVAL', 6, CONFIG)) || 6, 2) * 1000

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

  const github = siteConfig('GITHUB')
  const email = siteConfig('CONTACT_EMAIL')
  const enableRss = siteConfig('ENABLE_RSS')

  return (
    <div
      className='relative w-full overflow-hidden'
      style={{ height: `${height}vh`, minHeight: 340, background: 'var(--btn-regular-bg)' }}>
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
                ? 'ff-kenburns h-full w-full object-cover'
                : 'h-full w-full object-cover'
            }
          />
        </div>
      ))}

      {/* 压暗 */}
      <div
        className='absolute inset-0'
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.55) 100%)'
        }}
      />

      {/* 文案 */}
      <div className='relative z-10 flex h-full flex-col items-center justify-center px-6 text-center'>
        <h1 className='ff-banner-title text-3xl font-extrabold text-white md:text-5xl lg:text-6xl'>
          {title}
        </h1>
        {subtitle && (
          <p className='ff-banner-subtitle mt-4 max-w-2xl text-sm text-white/90 md:text-lg'>
            {subtitle}
          </p>
        )}

        <div className='mt-7 flex items-center gap-3'>
          {github && (
            <a
              href={github}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='github'
              className='grid h-10 w-10 place-items-center rounded-full text-white no-underline transition-transform duration-200 hover:scale-110'
              style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)' }}>
              <i className='fab fa-github' />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label='email'
              className='grid h-10 w-10 place-items-center rounded-full text-white no-underline transition-transform duration-200 hover:scale-110'
              style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)' }}>
              <i className='fas fa-envelope' />
            </a>
          )}
          {enableRss && (
            <a
              href='/rss/feed.xml'
              aria-label='rss'
              className='grid h-10 w-10 place-items-center rounded-full text-white no-underline transition-transform duration-200 hover:scale-110'
              style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)' }}>
              <i className='fas fa-rss' />
            </a>
          )}
        </div>

        {images.length > 1 && (
          <div className='mt-6 flex items-center gap-1.5'>
            {images.map((_, index) => (
              <button
                key={index}
                type='button'
                aria-label={`banner-${index + 1}`}
                onClick={() => setActive(index)}
                className='h-1.5 rounded-full transition-all duration-300'
                style={{
                  width: index === active ? 22 : 7,
                  background:
                    index === active ? '#ffffff' : 'rgba(255,255,255,0.45)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 水波纹 */}
      {showWaves && (
        <svg
          className='ff-waves'
          viewBox='0 0 1440 180'
          preserveAspectRatio='none'
          aria-hidden='true'>
          <path
            className='ff-wave-1'
            d='M0,90 C240,150 480,30 720,60 C960,90 1200,160 1440,104 L1440,180 L0,180 Z'
          />
          <path
            className='ff-wave-2'
            d='M0,120 C240,60 480,168 720,120 C960,76 1200,150 1440,120 L1440,180 L0,180 Z'
          />
          <path
            className='ff-wave-3'
            d='M0,150 C300,110 540,182 780,144 C1020,106 1260,168 1440,150 L1440,180 L0,180 Z'
          />
        </svg>
      )}
    </div>
  )
}
