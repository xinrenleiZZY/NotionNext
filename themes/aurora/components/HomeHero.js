'use client'

import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

/**
 * 首页主视觉
 * 大标题 + 简介 + 统计胶囊，不抢列表的注意力
 */
export default function HomeHero(props) {
  const { locale, categoryOptions, tagOptions } = useGlobal()
  const title = siteConfig('TITLE')
  const bio = siteConfig('BIO')
  const author = siteConfig('AUTHOR')
  const showStats = siteConfig('AURORA_HERO_STATS', true, CONFIG)

  const postCount =
    props.postCount || props.allNavPages?.length || props.posts?.length || 0
  const categoryCount =
    props.categoryOptions?.length || categoryOptions?.length || 0
  const tagCount = props.tagOptions?.length || tagOptions?.length || 0

  return (
    <section className='relative z-10 mx-auto w-full max-w-[1180px] px-5 pb-6 pt-12 md:pt-20'>
      <div className='aurora-pill mb-6'>
        <span
          className='h-1.5 w-1.5 rounded-full'
          style={{ background: 'var(--aurora-accent)' }}
        />
        <span className='tracking-[0.18em] uppercase'>
          {author || 'AURORA'}
        </span>
      </div>

      <h1
        className='max-w-4xl text-4xl font-extrabold leading-[1.15] tracking-tight md:text-6xl'
        style={{ color: 'var(--aurora-text)' }}>
        <span className='aurora-accent-text'>{title}</span>
      </h1>

      {bio && (
        <p
          className='mt-5 max-w-2xl text-base leading-relaxed md:text-lg'
          style={{ color: 'var(--aurora-text-soft)' }}>
          {bio}
        </p>
      )}

      {showStats && (
        <div className='mt-8 flex flex-wrap items-center gap-2.5'>
          <span className='aurora-pill'>
            {postCount} {locale.COMMON.POSTS}
          </span>
          <span className='aurora-pill'>
            {locale.COMMON.CATEGORY} {categoryCount}
          </span>
          <span className='aurora-pill'>
            {locale.COMMON.TAGS} {tagCount}
          </span>
        </div>
      )}

      <div className='aurora-divider mt-10' />
    </section>
  )
}
