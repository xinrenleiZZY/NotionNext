'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import BlogCard from './BlogCard'

/**
 * 文章列表 + 分页
 * props: posts / page / postCount / category / tag / slotTop
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

  const pageHref = target => {
    if (target <= 1) return `${pagePrefix}/`
    return `${pagePrefix}/page/${target}`
  }

  const heading = category
    ? `${locale.COMMON.CATEGORY} · ${category}`
    : tag
      ? `${locale.COMMON.TAGS} · ${tag}`
      : ''

  return (
    <section className='relative z-10 mx-auto w-full max-w-[1180px] px-5 pb-24 pt-8'>
      {heading && (
        <div className='mb-6 flex items-center gap-3'>
          <h2
            className='text-lg font-bold tracking-tight'
            style={{ color: 'var(--aurora-text)' }}>
            {heading}
          </h2>
          <span className='aurora-pill'>{postCount}</span>
        </div>
      )}

      {posts.length === 0 ? (
        <div
          className='aurora-glass px-6 py-16 text-center text-sm'
          style={{ color: 'var(--aurora-text-soft)' }}>
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
        <nav className='mt-10 flex items-center justify-between gap-3'>
          {currentPage > 1 ? (
            <SmartLink
              href={pageHref(currentPage - 1)}
              className='aurora-glass aurora-glass-hover flex items-center gap-2 px-4 py-2.5 text-[13px] no-underline'
              style={{ color: 'var(--aurora-text-soft)' }}>
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
                    <span style={{ color: 'var(--aurora-text-mute)' }}>…</span>
                  )}
                  <SmartLink
                    href={pageHref(p)}
                    className='grid h-9 w-9 place-items-center rounded-full text-[13px] no-underline transition-colors duration-200'
                    style={
                      p === currentPage
                        ? {
                            background: 'var(--aurora-accent)',
                            color: '#fff',
                            fontWeight: 700
                          }
                        : {
                            color: 'var(--aurora-text-soft)',
                            background: 'var(--aurora-surface)',
                            border: '1px solid var(--aurora-border)'
                          }
                    }>
                    {p}
                  </SmartLink>
                </span>
              ))}
          </div>

          {currentPage < totalPage ? (
            <SmartLink
              href={pageHref(currentPage + 1)}
              className='aurora-glass aurora-glass-hover flex items-center gap-2 px-4 py-2.5 text-[13px] no-underline'
              style={{ color: 'var(--aurora-text-soft)' }}>
              下一页 →
            </SmartLink>
          ) : (
            <span />
          )}
        </nav>
      )}
    </section>
  )
}
