'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'

/**
 * 左侧资料卡（Firefly 左栏）
 */
export default function ProfileCard(props) {
  const { siteInfo, categoryOptions, tagOptions } = useGlobal()
  const avatar = siteConfig('AVATAR') || '/avatar.png'
  const author = siteConfig('AUTHOR') || siteInfo?.title || ''
  const bio = siteConfig('BIO') || siteInfo?.description || ''
  const github = siteConfig('GITHUB')
  const email = siteConfig('CONTACT_EMAIL')
  const posts = props.posts || props.allNavPages || []

  const stats = [
    { label: '文章', value: props.postCount || posts.length || 0 },
    {
      label: '分类',
      value: props.categoryOptions?.length || categoryOptions?.length || 0
    },
    { label: '标签', value: props.tagOptions?.length || tagOptions?.length || 0 }
  ]

  return (
    <div className='card-base ff-card-shadow overflow-hidden'>
      <div className='px-5 pt-6 pb-5 text-center'>
        <div className='mx-auto h-24 w-24 overflow-hidden rounded-2xl'>
          <img src={avatar} alt={author} className='h-full w-full object-cover' />
        </div>
        <div className='mt-3 text-base font-bold' style={{ color: 'var(--deep-text)' }}>
          {author}
        </div>
        <div
          className='mt-0.5 text-[0.75rem]'
          style={{ color: 'var(--content-meta)' }}>
          Hello, I&apos;m {author}.
        </div>
        {bio && (
          <p
            className='mt-3 text-[0.8125rem] leading-relaxed'
            style={{ color: 'var(--content-meta)' }}>
            {bio}
          </p>
        )}

        <div className='mt-4 flex items-center gap-2'>
          {github && (
            <a
              href={github}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='github'
              className='ff-btn-regular h-8 w-8 no-underline'>
              <i className='fab fa-github text-xs' />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label='email'
              className='ff-btn-regular h-8 w-8 no-underline'>
              <i className='fas fa-envelope text-xs' />
            </a>
          )}
          <SmartLink
            href='/rss/feed.xml'
            aria-label='rss'
            className='ff-btn-regular h-8 w-8 no-underline'>
            <i className='fas fa-rss text-xs' />
          </SmartLink>
        </div>
      </div>

      <div
        className='grid grid-cols-3'
        style={{ borderTop: '1px solid var(--line-divider)' }}>
        {stats.map(item => (
          <div key={item.label} className='py-3 text-center'>
            <div
              className='text-sm font-bold'
              style={{ color: 'var(--primary)' }}>
              {item.value}
            </div>
            <div
              className='mt-0.5 text-[0.6875rem]'
              style={{ color: 'var(--content-meta)' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
