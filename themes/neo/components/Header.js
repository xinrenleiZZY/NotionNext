'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const isVisible = link => !!link && link.show !== false

/**
 * Neo 顶部导航：粗黑边贴纸条
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
  if (customNav?.length) links = links.concat(customNav)
  if (siteConfig('CUSTOM_MENU') && customMenu?.length) links = customMenu
  links = (links || []).filter(isVisible)

  const submitSearch = () => {
    const value = keyword.trim()
    if (!value) return
    setSearchOpen(false)
    router.push({ pathname: `/search/${encodeURIComponent(value)}` })
  }

  return (
    <header className='sticky top-0 z-30'>
      <div className='mx-auto w-full max-w-[1120px] px-4 pt-4 md:px-6'>
        <div className='neo-card flex items-center gap-3 px-4 py-2.5'>
          <SmartLink
            href='/'
            className='flex shrink-0 items-center gap-2 no-underline'>
            <span className='neo-chip neo-chip-yellow text-[13px]'>
              {siteConfig('TITLE') || 'NEO'}
            </span>
          </SmartLink>

          <nav className='ml-auto hidden items-center gap-1.5 md:flex'>
            {links.map((link, index) => (
              <SmartLink
                key={`${link.href || link.name}-${index}`}
                href={link.href}
                target={link.target}
                className='neo-chip neo-hover no-underline'
                style={{ fontSize: '12px' }}>
                {link.name}
              </SmartLink>
            ))}
          </nav>

          <div className='ml-auto flex items-center gap-1.5 md:ml-0'>
            <button
              type='button'
              aria-label={locale.NAV.SEARCH}
              onClick={() => setSearchOpen(v => !v)}
              className='neo-chip neo-hover cursor-pointer'
              style={{ padding: '6px 10px' }}>
              🔍
            </button>
            <button
              type='button'
              aria-label='dark-mode'
              onClick={toggleDarkMode}
              className='neo-chip neo-hover cursor-pointer'
              style={{ padding: '6px 10px' }}>
              {isDarkMode ? '☀' : '☾'}
            </button>
            <button
              type='button'
              aria-label='menu'
              onClick={() => setMenuOpen(v => !v)}
              className='neo-chip neo-hover cursor-pointer md:hidden'
              style={{ padding: '6px 10px' }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className='neo-card mt-3 flex items-center gap-2 px-3 py-2'>
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
              style={{ color: 'var(--neo-ink)' }}
            />
            <button
              type='button'
              onClick={submitSearch}
              className='neo-btn'
              style={{ padding: '5px 12px', fontSize: '11px' }}>
              GO
            </button>
          </div>
        )}

        {menuOpen && (
          <div className='neo-card mt-3 grid gap-1.5 p-3 md:hidden'>
            {links.map((link, index) => (
              <SmartLink
                key={`m-${link.href || link.name}-${index}`}
                href={link.href}
                target={link.target}
                onClick={() => setMenuOpen(false)}
                className='neo-chip no-underline'
                style={{ justifyContent: 'flex-start', fontSize: '12px' }}>
                {link.name}
              </SmartLink>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
