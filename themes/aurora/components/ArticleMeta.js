'use client'

import NotionIcon from '@/components/NotionIcon'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'

/**
 * 文章页头部信息
 * h1 标题 + 作者/日期/最后编辑 + 分类/标签
 */
export default function ArticleMeta({ post }) {
  const { locale } = useGlobal()
  if (!post) return null

  const isPage = post.type === 'Page'

  return (
    <header>
      <h1
        className='text-2xl font-extrabold leading-tight tracking-tight md:text-4xl'
        style={{ color: 'var(--aurora-text)' }}>
        {siteConfig('POST_TITLE_ICON') && (
          <span className='mr-2 inline-block align-middle'>
            <NotionIcon icon={post.pageIcon} />
          </span>
        )}
        {post.title}
      </h1>

      {!isPage && (
        <div
          className='mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]'
          style={{ color: 'var(--aurora-text-mute)' }}>
          <span>{siteConfig('AUTHOR')}</span>
          {post.publishDay && (
            <>
              <span
                className='h-3 w-px'
                style={{ background: 'var(--aurora-border-strong)' }}
              />
              <SmartLink
                href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                className='no-underline'
                style={{ color: 'inherit' }}>
                {post.publishDay}
              </SmartLink>
            </>
          )}
          {post.lastEditedDay && (
            <>
              <span
                className='h-3 w-px'
                style={{ background: 'var(--aurora-border-strong)' }}
              />
              <span>
                {locale.COMMON.LAST_EDITED_TIME} {post.lastEditedDay}
              </span>
            </>
          )}
          {post.category && (
            <>
              <span
                className='h-3 w-px'
                style={{ background: 'var(--aurora-border-strong)' }}
              />
              <SmartLink
                href={`/category/${post.category}`}
                className='no-underline'
                style={{ color: 'var(--aurora-accent)' }}>
                {post.category}
              </SmartLink>
            </>
          )}
        </div>
      )}

      {post.tags?.length > 0 && (
        <div className='mt-4 flex flex-wrap gap-2'>
          {post.tags.map(t => (
            <SmartLink
              key={t}
              href={`/tag/${encodeURIComponent(t)}`}
              className='aurora-pill no-underline transition-colors duration-200 hover:bg-[var(--aurora-accent-soft)]'>
              #{t}
            </SmartLink>
          ))}
        </div>
      )}
    </header>
  )
}
