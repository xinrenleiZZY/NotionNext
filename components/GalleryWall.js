'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

const FAV_KEY = 'gallery-favorites'
const ADULT_KEY = 'gallery-adult-confirmed'

/**
 * 照片墙 / 相册组件
 * - 瀑布流（1/2/N 列自适应）
 * - 标签筛选
 * - 卡片：标签 + 今日推荐 + 作者 + 作者出处 + NO.xx + 收藏
 * - 灯箱：键盘 ← → Esc、原作品链接
 * - Pixiv 图片自动走 /api/pximg 代理
 */
export default function GalleryWall({ config }) {
  const items = useMemo(() => (config?.ITEMS || []).filter(item => item?.src), [config])
  const allTags = useMemo(() => {
    const set = new Set()
    items.forEach(item =>
      (item.tags || []).forEach(tag => {
        if (tag && tag !== 'Pixiv') set.add(tag)
      })
    )
    return Array.from(set)
  }, [items])

  const [activeTag, setActiveTag] = useState('')
  const [lightbox, setLightbox] = useState(-1)
  const [favorites, setFavorites] = useState([])
  const [adultConfirmed, setAdultConfirmed] = useState(false)
  const [showSensitive, setShowSensitive] = useState(true)

  const hasSensitive = useMemo(() => items.some(item => item.sensitive), [items])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAV_KEY) || '[]')
      if (Array.isArray(saved)) setFavorites(saved)
      if (localStorage.getItem(ADULT_KEY) === '1') setAdultConfirmed(true)
    } catch (e) {}
  }, [])

  const confirmAdult = useCallback(() => {
    setAdultConfirmed(true)
    try {
      localStorage.setItem(ADULT_KEY, '1')
    } catch (e) {}
  }, [])

  const toggleFav = useCallback(key => {
    setFavorites(prev => {
      const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(next))
      } catch (e) {}
      return next
    })
  }, [])

  const visible = useMemo(() => {
    const allowSensitive = adultConfirmed && showSensitive
    return items.filter(item => {
      if (item.sensitive && !allowSensitive) return false
      if (activeTag && !(item.tags || []).includes(activeTag)) return false
      return true
    })
  }, [items, activeTag, adultConfirmed, showSensitive])

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

  const itemKey = item => item.pixivId || item.src

  return (
    <div className='mx-auto w-full max-w-[1180px] px-4 pb-20 pt-10 md:px-6'>
      <header className='mb-6'>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <h1
            className='text-2xl font-extrabold tracking-tight md:text-3xl'
            style={{ color: 'var(--deep-text, #111)' }}>
            {config?.TITLE || '相册'}
          </h1>
          <a
            href='/apps/wall'
            className='rounded-full px-3.5 py-2 text-xs font-semibold no-underline transition-transform active:scale-95'
            style={{
              background: 'linear-gradient(120deg,#ff6b8a,#c9a8ff)',
              color: '#fff'
            }}>
            🌸 去照片墙（随机 12 张）
          </a>
        </div>
        {config?.DESCRIPTION && (
          <p
            className='mt-2 max-w-2xl text-sm leading-relaxed'
            style={{ color: 'var(--content-meta, rgba(0,0,0,.65))' }}>
            {config.DESCRIPTION}
          </p>
        )}
      </header>

      {hasSensitive && !adultConfirmed && (
        <div
          className='mb-5 flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3 text-sm'
          style={{
            background: 'var(--btn-regular-bg, #ffe7ef)',
            color: 'var(--deep-text, #3a1f2b)'
          }}>
          <span className='font-semibold'>🔞 本站相册含 18+ 插画</span>
          <span style={{ color: 'var(--content-meta, rgba(0,0,0,.62))' }}>
            默认仅显示全年龄内容。确认已满 18 岁后可查看全部。
          </span>
          <button
            type='button'
            onClick={confirmAdult}
            className='rounded-full px-3 py-1.5 text-xs font-semibold text-white'
            style={{ background: 'var(--primary, #d6336c)' }}>
            我已满 18 岁，显示全部
          </button>
        </div>
      )}

      {config?.SHOW_TAGS !== false && allTags.length > 0 && (
        <div className='mb-6 flex flex-wrap items-center gap-2'>
          <button
            type='button'
            onClick={() => setActiveTag('')}
            className='rounded-full px-3 py-1.5 text-xs font-medium transition-colors'
            style={{
              background:
                activeTag === '' ? 'var(--primary, #d6336c)' : 'var(--btn-regular-bg, #ffe7ef)',
              color: activeTag === '' ? '#fff' : 'var(--btn-content, #c2255c)'
            }}>
            全部 {visible.length}
          </button>
          {allTags.slice(0, 16).map(tag => (
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
          {hasSensitive && adultConfirmed && (
            <button
              type='button'
              onClick={() => setShowSensitive(v => !v)}
              className='ml-auto rounded-full px-3 py-1.5 text-xs font-medium transition-colors'
              style={{
                background: showSensitive ? 'var(--primary, #d6336c)' : 'var(--btn-regular-bg, #ffe7ef)',
                color: showSensitive ? '#fff' : 'var(--btn-content, #c2255c)'
              }}>
              {showSensitive ? '隐藏 18+' : '显示 18+'}
            </button>
          )}
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
            {visible.map((item, index) => {
              const isFav = favorites.includes(itemKey(item))
              const tags = (item.tags || []).filter(tag => tag && tag !== 'Pixiv')
              const primaryTag = tags[0] || ''
              const recommend = Number(item.rank) > 0 && Number(item.rank) <= 3
              return (
                <figure
                  key={`${item.src}-${index}`}
                  className={`gw-item group relative cursor-zoom-in overflow-hidden ${
                    item.sensitive ? 'is-adult' : ''
                  }`}
                  onClick={() => setLightbox(index)}>
                  <img
                    src={resolveSrc(item.thumb || item.src)}
                    alt={item.title || ''}
                    loading='lazy'
                    decoding='async'
                    className='h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                  />

                  {item.sensitive && <span className='gw-adult-badge'>18+</span>}

                  <button
                    type='button'
                    aria-label='favorite'
                    className={`gw-fav ${isFav ? 'is-fav' : ''}`}
                    onClick={e => {
                      e.stopPropagation()
                      toggleFav(itemKey(item))
                    }}>
                    {isFav ? '♥' : '♡'}
                  </button>

                  <figcaption className='gw-caption'>
                    <div className='gw-tags'>
                      {primaryTag && <span className='gw-tag'>{primaryTag}</span>}
                      {recommend && <span className='gw-tag gw-hot'>今日推荐</span>}
                    </div>

                    {item.author && <div className='gw-author'>{item.author}</div>}

                    <div className='gw-bottom'>
                      {item.link ? (
                        <a
                          href={item.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='gw-source'
                          onClick={e => e.stopPropagation()}>
                          作者出处 ↗
                        </a>
                      ) : (
                        <span />
                      )}
                      {Number(item.rank) > 0 && (
                        <span className='gw-rank'>
                          NO.{String(item.rank).padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  </figcaption>
                </figure>
              )
            })}
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
        .gw-fav {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 2;
          display: grid;
          place-items: center;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          color: #e0507f;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          font-size: 15px;
          line-height: 1;
        }
        .gw-fav.is-fav {
          background: #ff6b8a;
          color: #fff;
        }
        /* 18+ 缩略图默认模糊，悬停/聚焦时清晰 */
        .gw-item.is-adult img {
          filter: blur(14px) saturate(1.05);
          transition: filter 0.3s ease, transform 0.5s ease;
        }
        .gw-item.is-adult:hover img,
        .gw-item.is-adult:focus-within img {
          filter: blur(0);
        }
        .gw-adult-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 2;
          padding: 2px 7px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #fff;
          background: rgba(214, 51, 108, 0.92);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
        }
        .gw-caption {
          position: absolute;
          inset-inline: 0;
          bottom: 0;
          padding: 34px 12px 10px;
          color: #fff;
          background: linear-gradient(180deg, transparent, rgba(18, 8, 14, 0.72));
          transition: opacity 0.25s ease;
        }
        .gw-tags {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        .gw-tag {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          color: #fff;
          background: rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(4px);
        }
        .gw-hot {
          background: linear-gradient(120deg, #ff5c8a, #c9a8ff);
        }
        .gw-author {
          font-size: 13px;
          font-weight: 600;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
        }
        .gw-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 6px;
        }
        .gw-source {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          color: #fff;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.2);
          transition: background 0.2s ease;
        }
        .gw-source:hover {
          background: rgba(255, 255, 255, 0.32);
        }
        .gw-rank {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.85);
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
