'use client'

import { useEffect, useMemo, useState } from 'react'

/**
 * 关于本尊 · GitHub 主页展示
 * - 头像 / 昵称 / bio / 位置 / 关注数据
 * - 语言分布（按仓库主语言统计）
 * - 精选仓库卡片（星标排序）
 * 数据来自 /api/github（服务端代理 + 缓存）
 */
export default function GitHubShowcase({ fallback }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/api/github')
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('bad status'))))
      .then(json => {
        if (alive) setData(json)
      })
      .catch(() => {
        if (alive) setError(true)
      })
    return () => {
      alive = false
    }
  }, [])

  const user = data?.user || fallback?.user
  const stats = data?.stats || fallback?.stats
  const repos = data?.repos || fallback?.repos || []

  const languages = useMemo(() => stats?.languages || [], [stats])

  return (
    <div className='mx-auto w-full max-w-[1180px] px-4 pb-24 pt-10 md:px-6'>
      {/* 头部卡片 */}
      <section
        className='relative overflow-hidden rounded-3xl p-6 md:p-9'
        style={{
          background:
            'linear-gradient(135deg, rgba(255,182,206,0.22), rgba(201,168,255,0.2))',
          border: '1px solid var(--line-color, rgba(214,51,108,.12))'
        }}>
        <div className='flex flex-col items-start gap-6 md:flex-row md:items-center'>
          <img
            src={user?.avatar_url || '/brand/zenyth-avatar-512.png'}
            alt={user?.name || user?.login || ''}
            width={112}
            height={112}
            className='h-24 w-24 rounded-2xl object-cover shadow-lg md:h-28 md:w-28'
            style={{ border: '3px solid rgba(255,255,255,.6)' }}
          />
          <div className='min-w-0 flex-1'>
            <p
              className='text-xs font-semibold uppercase tracking-[0.3em]'
              style={{ color: 'var(--content-meta, rgba(0,0,0,.5))' }}>
              About me
            </p>
            <h1
              className='mt-1 text-2xl font-black tracking-tight md:text-4xl'
              style={{ color: 'var(--deep-text, #3a1f2b)' }}>
              仙帝 · Zeyan
            </h1>
            <p
              className='mt-2 max-w-2xl text-sm leading-relaxed'
              style={{ color: 'var(--content-meta, rgba(0,0,0,.65))' }}>
              {user?.bio ||
                '写代码、做系统、折腾 AI 的开发者。白天做企业数据与知识产权服务，晚上写桌面宠物和博客。'}
            </p>
            <div className='mt-4 flex flex-wrap items-center gap-2'>
              <a
                href={user?.html_url || 'https://github.com/xinrenleiZZY'}
                target='_blank'
                rel='noopener noreferrer'
                className='rounded-full px-3.5 py-1.5 text-xs font-semibold no-underline'
                style={{ background: 'var(--deep-text, #3a1f2b)', color: 'var(--page-bg, #fff)' }}>
                GitHub @{user?.login || 'xinrenleiZZY'}
              </a>
              <a
                href='mailto:2787326121@qq.com'
                className='rounded-full px-3.5 py-1.5 text-xs font-semibold no-underline'
                style={{ background: 'rgba(255,255,255,.7)', color: 'var(--btn-content, #c2255c)' }}>
                邮件联系
              </a>
              <span
                className='rounded-full px-3.5 py-1.5 text-xs font-semibold'
                style={{ background: 'rgba(255,255,255,.7)', color: 'var(--content-meta, #666)' }}>
                {user?.location || 'Guangzhou, CN'}
              </span>
            </div>
          </div>

          <div className='grid w-full grid-cols-3 gap-2 md:w-auto'>
            {[
              { label: '仓库', value: stats?.repos ?? user?.public_repos ?? '—' },
              { label: '星标', value: stats?.stars ?? '—' },
              { label: '关注者', value: user?.followers ?? '—' }
            ].map(item => (
              <div
                key={item.label}
                className='rounded-2xl px-4 py-3 text-center'
                style={{ background: 'rgba(255,255,255,.62)' }}>
                <div
                  className='text-lg font-black leading-none'
                  style={{ color: 'var(--deep-text, #3a1f2b)' }}>
                  {item.value}
                </div>
                <div
                  className='mt-1 text-[10px] font-semibold uppercase tracking-widest'
                  style={{ color: 'var(--content-meta, #999)' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {languages.length > 0 && (
          <div className='mt-6 flex flex-wrap items-center gap-2'>
            <span
              className='text-[11px] font-bold uppercase tracking-widest'
              style={{ color: 'var(--content-meta, #999)' }}>
              Stack
            </span>
            {languages.map(lang => (
              <span
                key={lang.name}
                className='rounded-full px-2.5 py-1 text-[11px] font-semibold'
                style={{ background: 'rgba(255,255,255,.7)', color: 'var(--btn-content, #c2255c)' }}>
                {lang.name}
                <span className='ml-1 opacity-50'>{lang.count}</span>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 仓库列表 */}
      <section className='mt-8'>
        <div className='mb-4 flex items-end justify-between'>
          <h2
            className='text-lg font-extrabold tracking-tight md:text-xl'
            style={{ color: 'var(--deep-text, #3a1f2b)' }}>
            精选仓库
          </h2>
          <a
            href={user?.html_url || 'https://github.com/xinrenleiZZY'}
            target='_blank'
            rel='noopener noreferrer'
            className='text-xs font-semibold no-underline'
            style={{ color: 'var(--primary, #d6336c)' }}>
            全部仓库 ↗
          </a>
        </div>

        {error && !repos.length && (
          <p className='text-xs' style={{ color: 'var(--content-meta, #999)' }}>
            GitHub 数据暂时不可用，先看看右侧链接吧。
          </p>
        )}

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {repos.map(repo => (
            <a
              key={repo.name}
              href={repo.html_url}
              target='_blank'
              rel='noopener noreferrer'
              className='ff-card-shadow group block rounded-2xl p-4 no-underline transition-transform duration-300 hover:-translate-y-1'
              style={{
                background: 'var(--card-bg, #fff)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
              }}>
              <div className='flex items-center justify-between gap-2'>
                <h3
                  className='truncate text-sm font-bold'
                  style={{ color: 'var(--deep-text, #3a1f2b)' }}>
                  {repo.name}
                </h3>
                <span className='text-xs font-semibold' style={{ color: '#d6336c' }}>
                  ★ {repo.stars}
                </span>
              </div>
              <p
                className='mt-1.5 line-clamp-2 min-h-[2.6em] text-xs leading-relaxed'
                style={{ color: 'var(--content-meta, rgba(0,0,0,.6))' }}>
                {repo.description || '暂无描述'}
              </p>
              <div className='mt-3 flex items-center gap-3 text-[11px]' style={{ color: 'var(--content-meta, #999)' }}>
                {repo.language && (
                  <span className='inline-flex items-center gap-1'>
                    <i
                      className='inline-block h-2 w-2 rounded-full'
                      style={{ background: 'var(--primary, #d6336c)' }}
                    />
                    {repo.language}
                  </span>
                )}
                <span>⑂ {repo.forks}</span>
                <span className='ml-auto opacity-70'>
                  {repo.updated_at ? new Date(repo.updated_at).toLocaleDateString('zh-CN') : ''}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {!data && !user && (
        <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className='h-32 animate-pulse rounded-2xl'
              style={{ background: 'var(--btn-regular-bg, #ffe7ef)' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
