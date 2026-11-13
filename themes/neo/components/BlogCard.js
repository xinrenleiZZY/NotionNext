'use client'

import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const CHIP_STYLES = ['neo-chip-yellow', 'neo-chip-blue', 'neo-chip-pink']

/**
 * 贴纸式文章卡片
 */
export default function BlogCard({ post, index = 0 }) {
  const showCover =
    siteConfig('NEO_POST_COVER', true, CONFIG) && post?.pageCoverThumbnail
  const showExcerpt =
    siteConfig('NEO_POST_EXCERPT', true, CONFIG) && post?.summary
  const chip = CHIP_STYLES[index % CHIP_STYLES.length]

  return (
    <SmartLink
      href={post.href}
      className='neo-card neo-hover block overflow-hidden no-underline'
      style={{ color: 'inherit' }}>
      {showCover && (
        <div
          className='relative w-full overflow-hidden'
          style={{
            aspectRatio: '16 / 7',
            borderBottom: '3px solid var(--neo-ink)'
          }}>
          <LazyImage
            src={post.pageCoverThumbnail}
            alt={post.title || ''}
            priority={index < 2}
            className='h-full w-full object-cover'
          />
        </div>
      )}

      <div className='px-5 py-5 md:px-6'>
        <div className='flex flex-wrap items-center gap-2'>
          {post.publishDay && (
            <span className='neo-chip' style={{ fontSize: '10px' }}>
              {post.publishDay}
            </span>
          )}
          {post.category && (
            <span className={`neo-chip ${chip}`} style={{ fontSize: '10px' }}>
              {post.category}
            </span>
          )}
        </div>

        <h2
          className='mt-3 text-xl font-black leading-snug tracking-tight md:text-2xl'
          style={{ color: 'var(--neo-ink)' }}>
          {siteConfig('POST_TITLE_ICON') && (
            <span className='mr-2 inline-block align-middle'>
              <NotionIcon icon={post.pageIcon} />
            </span>
          )}
          {post.title}
        </h2>

        {showExcerpt && (
          <p
            className='mt-3 line-clamp-2 text-[13px] font-medium leading-relaxed'
            style={{ color: 'var(--neo-ink-soft)' }}>
            {post.summary}
          </p>
        )}

        <div className='mt-4 flex items-center justify-between'>
          <div className='flex flex-wrap gap-1.5'>
            {(post.tags || []).slice(0, 3).map(t => (
              <span
                key={t}
                className='neo-chip'
                style={{ fontSize: '10px', textTransform: 'none' }}>
                #{t}
              </span>
            ))}
          </div>
          <span
            className='text-[11px] font-black uppercase tracking-[0.14em]'
            style={{ color: 'var(--neo-blue)' }}>
            READ →
          </span>
        </div>
      </div>
    </SmartLink>
  )
}
