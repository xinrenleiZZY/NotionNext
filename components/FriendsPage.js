'use client'

import FRIENDS from '@/conf/friends.config'
import LazyImage from '@/components/LazyImage'
import { useState } from 'react'

const SocialLink = ({ href, children, className = '' }) => (
  <a
    href={href}
    target={href?.startsWith('http') ? '_blank' : undefined}
    rel='noopener noreferrer'
    className={`no-underline transition hover:-translate-y-0.5 ${className}`}
  >
    {children}
  </a>
)

export default function FriendsPage() {
  const [copied, setCopied] = useState(false)

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(FRIENDS.application.template)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (e) {
      setCopied(false)
    }
  }

  return (
    <main className='relative mx-auto w-full max-w-[1180px] px-4 pb-24 pt-8 md:px-6 md:pt-10'>
      <section
        className='relative overflow-hidden rounded-[2rem] border px-6 py-8 md:px-10 md:py-11'
        style={{
          borderColor: 'var(--line-color)',
          background:
            'linear-gradient(135deg, color-mix(in oklch, var(--card-bg) 92%, transparent), color-mix(in oklch, var(--primary) 8%, transparent))',
          boxShadow: 'var(--shadow-navbar)'
        }}
      >
        <div
          className='pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border opacity-40'
          style={{ borderColor: 'var(--primary)' }}
        />
        <div
          className='pointer-events-none absolute right-10 top-10 h-32 w-32 rounded-full border opacity-20'
          style={{ borderColor: 'var(--primary)' }}
        />
        <div className='relative grid gap-8 md:grid-cols-[minmax(0,1fr)_260px] md:items-end'>
          <div>
            <p
              className='text-[10px] font-bold uppercase tracking-[0.28em]'
              style={{ color: 'var(--primary)' }}
            >
              {FRIENDS.eyebrow}
            </p>
            <h1
              className='mt-3 text-4xl font-black tracking-tight md:text-6xl'
              style={{ color: 'var(--deep-text)' }}
            >
              {FRIENDS.title}
            </h1>
            <p
              className='mt-4 max-w-2xl text-sm leading-7 md:text-base'
              style={{ color: 'var(--content-meta)' }}
            >
              {FRIENDS.description}
            </p>
          </div>
          <div
            className='relative overflow-hidden rounded-3xl border p-5'
            style={{
              borderColor: 'var(--line-color)',
              background:
                'linear-gradient(145deg, rgba(5, 12, 24, 0.9), rgba(14, 41, 48, 0.72))'
            }}
          >
            <p className='font-mono text-[10px] tracking-[0.22em] text-white/45'>
              FRIEND NETWORK
            </p>
            <div className='mt-5 flex items-end justify-between gap-4'>
              <div>
                <strong className='block font-serif text-3xl font-medium text-white'>
                  {String(FRIENDS.friends.length).padStart(2, '0')}
                </strong>
                <span className='mt-1 block text-xs text-white/55'>
                  常驻伙伴
                </span>
              </div>
              <div className='text-right'>
                <strong className='block font-serif text-3xl font-medium text-[#78e2c2]'>
                  {String(FRIENDS.bookmarks.length).padStart(2, '0')}
                </strong>
                <span className='mt-1 block text-xs text-white/55'>
                  收藏书签
                </span>
              </div>
            </div>
            <div className='mt-5 h-px w-full bg-white/12'>
              <div className='h-px w-2/3 bg-[#78e2c2]' />
            </div>
          </div>
        </div>
      </section>

      <section className='mt-12'>
        <div className='mb-5 flex flex-wrap items-end justify-between gap-3'>
          <div>
            <p className='text-[10px] font-bold tracking-[0.25em] text-[var(--primary)]'>
              ALWAYS ON
            </p>
            <h2
              className='mt-1 text-2xl font-black tracking-tight md:text-3xl'
              style={{ color: 'var(--deep-text)' }}
            >
              常驻伙伴
            </h2>
          </div>
          <span
            className='rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.14em]'
            style={{
              borderColor: 'var(--line-color)',
              color: 'var(--content-meta)'
            }}
          >
            LINK STATUS · ACTIVE
          </span>
        </div>

        <div className='grid gap-5 md:grid-cols-2'>
          {FRIENDS.friends.map((friend, index) => (
            <SocialLink
              key={friend.href}
              href={friend.href}
              className='group relative block overflow-hidden rounded-3xl border p-5 md:p-6'
            >
              <div
                className='absolute inset-0 opacity-70'
                style={{
                  background:
                    index === 0
                      ? 'linear-gradient(135deg, rgba(120,226,194,.16), transparent 58%)'
                      : 'linear-gradient(135deg, rgba(217,108,158,.16), transparent 58%)'
                }}
              />
              <div className='relative flex items-start gap-4'>
                <LazyImage
                  src={friend.avatar}
                  alt={friend.name}
                  width={84}
                  height={84}
                  className='h-[84px] w-[84px] shrink-0 rounded-2xl border-2 object-cover shadow-lg'
                  style={{ borderColor: 'var(--card-bg)' }}
                />
                <div className='min-w-0 flex-1'>
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <span
                        className='rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider'
                        style={{
                          background: 'var(--primary)',
                          color: 'var(--page-bg)'
                        }}
                      >
                        {friend.badge}
                      </span>
                      <h3
                        className='mt-2 truncate text-xl font-black'
                        style={{ color: 'var(--deep-text)' }}
                      >
                        {friend.name}
                      </h3>
                      <p
                        className='mt-0.5 font-mono text-[11px]'
                        style={{ color: 'var(--content-meta)' }}
                      >
                        {friend.handle}
                      </p>
                    </div>
                    <span
                      className='text-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1'
                      style={{ color: 'var(--primary)' }}
                    >
                      ↗
                    </span>
                  </div>
                  <p
                    className='mt-3 text-xs leading-6 md:text-sm'
                    style={{ color: 'var(--content-meta)' }}
                  >
                    {friend.description}
                  </p>
                </div>
              </div>
              <div className='relative mt-5 flex flex-wrap gap-2'>
                {friend.tags.map(tag => (
                  <span
                    key={tag}
                    className='rounded-full px-2.5 py-1 text-[10px] font-semibold'
                    style={{
                      background: 'var(--btn-regular-bg)',
                      color: 'var(--btn-content)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div
                className='relative mt-5 flex items-center justify-between border-t pt-4 text-[11px]'
                style={{
                  borderColor: 'var(--line-divider)',
                  color: 'var(--content-meta)'
                }}
              >
                <span>前往主页</span>
                <span className='font-mono tracking-wider'>CONNECTED</span>
              </div>
            </SocialLink>
          ))}
        </div>
      </section>

      <section className='mt-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]'>
        <div>
          <p className='text-[10px] font-bold tracking-[0.25em] text-[var(--primary)]'>
            BOOKMARKS
          </p>
          <h2
            className='mt-1 text-2xl font-black tracking-tight md:text-3xl'
            style={{ color: 'var(--deep-text)' }}
          >
            收藏书签
          </h2>
          <p
            className='mt-2 text-sm leading-6'
            style={{ color: 'var(--content-meta)' }}
          >
            不是搜索引擎式收藏，只留下会再次打开、并且长期有效的入口。
          </p>
          <div className='mt-5 grid gap-3'>
            {FRIENDS.bookmarks.map(bookmark => (
              <SocialLink
                key={bookmark.href}
                href={bookmark.href}
                className='group flex items-center justify-between rounded-2xl border px-4 py-4'
              >
                <span className='min-w-0'>
                  <span className='flex items-center gap-2'>
                    <span
                      className='font-mono text-[9px] font-bold tracking-[0.16em]'
                      style={{ color: 'var(--primary)' }}
                    >
                      {bookmark.label}
                    </span>
                    <strong
                      className='truncate text-sm'
                      style={{ color: 'var(--deep-text)' }}
                    >
                      {bookmark.title}
                    </strong>
                  </span>
                  <span
                    className='mt-1 block text-xs'
                    style={{ color: 'var(--content-meta)' }}
                  >
                    {bookmark.description}
                  </span>
                </span>
                <span
                  className='ml-4 shrink-0 transition-transform group-hover:translate-x-1'
                  style={{ color: 'var(--primary)' }}
                >
                  →
                </span>
              </SocialLink>
            ))}
          </div>
        </div>

        <div
          className='rounded-3xl border p-5 md:p-7'
          style={{
            borderColor: 'var(--line-color)',
            background:
              'linear-gradient(145deg, color-mix(in oklch, var(--card-bg) 96%, transparent), color-mix(in oklch, var(--primary) 7%, transparent))'
          }}
        >
          <p className='font-mono text-[10px] tracking-[0.22em] text-[var(--primary)]'>
            APPLY FOR A LINK
          </p>
          <h2
            className='mt-2 text-2xl font-black'
            style={{ color: 'var(--deep-text)' }}
          >
            {FRIENDS.application.title}
          </h2>
          <p
            className='mt-3 text-sm leading-7'
            style={{ color: 'var(--content-meta)' }}
          >
            {FRIENDS.application.description}
          </p>
          <pre
            className='mt-5 overflow-x-auto whitespace-pre-wrap rounded-2xl border p-4 font-mono text-[11px] leading-6'
            style={{
              borderColor: 'var(--line-divider)',
              background: 'var(--btn-regular-bg)',
              color: 'var(--deep-text)'
            }}
          >
            {FRIENDS.application.template}
          </pre>
          <div className='mt-4 flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => {
                copyTemplate()
              }}
              className='cursor-pointer rounded-full border-0 px-4 py-2 text-xs font-semibold'
              style={{
                background: 'var(--primary)',
                color: 'var(--page-bg)'
              }}
            >
              {copied ? '已复制' : '复制友链资料'}
            </button>
            <SocialLink
              href={FRIENDS.application.github}
              className='inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold'
            >
              GitHub
            </SocialLink>
            <SocialLink
              href={FRIENDS.application.email}
              className='inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold'
            >
              邮箱
            </SocialLink>
          </div>
        </div>
      </section>
    </main>
  )
}
