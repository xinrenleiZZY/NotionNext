'use client'

import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'

/**
 * 右侧栏 Widgets（Firefly 右栏）：最新动态 / 站点统计 / 分类 / 标签
 */
export default function SideWidgets(props) {
  const { locale, siteInfo, categoryOptions, tagOptions } = useGlobal()
  const posts = props.posts || props.allNavPages || []
  const latest = posts.slice(0, 5)
  const categories = (categoryOptions || props.categoryOptions || []).slice(0, 8)
  const tags = (tagOptions || props.tagOptions || []).slice(0, 16)

  const Card = ({ title, children, action }) => (
    <div className='card-base ff-card-shadow px-4 py-4'>
      <div className='mb-3 flex items-center justify-between'>
        <span className='ff-section-title'>{title}</span>
        {action}
      </div>
      {children}
    </div>
  )

  return (
    <div className='flex flex-col gap-4'>
      {/* 最新动态 */}
      {latest.length > 0 && (
        <Card
          title='最新动态'
          action={
            <SmartLink
              href='/archive'
              className='text-[0.6875rem] no-underline'
              style={{ color: 'var(--primary)' }}>
              {locale.COMMON.MORE}
            </SmartLink>
          }>
          <div className='space-y-2.5'>
            {latest.map(post => (
              <SmartLink
                key={post.id}
                href={post.href}
                className='block border-l-2 pl-2.5 no-underline transition-colors duration-150'
                style={{ borderColor: 'var(--primary)' }}>
                <div
                  className='line-clamp-2 text-[0.8125rem] font-medium leading-snug'
                  style={{ color: 'var(--deep-text)' }}>
                  {post.title}
                </div>
                <div
                  className='mt-0.5 text-[0.6875rem]'
                  style={{ color: 'var(--content-meta)' }}>
                  {post.publishDay}
                </div>
              </SmartLink>
            ))}
          </div>
        </Card>
      )}

      {/* 站点统计 */}
      <Card title='站点统计'>
        <div className='space-y-1.5 text-[0.8125rem]'>
          {[
            { label: locale.COMMON.POSTS, value: props.postCount || posts.length || 0 },
            {
              label: locale.COMMON.CATEGORY,
              value: categoryOptions?.length || props.categoryOptions?.length || 0
            },
            {
              label: locale.COMMON.TAGS,
              value: tagOptions?.length || props.tagOptions?.length || 0
            }
          ].map(row => (
            <div key={row.label} className='flex items-center justify-between'>
              <span style={{ color: 'var(--content-meta)' }}>{row.label}</span>
              <span className='font-semibold' style={{ color: 'var(--primary)' }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 分类 */}
      {categories.length > 0 && (
        <Card title={locale.COMMON.CATEGORY}>
          <div className='flex flex-wrap gap-1.5'>
            {categories.map(category => (
              <SmartLink
                key={category.name}
                href={`/category/${category.name}`}
                className='ff-chip no-underline'
                style={{ fontSize: '0.6875rem' }}>
                {category.name}
                <span className='opacity-60'>{category.count}</span>
              </SmartLink>
            ))}
          </div>
        </Card>
      )}

      {/* 标签 */}
      {tags.length > 0 && (
        <Card title={locale.COMMON.TAGS}>
          <div className='flex flex-wrap gap-1.5'>
            {tags.map(tag => (
              <SmartLink
                key={tag.name}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                className='ff-chip no-underline'
                style={{ fontSize: '0.6875rem' }}>
                #{tag.name}
              </SmartLink>
            ))}
          </div>
        </Card>
      )}

      <div
        className='text-center text-[0.6875rem]'
        style={{ color: 'var(--content-meta)' }}>
        {siteInfo?.title || ''}
      </div>
    </div>
  )
}
