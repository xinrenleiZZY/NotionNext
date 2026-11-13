'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import BlogCard from './BlogCard'

/**
 * 文章列表 + 方块分页
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
    <section className='relative z-10 mx-auto w-full max-w-[1120px] px-4 pb-24 pt-6 md:px-6'>
      {heading && (
        <div className='mb-6 flex items-center gap-2.5'>
          <h2
            className='text-lg font-black uppercase tracking-tight'
            style={{ color: 'var(--neo-ink)' }}>
            {heading}
          </h2>
          <span className='neo-chip neo-chip-yellow'>{postCount}</span>
        </div>
      )}

      {posts.length === 0 ? (
        <div
          className='neo-card px-6 py-16 text-center text-sm font-bold'
          style={{ color: 'var(--neo-ink-soft)' }}>
          {locale.COMMON.NO_RESULTS_FOUND}
        </div>
      ) : (
        <div id='posts-wrapper' className='grid gap-6'>
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}

      {totalPage > 1 && (
        <nav className='mt-10 flex items-center justify-between gap-3'>
          {currentPage > 1 ? (
            <SmartLink href={pageHref(currentPage - 1)} className='neo-btn no-underline'>
              ← PREV
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
                    <span style={{ color: 'var(--neo-ink-mute)' }}>…</span>
                  )}
                  <SmartLink
                    href={pageHref(p)}
                    className='grid h-9 w-9 place-items-center text-[12px] no-underline'
                    style={{
                      border: '3px solid var(--neo-ink)',
                      borderRadius: '4px',
                      fontWeight: 800,
                      background:
                        p === currentPage ? 'var(--neo-yellow)' : 'var(--neo-card)',
                      color: p === currentPage ? '#111' : 'var(--neo-ink)',
                      boxShadow:
                        p === currentPage ? '3px 3px 0 var(--neo-shadow-color)' : 'none'
                    }}>
                    {p}
                  </SmartLink>
                </span>
              ))}
          </div>

          {currentPage < totalPage ? (
            <SmartLink href={pageHref(currentPage + 1)} className='neo-btn no-underline'>
              NEXT →
            </SmartLink>
          ) : (
            <span />
          )}
        </nav>
      )}
    </section>
  )
}
