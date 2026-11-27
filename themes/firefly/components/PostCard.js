'use client'

import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

function JournalFallbackCover({ category }) {
  return (
    <div
      className='relative flex h-full min-h-[148px] w-full flex-col justify-between overflow-hidden px-5 py-5 md:min-h-[178px]'
      style={{
        background:
          'radial-gradient(circle at 82% 18%, color-mix(in oklch, var(--primary) 40%, transparent), transparent 34%), linear-gradient(145deg, color-mix(in oklch, var(--card-bg) 84%, #07131b), color-mix(in oklch, var(--primary) 24%, #0a1220))'
      }}
    >
      <div className='absolute -right-10 -top-12 h-36 w-36 rounded-full border border-white/15' />
      <div className='absolute -right-1 top-7 h-24 w-24 rounded-full border border-white/10' />
      <span className='relative font-mono text-[9px] uppercase tracking-[0.24em] text-white/45'>
        Journal entry
      </span>
      <span className='relative max-w-[10rem] font-serif text-2xl font-medium leading-tight text-white/90'>
        {category}
      </span>
      <span className='relative font-mono text-[9px] tracking-[0.18em] text-[#78e2c2]'>
        ZEYAN · ARCHIVE
      </span>
    </div>
  )
}

/**
 * Firefly 文章卡片：左文右图（桌面），移动端封面在上
 */
export default function PostCard({ post, index = 0 }) {
  const showCover =
    siteConfig('FIREFLY_POST_COVER', true, CONFIG) && post?.pageCoverThumbnail
  const showExcerpt =
    siteConfig('FIREFLY_POST_EXCERPT', true, CONFIG) && post?.summary
  const categoryLabel = post.category || '修行记录'

  return (
    <SmartLink
      href={post.href}
      className='card-base ff-card-shadow block overflow-hidden no-underline'
      style={{ color: 'inherit' }}
    >
      {/* 移动端封面 */}
      {showCover && (
        <div
          className='relative w-full md:hidden'
          style={{ aspectRatio: '16 / 9' }}
        >
          <LazyImage
            src={post.pageCoverThumbnail}
            alt={post.title || ''}
            priority={index < 2}
            className='h-full w-full object-cover'
          />
        </div>
      )}
      {!showCover && (
        <div
          className='relative w-full overflow-hidden md:hidden'
          style={{ aspectRatio: '16 / 9' }}
        >
          <JournalFallbackCover category={categoryLabel} />
        </div>
      )}

      <div className='flex'>
        <div className='min-w-0 flex-1 px-5 py-5 md:px-6 md:py-6'>
          <div className='mb-2 flex flex-wrap items-center gap-2'>
            {post.pinned && (
              <span className='ff-chip ff-chip-primary'>
                <i className='fas fa-thumbtack text-[0.6rem]' />
                置顶
              </span>
            )}
            {post.publishDay && (
              <span
                className='flex items-center gap-1 text-[0.75rem]'
                style={{ color: 'var(--content-meta)' }}
              >
                <i className='fas fa-calendar-days text-[0.7rem]' />
                {post.publishDay}
              </span>
            )}
            {post.category && (
              <SmartLink
                href={`/category/${post.category}`}
                className='ff-chip no-underline'
              >
                {post.category}
              </SmartLink>
            )}
          </div>

          <h2
            className='text-lg font-bold leading-snug transition-colors duration-200 hover:text-[var(--primary)] md:text-xl'
            style={{ color: 'var(--deep-text)' }}
          >
            {siteConfig('POST_TITLE_ICON') && (
              <span className='mr-1.5 inline-block align-middle'>
                <NotionIcon icon={post.pageIcon} />
              </span>
            )}
            {post.title}
          </h2>

          {showExcerpt && (
            <p
              className='mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed'
              style={{ color: 'var(--content-meta)' }}
            >
              {post.summary}
            </p>
          )}

          <div className='mt-3 flex flex-wrap items-center gap-1.5'>
            {(post.tags || []).slice(0, 4).map(t => (
              <SmartLink
                key={t}
                href={`/tag/${encodeURIComponent(t)}`}
                className='ff-chip no-underline'
                style={{ fontSize: '0.6875rem' }}
              >
                #{t}
              </SmartLink>
            ))}
          </div>
        </div>

        {/* 桌面端右侧封面 */}
        {showCover && (
          <div className='relative hidden w-[40%] shrink-0 p-2.5 md:block'>
            <div className='h-full w-full overflow-hidden rounded-xl'>
              <LazyImage
                src={post.pageCoverThumbnail}
                alt={post.title || ''}
                priority={index < 2}
                className='h-full w-full object-cover transition-transform duration-300 hover:scale-[1.04]'
              />
            </div>
          </div>
        )}
        {!showCover && (
          <div className='relative hidden w-[34%] shrink-0 p-2.5 md:block'>
            <div className='h-full overflow-hidden rounded-xl'>
              <JournalFallbackCover category={categoryLabel} />
            </div>
          </div>
        )}
      </div>
    </SmartLink>
  )
}
