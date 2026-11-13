'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const isVisible = link => !!link && link.show !== false

/**
 * Aurora 顶部导航
 * 玻璃吸顶条：品牌 + 菜单 + 搜索 + 深色切换
 */
export default function Header(props) {
  const { customNav, customMenu } = props
  const { locale, isDarkMode, toggleDarkMode } = useGlobal()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const onRouteChange = () => setMenuOpen(false)
    router.events.on('routeChangeStart', onRouteChange)
    return () => router.events.off('routeChangeStart', onRouteChange)
  }, [router])

  const builtinLinks = [
    { name: locale.NAV.ARCHIVE, href: '/archive' },
    { name: locale.COMMON.CATEGORY, href: '/category' },
    { name: locale.COMMON.TAGS, href: '/tag' }
  ]

  let links = builtinLinks
  if (customNav?.length) {
    links = links.concat(customNav)
  }
  if (siteConfig('CUSTOM_MENU') && customMenu?.length) {
    links = customMenu
  }
  links = (links || []).filter(isVisible)

  const submitSearch = () => {
    const value = keyword.trim()
    if (!value) return
    setSearchOpen(false)
    router.push({ pathname: `/search/${encodeURIComponent(value)}` })
  }

  const title = siteConfig('TITLE') || 'AURORA'

  return (
    <header className='sticky top-0 z-30'>
      <div className='mx-auto w-full max-w-[1180px] px-4 md:px-6'>
        <div className='aurora-glass mt-3 flex h-14 items-center gap-3 px-4 md:mt-4'>
          {/* 品牌 */}
          <SmartLink
            href='/'
            className='flex shrink-0 items-center gap-2.5 no-underline'>
            <span
              className='h-6 w-6 rounded-full'
              style={{
                background:
                  'linear-gradient(135deg, var(--aurora-accent), var(--aurora-accent-2))',
                boxShadow: '0 0 18px var(--aurora-accent-soft)'
              }}
            />
            <span
              className='max-w-[42vw] truncate text-[15px] font-extrabold tracking-tight'
              style={{ color: 'var(--aurora-text)' }}>
              {title}
            </span>
          </SmartLink>

          {/* 桌面菜单 */}
          <nav className='ml-auto hidden items-center gap-1 md:flex'>
            {links.map((link, index) => (
              <SmartLink
                key={`${link.href || link.name}-${index}`}
                href={link.href}
                target={link.target}
                className='rounded-full px-3 py-1.5 text-[13px] no-underline transition-colors duration-200 hover:bg-[var(--aurora-accent-soft)]'
                style={{ color: 'var(--aurora-text-soft)' }}>
                {link.name}
              </SmartLink>
            ))}
          </nav>

          {/* 操作区 */}
          <div
            className='ml-auto flex items-center gap-1 md:ml-0'
            style={{ color: 'var(--aurora-text-soft)' }}>
            <button
              type='button'
              aria-label={locale.NAV.SEARCH}
              onClick={() => setSearchOpen(v => !v)}
              className='grid h-9 w-9 place-items-center rounded-full transition-colors duration-200 hover:bg-[var(--aurora-accent-soft)]'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'>
                <circle cx='11' cy='11' r='7' />
                <path d='m20 20-3.5-3.5' />
              </svg>
            </button>
            <button
              type='button'
              aria-label={locale.MENU?.DARK_MODE || 'dark-mode'}
              onClick={toggleDarkMode}
              className='grid h-9 w-9 place-items-center rounded-full transition-colors duration-200 hover:bg-[var(--aurora-accent-soft)]'>
              {isDarkMode ? (
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'>
                  <circle cx='12' cy='12' r='4' />
                  <path d='M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4' />
                </svg>
              ) : (
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'>
                  <path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z' />
                </svg>
              )}
            </button>
            <button
              type='button'
              aria-label='menu'
              onClick={() => setMenuOpen(v => !v)}
              className='grid h-9 w-9 place-items-center rounded-full transition-colors duration-200 hover:bg-[var(--aurora-accent-soft)] md:hidden'>
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'>
                {menuOpen ? (
                  <path d='M6 6l12 12M18 6L6 18' />
                ) : (
                  <path d='M4 7h16M4 12h16M4 17h16' />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 搜索条 */}
        {searchOpen && (
          <div className='aurora-glass mt-2 flex items-center gap-2 px-4 py-2'>
            <input
              autoFocus
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyUp={e => {
                if (e.key === 'Enter') submitSearch()
                if (e.key === 'Escape') setSearchOpen(false)
              }}
              placeholder={`${locale.NAV.SEARCH}…`}
              className='w-full bg-transparent text-sm outline-none'
              style={{ color: 'var(--aurora-text)' }}
            />
            <button
              type='button'
              onClick={submitSearch}
              className='shrink-0 rounded-full px-3 py-1 text-xs font-semibold'
              style={{
                color: 'var(--aurora-text)',
                background: 'var(--aurora-accent-soft)'
              }}>
              {locale.NAV.SEARCH}
            </button>
          </div>
        )}

        {/* 移动端菜单 */}
        {menuOpen && (
          <div className='aurora-glass mt-2 grid gap-1 p-2 md:hidden'>
            {links.map((link, index) => (
              <SmartLink
                key={`m-${link.href || link.name}-${index}`}
                href={link.href}
                target={link.target}
                onClick={() => setMenuOpen(false)}
                className='rounded-xl px-3 py-2.5 text-sm no-underline transition-colors duration-200 hover:bg-[var(--aurora-accent-soft)]'
                style={{ color: 'var(--aurora-text-soft)' }}>
                {link.name}
              </SmartLink>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
