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
export default function Navbar(props) {
  const { customNav, customMenu, overlay = false } = props
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
        className={`ff-navbar ${overlay && !scrolled ? 'ff-navbar-transparent' : ''}`}>
        <div className='flex h-full w-full items-center gap-2 px-3'>
          {/* Logo */}
          <SmartLink
            href='/'
            className='ff-btn-plain shrink-0 px-2 py-1.5 no-underline'
            style={{ color: overlay && !scrolled ? '#fff' : 'var(--deep-text)' }}>
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
          </SmartLink>

          {/* 桌面菜单 */}
          <nav className='ml-auto mr-auto hidden items-center gap-0.5 lg:flex'>
            {links.map((link, index) => (
              <SmartLink
                key={`${link.href || link.name}-${index}`}
                href={link.href}
                target={link.target}
                className='ff-btn-plain px-3 py-1.5 text-[0.8125rem] font-medium no-underline'
                style={{ color: overlay && !scrolled ? '#fff' : 'var(--content-meta)' }}>
                {link.icon && <i className={`${link.icon} text-[0.75rem]`} />}
                {link.name}
              </SmartLink>
            ))}
          </nav>

          {/* 右侧操作 */}
          <div
            className='ml-auto flex items-center gap-1'
            style={{ color: overlay && !scrolled ? '#fff' : 'var(--content-meta)' }}>
            {searchOpen ? (
              <input
                autoFocus
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyUp={e => {
                  if (e.key === 'Enter') submitSearch()
                  if (e.key === 'Escape') setSearchOpen(false)
                }}
                placeholder={`${locale.NAV.SEARCH}…`}
                className='w-36 rounded-xl px-2 py-1 text-xs outline-none sm:w-48'
                style={{
                  background: 'var(--btn-regular-bg)',
                  color: 'var(--deep-text)'
                }}
              />
            ) : (
              <button
                type='button'
                aria-label={locale.NAV.SEARCH}
                onClick={() => setSearchOpen(true)}
                className='ff-btn-plain h-9 w-9 cursor-pointer'>
                <i className='fas fa-magnifying-glass text-[0.8rem]' />
              </button>
            )}
            <button
              type='button'
              aria-label='dark-mode'
              onClick={toggleDarkMode}
              className='ff-btn-plain h-9 w-9 cursor-pointer'>
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-[0.8rem]`} />
            </button>
            <button
              type='button'
              aria-label='menu'
              onClick={() => setMenuOpen(v => !v)}
              className='ff-btn-plain h-9 w-9 cursor-pointer lg:hidden'>
              <i className={`fas ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-[0.85rem]`} />
            </button>
          </div>
        </div>
      </header>

      {/* 移动端菜单 */}
      {menuOpen && (
        <div
          className='card-base fixed inset-x-3 top-[4.5rem] z-40 grid gap-1 p-2 lg:hidden'
          style={{ boxShadow: 'var(--shadow-navbar)' }}>
          {links.map((link, index) => (
            <SmartLink
              key={`m-${link.href || link.name}-${index}`}
              href={link.href}
              target={link.target}
              onClick={() => setMenuOpen(false)}
              className='ff-btn-plain justify-start px-3 py-2.5 text-sm no-underline'
              style={{ color: 'var(--deep-text)' }}>
              {link.icon && <i className={`${link.icon} text-xs`} />}
              {link.name}
            </SmartLink>
          ))}
        </div>
      )}
    </>
  )
}
