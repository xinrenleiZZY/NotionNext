'use client'

import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

/**
 * 首页主视觉：超大字 + 马克笔高亮 + 贴纸统计
 */
export default function HomeHero(props) {
  const { locale, categoryOptions, tagOptions } = useGlobal()
  const title = siteConfig('TITLE')
  const bio = siteConfig('BIO')
  const author = siteConfig('AUTHOR')
  const showStats = siteConfig('NEO_HERO_STATS', true, CONFIG)

  const postCount =
    props.postCount || props.allNavPages?.length || props.posts?.length || 0
  const categoryCount =
    props.categoryOptions?.length || categoryOptions?.length || 0
  const tagCount = props.tagOptions?.length || tagOptions?.length || 0

  return (
    <section className='relative z-10 mx-auto w-full max-w-[1120px] px-4 pb-8 pt-10 md:px-6 md:pt-16'>
      <div className='mb-5 flex flex-wrap items-center gap-2'>
        <span className='neo-chip neo-chip-blue'>
          {author || 'NEO BRUTAL'}
        </span>
        <span className='neo-chip'>PERSONAL BLOG</span>
      </div>

      <h1
        className='text-4xl font-black uppercase leading-[1.05] tracking-tight md:text-6xl'
        style={{ color: 'var(--neo-ink)' }}>
        <span className='neo-mark'>{title}</span>
      </h1>

      {bio && (
        <p
          className='mt-6 max-w-2xl text-sm font-medium leading-relaxed md:text-base'
          style={{ color: 'var(--neo-ink-soft)' }}>
          {bio}
        </p>
      )}

      {showStats && (
        <div className='mt-8 flex flex-wrap items-center gap-2.5'>
          <span className='neo-chip neo-chip-yellow'>
            {postCount} {locale.COMMON.POSTS}
          </span>
          <span className='neo-chip'>
            {locale.COMMON.CATEGORY} {categoryCount}
          </span>
          <span className='neo-chip'>
            {locale.COMMON.TAGS} {tagCount}
          </span>
        </div>
      )}

      <div className='neo-rule mt-10' />
    </section>
  )
}
