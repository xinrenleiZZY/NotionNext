import SmartLink from '@/components/SmartLink'
import JOURNAL from '@/conf/journal.config'

export default function JournalHeader({
  category,
  tag,
  postCount = 0,
  posts = []
}) {
  const meta = category
    ? JOURNAL.categories[category] || {
        ...JOURNAL.fallback,
        title: category
      }
    : {
        ...JOURNAL.fallback,
        title: tag ? `标签 · ${tag}` : '文章目录'
      }
  const latest = posts?.[0]?.publishDay

  return (
    <header
      className='relative mb-5 overflow-hidden rounded-[1.75rem] border px-5 py-6 md:px-8 md:py-8'
      style={{
        borderColor: 'var(--line-color)',
        background:
          'linear-gradient(135deg, color-mix(in oklch, var(--card-bg) 96%, transparent), color-mix(in oklch, var(--primary) 8%, transparent))',
        boxShadow: 'var(--shadow-navbar)'
      }}
    >
      <div
        className='pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full border opacity-35'
        style={{ borderColor: 'var(--primary)' }}
      />
      <div
        className='pointer-events-none absolute right-10 top-4 h-24 w-24 rounded-full border opacity-20'
        style={{ borderColor: 'var(--primary)' }}
      />
      <div className='relative max-w-3xl'>
        <p
          className='text-[10px] font-bold uppercase tracking-[0.26em]'
          style={{ color: 'var(--primary)' }}
        >
          {meta.eyebrow}
        </p>
        <div className='mt-2 flex flex-wrap items-center gap-2.5'>
          <h1
            className='text-3xl font-black tracking-tight md:text-5xl'
            style={{ color: 'var(--deep-text)' }}
          >
            {meta.title}
          </h1>
          {category && (
            <span
              className='rounded-full px-2.5 py-1 text-[10px] font-semibold'
              style={{
                background: 'var(--btn-regular-bg)',
                color: 'var(--btn-content)'
              }}
            >
              {category}
            </span>
          )}
        </div>
        <p
          className='mt-3 max-w-2xl text-sm leading-7'
          style={{ color: 'var(--content-meta)' }}
        >
          {meta.description}
        </p>
        <div className='mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]'>
          <span
            className='font-mono tracking-[0.08em]'
            style={{ color: 'var(--content-meta)' }}
          >
            {String(postCount).padStart(2, '0')} 篇记录
          </span>
          {latest && (
            <span
              className='font-mono tracking-[0.08em]'
              style={{ color: 'var(--content-meta)' }}
            >
              LATEST · {latest}
            </span>
          )}
          <span
            className='font-mono tracking-[0.12em]'
            style={{ color: 'var(--primary)' }}
          >
            {meta.accent}
          </span>
          <SmartLink
            href='/archive'
            className='ml-auto font-semibold no-underline'
            style={{ color: 'var(--primary)' }}
          >
            全部归档 →
          </SmartLink>
        </div>
      </div>
    </header>
  )
}
