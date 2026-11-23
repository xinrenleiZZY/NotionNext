'use client'

import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useEffect, useMemo, useState } from 'react'
import CONFIG from '../config'
import WavesCanvas from './WavesCanvas'

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

  // 自定义轮播图优先（可用 Notion Config / 环境变量覆盖，无需改代码）
  const customImages = useMemo(() => {
    const raw = siteConfig('FIREFLY_BANNER_IMAGES', '', CONFIG)
    if (!raw) return []
    if (Array.isArray(raw)) return raw.filter(Boolean)
    const text = String(raw).trim()
    if (text.startsWith('[')) {
      try {
        const parsed = JSON.parse(text)
        if (Array.isArray(parsed)) return parsed.filter(Boolean)
      } catch (e) {
        // 落到逗号分隔解析
      }
    }
    return text
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }, [])

  const images = useMemo(() => {
    if (customImages.length) return customImages
    const list = []
    if (siteInfo?.pageCover) list.push(siteInfo.pageCover)
    posts.slice(0, 4).forEach(post => {
      if (post?.pageCover && !list.includes(post.pageCover)) {
        list.push(post.pageCover)
      }
    })
    return list.slice(0, 4)
  }, [customImages, siteInfo, posts])

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

      {/* 水波纹：Canvas 连续正弦波（无拼接边界，宽屏也平滑流动） */}
      {showWaves && <WavesCanvas className='ff-waves-canvas' />}
    </div>
  )
}
