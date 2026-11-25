'use client'

import LazyImage from '@/components/LazyImage'
import { useEffect, useMemo, useState } from 'react'

const AUTO_PLAY_MS = 6500

export default function AboutHero({ wallpapers = [], name, role, headline }) {
  const images = useMemo(
    () =>
      wallpapers
        .map(item => (typeof item === 'string' ? { src: item } : item))
        .filter(item => item?.src),
    [wallpapers]
  )
  const [active, setActive] = useState(0)
  const [manualPaused, setManualPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(query.matches)
    sync()
    query.addEventListener?.('change', sync)
    return () => query.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    if (!images.length || manualPaused || hovered || reducedMotion) return
    const timer = window.setInterval(() => {
      setActive(current => (current + 1) % images.length)
    }, AUTO_PLAY_MS)
    return () => window.clearInterval(timer)
  }, [hovered, images.length, manualPaused, reducedMotion])

  const current = images[active]

  return (
    <section
      className='relative left-1/2 -mt-[4.75rem] min-h-[620px] w-screen -translate-x-1/2 overflow-hidden bg-[#07101d] text-white'
      style={{ height: 'clamp(620px, 72vh, 790px)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      {images.map((image, index) => (
        <div
          key={image.src}
          className='absolute inset-0 transition-opacity duration-1000'
          style={{ opacity: index === active ? 1 : 0 }}
        >
          <LazyImage
            src={image.src}
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

      <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,20,.86)_0%,rgba(5,10,20,.58)_48%,rgba(5,10,20,.2)_100%)]' />
      <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,16,.36)_0%,transparent_36%,rgba(4,8,16,.78)_100%)]' />

      <div className='relative mx-auto flex h-full w-full max-w-[var(--page-width)] flex-col justify-end px-5 pb-12 pt-32 md:px-8 md:pb-16'>
        <div className='max-w-3xl'>
          <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-white/80 backdrop-blur-md'>
            <span className='h-1.5 w-1.5 rounded-full bg-emerald-300' />
            PERSONAL SPACE STATION
          </div>
          <h1 className='ff-banner-title text-[clamp(2.8rem,7vw,6.2rem)] font-black leading-[0.95] tracking-[-0.055em]'>
            {name}
          </h1>
          <p className='mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-white/70 md:text-base'>
            {role}
          </p>
          <p className='ff-banner-subtitle mt-4 max-w-2xl text-xl font-semibold leading-relaxed text-white md:text-3xl'>
            {headline}
          </p>

          <div className='mt-8 flex flex-wrap items-center gap-3'>
            <a
              href='#about'
              className='inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0a1726] no-underline transition-transform duration-200 hover:-translate-y-0.5'
            >
              认识我
              <i className='fas fa-arrow-down text-[11px]' />
            </a>
            <a
              href='#projects'
              className='inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white no-underline backdrop-blur-md transition-colors hover:bg-white/20'
            >
              查看项目
            </a>
            <a
              href='https://github.com/xinrenleiZZY'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white no-underline backdrop-blur-md transition-colors hover:bg-white/20'
            >
              <i className='fab fa-github' />
              GitHub
            </a>
          </div>
        </div>

        <div className='mt-12 flex items-end justify-between gap-4 border-t border-white/20 pt-4'>
          <div className='min-w-0'>
            <div className='text-[10px] font-bold tracking-[0.24em] text-white/50'>
              NOW VIEWING
            </div>
            <div className='mt-1 truncate text-xs font-semibold text-white/80'>
              {current?.title || '星轨夜航'} ·{' '}
              {String(active + 1).padStart(2, '0')}/
              {String(images.length).padStart(2, '0')}
            </div>
          </div>

          <div className='flex items-center gap-3'>
            {images.length > 1 && (
              <div
                className='flex items-center gap-1.5'
                role='tablist'
                aria-label='壁纸切换'
              >
                {images.map((image, index) => (
                  <button
                    key={image.src}
                    type='button'
                    role='tab'
                    aria-label={`显示第 ${index + 1} 张壁纸`}
                    aria-selected={index === active}
                    onClick={() => setActive(index)}
                    className='flex h-8 items-center border-0 bg-transparent p-0'
                    style={{
                      width: index === active ? 28 : 16,
                      cursor: 'pointer'
                    }}
                  >
                    <span
                      className='block h-1.5 rounded-full transition-all duration-300'
                      style={{
                        width: index === active ? 28 : 8,
                        background:
                          index === active ? '#ffffff' : 'rgba(255,255,255,.4)'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
            {images.length > 1 && (
              <button
                type='button'
                onClick={() => setManualPaused(value => !value)}
                aria-label={manualPaused ? '继续播放壁纸' : '暂停播放壁纸'}
                className='grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-xs text-white backdrop-blur-md transition-colors hover:bg-white/20'
                style={{ cursor: 'pointer' }}
              >
                <i className={`fas ${manualPaused ? 'fa-play' : 'fa-pause'}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
