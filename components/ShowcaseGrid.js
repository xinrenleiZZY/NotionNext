'use client'

import { useMemo, useState } from 'react'

/**
 * 仙术展示 · 作品网格（参考 jlern.com 的项目墙）
 * - 大标题 + 分类筛选 + 卡片网格
 * - 悬停：图片放大、遮罩浮现、箭头外链
 * - 数字编号 NO.01 风格
 */
export default function ShowcaseGrid({ config }) {
  const items = config?.ITEMS || []
  const categories = useMemo(() => {
    const set = new Set()
    items.forEach(item => item.category && set.add(item.category))
    return ['全部', ...Array.from(set)]
  }, [items])
  const [active, setActive] = useState('全部')

  const visible = useMemo(
    () => (active === '全部' ? items : items.filter(item => item.category === active)),
    [items, active]
  )

  return (
    <div className='mx-auto w-full max-w-[1180px] px-4 pb-24 pt-10 md:px-6'>
      <header className='mb-8'>
        <p
          className='text-xs font-semibold uppercase tracking-[0.28em]'
          style={{ color: 'var(--content-meta, rgba(0,0,0,.55))' }}>
          {String(items.length).padStart(2, '0')} projects
        </p>
        <h1
          className='mt-2 text-3xl font-black tracking-tight md:text-5xl'
          style={{ color: 'var(--deep-text, #111)' }}>
          {config?.TITLE || '仙术展示'}
        </h1>
        <p
          className='mt-3 max-w-2xl text-sm leading-relaxed'
          style={{ color: 'var(--content-meta, rgba(0,0,0,.65))' }}>
          {config?.SUBTITLE}
        </p>
      </header>

      <div className='mb-8 flex flex-wrap items-center gap-2'>
        {categories.map(category => (
          <button
            key={category}
            type='button'
            onClick={() => setActive(category)}
            className='rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors'
            style={{
              background:
                active === category
                  ? 'var(--deep-text, #111)'
                  : 'var(--btn-regular-bg, #ffe7ef)',
              color: active === category ? 'var(--page-bg, #fff)' : 'var(--btn-content, #c2255c)'
            }}>
            {category}
          </button>
        ))}
      </div>

      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        {visible.map((item, index) => (
          <a
            key={item.title}
            href={item.href}
            target={item.href?.startsWith('http') ? '_blank' : undefined}
            rel='noopener noreferrer'
            className='ff-card-shadow group relative block overflow-hidden no-underline'
            style={{
              borderRadius: 'var(--radius-large, 1rem)',
              background: 'var(--card-bg, #fff)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
            }}>
            <div className='relative aspect-[4/3] overflow-hidden'>
              <img
                src={encodeURI(item.cover || '')}
                alt={item.title}
                loading={index < 3 ? 'eager' : 'lazy'}
                className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]'
              />
              <span className='absolute left-3 top-3 rounded-full bg-black/45 px-2 py-1 text-[10px] font-bold tracking-wider text-white backdrop-blur'>
                NO.{String(index + 1).padStart(2, '0')}
              </span>
              <span className='absolute right-3 top-3 rounded-full bg-white/85 px-2 py-1 text-[10px] font-bold text-black/70'>
                {item.year}
              </span>
            </div>

            <div className='p-4'>
              <div className='flex items-start justify-between gap-3'>
                <h2
                  className='text-base font-extrabold leading-snug'
                  style={{ color: 'var(--deep-text, #111)' }}>
                  {item.title}
                </h2>
                <span
                  className='mt-0.5 shrink-0 text-lg transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
                  style={{ color: 'var(--primary, #d6336c)' }}>
                  ↗
                </span>
              </div>
              {item.subtitle && (
                <p
                  className='mt-0.5 text-xs font-medium'
                  style={{ color: 'var(--primary, #d6336c)' }}>
                  {item.subtitle}
                </p>
              )}
              <p
                className='mt-2 line-clamp-3 text-xs leading-relaxed'
                style={{ color: 'var(--content-meta, rgba(0,0,0,.62))' }}>
                {item.desc}
              </p>
              <div className='mt-3 flex flex-wrap gap-1.5'>
                {(item.tags || []).map(tag => (
                  <span
                    key={tag}
                    className='rounded-full px-2 py-0.5 text-[10px] font-semibold'
                    style={{
                      background: 'var(--btn-regular-bg, #ffe7ef)',
                      color: 'var(--btn-content, #c2255c)'
                    }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>

      {visible.length === 0 && (
        <div
          className='rounded-2xl px-6 py-16 text-center text-sm'
          style={{
            background: 'var(--card-bg, #fff)',
            color: 'var(--content-meta, rgba(0,0,0,.6))'
          }}>
          这个分类下还没有作品。
        </div>
      )}
    </div>
  )
}
