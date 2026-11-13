'use client'

import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import ArchiveList from './components/ArchiveList'
import ArticleLock from './components/ArticleLock'
import ArticleMeta from './components/ArticleMeta'
import BackToTop from './components/BackToTop'
import Catalog from './components/Catalog'
import Footer from './components/Footer'
import Header from './components/Header'
import HomeHero from './components/HomeHero'
import PostList from './components/PostList'
import SearchInput from './components/SearchInput'
import CONFIG from './config'
import { Style } from './style'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false })

/**
 * 基础布局
 */
const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading } = useGlobal()
  const searchModal = useRef(null)

  return (
    <div id='theme-neo' className={siteConfig('FONT_STYLE')}>
      <Style />

      <div className='relative z-10 flex min-h-screen flex-col'>
        <Header {...props} searchModal={searchModal} />

        <main className='flex-1'>
          <Transition
            show={!onLoading}
            appear={true}
            enter='transition ease-out duration-300'
            enterFrom='opacity-0 translate-x-2'
            enterTo='opacity-100 translate-x-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            unmount={false}>
            <div>
              {slotTop}
              {children}
            </div>
          </Transition>
        </main>

        <Footer {...props} />
      </div>

      <BackToTop />
      <AlgoliaSearchModal cRef={searchModal} {...props} />
    </div>
  )
}

/**
 * 首页
 */
const LayoutIndex = props => {
  return (
    <>
      <HomeHero {...props} />
      <PostList {...props} />
    </>
  )
}

/**
 * 列表（分类 / 标签 / 分页）
 */
const LayoutPostList = props => {
  return <PostList {...props} />
}

/**
 * 搜索
 */
const LayoutSearch = props => {
  const { keyword } = props

  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'bg-[var(--neo-yellow)] text-black px-1'
        }
      })
    }
  }, [keyword])

  return (
    <>
      <div className='relative z-10 mx-auto w-full max-w-[1120px] px-4 pt-8 md:px-6'>
        <SearchInput {...props} />
      </div>
      <PostList {...props} />
    </>
  )
}

/**
 * 归档
 */
const LayoutArchive = props => {
  return (
    <section className='relative z-10 mx-auto w-full max-w-[1120px] px-4 pb-24 pt-8 md:px-6'>
      <ArchiveList archivePosts={props.archivePosts} />
    </section>
  )
}

/**
 * 文章详情
 */
const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next } = props
  const { fullWidth } = useGlobal()
  const showToc =
    siteConfig('NEO_TOC', true, CONFIG) &&
    !fullWidth &&
    !lock &&
    post?.type !== 'Page' &&
    post?.toc?.length > 0

  if (lock) {
    return <ArticleLock validPassword={validPassword} />
  }

  if (!post) {
    return <Layout404 />
  }

  return (
    <section className='relative z-10 mx-auto w-full max-w-[1120px] px-4 pb-24 pt-8 md:px-6'>
      <div className='flex items-start gap-6'>
        <article className='min-w-0 flex-1'>
          <div className='neo-card px-5 py-7 md:px-9 md:py-10'>
            <ArticleMeta post={post} />
            <div className='neo-rule my-7' />
            <div id='article-wrapper'>
              <NotionPage post={post} />
            </div>
            {post.type !== 'Page' && (
              <div className='mt-8'>
                <ShareBar post={post} />
              </div>
            )}
          </div>

          {(prev || next) && (
            <div className='mt-5 grid gap-4 md:grid-cols-2'>
              {prev && (
                <SmartLink
                  href={prev.href}
                  className='neo-card neo-hover block px-4 py-3 no-underline'
                  style={{ color: 'var(--neo-ink-soft)' }}>
                  <div
                    className='text-[10px] font-black uppercase tracking-[0.14em]'
                    style={{ color: 'var(--neo-ink-mute)' }}>
                    ← PREV
                  </div>
                  <div
                    className='mt-1 line-clamp-1 text-[13px] font-bold'
                    style={{ color: 'var(--neo-ink)' }}>
                    {prev.title}
                  </div>
                </SmartLink>
              )}
              {next && (
                <SmartLink
                  href={next.href}
                  className='neo-card neo-hover block px-4 py-3 text-right no-underline'
                  style={{ color: 'var(--neo-ink-soft)' }}>
                  <div
                    className='text-[10px] font-black uppercase tracking-[0.14em]'
                    style={{ color: 'var(--neo-ink-mute)' }}>
                    NEXT →
                  </div>
                  <div
                    className='mt-1 line-clamp-1 text-[13px] font-bold'
                    style={{ color: 'var(--neo-ink)' }}>
                    {next.title}
                  </div>
                </SmartLink>
              )}
            </div>
          )}

          {post.type !== 'Page' && (
            <div className='neo-card mt-5 px-4 py-6 md:px-7'>
              <Comment frontMatter={post} />
            </div>
          )}
        </article>

        {showToc && (
          <aside className='sticky top-24 hidden w-[240px] shrink-0 xl:block'>
            <div className='neo-card px-4 py-4'>
              <Catalog post={post} />
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}

/**
 * 404
 */
const Layout404 = () => {
  const { locale } = useGlobal()
  return (
    <section className='relative z-10 mx-auto flex min-h-[60vh] w-full max-w-[680px] flex-col items-center justify-center px-4 text-center'>
      <div
        className='text-[92px] font-black leading-none md:text-[140px]'
        style={{ color: 'var(--neo-ink)', textShadow: '8px 8px 0 var(--neo-yellow)' }}>
        404
      </div>
      <p
        className='mt-5 text-sm font-bold'
        style={{ color: 'var(--neo-ink-soft)' }}>
        {locale.NAV.PAGE_NOT_FOUND}
      </p>
      <SmartLink href='/' className='neo-btn mt-7 no-underline'>
        返回首页
      </SmartLink>
    </section>
  )
}

/**
 * 分类总览
 */
const LayoutCategoryIndex = ({ categoryOptions = [] }) => {
  const { locale } = useGlobal()
  return (
    <section className='relative z-10 mx-auto w-full max-w-[1120px] px-4 pb-24 pt-10 md:px-6'>
      <h1
        className='text-2xl font-black uppercase tracking-tight'
        style={{ color: 'var(--neo-ink)' }}>
        {locale.COMMON.CATEGORY}
      </h1>
      <div className='mt-6 flex flex-wrap gap-2.5'>
        {categoryOptions.map(category => (
          <SmartLink
            key={category.name}
            href={`/category/${category.name}`}
            className='neo-card neo-hover px-4 py-2.5 text-sm font-bold no-underline'
            style={{ color: 'var(--neo-ink)' }}>
            {category.name}
            <span style={{ color: 'var(--neo-ink-mute)' }}> {category.count}</span>
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

/**
 * 标签总览
 */
const LayoutTagIndex = ({ tagOptions = [] }) => {
  const { locale } = useGlobal()
  return (
    <section className='relative z-10 mx-auto w-full max-w-[1120px] px-4 pb-24 pt-10 md:px-6'>
      <h1
        className='text-2xl font-black uppercase tracking-tight'
        style={{ color: 'var(--neo-ink)' }}>
        {locale.COMMON.TAGS}
      </h1>
      <div className='mt-6 flex flex-wrap gap-2'>
        {tagOptions.map(tag => (
          <SmartLink
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className='neo-chip neo-hover no-underline'
            style={{ textTransform: 'none', fontSize: '12px' }}>
            #{tag.name}
            {tag.count ? (
              <span style={{ color: 'var(--neo-ink-mute)' }}>{tag.count}</span>
            ) : null}
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

/**
 * 仪表盘
 */
const LayoutDashboard = props => {
  const { post } = props
  return (
    <section className='relative z-10 mx-auto w-full max-w-[1120px] px-4 pb-24 pt-8 md:px-6'>
      <div className='neo-card px-5 py-7 md:px-9 md:py-10'>
        {post ? <NotionPage post={post} /> : null}
      </div>
    </section>
  )
}

const AuthPlaceholder = ({ text }) => (
  <section className='relative z-10 mx-auto flex min-h-[50vh] w-full max-w-[520px] items-center px-4'>
    <div
      className='neo-card w-full px-6 py-10 text-center text-sm font-bold'
      style={{ color: 'var(--neo-ink-soft)' }}>
      {text}
    </div>
  </section>
)

const LayoutSignIn = () => <AuthPlaceholder text='登录功能未启用' />
const LayoutSignUp = () => <AuthPlaceholder text='注册功能未启用' />
const LayoutAuth = () => <AuthPlaceholder text='授权结果页' />

export {
  Layout404,
  LayoutArchive,
  LayoutAuth,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutDashboard,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSignIn,
  LayoutSignUp,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
