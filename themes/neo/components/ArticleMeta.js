'use client'

import NotionIcon from '@/components/NotionIcon'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'

/**
 * 文章页头部：粗黑标题 + 贴纸元信息
 */
export default function ArticleMeta({ post }) {
  const { locale } = useGlobal()
  if (!post) return null

  const isPage = post.type === 'Page'

  return (
    <header>
      <h1
        className='text-2xl font-black leading-tight tracking-tight md:text-4xl'
        style={{ color: 'var(--neo-ink)' }}>
        {siteConfig('POST_TITLE_ICON') && (
          <span className='mr-2 inline-block align-middle'>
            <NotionIcon icon={post.pageIcon} />
          </span>
        )}
        {post.title}
      </h1>

      {!isPage && (
        <div className='mt-5 flex flex-wrap items-center gap-2'>
          <span className='neo-chip'>{siteConfig('AUTHOR')}</span>
          {post.publishDay && (
            <SmartLink
              href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
              className='neo-chip no-underline'>
              {post.publishDay}
            </SmartLink>
          )}
          {post.lastEditedDay && (
            <span className='neo-chip'>
              {locale.COMMON.LAST_EDITED_TIME} {post.lastEditedDay}
            </span>
          )}
          {post.category && (
            <SmartLink
              href={`/category/${post.category}`}
              className='neo-chip neo-chip-blue no-underline'>
              {post.category}
            </SmartLink>
          )}
        </div>
      )}

      {post.tags?.length > 0 && (
        <div className='mt-3 flex flex-wrap gap-1.5'>
          {post.tags.map(t => (
            <SmartLink
              key={t}
              href={`/tag/${encodeURIComponent(t)}`}
              className='neo-chip no-underline'
              style={{ textTransform: 'none' }}>
              #{t}
            </SmartLink>
          ))}
        </div>
      )}
    </header>
  )
}
