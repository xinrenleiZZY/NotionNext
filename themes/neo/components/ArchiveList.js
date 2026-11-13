'use client'

import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'

/**
 * 归档：按月贴纸卡
 */
export default function ArchiveList({ archivePosts }) {
  const { locale } = useGlobal()
  const groups = Object.keys(archivePosts || {})

  if (!groups.length) {
    return (
      <div
        className='neo-card px-6 py-16 text-center text-sm font-bold'
        style={{ color: 'var(--neo-ink-soft)' }}>
        {locale.COMMON.NO_RESULTS_FOUND}
      </div>
    )
  }

  return (
    <div className='space-y-5'>
      {groups.map(group => {
        const posts = archivePosts[group] || []
        return (
          <section key={group} className='neo-card px-4 py-4 md:px-6'>
            <div className='mb-3 flex items-center gap-2'>
              <h2
                className='text-base font-black uppercase tracking-tight'
                style={{ color: 'var(--neo-ink)' }}>
                {group}
              </h2>
              <span className='neo-chip neo-chip-pink'>{posts.length}</span>
            </div>
            <div className='space-y-1'>
              {posts.map(post => (
                <SmartLink
                  key={post.id}
                  href={post.href}
                  className='flex items-baseline justify-between gap-4 rounded-sm px-2 py-1.5 no-underline transition-colors duration-100 hover:bg-[var(--neo-yellow)]'
                  style={{ color: 'var(--neo-ink-soft)' }}>
                  <span className='truncate text-[13px] font-semibold'>
                    {post.title}
                  </span>
                  <span
                    className='shrink-0 text-[11px] font-bold tabular-nums'
                    style={{ color: 'var(--neo-ink-mute)' }}>
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
