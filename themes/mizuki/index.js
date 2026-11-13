'use client'

import LazyImage from '@/components/LazyImage'
import replaceSearchResult from '@/components/Mark'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Banner from './components/Banner'
import Catalog from './components/Catalog'
import Header from './components/Header'
import PostList from './components/PostList'
import Sakura from './components/Sakura'
import SideBar from './components/SideBar'
import CONFIG from './config'
import { Style } from './style'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false })

/* ============================================================
   公共小部件
   ============================================================ */

const Footer = () => {
  const { locale } = useGlobal()
  const author = siteConfig('AUTHOR')
  const since = siteConfig('SINCE')
  const year = new Date().getFullYear()
  const startYear = Number(since) > 1900 ? Number(since) : year
  const range = startYear < year ? `${startYear}-${year}` : `${year}`
  const beiAn = siteConfig('BEI_AN')
  const beiAnLink = siteConfig('BEI_AN_LINK')
  const enableRss = siteConfig('ENABLE_RSS')

  return (
    <footer className='relative z-10 mt-10 px-4 pb-10 md:px-6'>
      <div className='mx-auto flex w-full max-w-[var(--layout-page-width)] flex-col items-center justify-between gap-2 text-[12px] md:flex-row'
        style={{ color: 'var(--mz-on-surface-variant)' }}>
        <div className='flex flex-wrap items-center gap-2'>
          <span>© {range}</span>
          <span style={{ color: 'var(--mz-on-surface)' }}>{author}</span>
          <span>·</span>
          <span>Powered by NotionNext</span>
        </div>
        <div className='flex items-center gap-3'>
          {enableRss && (
            <SmartLink href='/rss/feed.xml' className='no-underline' style={{ color: 'inherit' }}>
              {locale.NAV.RSS}
            </SmartLink>
          )}
          {beiAn && (
            <a
              href={beiAnLink || 'https://beian.miit.gov.cn/'}
              target='_blank'
              rel='noopener noreferrer'
              className='no-underline'
              style={{ color: 'inherit' }}>
              {beiAn}
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}

const BackToTop = () => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!visible) return null
  return (
    <button
      type='button'
      aria-label='back to top'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='mz-fab fixed bottom-6 right-5 z-30 h-12 w-12 cursor-pointer text-lg'
      style={{ color: 'var(--mz-on-primary-container)' }}>
      ↑
    </button>
  )
}

const SearchInput = ({ keyword }) => {
  const router = useRouter()
  const [value, setValue] = useState(keyword || '')
  const submit = () => {
    const key = String(value || '').trim()
    if (!key) return
    router.push({ pathname: `/search/${encodeURIComponent(key)}` })
  }
  return (
    <div className='mz-surface mb-5 flex items-center gap-2 px-4 py-2.5'>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyUp={e => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') setValue('')
        }}
        autoComplete='off'
        placeholder='输入关键词后回车'
        className='w-full bg-transparent text-sm outline-none'
        style={{ color: 'var(--mz-on-surface)' }}
      />
      <button type='button' onClick={submit} className='mz-chip mz-chip-primary cursor-pointer'>
        搜索
      </button>
    </div>
  )
}

const ArticleLock = ({ validPassword }) => {
  const { locale } = useGlobal()
  const inputRef = useRef(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  const submit = () => setError(!validPassword(inputRef.current?.value))
  return (
    <div className='relative z-10 mx-auto flex min-h-[50vh] w-full max-w-[460px] items-center px-4'>
      <div className='mz-surface w-full px-6 py-8 text-center'>
        <div className='text-sm font-bold' style={{ color: 'var(--mz-on-surface)' }}>
          {locale.COMMON.ARTICLE_LOCK_TIPS}
        </div>
        <div className='mt-5 flex gap-2'>
          <input
            ref={inputRef}
            type='password'
            onKeyDown={e => {
              if (e.key === 'Enter') submit()
            }}
            className='w-full px-3 py-2 text-sm outline-none'
            style={{
              color: 'var(--mz-on-surface)',
              background: 'var(--mz-surface-container-high)',
              border: '1px solid var(--mz-outline)',
              borderRadius: '999px'
            }}
          />
          <button
            type='button'
            onClick={submit}
            className='mz-chip mz-chip-primary cursor-pointer px-4'>
            {locale.COMMON.SUBMIT}
          </button>
        </div>
        {error && (
          <div className='mt-3 text-xs font-bold' style={{ color: '#e11d48' }}>
            {locale.COMMON.PASSWORD_ERROR}
          </div>
        )}
      </div>
    </div>
  )
}

const ArticleMeta = ({ post }) => {
  const { locale } = useGlobal()
  if (!post) return null
  const isPage = post.type === 'Page'
  return (
    <header>
      <h1
        className='text-2xl font-extrabold leading-tight tracking-tight md:text-4xl'
        style={{ color: 'var(--mz-on-surface)' }}>
        {siteConfig('POST_TITLE_ICON') && (
          <span className='mr-2 inline-block align-middle'>
            <NotionIcon icon={post.pageIcon} />
          </span>
        )}
        {post.title}
      </h1>
      {!isPage && (
        <div className='mt-4 flex flex-wrap items-center gap-2'>
          <span className='mz-chip mz-chip-primary'>{siteConfig('AUTHOR')}</span>
          {post.publishDay && (
            <SmartLink
              href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
              className='mz-chip no-underline'>
              {post.publishDay}
            </SmartLink>
          )}
          {post.lastEditedDay && (
            <span className='mz-chip'>
              {locale.COMMON.LAST_EDITED_TIME} {post.lastEditedDay}
            </span>
          )}
          {post.category && (
            <SmartLink
              href={`/category/${post.category}`}
              className='mz-chip no-underline'>
              {post.category}
            </SmartLink>
          )}
        </div>
      )}
      {post.tags?.length > 0 && (
        <div className='mt-2.5 flex flex-wrap gap-1.5'>
          {post.tags.map(t => (
            <SmartLink
              key={t}
              href={`/tag/${encodeURIComponent(t)}`}
              className='mz-chip no-underline'
              style={{ fontSize: '10px' }}>
              #{t}
            </SmartLink>
          ))}
        </div>
      )}
    </header>
  )
}

const ArchiveList = ({ archivePosts }) => {
  const { locale } = useGlobal()
  const groups = Object.keys(archivePosts || {})
  if (!groups.length) {
    return (
      <div className='mz-surface px-6 py-16 text-center text-sm'
        style={{ color: 'var(--mz-on-surface-variant)' }}>
        {locale.COMMON.NO_RESULTS_FOUND}
      </div>
    )
  }
  return (
    <div className='space-y-4'>
      {groups.map(group => {
        const posts = archivePosts[group] || []
        return (
          <section key={group} className='mz-surface px-5 py-4'>
            <div className='mb-2 flex items-center gap-2'>
              <h2 className='text-sm font-bold' style={{ color: 'var(--mz-on-surface)' }}>
                {group}
              </h2>
              <span className='mz-chip'>{posts.length}</span>
            </div>
            <div className='space-y-0.5'>
              {posts.map(post => (
                <SmartLink
                  key={post.id}
                  href={post.href}
                  className='flex items-baseline justify-between gap-4 rounded-xl px-2 py-1.5 no-underline transition-colors duration-150 hover:bg-[var(--mz-surface-container-high)]'
                  style={{ color: 'var(--mz-on-surface-variant)' }}>
                  <span className='truncate text-[13px]'>{post.title}</span>
                  <span className='shrink-0 text-[11px]'>{post.publishDay}</span>
                </SmartLink>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

/* ============================================================
   布局
   ============================================================ */

const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading } = useGlobal()
  const searchModal = useRef(null)
  const router = useRouter()
  const isHome = router.pathname === '/'
  const hasBanner = isHome && siteConfig('MIZUKI_BANNER', true, CONFIG)
  const hue = siteConfig('MIZUKI_HUE', 345, CONFIG)

  return (
    <div
      id='theme-mizuki'
      className={siteConfig('FONT_STYLE')}
      style={{ '--hue': hue }}>
      <Style />
      <div className='mz-top-highlight' aria-hidden='true' />
      <Sakura />

      <div className='relative z-10 flex min-h-screen flex-col'>
        <Header {...props} overlay={hasBanner} />

        <main className='flex-1'>
          <Transition
            show={!onLoading}
            appear={true}
            enter='transition ease-out duration-400'
            enterFrom='opacity-0 translate-y-2'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            unmount={false}>
            <div style={hasBanner ? { marginTop: '-4.5rem' } : undefined}>
              {slotTop}
              {children}
            </div>
          </Transition>
        </main>

        <Footer />
      </div>

      <BackToTop />
      <AlgoliaSearchModal cRef={searchModal} {...props} />
    </div>
  )
}

const LayoutIndex = props => {
  const showSidebar = siteConfig('MIZUKI_SIDEBAR', true, CONFIG)
  return (
    <>
      {siteConfig('MIZUKI_BANNER', true, CONFIG) && <Banner {...props} />}
      <section className='relative z-10 mx-auto w-full max-w-[var(--layout-page-width)] px-4 pb-24 pt-8 md:px-6'>
        <div className='flex items-start gap-6'>
          <PostList {...props} />
          {showSidebar && <SideBar {...props} />}
        </div>
      </section>
    </>
  )
}

const LayoutPostList = props => {
  return (
    <section className='relative z-10 mx-auto w-full max-w-[var(--layout-page-width)] px-4 pb-24 pt-8 md:px-6'>
      <PostList {...props} />
    </section>
  )
}

const LayoutSearch = props => {
  const { keyword } = props
  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'bg-[var(--mz-primary-container)] text-[var(--mz-on-primary-container)] px-1 rounded'
        }
      })
    }
  }, [keyword])
  return (
    <section className='relative z-10 mx-auto w-full max-w-[var(--layout-page-width)] px-4 pb-24 pt-8 md:px-6'>
      <SearchInput {...props} />
      <PostList {...props} />
    </section>
  )
}

const LayoutArchive = props => {
  return (
    <section className='relative z-10 mx-auto w-full max-w-[980px] px-4 pb-24 pt-8 md:px-6'>
      <ArchiveList archivePosts={props.archivePosts} />
    </section>
  )
}

const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next } = props
  const { fullWidth } = useGlobal()
  const showToc =
    siteConfig('MIZUKI_TOC', true, CONFIG) &&
    !fullWidth &&
    !lock &&
    post?.type !== 'Page' &&
    post?.toc?.length > 0

  if (lock) return <ArticleLock validPassword={validPassword} />
  if (!post) return <Layout404 />

  return (
    <section className='relative z-10 mx-auto w-full max-w-[var(--layout-page-width)] px-4 pb-24 pt-8 md:px-6'>
      <div className='flex items-start gap-6'>
        <article className='min-w-0 flex-1'>
          <div className='mz-card px-5 py-7 md:px-9 md:py-10'>
            {post.pageCover && (
              <div
                className='mb-6 w-full overflow-hidden'
                style={{
                  borderRadius: 'var(--mz-radius)',
                  aspectRatio: '16 / 7',
                  background: 'var(--mz-surface-container-high)'
                }}>
                <LazyImage
                  src={post.pageCover}
                  alt={post.title || ''}
                  priority
                  className='h-full w-full object-cover'
                />
              </div>
            )}
            <ArticleMeta post={post} />
            <div className='my-7 h-px w-full' style={{ background: 'var(--mz-outline)' }} />
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
                <SmartLink href={prev.href} className='mz-surface mz-card block px-4 py-3 no-underline'>
                  <div className='text-[11px] font-semibold' style={{ color: 'var(--mz-on-surface-variant)' }}>
                    ← 上一篇
                  </div>
                  <div className='mt-1 line-clamp-1 text-[13px] font-semibold' style={{ color: 'var(--mz-on-surface)' }}>
                    {prev.title}
                  </div>
                </SmartLink>
              )}
              {next && (
                <SmartLink href={next.href} className='mz-surface mz-card block px-4 py-3 text-right no-underline'>
                  <div className='text-[11px] font-semibold' style={{ color: 'var(--mz-on-surface-variant)' }}>
                    下一篇 →
                  </div>
                  <div className='mt-1 line-clamp-1 text-[13px] font-semibold' style={{ color: 'var(--mz-on-surface)' }}>
                    {next.title}
                  </div>
                </SmartLink>
              )}
            </div>
          )}

          {post.type !== 'Page' && (
            <div className='mz-surface mt-5 px-4 py-6 md:px-7'>
              <Comment frontMatter={post} />
            </div>
          )}
        </article>

        {showToc && (
          <aside className='sticky top-24 hidden w-[250px] shrink-0 xl:block'>
            <div className='mz-surface px-4 py-5'>
              <Catalog post={post} />
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}

const Layout404 = () => {
  const { locale } = useGlobal()
  return (
    <section className='relative z-10 mx-auto flex min-h-[60vh] w-full max-w-[680px] flex-col items-center justify-center px-4 text-center'>
      <div
        className='text-[96px] font-extrabold leading-none md:text-[140px]'
        style={{ color: 'var(--mz-primary)' }}>
        404
      </div>
      <p className='mt-3 text-sm' style={{ color: 'var(--mz-on-surface-variant)' }}>
        {locale.NAV.PAGE_NOT_FOUND}
      </p>
      <SmartLink href='/' className='mz-chip mz-chip-primary mt-6 no-underline px-4'>
        返回首页
      </SmartLink>
    </section>
  )
}

const LayoutCategoryIndex = ({ categoryOptions = [] }) => {
  const { locale } = useGlobal()
  return (
    <section className='relative z-10 mx-auto w-full max-w-[var(--layout-page-width)] px-4 pb-24 pt-10 md:px-6'>
      <h1 className='text-2xl font-extrabold' style={{ color: 'var(--mz-on-surface)' }}>
        {locale.COMMON.CATEGORY}
      </h1>
      <div className='mt-5 flex flex-wrap gap-2'>
        {categoryOptions.map(category => (
          <SmartLink
            key={category.name}
            href={`/category/${category.name}`}
            className='mz-surface mz-card px-4 py-2.5 text-sm font-semibold no-underline'
            style={{ color: 'var(--mz-on-surface)' }}>
            {category.name}
            <span style={{ color: 'var(--mz-on-surface-variant)' }}> {category.count}</span>
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

const LayoutTagIndex = ({ tagOptions = [] }) => {
  const { locale } = useGlobal()
  return (
    <section className='relative z-10 mx-auto w-full max-w-[var(--layout-page-width)] px-4 pb-24 pt-10 md:px-6'>
      <h1 className='text-2xl font-extrabold' style={{ color: 'var(--mz-on-surface)' }}>
        {locale.COMMON.TAGS}
      </h1>
      <div className='mt-5 flex flex-wrap gap-2'>
        {tagOptions.map(tag => (
          <SmartLink
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className='mz-chip no-underline transition-colors duration-200 hover:bg-[var(--mz-primary-container)]'>
            #{tag.name}
            {tag.count ? <span style={{ opacity: 0.6 }}>{tag.count}</span> : null}
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

const LayoutDashboard = props => {
  const { post } = props
  return (
    <section className='relative z-10 mx-auto w-full max-w-[var(--layout-page-width)] px-4 pb-24 pt-8 md:px-6'>
      <div className='mz-card px-5 py-7 md:px-9 md:py-10'>
        {post ? <NotionPage post={post} /> : null}
      </div>
    </section>
  )
}

const AuthPlaceholder = ({ text }) => (
  <section className='relative z-10 mx-auto flex min-h-[50vh] w-full max-w-[520px] items-center px-4'>
    <div className='mz-surface w-full px-6 py-10 text-center text-sm'
      style={{ color: 'var(--mz-on-surface-variant)' }}>
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
