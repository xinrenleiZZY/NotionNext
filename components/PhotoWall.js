'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

const ADULT_KEY = 'gallery-adult-confirmed'
const PAGE_SIZE = 12
const ALL_TAG = '__all__'

function shuffle(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * 动漫照片墙
 * - 按标签筛选，每次随机抽 12 张
 * - 「随机换一批」重新抽
 * - 18+ 内容遵循全局年龄门禁（localStorage: gallery-adult-confirmed）
 */
export default function PhotoWall({ config }) {
  const pool = useMemo(
    () => (config?.ITEMS || []).filter(item => item?.src),
    [config]
  )

  const [activeTag, setActiveTag] = useState(ALL_TAG)
  const [adultConfirmed, setAdultConfirmed] = useState(false)
  const [batch, setBatch] = useState([])
  const [lightbox, setLightbox] = useState(-1)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(ADULT_KEY) === '1') setAdultConfirmed(true)
    } catch (e) {}
    setReady(true)
  }, [])

  const tags = useMemo(() => {
    const map = new Map()
    pool.forEach(item => {
      ;(item.tags || []).forEach(tag => {
        if (!tag || tag === 'Pixiv') return
        if (item.sensitive && !adultConfirmed) return
        map.set(tag, (map.get(tag) || 0) + 1)
      })
    })
    return [...map.entries()]
      .filter(([, count]) => count >= 4)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
  }, [pool, adultConfirmed])

  const candidates = useMemo(() => {
    return pool.filter(item => {
      if (item.sensitive && !adultConfirmed) return false
      if (activeTag === ALL_TAG) return true
      return (item.tags || []).includes(activeTag)
    })
  }, [pool, activeTag, adultConfirmed])

  const pick = useCallback(() => {
    setBatch(shuffle(candidates).slice(0, PAGE_SIZE))
    setLightbox(-1)
  }, [candidates])

  useEffect(() => {
    if (ready) pick()
  }, [ready, pick])

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

  const current = lightbox >= 0 ? batch[lightbox] : null

  useEffect(() => {
    if (lightbox < 0) return
    const onKey = e => {
      if (e.key === 'Escape') setLightbox(-1)
      if (e.key === 'ArrowLeft')
        setLightbox(i => (i <= 0 ? batch.length - 1 : i - 1))
      if (e.key === 'ArrowRight')
        setLightbox(i => (i >= batch.length - 1 ? 0 : i + 1))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightbox, batch.length])

  const tagLabel = activeTag === ALL_TAG ? '全部' : activeTag

  return (
    <div className='mx-auto w-full max-w-[1180px] px-4 pb-20 pt-10 md:px-6'>
      <div
        className='mb-5 rounded-3xl px-5 py-5'
        style={{
          background:
            'linear-gradient(120deg, rgba(255, 182, 206, 0.22), rgba(201, 168, 255, 0.22))',
          border: '1px solid var(--line-color, rgba(214,51,108,.12))'
        }}>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1
              className='flex items-center gap-2 text-xl font-extrabold md:text-2xl'
              style={{ color: 'var(--deep-text, #3a1f2b)' }}>
              🌸 动漫照片墙
              <a
                href='/apps/gallery'
                className='ml-2 rounded-full px-3 py-1 text-[11px] font-semibold no-underline'
                style={{ background: 'rgba(255,255,255,.72)', color: '#b06a83' }}>
                全部相册 ↗
              </a>
            </h1>
            <p
              className='mt-1 text-xs'
              style={{ color: 'var(--content-meta, rgba(0,0,0,.6))' }}>
              像翻阅一本花册——选一个标签，每次随机抽出 12 张。点开看大图。
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <span
              className='rounded-full px-3 py-1 text-xs font-semibold'
              style={{
                background: 'rgba(255,255,255,.6)',
                color: 'var(--btn-content, #c2255c)'
              }}>
              {tagLabel} · {Math.min(batch.length, candidates.length)} 张
            </span>
            <button
              type='button'
              onClick={pick}
              className='rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm transition-transform active:scale-95'
              style={{ background: 'linear-gradient(120deg,#ff6b8a,#c9a8ff)' }}>
              🎲 随机换一批
            </button>
          </div>
        </div>

        <div className='mt-4 flex flex-wrap items-center gap-2'>
          <button
            type='button'
            onClick={() => setActiveTag(ALL_TAG)}
            className='rounded-full px-3 py-1.5 text-xs font-semibold transition-colors'
            style={{
              background: activeTag === ALL_TAG ? '#d6336c' : 'rgba(255,255,255,.72)',
              color: activeTag === ALL_TAG ? '#fff' : '#b06a83'
            }}>
            ✨ 全部
          </button>
          {tags.map(([tag, count]) => (
            <button
              key={tag}
              type='button'
              onClick={() => setActiveTag(tag)}
              className='rounded-full px-3 py-1.5 text-xs font-semibold transition-colors'
              style={{
                background: activeTag === tag ? '#d6336c' : 'rgba(255,255,255,.72)',
                color: activeTag === tag ? '#fff' : '#b06a83'
              }}>
              {tag}
              <span className='ml-1 opacity-60'>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {!adultConfirmed && pool.some(i => i.sensitive) && (
        <div className='mb-4 text-xs' style={{ color: 'var(--content-meta, rgba(0,0,0,.6))' }}>
          🔞 已自动排除 18+ 内容；想包含请到 <a href='/apps/gallery' className='underline'>相册页</a> 确认年龄。
        </div>
      )}

      {batch.length === 0 ? (
        <div
          className='rounded-2xl px-6 py-16 text-center text-sm'
          style={{
            background: 'var(--card-bg, #fff)',
            color: 'var(--content-meta, rgba(0,0,0,.6))'
          }}>
          这个标签下暂时没有足够的图，换个标签试试。
        </div>
      ) : (
        <div className='wall-grid'>
          {batch.map((item, index) => (
            <figure
              key={`${item.src}-${index}`}
              className={`wall-item group relative cursor-zoom-in overflow-hidden ${item.sensitive ? 'is-adult' : ''}`}
              onClick={() => setLightbox(index)}>
              <img
                src={resolveSrc(item.thumb || item.src)}
                alt={item.title || ''}
                loading={index < 4 ? 'eager' : 'lazy'}
                decoding='async'
                className='h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]'
              />
              {item.sensitive && <span className='wall-adult'>18+</span>}
              <figcaption className='wall-caption'>
                <span className='wall-author'>{item.author || '—'}</span>
                {item.link && (
                  <a
                    href={item.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='wall-source'
                    onClick={e => e.stopPropagation()}>
                    作者出处 ↗
                  </a>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {current && (
        <div
          className='wall-lightbox'
          onClick={() => setLightbox(-1)}
          role='dialog'
          aria-modal='true'>
          <button
            type='button'
            className='wall-lb-btn wall-lb-close'
            onClick={() => setLightbox(-1)}
            aria-label='close'>
            ✕
          </button>
          <button
            type='button'
            className='wall-lb-btn wall-lb-prev'
            onClick={e => {
              e.stopPropagation()
              setLightbox(i => (i <= 0 ? batch.length - 1 : i - 1))
            }}
            aria-label='prev'>
            ‹
          </button>
          <figure className='wall-lb-body' onClick={e => e.stopPropagation()}>
            <img src={resolveSrc(current.src)} alt={current.title || ''} />
            <figcaption>
              <span className='font-semibold'>{current.title || '未命名'}</span>
              {current.author && <span className='ml-2 opacity-70'>· {current.author}</span>}
              {current.link && (
                <a
                  href={current.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='ml-3 underline underline-offset-2 opacity-80'>
                  查看原图
                </a>
              )}
              <span className='ml-3 opacity-60'>
                {lightbox + 1} / {batch.length}
              </span>
            </figcaption>
          </figure>
          <button
            type='button'
            className='wall-lb-btn wall-lb-next'
            onClick={e => {
              e.stopPropagation()
              setLightbox(i => (i >= batch.length - 1 ? 0 : i + 1))
            }}
            aria-label='next'>
            ›
          </button>
        </div>
      )}

      <style jsx>{`
        .wall-grid {
          columns: 2;
          column-gap: 14px;
        }
        @media (min-width: 720px) {
          .wall-grid {
            columns: 3;
          }
        }
        @media (min-width: 1140px) {
          .wall-grid {
            columns: 4;
          }
        }
        .wall-item {
          break-inside: avoid;
          margin: 0 0 14px;
          border-radius: 18px;
          background: var(--card-bg, #fff);
          box-shadow: 0 8px 24px rgba(214, 51, 108, 0.1);
        }
        .wall-item img {
          border-radius: 18px;
        }
        .wall-adult {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 2;
          padding: 2px 7px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          color: #fff;
          background: rgba(214, 51, 108, 0.92);
        }
        .wall-item.is-adult img {
          filter: blur(14px);
          transition: filter 0.3s ease;
        }
        .wall-item.is-adult:hover img {
          filter: blur(0);
        }
        .wall-caption {
          position: absolute;
          inset-inline: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 30px 12px 10px;
          color: #fff;
          background: linear-gradient(180deg, transparent, rgba(18, 8, 14, 0.7));
          opacity: 0;
          transition: opacity 0.25s ease;
          border-radius: 0 0 18px 18px;
        }
        .wall-item:hover .wall-caption {
          opacity: 1;
        }
        .wall-author {
          font-size: 12px;
          font-weight: 600;
        }
        .wall-source {
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.22);
          color: #fff;
          text-decoration: none;
          white-space: nowrap;
        }
        .wall-lightbox {
          position: fixed;
          inset: 0;
          z-index: 90;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(10, 6, 10, 0.86);
          backdrop-filter: blur(6px);
        }
        .wall-lb-body {
          max-width: min(92vw, 1200px);
          max-height: 88vh;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .wall-lb-body img {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 12px;
        }
        .wall-lb-body figcaption {
          color: rgba(255, 255, 255, 0.92);
          font-size: 13px;
          text-align: center;
        }
        .wall-lb-btn {
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
        }
        .wall-lb-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .wall-lb-close {
          top: 18px;
          right: 18px;
          font-size: 18px;
        }
        .wall-lb-prev {
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
        }
        .wall-lb-next {
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>
    </div>
  )
}
