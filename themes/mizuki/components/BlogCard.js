'use client'

import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * Mizuki PostCard：桌面端「左文 + 右侧 28% 封面」，移动端「封面在上」
 * 对应源码 PostCard.astro 的 flex-col-reverse md:flex-col + --coverWidth 28%
 */
export default function BlogCard({ post, index = 0 }) {
  const showCover =
    siteConfig('MIZUKI_POST_COVER', true, CONFIG) && post?.pageCoverThumbnail
  const showExcerpt =
    siteConfig('MIZUKI_POST_EXCERPT', true, CONFIG) && post?.summary

  return (
    <SmartLink
      href={post.href}
      className='card-base card-shadow block overflow-hidden no-underline'
      style={{ color: 'inherit' }}>
      {/* 移动端封面 */}
      {showCover && (
        <div className='relative w-full md:hidden' style={{ aspectRatio: '16 / 9' }}>
          <LazyImage
            src={post.pageCoverThumbnail}
            alt={post.title || ''}
            priority={index < 2}
            className='h-full w-full object-cover'
          />
        </div>
      )}

      <div className='relative flex'>
        <div className='min-w-0 flex-1 px-6 py-6 md:py-7'>
          <div className='mb-3 flex flex-wrap items-center gap-2'>
            {post.publishDay && (
              <span className='text-[13px]' style={{ color: 'var(--content-meta)' }}>
                {post.publishDay}
              </span>
            )}
            {post.category && (
              <span className='mz-chip'>{post.category}</span>
            )}
          </div>

          <h2
            className='relative text-xl font-bold leading-snug transition-colors duration-150 hover:text-[var(--primary)] md:text-2xl'
            style={{ color: 'var(--deep-text)' }}>
            {siteConfig('POST_TITLE_ICON') && (
              <span className='mr-1.5 inline-block align-middle'>
                <NotionIcon icon={post.pageIcon} />
              </span>
            )}
            {post.title}
          </h2>

          {showExcerpt && (
            <p
              className='mt-3 line-clamp-2 text-[14px] leading-relaxed'
              style={{ color: 'var(--content-meta)' }}>
              {post.summary}
            </p>
          )}

          <div className='mt-4 flex flex-wrap items-center gap-1.5'>
            {(post.tags || []).slice(0, 4).map(t => (
              <span key={t} className='mz-chip'>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* 桌面端右侧封面 28% */}
        {showCover && (
          <div className='relative hidden w-[28%] shrink-0 p-3 pl-0 md:block'>
            <div
              className='relative h-full w-full overflow-hidden'
              style={{ borderRadius: 'calc(var(--radius-large) - 0.25rem)' }}>
              <LazyImage
                src={post.pageCoverThumbnail}
                alt={post.title || ''}
                priority={index < 2}
                className='h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]'
              />
            </div>
          </div>
        )}
      </div>
    </SmartLink>
  )
}
