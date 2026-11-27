'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const isVisible = link => !!link && link.show !== false

/**
 * Firefly 顶栏：玻璃胶囊（源码 navbar.css）
 * 首页覆盖 banner 时透明，滚动后变实底
 */
/**
 * 去掉菜单标题开头重复的 emoji / 符号（Notion 菜单本身已有图标设计）
 * 例："🔗 仙盟友链" → "仙盟友链"，"ℹ️ 关于本尊" → "关于本尊"
 */
const cleanMenuName = name =>
  String(name || '')
    .replace(
      /^[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{200D}\u{20E3}\u2600-\u27BF\s]+/gu,
      ''
    )
    .trim()
export default function Navbar(props) {
  const {
    customNav,
    customMenu,
    overlay = false,
    constellationMode = false
  } = props
  const { locale, isDarkMode, toggleDarkMode, siteInfo } = useGlobal()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = () => setMenuOpen(false)
    router.events.on('routeChangeStart', close)
    return () => router.events.off('routeChangeStart', close)
  }, [router])

  let links = [
    { name: locale.NAV.INDEX, href: '/', icon: 'fas fa-house' },
    { name: locale.NAV.ARCHIVE, href: '/archive', icon: 'fas fa-box-archive' },
    { name: locale.COMMON.CATEGORY, href: '/category', icon: 'fas fa-folder' },
    { name: locale.COMMON.TAGS, href: '/tag', icon: 'fas fa-tags' }
  ]
  if (customNav?.length) links = links.concat(customNav)
  if (siteConfig('CUSTOM_MENU') && customMenu?.length) links = customMenu
  links = (links || []).filter(isVisible)

  const submitSearch = () => {
    const value = keyword.trim()
    if (!value) return
    setSearchOpen(false)
    router.push({ pathname: `/search/${encodeURIComponent(value)}` })
  }

  const title = siteInfo?.title || siteConfig('TITLE') || 'Firefly'

  return (
    <>
      <header
        className={`ff-navbar ${overlay && !scrolled ? 'ff-navbar-transparent' : ''}`}
      >
        <div className='flex h-full w-full items-center gap-2 px-3'>
          {/* Logo */}
          <SmartLink
            href='/'
            className='ff-btn-plain shrink-0 px-2 py-1.5 no-underline'
            style={{
              color: overlay && !scrolled ? '#fff' : 'var(--deep-text)'
            }}
          >
            {overlay && !scrolled ? (
              <span className='ff-wordmark'>
                Zenyth
                <span className='ff-wordmark-badge'>2026</span>
              </span>
            ) : (
              <>
                <img
                  src={siteConfig('BLOG_LOGO')}
                  alt=''
                  width={24}
                  height={24}
                  draggable={false}
                  className='h-6 w-6 shrink-0 rounded-full object-cover'
                  style={{ boxShadow: '0 0 0 1px var(--line-divider)' }}
                />
                <span className='max-w-[38vw] truncate text-[0.9rem] font-bold'>
                  {title}
                </span>
              </>
            )}
          </SmartLink>

          {/* 桌面菜单：强制单行，放不下时横向滚动（不换行、不压 banner） */}
          <nav
            className='mx-auto hidden min-w-0 flex-1 flex-nowrap items-center justify-center gap-0.5 overflow-x-auto overflow-y-hidden lg:flex'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {links.map((link, index) => (
              <SmartLink
                key={`${link.href || link.name}-${index}`}
                href={link.href}
                target={link.target}
                className='ff-btn-plain shrink-0 whitespace-nowrap px-2 py-1.5 text-[0.8125rem] font-medium no-underline xl:px-2.5'
                style={{
                  color: overlay && !scrolled ? '#fff' : 'var(--content-meta)'
                }}
              >
                {link.name}
              </SmartLink>
            ))}
          </nav>

          {/* 右侧操作：搜索浮层，避免撑开导航导致位移 */}
          <div
            className='relative ml-auto flex shrink-0 items-center gap-1'
            style={{
              color: overlay && !scrolled ? '#fff' : 'var(--content-meta)'
            }}
          >
            <button
              type='button'
              aria-label={locale.NAV.SEARCH}
              onClick={() => setSearchOpen(v => !v)}
              className='ff-btn-plain h-9 w-9 cursor-pointer'
            >
              <i
                className={`fas ${searchOpen ? 'fa-xmark' : 'fa-magnifying-glass'} text-[0.8rem]`}
              />
            </button>

            {searchOpen && (
              <div
                className='absolute right-0 top-[2.6rem] z-50 w-[min(20rem,80vw)] rounded-2xl p-2'
                style={{
                  background: 'var(--float-panel-bg)',
                  boxShadow: '0 0 0 1px var(--line-color), var(--shadow-navbar)'
                }}
              >
                <input
                  autoFocus
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onKeyUp={e => {
                    if (e.key === 'Enter') submitSearch()
                    if (e.key === 'Escape') setSearchOpen(false)
                  }}
                  placeholder={`${locale.NAV.SEARCH}…`}
                  className='w-full rounded-xl px-3 py-2 text-sm outline-none'
                  style={{
                    background: 'var(--btn-regular-bg)',
                    color: 'var(--deep-text)'
                  }}
                />
              </div>
            )}

            {constellationMode ? (
              <button
                type='button'
                aria-label={isDarkMode ? '切换为亮色主题' : '切换为暗色主题'}
                aria-pressed={isDarkMode}
                onClick={toggleDarkMode}
                className='ff-theme-orb'
              >
                <span className='ff-theme-orb-core' aria-hidden='true' />
              </button>
            ) : (
              <button
                type='button'
                aria-label='dark-mode'
                onClick={toggleDarkMode}
                className='ff-btn-plain h-9 w-9 cursor-pointer'
              >
                <i
                  className={`fas ${
                    isDarkMode ? 'fa-sun' : 'fa-moon'
                  } text-[0.8rem]`}
                />
              </button>
            )}
            <button
              type='button'
              aria-label='menu'
              onClick={() => setMenuOpen(v => !v)}
              className='ff-btn-plain h-9 w-9 cursor-pointer lg:hidden'
            >
              <i
                className={`fas ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-[0.85rem]`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* 移动端菜单 */}
      {menuOpen && (
        <div
          className='card-base fixed inset-x-3 top-[4.5rem] z-40 grid gap-1 p-2 lg:hidden'
          style={{ boxShadow: 'var(--shadow-navbar)' }}
        >
          {links.map((link, index) => (
            <SmartLink
              key={`m-${link.href || link.name}-${index}`}
              href={link.href}
              target={link.target}
              onClick={() => setMenuOpen(false)}
              className='ff-btn-plain justify-start px-3 py-2.5 text-sm no-underline'
              style={{ color: 'var(--deep-text)' }}
            >
              {link.name}
            </SmartLink>
          ))}
        </div>
      )}
    </>
  )
}
