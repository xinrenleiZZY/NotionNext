'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'

/**
 * 首页右侧栏：资料卡 + 分类 + 标签 + 最新文章
 */
export default function SideBar(props) {
  const { locale, siteInfo, categoryOptions, tagOptions } = useGlobal()
  const avatar = siteConfig('AVATAR') || '/avatar.png'
  const title = siteInfo?.title || siteConfig('TITLE')
  const bio = siteInfo?.description || siteConfig('BIO')
  const author = siteConfig('AUTHOR')
  const posts = props.posts || props.allNavPages || []
  const latest = posts.slice(0, 5)
  const categories = categoryOptions || props.categoryOptions || []
  const tags = (tagOptions || props.tagOptions || []).slice(0, 18)

  return (
    <aside className='hidden w-[300px] shrink-0 lg:block'>
      <div className='sticky top-24 space-y-4'>
        {/* 资料卡 */}
        <div className='mz-surface px-5 py-6 text-center'>
          <div
            className='mx-auto h-20 w-20 overflow-hidden'
            style={{
              borderRadius: '999px',
              border: '3px solid var(--mz-primary-container)'
            }}>
            <img src={avatar} alt={author} className='h-full w-full object-cover' />
          </div>
          <div
            className='mt-3 text-base font-bold'
            style={{ color: 'var(--mz-on-surface)' }}>
            {author || title}
          </div>
          {bio && (
            <p
              className='mt-2 text-[12px] leading-relaxed'
              style={{ color: 'var(--mz-on-surface-variant)' }}>
              {bio}
            </p>
          )}
        </div>

        {/* 分类 */}
        {categories.length > 0 && (
          <div className='mz-surface px-5 py-5'>
            <div
              className='mb-3 text-[12px] font-bold uppercase tracking-[0.14em]'
              style={{ color: 'var(--mz-on-surface-variant)' }}>
              {locale.COMMON.CATEGORY}
            </div>
            <div className='flex flex-wrap gap-2'>
              {categories.map(category => (
                <SmartLink
                  key={category.name}
                  href={`/category/${category.name}`}
                  className='mz-chip no-underline transition-colors duration-200 hover:bg-[var(--mz-primary-container)]'
                  style={{ color: 'var(--mz-on-surface-variant)' }}>
                  {category.name}
                  <span style={{ opacity: 0.6 }}>{category.count}</span>
                </SmartLink>
              ))}
            </div>
          </div>
        )}

        {/* 标签 */}
        {tags.length > 0 && (
          <div className='mz-surface px-5 py-5'>
            <div
              className='mb-3 text-[12px] font-bold uppercase tracking-[0.14em]'
              style={{ color: 'var(--mz-on-surface-variant)' }}>
              {locale.COMMON.TAGS}
            </div>
            <div className='flex flex-wrap gap-2'>
              {tags.map(tag => (
                <SmartLink
                  key={tag.name}
                  href={`/tag/${encodeURIComponent(tag.name)}`}
                  className='mz-chip no-underline transition-colors duration-200 hover:bg-[var(--mz-secondary)] hover:text-white'
                  style={{ color: 'var(--mz-on-surface-variant)' }}>
                  #{tag.name}
                </SmartLink>
              ))}
            </div>
          </div>
        )}

        {/* 最新文章 */}
        {latest.length > 0 && (
          <div className='mz-surface px-5 py-5'>
            <div
              className='mb-3 text-[12px] font-bold uppercase tracking-[0.14em]'
              style={{ color: 'var(--mz-on-surface-variant)' }}>
              {locale.COMMON.LATEST_POSTS}
            </div>
            <div className='space-y-2.5'>
              {latest.map(post => (
                <SmartLink
                  key={post.id}
                  href={post.href}
                  className='block no-underline'>
                  <div
                    className='line-clamp-2 text-[13px] font-medium leading-snug transition-colors duration-200 hover:text-[var(--mz-primary)]'
                    style={{ color: 'var(--mz-on-surface)' }}>
                    {post.title}
                  </div>
                  <div
                    className='mt-0.5 text-[11px]'
                    style={{ color: 'var(--mz-on-surface-variant)' }}>
                    {post.publishDay}
                  </div>
                </SmartLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
