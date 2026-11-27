'use client'

import LazyImage from '@/components/LazyImage'
import replaceSearchResult from '@/components/Mark'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { formatDateFmt } from '@/lib/utils/formatDate'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Catalog from './components/Catalog'
import ConstellationHomeHero from '@/components/ConstellationHomeHero'
import MotionLayer from './components/MotionLayer'
import Navbar from './components/Navbar'
import PostList from './components/PostList'
import ProfileCard from './components/ProfileCard'
import SideWidgets from './components/SideWidgets'
import CONFIG from './config'
import { Style } from './style'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false })

const PAGE = 'max-w-[var(--page-width)]'

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
    <footer className='mt-10 px-3 pb-8'>
      <div
        className={`mx-auto flex w-full ${PAGE} flex-col items-center justify-between gap-2 text-[0.75rem] md:flex-row`}
        style={{ color: 'var(--content-meta)' }}
      >
        <div className='flex flex-wrap items-center gap-2'>
          <span>© {range}</span>
          <span style={{ color: 'var(--deep-text)' }}>{author}</span>
          <span>·</span>
          <span>Powered by NotionNext</span>
        </div>
        <div className='flex items-center gap-3'>
          {enableRss && (
            <SmartLink
              href='/rss/feed.xml'
              className='no-underline'
              style={{ color: 'inherit' }}
            >
              {locale.NAV.RSS}
            </SmartLink>
          )}
          {beiAn && (
            <a
              href={beiAnLink || 'https://beian.miit.gov.cn/'}
              target='_blank'
              rel='noopener noreferrer'
              className='no-underline'
              style={{ color: 'inherit' }}
            >
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
      className='ff-btn-regular fixed bottom-6 right-5 z-30 h-10 w-10 cursor-pointer rounded-full'
      style={{ boxShadow: 'var(--shadow-navbar)' }}
    >
      <i className='fas fa-angle-up' />
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
    <div className='card-base mb-4 flex items-center gap-2 px-4 py-2.5'>
      <i
        className='fas fa-magnifying-glass text-xs'
        style={{ color: 'var(--content-meta)' }}
      />
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
        style={{ color: 'var(--deep-text)' }}
      />
      <button
        type='button'
        onClick={submit}
        className='ff-btn-regular cursor-pointer px-3 py-1 text-xs'
      >
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
      <div className='card-base ff-card-shadow w-full px-6 py-8 text-center'>
        <div
          className='text-sm font-bold'
          style={{ color: 'var(--deep-text)' }}
        >
          {locale.COMMON.ARTICLE_LOCK_TIPS}
        </div>
        <div className='mt-5 flex gap-2'>
          <input
            ref={inputRef}
            type='password'
            onKeyDown={e => {
              if (e.key === 'Enter') submit()
            }}
            className='w-full rounded-xl px-3 py-2 text-sm outline-none'
            style={{
              background: 'var(--btn-regular-bg)',
              color: 'var(--deep-text)'
            }}
          />
          <button
            type='button'
            onClick={submit}
            className='ff-btn-regular cursor-pointer px-4'
          >
            {locale.COMMON.SUBMIT}
          </button>
        </div>
        {error && (
          <div className='mt-3 text-xs font-bold' style={{ color: '#ef4444' }}>
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
        style={{ color: 'var(--deep-text)' }}
      >
        {siteConfig('POST_TITLE_ICON') && (
          <span className='mr-2 inline-block align-middle'>
            <NotionIcon icon={post.pageIcon} />
          </span>
        )}
        {post.title}
      </h1>
      {!isPage && (
        <div
          className='mt-4 flex flex-wrap items-center gap-2 text-[0.75rem]'
          style={{ color: 'var(--content-meta)' }}
        >
          <span className='flex items-center gap-1'>
            <i className='fas fa-user text-[0.7rem]' />
            {siteConfig('AUTHOR')}
          </span>
          {post.publishDay && (
            <SmartLink
              href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
              className='flex items-center gap-1 no-underline'
              style={{ color: 'inherit' }}
            >
              <i className='fas fa-calendar-days text-[0.7rem]' />
              {post.publishDay}
            </SmartLink>
          )}
          {post.lastEditedDay && (
            <span className='flex items-center gap-1'>
              <i className='fas fa-clock-rotate-left text-[0.7rem]' />
              {locale.COMMON.LAST_EDITED_TIME} {post.lastEditedDay}
            </span>
          )}
          {post.category && (
            <SmartLink
              href={`/category/${post.category}`}
              className='ff-chip no-underline'
            >
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
              className='ff-chip no-underline'
              style={{ fontSize: '0.6875rem' }}
            >
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
      <div
        className='card-base px-6 py-16 text-center text-sm'
        style={{ color: 'var(--content-meta)' }}
      >
        {locale.COMMON.NO_RESULTS_FOUND}
      </div>
    )
  }
  return (
    <div className='grid gap-4'>
      {groups.map(group => {
        const posts = archivePosts[group] || []
        return (
          <section key={group} className='card-base ff-card-shadow px-5 py-4'>
            <div className='mb-2 flex items-center gap-2'>
              <span className='ff-section-title'>{group}</span>
              <span className='ff-chip'>{posts.length}</span>
            </div>
            <div className='space-y-0.5'>
              {posts.map(post => (
                <SmartLink
                  key={post.id}
                  href={post.href}
                  className='flex items-baseline justify-between gap-4 rounded-lg px-2 py-1.5 no-underline transition-colors duration-150 hover:bg-[var(--btn-plain-bg-hover)]'
                  style={{ color: 'var(--content-meta)' }}
                >
                  <span className='truncate text-[0.8125rem]'>
                    {post.title}
                  </span>
                  <span className='shrink-0 text-[0.6875rem]'>
                    {post.publishDay}
                  </span>
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
  const router = useRouter()
  const searchModal = useRef(null)
  const isHome = router.pathname === '/'
  const isAbout = router.pathname === '/apps/about'
  const isConstellationPage = isHome || isAbout
  const hasBanner =
    isConstellationPage && siteConfig('FIREFLY_BANNER', true, CONFIG)
  const hue = siteConfig('FIREFLY_HUE', 165, CONFIG)
  const wallpaper = siteConfig('FIREFLY_WALLPAPER', '', CONFIG)
  const wallpaperOpacity = Number(
    siteConfig('FIREFLY_WALLPAPER_OPACITY', 0.28, CONFIG)
  )
  const wallpaperBlur = Number(siteConfig('FIREFLY_WALLPAPER_BLUR', 2, CONFIG))

  return (
    <div
      id='theme-firefly'
      className={`${siteConfig('FONT_STYLE')} ${
        isConstellationPage ? 'ff-space-page' : ''
      }`}
      style={{ '--hue': hue }}
    >
      <Style />
      <MotionLayer />

      {isConstellationPage && (
        <div className='ff-space-ambient' aria-hidden='true'>
          <img src='/banner/starfield.webp' alt='' />
        </div>
      )}

      {/* 可替换的全站背景图 */}
      {wallpaper && (
        <div className='ff-wallpaper' aria-hidden='true'>
          <img
            src={encodeURI(String(wallpaper))}
            alt=''
            style={{
              opacity: Number.isFinite(wallpaperOpacity)
                ? wallpaperOpacity
                : 0.28,
              filter: `blur(${Number.isFinite(wallpaperBlur) ? wallpaperBlur : 2}px)`
            }}
          />
        </div>
      )}

      <Navbar
        {...props}
        overlay={hasBanner}
        constellationMode={isConstellationPage}
      />

      <div className='relative z-10 flex min-h-screen flex-col'>
        <main className={`flex-1 ${hasBanner ? '' : 'pt-[4.75rem]'}`}>
          <Transition
            show={!onLoading}
            appear={true}
            enter='transition ease-out duration-300'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            unmount={false}
          >
            <div>
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
  const showLeft = siteConfig('FIREFLY_LEFT_SIDEBAR', true, CONFIG)
  const showRight = siteConfig('FIREFLY_RIGHT_SIDEBAR', true, CONFIG)
  return (
    <>
      {siteConfig('FIREFLY_BANNER', true, CONFIG) && (
        <ConstellationHomeHero {...props} />
      )}
      <section
        id='home-feed'
        className={`mx-auto w-full ${PAGE} scroll-mt-[5rem] px-3 pb-16 pt-5`}
      >
        <div className='grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[260px_minmax(0,1fr)_280px]'>
          {showLeft && (
            <div className='hidden xl:block'>
              <div className='sticky top-[4.75rem]'>
                <ProfileCard {...props} />
              </div>
            </div>
          )}
          <div className='min-w-0'>
            <PostList {...props} />
          </div>
          {showRight && (
            <div className='hidden md:block'>
              <div className='sticky top-[4.75rem]'>
                <SideWidgets {...props} />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

const LayoutPostList = props => {
  return (
    <section className={`mx-auto w-full ${PAGE} px-3 pb-16 pt-4`}>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_260px]'>
        <div className='min-w-0'>
          <PostList {...props} />
        </div>
        <div className='hidden md:block'>
          <div className='sticky top-[4.75rem]'>
            <SideWidgets {...props} />
          </div>
        </div>
      </div>
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
          className: 'bg-[var(--selection-bg)] rounded px-1'
        }
      })
    }
  }, [keyword])
  return (
    <section className={`mx-auto w-full ${PAGE} px-3 pb-16 pt-4`}>
      <SearchInput {...props} />
      <PostList {...props} hideTabs />
    </section>
  )
}

const LayoutArchive = props => {
  return (
    <section className={`mx-auto w-full ${PAGE} px-3 pb-16 pt-4`}>
      <ArchiveList archivePosts={props.archivePosts} />
    </section>
  )
}

const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next } = props
  const { fullWidth } = useGlobal()
  const showToc =
    siteConfig('FIREFLY_TOC', true, CONFIG) &&
    !fullWidth &&
    !lock &&
    post?.type !== 'Page' &&
    post?.toc?.length > 0

  if (lock) return <ArticleLock validPassword={validPassword} />
  if (!post) return <Layout404 />

  return (
    <section className={`mx-auto w-full ${PAGE} px-3 pb-16 pt-4`}>
      <div className='flex items-start gap-4'>
        <article className='min-w-0 flex-1'>
          <div className='card-base ff-card-shadow px-5 py-7 md:px-8 md:py-9'>
            {post.pageCover && (
              <div
                className='mb-6 w-full overflow-hidden rounded-xl'
                style={{ aspectRatio: '16 / 7' }}
              >
                <LazyImage
                  src={post.pageCover}
                  alt={post.title || ''}
                  priority
                  className='h-full w-full object-cover'
                />
              </div>
            )}
            <ArticleMeta post={post} />
            <div
              className='my-6 h-px w-full'
              style={{ background: 'var(--line-divider)' }}
            />
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
            <div className='mt-4 grid gap-3 md:grid-cols-2'>
              {prev && (
                <SmartLink
                  href={prev.href}
                  className='card-base ff-card-shadow block px-4 py-3 no-underline'
                >
                  <div
                    className='text-[0.6875rem]'
                    style={{ color: 'var(--content-meta)' }}
                  >
                    <i className='fas fa-angle-left mr-1' /> 上一篇
                  </div>
                  <div
                    className='mt-1 line-clamp-1 text-[0.8125rem] font-semibold'
                    style={{ color: 'var(--deep-text)' }}
                  >
                    {prev.title}
                  </div>
                </SmartLink>
              )}
              {next && (
                <SmartLink
                  href={next.href}
                  className='card-base ff-card-shadow block px-4 py-3 text-right no-underline'
                >
                  <div
                    className='text-[0.6875rem]'
                    style={{ color: 'var(--content-meta)' }}
                  >
                    下一篇 <i className='fas fa-angle-right ml-1' />
                  </div>
                  <div
                    className='mt-1 line-clamp-1 text-[0.8125rem] font-semibold'
                    style={{ color: 'var(--deep-text)' }}
                  >
                    {next.title}
                  </div>
                </SmartLink>
              )}
            </div>
          )}

          {post.type !== 'Page' && (
            <div className='card-base ff-card-shadow mt-4 px-4 py-6 md:px-7'>
              <Comment frontMatter={post} />
            </div>
          )}
        </article>

        {showToc && (
          <aside className='sticky top-[4.75rem] hidden w-[240px] shrink-0 xl:block'>
            <div className='card-base ff-card-shadow px-4 py-4'>
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
        style={{ color: 'var(--primary)' }}
      >
        404
      </div>
      <p className='mt-3 text-sm' style={{ color: 'var(--content-meta)' }}>
        {locale.NAV.PAGE_NOT_FOUND}
      </p>
      <SmartLink
        href='/'
        className='ff-btn-regular mt-6 px-4 py-2 text-sm no-underline'
      >
        返回首页
      </SmartLink>
    </section>
  )
}

const LayoutCategoryIndex = ({ categoryOptions = [] }) => {
  const { locale } = useGlobal()
  return (
    <section className={`mx-auto w-full ${PAGE} px-3 pb-16 pt-6`}>
      <h1
        className='mb-5 text-2xl font-extrabold'
        style={{ color: 'var(--deep-text)' }}
      >
        {locale.COMMON.CATEGORY}
      </h1>
      <div className='flex flex-wrap gap-2'>
        {categoryOptions.map(category => (
          <SmartLink
            key={category.name}
            href={`/category/${category.name}`}
            className='card-base ff-card-shadow px-4 py-2.5 text-sm font-semibold no-underline'
            style={{ color: 'var(--deep-text)' }}
          >
            {category.name}
            <span className='ml-1.5' style={{ color: 'var(--primary)' }}>
              {category.count}
            </span>
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

const LayoutTagIndex = ({ tagOptions = [] }) => {
  const { locale } = useGlobal()
  return (
    <section className={`mx-auto w-full ${PAGE} px-3 pb-16 pt-6`}>
      <h1
        className='mb-5 text-2xl font-extrabold'
        style={{ color: 'var(--deep-text)' }}
      >
        {locale.COMMON.TAGS}
      </h1>
      <div className='flex flex-wrap gap-2'>
        {tagOptions.map(tag => (
          <SmartLink
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className='ff-chip no-underline'
            style={{ fontSize: '0.8125rem', height: '1.75rem' }}
          >
            #{tag.name}
            {tag.count ? <span className='opacity-60'>{tag.count}</span> : null}
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

const LayoutDashboard = props => {
  const { post } = props
  return (
    <section className={`mx-auto w-full ${PAGE} px-3 pb-16 pt-4`}>
      <div className='card-base ff-card-shadow px-5 py-7 md:px-8 md:py-9'>
        {post ? <NotionPage post={post} /> : null}
      </div>
    </section>
  )
}

const AuthPlaceholder = ({ text }) => (
  <section className='relative z-10 mx-auto flex min-h-[50vh] w-full max-w-[520px] items-center px-4'>
    <div
      className='card-base w-full px-6 py-10 text-center text-sm'
      style={{ color: 'var(--content-meta)' }}
    >
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
