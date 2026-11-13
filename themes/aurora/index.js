'use client'

import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import ArchiveList from './components/ArchiveList'
import ArticleLock from './components/ArticleLock'
import ArticleMeta from './components/ArticleMeta'
import AuroraBackground from './components/AuroraBackground'
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
 * 背景层 + 吸顶玻璃导航 + 主内容 + 页脚
 */
const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading } = useGlobal()
  const router = useRouter()
  const searchModal = useRef(null)
  const isHome = router.pathname === '/'

  return (
    <div id='theme-aurora' className={siteConfig('FONT_STYLE')}>
      <Style />
      <AuroraBackground showVideo={isHome} />

      <div className='relative z-10 flex min-h-screen flex-col'>
        <Header {...props} searchModal={searchModal} />

        <main className='flex-1'>
          <Transition
            show={!onLoading}
            appear={true}
            enter='transition ease-out duration-500'
            enterFrom='opacity-0 translate-y-2'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-200'
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
 * 首页：主视觉 + 文章列表
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
 * 文章列表（首页 / 分类 / 标签 / 分页共用）
 */
const LayoutPostList = props => {
  return <PostList {...props} />
}

/**
 * 搜索页
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
          className: 'text-[var(--aurora-accent)] border-b border-dashed'
        }
      })
    }
  }, [keyword])

  return (
    <>
      <div className='relative z-10 mx-auto w-full max-w-[1180px] px-5 pt-10'>
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
    <section className='relative z-10 mx-auto w-full max-w-[1180px] px-5 pb-24 pt-10'>
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
    siteConfig('AURORA_TOC', true, CONFIG) &&
    !fullWidth &&
    !lock &&
    post?.type !== 'Page' &&
    post?.toc?.length > 0

  if (lock) {
    return <ArticleLock validPassword={validPassword} />
  }

  if (!post) {
    return <Layout404 {...props} />
  }

  return (
    <section className='relative z-10 mx-auto w-full max-w-[1180px] px-5 pb-24 pt-10'>
      <div className='flex items-start gap-8'>
        <article className='min-w-0 flex-1'>
          <div className='aurora-glass px-5 py-8 md:px-10 md:py-12'>
            <ArticleMeta post={post} />
            <div className='aurora-divider my-8' />

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
            <div className='mt-5 grid gap-3 md:grid-cols-2'>
              {prev && (
                <SmartLink
                  href={prev.href}
                  className='aurora-glass aurora-glass-hover block px-5 py-4 no-underline'
                  style={{ color: 'var(--aurora-text-soft)' }}>
                  <div
                    className='text-[11px] tracking-[0.14em] uppercase'
                    style={{ color: 'var(--aurora-text-mute)' }}>
                    ← 上一篇
                  </div>
                  <div
                    className='mt-1 line-clamp-1 text-sm font-semibold'
                    style={{ color: 'var(--aurora-text)' }}>
                    {prev.title}
                  </div>
                </SmartLink>
              )}
              {next && (
                <SmartLink
                  href={next.href}
                  className='aurora-glass aurora-glass-hover block px-5 py-4 text-right no-underline'
                  style={{ color: 'var(--aurora-text-soft)' }}>
                  <div
                    className='text-[11px] tracking-[0.14em] uppercase'
                    style={{ color: 'var(--aurora-text-mute)' }}>
                    下一篇 →
                  </div>
                  <div
                    className='mt-1 line-clamp-1 text-sm font-semibold'
                    style={{ color: 'var(--aurora-text)' }}>
                    {next.title}
                  </div>
                </SmartLink>
              )}
            </div>
          )}

          {post.type !== 'Page' && (
            <div className='aurora-glass mt-5 px-5 py-6 md:px-8'>
              <Comment frontMatter={post} />
            </div>
          )}
        </article>

        {showToc && (
          <aside className='sticky top-24 hidden w-[250px] shrink-0 xl:block'>
            <div className='aurora-glass px-4 py-5'>
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
    <section className='relative z-10 mx-auto flex min-h-[60vh] w-full max-w-[720px] flex-col items-center justify-center px-5 text-center'>
      <div
        className='aurora-accent-text text-[96px] font-extrabold leading-none md:text-[140px]'>
        404
      </div>
      <p
        className='mt-4 text-sm'
        style={{ color: 'var(--aurora-text-soft)' }}>
        {locale.NAV.PAGE_NOT_FOUND}
      </p>
      <SmartLink
        href='/'
        className='aurora-glass aurora-glass-hover mt-8 px-5 py-2.5 text-sm no-underline'
        style={{ color: 'var(--aurora-text)' }}>
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
    <section className='relative z-10 mx-auto w-full max-w-[1180px] px-5 pb-24 pt-12'>
      <h1
        className='text-2xl font-extrabold tracking-tight'
        style={{ color: 'var(--aurora-text)' }}>
        {locale.COMMON.CATEGORY}
      </h1>
      <div className='mt-6 flex flex-wrap gap-2.5'>
        {categoryOptions.map(category => (
          <SmartLink
            key={category.name}
            href={`/category/${category.name}`}
            className='aurora-glass aurora-glass-hover px-4 py-2.5 text-sm no-underline'
            style={{ color: 'var(--aurora-text-soft)' }}>
            {category.name}
            <span style={{ color: 'var(--aurora-text-mute)' }}>
              {' '}
              {category.count}
            </span>
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
    <section className='relative z-10 mx-auto w-full max-w-[1180px] px-5 pb-24 pt-12'>
      <h1
        className='text-2xl font-extrabold tracking-tight'
        style={{ color: 'var(--aurora-text)' }}>
        {locale.COMMON.TAGS}
      </h1>
      <div className='mt-6 flex flex-wrap gap-2'>
        {tagOptions.map(tag => (
          <SmartLink
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className='aurora-pill no-underline transition-colors duration-200 hover:bg-[var(--aurora-accent-soft)]'>
            #{tag.name}
            {tag.count ? (
              <span style={{ color: 'var(--aurora-text-mute)' }}>
                {tag.count}
              </span>
            ) : null}
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

/**
 * 仪表盘（占用页面由 Notion 内容渲染）
 */
const LayoutDashboard = props => {
  const { post } = props
  return (
    <section className='relative z-10 mx-auto w-full max-w-[1180px] px-5 pb-24 pt-10'>
      <div className='aurora-glass px-5 py-8 md:px-10 md:py-12'>
        {post ? <NotionPage post={post} /> : null}
      </div>
    </section>
  )
}

/**
 * 登录 / 注册 / 授权回调：本项目未启用会员体系，给出轻量占位
 */
const LayoutSignIn = () => <AuthPlaceholder text='登录功能未启用' />
const LayoutSignUp = () => <AuthPlaceholder text='注册功能未启用' />
const LayoutAuth = () => <AuthPlaceholder text='授权结果页' />

const AuthPlaceholder = ({ text }) => (
  <section className='relative z-10 mx-auto flex min-h-[50vh] w-full max-w-[560px] items-center px-5'>
    <div
      className='aurora-glass w-full px-6 py-10 text-center text-sm'
      style={{ color: 'var(--aurora-text-soft)' }}>
      {text}
    </div>
  </section>
)

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
