'use client'

import ConstellationExperience from '@/components/ConstellationExperience'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import ABOUT from '@/conf/about.config'
import { useEffect, useMemo, useState } from 'react'

const safeDate = value =>
  value ? String(value).slice(0, 10).replaceAll('-', '.') : ''

const SectionHeading = ({ eyebrow, title, description, action }) => (
  <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
    <div>
      <div
        className='text-[10px] font-bold tracking-[0.25em]'
        style={{ color: 'var(--primary)' }}
      >
        {eyebrow}
      </div>
      <h2
        className='mt-1 text-2xl font-black tracking-tight md:text-3xl'
        style={{ color: 'var(--deep-text)' }}
      >
        {title}
      </h2>
      {description && (
        <p
          className='mt-2 max-w-2xl text-sm leading-relaxed'
          style={{ color: 'var(--content-meta)' }}
        >
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
)

export default function AboutShowcase({ fallback, latestPosts = [] }) {
  const [data, setData] = useState(fallback || null)

  useEffect(() => {
    let alive = true
    fetch('/api/github')
      .then(response =>
        response.ok ? response.json() : Promise.reject(new Error('bad status'))
      )
      .then(payload => {
        if (alive && payload?.user) setData(payload)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const user = data?.user || {}
  const stats = data?.stats || {}
  const repos = data?.repos || []
  const avatar = user.avatar_url || '/brand/zenyth-avatar-512.png'
  const createdAt = user.created_at ? new Date(user.created_at) : null
  const githubYears =
    createdAt && Number.isFinite(createdAt.getTime())
      ? Math.max(1, new Date().getFullYear() - createdAt.getFullYear())
      : '—'

  const featuredNames = useMemo(
    () => new Set(ABOUT.projects.map(project => project.title.toLowerCase())),
    []
  )
  const moreRepos = repos
    .filter(repo => !featuredNames.has(String(repo.name).toLowerCase()))
    .slice(0, 6)
  const recentPosts = latestPosts.slice(0, 3)

  return (
    <>
      <ConstellationExperience
        variant='about'
        eyebrow='Personal space station · 2026'
        title={ABOUT.name}
        role={ABOUT.role}
        headline={ABOUT.headline}
        actions={[
          {
            label: '查看个人档案',
            href: '#about',
            primary: true,
            icon: 'fas fa-arrow-down text-[10px]'
          },
          {
            label: 'GitHub',
            href: 'https://github.com/xinrenleiZZY',
            icon: 'fab fa-github'
          }
        ]}
      />

      <div
        id='about'
        className='relative z-10 mx-auto w-full max-w-[var(--page-width)] scroll-mt-[5rem] px-4 pb-24 pt-5 md:px-8'
      >
        <div className='grid items-start gap-5 lg:grid-cols-[310px_minmax(0,1fr)]'>
          <aside className='lg:sticky lg:top-[5.5rem]'>
            <div className='card-base ff-card-shadow overflow-hidden rounded-3xl'>
              <div className='relative h-24 overflow-hidden bg-[linear-gradient(120deg,#0f2e2a,#a33d69)]'>
                <div className='absolute -right-8 -top-10 h-36 w-36 rounded-full border border-white/20' />
                <div className='absolute -right-1 top-3 h-24 w-24 rounded-full border border-white/15' />
              </div>
              <div className='px-5 pb-5'>
                <LazyImage
                  src={avatar}
                  alt={user.name || ABOUT.name}
                  width={112}
                  height={112}
                  className='-mt-12 h-24 w-24 rounded-2xl border-4 object-cover'
                  style={{
                    borderColor: 'var(--card-bg)',
                    background: 'var(--btn-regular-bg)',
                    boxShadow: '0 10px 30px rgba(0,0,0,.14)'
                  }}
                />
                <h2
                  className='mt-3 text-xl font-black'
                  style={{ color: 'var(--deep-text)' }}
                >
                  {ABOUT.name}
                </h2>
                <p
                  className='mt-0.5 text-xs font-semibold tracking-wide'
                  style={{ color: 'var(--content-meta)' }}
                >
                  @{user.login || 'xinrenleiZZY'}
                </p>
                <p
                  className='mt-3 text-sm leading-relaxed'
                  style={{ color: 'var(--content-meta)' }}
                >
                  在 AI 时代解决真实问题，也把过程留给开源社区。
                </p>

                <div
                  className='mt-4 space-y-2 text-xs'
                  style={{ color: 'var(--content-meta)' }}
                >
                  <div className='flex items-center gap-2'>
                    <i
                      className='fas fa-building-columns w-4 text-center'
                      style={{ color: 'var(--primary)' }}
                    />
                    <span>{ABOUT.company}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <i
                      className='fas fa-location-dot w-4 text-center'
                      style={{ color: 'var(--primary)' }}
                    />
                    <span>{ABOUT.location}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <i
                      className='fab fa-github w-4 text-center'
                      style={{ color: 'var(--primary)' }}
                    />
                    <span>{githubYears} 年 GitHub 旅程</span>
                  </div>
                </div>

                <div
                  className='mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border'
                  style={{ borderColor: 'var(--line-divider)' }}
                >
                  {[
                    {
                      label: '公开仓库',
                      value: stats.repos ?? user.public_repos ?? '—'
                    },
                    { label: '累计星标', value: stats.stars ?? '—' },
                    { label: 'GitHub 年', value: githubYears }
                  ].map((item, index) => (
                    <div
                      key={item.label}
                      className='px-1 py-3 text-center'
                      style={{
                        borderLeft: index
                          ? '1px solid var(--line-divider)'
                          : 'none'
                      }}
                    >
                      <div
                        className='text-base font-black'
                        style={{ color: 'var(--primary)' }}
                      >
                        {item.value}
                      </div>
                      <div
                        className='mt-0.5 text-[10px]'
                        style={{ color: 'var(--content-meta)' }}
                      >
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className='space-y-1 border-t px-3 py-3'
                style={{ borderColor: 'var(--line-divider)' }}
              >
                {ABOUT.links.map(link => (
                  <a
                    key={link.label}
                    href={
                      link.label === 'GitHub'
                        ? user.html_url || link.href
                        : link.href
                    }
                    target={
                      link.href.startsWith('mailto:') ? undefined : '_blank'
                    }
                    rel={
                      link.href.startsWith('mailto:')
                        ? undefined
                        : 'noopener noreferrer'
                    }
                    className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs no-underline transition-colors hover:bg-[var(--btn-plain-bg-hover)]'
                    style={{ color: 'var(--content-meta)' }}
                  >
                    <i
                      className={`${link.icon} w-4 text-center`}
                      style={{ color: 'var(--primary)' }}
                    />
                    <span
                      className='font-semibold'
                      style={{ color: 'var(--deep-text)' }}
                    >
                      {link.label}
                    </span>
                    <span className='ml-auto max-w-[120px] truncate opacity-60'>
                      {link.hint}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <div className='min-w-0 space-y-6'>
            <section className='card-base ff-card-shadow rounded-3xl p-6 md:p-8'>
              <SectionHeading eyebrow='ABOUT ME' title='一边构建，一边记录' />
              <p
                className='text-base leading-8 md:text-lg'
                style={{ color: 'var(--deep-text)' }}
              >
                {ABOUT.intro}
              </p>
              <blockquote
                className='mt-6 rounded-2xl px-5 py-4 text-sm leading-relaxed'
                style={{
                  background: 'var(--btn-regular-bg)',
                  color: 'var(--content-meta)'
                }}
              >
                “{ABOUT.quote}”
                <span className='mt-2 block text-[11px] opacity-70'>
                  —— 绫小路清隆
                </span>
              </blockquote>

              <div className='mt-6 grid gap-3 sm:grid-cols-2'>
                <div
                  className='rounded-2xl border p-4'
                  style={{ borderColor: 'var(--line-divider)' }}
                >
                  <div
                    className='text-[10px] font-bold tracking-[0.22em]'
                    style={{ color: 'var(--primary)' }}
                  >
                    CURRENT FOCUS
                  </div>
                  <div
                    className='mt-2 text-sm font-bold'
                    style={{ color: 'var(--deep-text)' }}
                  >
                    {ABOUT.notice.title}
                  </div>
                  <p
                    className='mt-1 text-xs leading-relaxed'
                    style={{ color: 'var(--content-meta)' }}
                  >
                    {ABOUT.notice.body}
                  </p>
                </div>
                <div
                  className='rounded-2xl border p-4'
                  style={{ borderColor: 'var(--line-divider)' }}
                >
                  <div
                    className='text-[10px] font-bold tracking-[0.22em]'
                    style={{ color: 'var(--primary)' }}
                  >
                    WORKING ON
                  </div>
                  <div className='mt-2 flex flex-wrap gap-1.5'>
                    {ABOUT.currentWork.map(item => (
                      <span key={item} className='ff-chip'>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id='projects' className='scroll-mt-24'>
              <SectionHeading
                eyebrow='SELECTED WORK'
                title='精选项目'
                description='优先展示问题、处理流程和技术落地，而不是只罗列仓库名称。'
                action={
                  <a
                    href={user.html_url || 'https://github.com/xinrenleiZZY'}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='ff-chip ff-chip-primary w-fit no-underline'
                  >
                    全部仓库
                    <i className='fas fa-arrow-up-right-from-square text-[9px]' />
                  </a>
                }
              />

              <div className='grid gap-4 md:grid-cols-2'>
                {ABOUT.projects.map((project, index) => (
                  <a
                    key={project.title}
                    href={project.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group card-base ff-card-shadow relative flex min-h-[260px] flex-col overflow-hidden rounded-3xl p-5 no-underline transition-transform duration-300 hover:-translate-y-1 md:p-6'
                    style={{
                      background: `linear-gradient(145deg, color-mix(in srgb, ${project.accent} 16%, var(--card-bg)), var(--card-bg) 62%)`
                    }}
                  >
                    <div
                      className='absolute inset-x-0 top-0 h-1'
                      style={{ background: project.accent }}
                    />
                    <div className='flex items-start justify-between gap-4'>
                      <div>
                        <div
                          className='text-[10px] font-bold tracking-[0.22em]'
                          style={{ color: project.accent }}
                        >
                          {project.eyebrow}
                        </div>
                        <h3
                          className='mt-2 text-xl font-black tracking-tight'
                          style={{ color: 'var(--deep-text)' }}
                        >
                          {project.title}
                        </h3>
                      </div>
                      <span
                        className='grid h-10 w-10 shrink-0 place-items-center rounded-full border text-xs transition-transform duration-300 group-hover:rotate-45'
                        style={{
                          borderColor: 'var(--line-color)',
                          color: project.accent
                        }}
                      >
                        <i className='fas fa-arrow-up-right-from-square' />
                      </span>
                    </div>

                    <p
                      className='mt-5 text-sm leading-relaxed'
                      style={{ color: 'var(--content-meta)' }}
                    >
                      {project.description}
                    </p>

                    <div
                      className='mt-5 rounded-xl border px-3 py-3 font-mono text-[11px]'
                      style={{
                        borderColor: 'var(--line-divider)',
                        background:
                          'color-mix(in srgb, var(--card-bg) 78%, transparent)',
                        color: 'var(--deep-text)'
                      }}
                    >
                      <span style={{ color: project.accent }}>$</span>{' '}
                      {project.result}
                    </div>

                    <div className='mt-auto flex flex-wrap gap-1.5 pt-5'>
                      {project.stack.map(item => (
                        <span key={item} className='ff-chip'>
                          {item}
                        </span>
                      ))}
                      {index < 2 && (
                        <span className='ff-chip ff-chip-primary ml-auto'>
                          Featured
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {moreRepos.length > 0 && (
              <section>
                <SectionHeading
                  eyebrow='MORE REPOSITORIES'
                  title='更多公开仓库'
                  description='来自 GitHub 的实时数据，按最近活跃顺序补充展示。'
                />
                <div className='grid gap-3 sm:grid-cols-2'>
                  {moreRepos.map(repo => (
                    <a
                      key={repo.name}
                      href={repo.html_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='card-base ff-card-shadow group rounded-2xl p-4 no-underline transition-transform duration-200 hover:-translate-y-0.5'
                    >
                      <div className='flex items-center gap-2'>
                        <i
                          className='fas fa-book-bookmark text-[11px]'
                          style={{ color: 'var(--primary)' }}
                        />
                        <h3
                          className='truncate text-sm font-bold'
                          style={{ color: 'var(--deep-text)' }}
                        >
                          {repo.name}
                        </h3>
                        <span
                          className='ml-auto text-[11px]'
                          style={{ color: 'var(--content-meta)' }}
                        >
                          ★ {repo.stars || 0}
                        </span>
                      </div>
                      <p
                        className='mt-2 line-clamp-2 min-h-[2.5em] text-xs leading-relaxed'
                        style={{ color: 'var(--content-meta)' }}
                      >
                        {repo.description || '暂无描述'}
                      </p>
                      <div
                        className='mt-3 flex items-center gap-3 text-[10px]'
                        style={{ color: 'var(--content-meta)' }}
                      >
                        {repo.language && <span>{repo.language}</span>}
                        <span className='ml-auto'>
                          {safeDate(repo.updated_at)}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            <section className='card-base ff-card-shadow rounded-3xl p-6 md:p-8'>
              <SectionHeading
                eyebrow='TOOLBOX'
                title='我常用的技术'
                description='按解决方向组织能力，比单纯统计仓库语言更接近真实工作。'
              />
              <div className='grid gap-3 md:grid-cols-3'>
                {ABOUT.techGroups.map(group => (
                  <div
                    key={group.title}
                    className='rounded-2xl border p-4'
                    style={{
                      borderColor: 'var(--line-divider)',
                      background: 'var(--btn-regular-bg)'
                    }}
                  >
                    <h3
                      className='text-xs font-bold'
                      style={{ color: 'var(--deep-text)' }}
                    >
                      {group.title}
                    </h3>
                    <div className='mt-3 flex flex-wrap gap-1.5'>
                      {group.items.map(item => (
                        <span
                          key={item}
                          className='rounded-lg px-2 py-1 text-[11px] font-semibold'
                          style={{
                            background: 'var(--card-bg)',
                            color: 'var(--btn-content)'
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {recentPosts.length > 0 && (
              <section>
                <SectionHeading
                  eyebrow='LATEST WRITING'
                  title='最近写下的内容'
                  action={
                    <SmartLink
                      href='/archive'
                      className='text-xs font-semibold no-underline'
                      style={{ color: 'var(--primary)' }}
                    >
                      查看归档 ↗
                    </SmartLink>
                  }
                />
                <div className='grid gap-3 md:grid-cols-3'>
                  {recentPosts.map(post => (
                    <a
                      key={post.id || post.slug}
                      href={post.href || `/article/${post.slug}`}
                      className='group card-base ff-card-shadow overflow-hidden rounded-2xl no-underline transition-transform duration-200 hover:-translate-y-0.5'
                    >
                      <div
                        className='h-32 overflow-hidden'
                        style={{ background: 'var(--btn-regular-bg)' }}
                      >
                        {post.pageCoverThumbnail ? (
                          <LazyImage
                            src={post.pageCoverThumbnail}
                            alt=''
                            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                          />
                        ) : (
                          <div className='flex h-full items-center justify-center'>
                            <i className='fas fa-pen-nib text-2xl opacity-30' />
                          </div>
                        )}
                      </div>
                      <div className='p-4'>
                        <div
                          className='text-[10px] font-semibold'
                          style={{ color: 'var(--primary)' }}
                        >
                          {post.category || '修行日志'}
                        </div>
                        <h3
                          className='mt-1 line-clamp-2 text-sm font-bold leading-relaxed'
                          style={{ color: 'var(--deep-text)' }}
                        >
                          {post.title}
                        </h3>
                        <div
                          className='mt-2 text-[10px]'
                          style={{ color: 'var(--content-meta)' }}
                        >
                          {post.publishDay || safeDate(post.publishDate)}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            <section className='overflow-hidden rounded-3xl bg-[linear-gradient(120deg,#0b2e2a_0%,#173b4f_52%,#9d3863_100%)] p-6 text-white md:p-8'>
              <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
                <div className='max-w-2xl'>
                  <div className='text-[10px] font-bold tracking-[0.25em] text-white/60'>
                    DATA · IP · COMPLIANCE
                  </div>
                  <h2 className='mt-2 text-2xl font-black md:text-3xl'>
                    {ABOUT.company}
                  </h2>
                  <p className='mt-3 text-sm leading-relaxed text-white/75'>
                    {ABOUT.companyDescription}
                  </p>
                </div>
                <a
                  href='https://www.jxspace.top'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#10222e] no-underline'
                >
                  了解聚星业务
                  <i className='fas fa-arrow-up-right-from-square text-[10px]' />
                </a>
              </div>
            </section>

            <section className='card-base ff-card-shadow rounded-3xl p-6 md:p-8'>
              <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
                <div>
                  <div
                    className='text-[10px] font-bold tracking-[0.25em]'
                    style={{ color: 'var(--primary)' }}
                  >
                    SAY HELLO
                  </div>
                  <h2
                    className='mt-1 text-2xl font-black'
                    style={{ color: 'var(--deep-text)' }}
                  >
                    有想法，直接聊。
                  </h2>
                  <p
                    className='mt-2 text-sm'
                    style={{ color: 'var(--content-meta)' }}
                  >
                    自动化、企业工具、数据系统，或者只是交换一个有趣的点子。
                  </p>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <a
                    href='mailto:2787326121@qq.com'
                    className='ff-btn-regular px-4 py-2 text-sm no-underline'
                  >
                    <i className='fas fa-envelope' />
                    邮件联系
                  </a>
                  <a
                    href='https://github.com/xinrenleiZZY'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='ff-btn-regular px-4 py-2 text-sm no-underline'
                  >
                    <i className='fab fa-github' />
                    GitHub
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
