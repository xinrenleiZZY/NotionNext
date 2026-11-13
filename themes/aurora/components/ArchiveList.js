'use client'

import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'

/**
 * 归档列表
 * archivePosts 形如 { '2026年7月': [post, ...] }
 */
export default function ArchiveList({ archivePosts }) {
  const { locale } = useGlobal()
  const groups = Object.keys(archivePosts || {})

  if (!groups.length) {
    return (
      <div
        className='aurora-glass px-6 py-16 text-center text-sm'
        style={{ color: 'var(--aurora-text-soft)' }}>
        {locale.COMMON.NO_RESULTS_FOUND}
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {groups.map(group => {
        const posts = archivePosts[group] || []
        return (
          <section key={group} className='aurora-glass px-5 py-5 md:px-7'>
            <div className='mb-4 flex items-center gap-3'>
              <h2
                className='text-base font-bold tracking-tight'
                style={{ color: 'var(--aurora-text)' }}>
                {group}
              </h2>
              <span className='aurora-pill'>{posts.length}</span>
            </div>
            <div className='space-y-1'>
              {posts.map(post => (
                <SmartLink
                  key={post.id}
                  href={post.href}
                  className='flex items-baseline justify-between gap-4 rounded-xl px-2 py-2 no-underline transition-colors duration-200 hover:bg-[var(--aurora-accent-soft)]'>
                  <span
                    className='truncate text-sm'
                    style={{ color: 'var(--aurora-text-soft)' }}>
                    {post.title}
                  </span>
                  <span
                    className='shrink-0 text-[12px] tabular-nums'
                    style={{ color: 'var(--aurora-text-mute)' }}>
                    {post.publishDay}
                  </span>
                </SmartLink>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
