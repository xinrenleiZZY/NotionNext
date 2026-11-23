'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * 照片墙 / 相册组件
 * - 瀑布流布局（CSS columns，按屏幕宽度 1/2/N 列）
 * - 标签筛选
 * - 点击灯箱查看，支持键盘 ← → Esc
 * - Pixiv 图片自动走 /api/pximg 代理（绕过 Referer 校验）
 */
export default function GalleryWall({ config }) {
  const items = useMemo(() => (config?.ITEMS || []).filter(item => item?.src), [config])
  const allTags = useMemo(() => {
    const set = new Set()
    items.forEach(item => (item.tags || []).forEach(tag => set.add(tag)))
    return Array.from(set)
  }, [items])

  const [activeTag, setActiveTag] = useState('')
  const [lightbox, setLightbox] = useState(-1)

  const visible = useMemo(
    () => (activeTag ? items.filter(item => (item.tags || []).includes(activeTag)) : items),
    [items, activeTag]
  )

  const resolveSrc = useCallback(src => {
    const value = String(src || '')
    if (/^https?:\/\//i.test(value)) {
      try {
        const host = new URL(value).hostname
        if (host.endsWith('pximg.net') || host.endsWith('pixiv.net')) {
          return `/api/pximg?url=${encodeURIComponent(value)}`
        }
      } catch (e) {
        return value
      }
      return value
    }
    return encodeURI(value)
  }, [])

  const close = useCallback(() => setLightbox(-1), [])
  const prev = useCallback(() => {
    setLightbox(index => (index <= 0 ? visible.length - 1 : index - 1))
  }, [visible.length])
  const next = useCallback(() => {
    setLightbox(index => (index >= visible.length - 1 ? 0 : index + 1))
  }, [visible.length])

  useEffect(() => {
    if (lightbox < 0) return
    const onKey = e => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [lightbox, close, prev, next])

  const current = lightbox >= 0 ? visible[lightbox] : null

  return (
    <div className='mx-auto w-full max-w-[1180px] px-4 pb-20 pt-10 md:px-6'>
      <header className='mb-6'>
        <h1
          className='text-2xl font-extrabold tracking-tight md:text-3xl'
          style={{ color: 'var(--deep-text, #111)' }}>
          {config?.TITLE || '相册'}
        </h1>
        {config?.DESCRIPTION && (
          <p
            className='mt-2 max-w-2xl text-sm leading-relaxed'
            style={{ color: 'var(--content-meta, rgba(0,0,0,.65))' }}>
            {config.DESCRIPTION}
          </p>
        )}
      </header>

      {config?.SHOW_TAGS !== false && allTags.length > 0 && (
        <div className='mb-6 flex flex-wrap items-center gap-2'>
          <button
            type='button'
            onClick={() => setActiveTag('')}
            className='rounded-full px-3 py-1.5 text-xs font-medium transition-colors'
            style={{
              background: activeTag === '' ? 'var(--primary, #d6336c)' : 'var(--btn-regular-bg, #ffe7ef)',
              color: activeTag === '' ? '#fff' : 'var(--btn-content, #c2255c)'
            }}>
            全部 {items.length}
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              type='button'
              onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
              className='rounded-full px-3 py-1.5 text-xs font-medium transition-colors'
              style={{
                background:
                  tag === activeTag ? 'var(--primary, #d6336c)' : 'var(--btn-regular-bg, #ffe7ef)',
                color: tag === activeTag ? '#fff' : 'var(--btn-content, #c2255c)'
              }}>
              {tag}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div
          className='rounded-2xl px-6 py-16 text-center text-sm'
          style={{
            background: 'var(--card-bg, #fff)',
            color: 'var(--content-meta, rgba(0,0,0,.6))'
          }}>
          这个分类下还没有图，先去配置里加几张吧。
        </div>
      ) : (
        <div style={{ '--gw-cols': Number(config?.COLUMNS) || 3 }}>
          <div className='gw-grid'>
            {visible.map((item, index) => (
              <figure
                key={`${item.src}-${index}`}
                className='gw-item group relative cursor-zoom-in overflow-hidden'
                onClick={() => setLightbox(index)}>
                <img
                  src={resolveSrc(item.src)}
                  alt={item.title || ''}
                  loading='lazy'
                  decoding='async'
                  className='h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                />
                <figcaption className='gw-caption'>
                  <span className='line-clamp-1 text-sm font-semibold'>
                    {item.title || '未命名'}
                  </span>
                  {item.author && (
                    <span className='mt-0.5 block line-clamp-1 text-[11px] opacity-80'>
                      {item.author}
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {current && (
        <div className='gw-lightbox' onClick={close} role='dialog' aria-modal='true'>
          <button type='button' className='gw-lb-btn gw-lb-close' onClick={close} aria-label='close'>
            ✕
          </button>
          <button
            type='button'
            className='gw-lb-btn gw-lb-prev'
            onClick={e => {
              e.stopPropagation()
              prev()
            }}
            aria-label='prev'>
            ‹
          </button>
          <figure className='gw-lb-body' onClick={e => e.stopPropagation()}>
            <img src={resolveSrc(current.src)} alt={current.title || ''} />
            <figcaption>
              <span className='font-semibold'>{current.title || '未命名'}</span>
              {current.author && <span className='ml-2 opacity-70'>· {current.author}</span>}
              {current.link && (
                <a
                  href={current.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='ml-3 underline underline-offset-2 opacity-80 hover:opacity-100'>
                  查看原图 / 作品页
                </a>
              )}
              <span className='ml-3 opacity-60'>
                {lightbox + 1} / {visible.length}
              </span>
            </figcaption>
          </figure>
          <button
            type='button'
            className='gw-lb-btn gw-lb-next'
            onClick={e => {
              e.stopPropagation()
              next()
            }}
            aria-label='next'>
            ›
          </button>
        </div>
      )}

      <style jsx>{`
        .gw-grid {
          columns: 1;
          column-gap: 16px;
        }
        @media (min-width: 640px) {
          .gw-grid {
            columns: 2;
          }
        }
        @media (min-width: 1024px) {
          .gw-grid {
            columns: var(--gw-cols, 3);
          }
        }
        .gw-item {
          break-inside: avoid;
          margin: 0 0 16px;
          border-radius: var(--radius-large, 1rem);
          background: var(--card-bg, #fff);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }
        .gw-caption {
          position: absolute;
          inset-inline: 0;
          bottom: 0;
          padding: 28px 12px 10px;
          color: #fff;
          background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.72));
          opacity: 0;
          transform: translateY(6px);
          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }
        .gw-item:hover .gw-caption,
        .gw-item:focus-within .gw-caption {
          opacity: 1;
          transform: translateY(0);
        }
        .gw-lightbox {
          position: fixed;
          inset: 0;
          z-index: 90;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10, 6, 10, 0.86);
          backdrop-filter: blur(6px);
          padding: 24px;
        }
        .gw-lb-body {
          max-width: min(92vw, 1200px);
          max-height: 88vh;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .gw-lb-body img {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .gw-lb-body figcaption {
          color: rgba(255, 255, 255, 0.92);
          font-size: 13px;
          text-align: center;
        }
        .gw-lb-btn {
          position: fixed;
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.16);
          color: #fff;
          font-size: 22px;
          line-height: 1;
          transition: background 0.2s ease;
        }
        .gw-lb-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .gw-lb-close {
          top: 18px;
          right: 18px;
          font-size: 18px;
        }
        .gw-lb-prev {
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
        }
        .gw-lb-next {
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
        }
        @media (prefers-reduced-motion: reduce) {
          .gw-item img,
          .gw-caption {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}
