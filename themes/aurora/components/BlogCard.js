'use client'

import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 极光玻璃文章卡片
 * 封面（可选）+ 日期/分类 + 标题 + 摘要 + 标签
 */
export default function BlogCard({ post, index = 0 }) {
  const showCover =
    siteConfig('AURORA_POST_COVER', true, CONFIG) && post?.pageCoverThumbnail
  const showExcerpt =
    siteConfig('AURORA_POST_EXCERPT', true, CONFIG) && post?.summary

  return (
    <SmartLink
      href={post.href}
      className='aurora-glass aurora-glass-hover block overflow-hidden no-underline'
      style={{ color: 'inherit' }}>
      {showCover && (
        <div className='relative aspect-[16/8] w-full overflow-hidden'>
          <LazyImage
            src={post.pageCoverThumbnail}
            alt={post.title || ''}
            priority={index < 2}
            className='h-full w-full object-cover'
          />
          <div
            className='pointer-events-none absolute inset-0'
            style={{
              background:
                'linear-gradient(180deg, transparent 45%, var(--aurora-bg) 100%)',
              opacity: 0.55
            }}
          />
        </div>
      )}

      <div className='px-5 py-5 md:px-7 md:py-6'>
        <div
          className='flex flex-wrap items-center gap-2.5 text-[12px]'
          style={{ color: 'var(--aurora-text-mute)' }}>
          {post.publishDay && <span>{post.publishDay}</span>}
          {post.category && (
            <>
              <span
                className='h-3 w-px'
                style={{ background: 'var(--aurora-border-strong)' }}
              />
              <span
                className='tracking-[0.08em] uppercase'
                style={{ color: 'var(--aurora-accent)' }}>
                {post.category}
              </span>
            </>
          )}
          {post.tags?.length > 0 && (
            <>
              <span
                className='h-3 w-px'
                style={{ background: 'var(--aurora-border-strong)' }}
              />
              <span className='truncate'>
                {post.tags.slice(0, 3).map(t => `#${t}`).join('  ')}
              </span>
            </>
          )}
        </div>

        <h2
          className='mt-3 text-xl font-bold leading-snug tracking-tight transition-colors duration-200 md:text-2xl'
          style={{ color: 'var(--aurora-text)' }}>
          {siteConfig('POST_TITLE_ICON') && (
            <span className='mr-2 inline-block align-middle'>
              <NotionIcon icon={post.pageIcon} />
            </span>
          )}
          {post.title}
        </h2>

        {showExcerpt && (
          <p
            className='mt-3 line-clamp-2 text-sm leading-relaxed md:line-clamp-3'
            style={{ color: 'var(--aurora-text-soft)' }}>
            {post.summary}
          </p>
        )}

        <div
          className='mt-5 flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.14em] uppercase'
          style={{ color: 'var(--aurora-accent)' }}>
          <span>Read</span>
          <svg
            width='12'
            height='12'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'>
            <path d='M5 12h14M13 6l6 6-6 6' />
          </svg>
        </div>
      </div>
    </SmartLink>
  )
}
