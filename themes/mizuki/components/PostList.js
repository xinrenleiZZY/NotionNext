'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import BlogCard from './BlogCard'

/**
 * 文章列表 + 分页
 */
export default function PostList(props) {
  const { posts = [], page = 1, postCount = 0, category, tag } = props
  const { NOTION_CONFIG, locale } = useGlobal()
  const router = useRouter()

  const perPage = siteConfig('POSTS_PER_PAGE', 8, NOTION_CONFIG) || 8
  const totalPage = Math.max(1, Math.ceil(postCount / perPage))
  const currentPage = Number(page) || 1

  const pagePrefix = String(router.asPath || '/')
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  const pageHref = target =>
    target <= 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${target}`

  const heading = category
    ? `${locale.COMMON.CATEGORY} · ${category}`
    : tag
      ? `${locale.COMMON.TAGS} · ${tag}`
      : ''

  return (
    <div className='min-w-0 flex-1'>
      {heading && (
        <div className='mb-4 flex items-center gap-2'>
          <h2
            className='text-base font-bold'
            style={{ color: 'var(--mz-on-surface)' }}>
            {heading}
          </h2>
          <span className='mz-chip'>{postCount}</span>
        </div>
      )}

      {posts.length === 0 ? (
        <div
          className='mz-surface px-6 py-16 text-center text-sm'
          style={{ color: 'var(--mz-on-surface-variant)' }}>
          {locale.COMMON.NO_RESULTS_FOUND}
        </div>
      ) : (
        <div id='posts-wrapper' className='grid gap-5'>
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}

      {totalPage > 1 && (
        <nav className='mt-8 flex items-center justify-between gap-3'>
          {currentPage > 1 ? (
            <SmartLink href={pageHref(currentPage - 1)} className='mz-chip no-underline'>
              ← 上一页
            </SmartLink>
          ) : (
            <span />
          )}

          <div className='flex items-center gap-1.5'>
            {Array.from({ length: totalPage })
              .map((_, index) => index + 1)
              .filter(
                p =>
                  totalPage <= 7 ||
                  p === 1 ||
                  p === totalPage ||
                  Math.abs(p - currentPage) <= 1
              )
              .map((p, index, list) => (
                <span key={p} className='flex items-center gap-1.5'>
                  {index > 0 && p - list[index - 1] > 1 && (
                    <span style={{ color: 'var(--mz-on-surface-variant)' }}>…</span>
                  )}
                  <SmartLink
                    href={pageHref(p)}
                    className='grid h-9 w-9 place-items-center rounded-full text-[12px] no-underline transition-colors duration-200'
                    style={{
                      fontWeight: 600,
                      background:
                        p === currentPage ? 'var(--mz-primary)' : 'var(--mz-surface-container)',
                      color:
                        p === currentPage ? 'var(--mz-on-primary)' : 'var(--mz-on-surface-variant)',
                      border: '1px solid var(--mz-outline)'
                    }}>
                    {p}
                  </SmartLink>
                </span>
              ))}
          </div>

          {currentPage < totalPage ? (
            <SmartLink href={pageHref(currentPage + 1)} className='mz-chip no-underline'>
              下一页 →
            </SmartLink>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  )
}
