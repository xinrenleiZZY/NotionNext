'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const isVisible = link => !!link && link.show !== false

/**
 * Mizuki 顶栏
 *  - 高度 4.5rem，最大宽度 --layout-page-width
 *  - 首页覆盖在 banner 上时透明，滚动后变成 card-bg
 */
export default function Header(props) {
  const { customNav, customMenu, overlay = false } = props
  const { locale, isDarkMode, toggleDarkMode, siteInfo } = useGlobal()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onRouteChange = () => setMenuOpen(false)
    router.events.on('routeChangeStart', onRouteChange)
    return () => router.events.off('routeChangeStart', onRouteChange)
  }, [router])

  let links = [
    { name: locale.NAV.ARCHIVE, href: '/archive' },
    { name: locale.COMMON.CATEGORY, href: '/category' },
    { name: locale.COMMON.TAGS, href: '/tag' }
  ]
  if (customNav?.length) links = links.concat(customNav)
  if (siteConfig('CUSTOM_MENU') && customMenu?.length) links = customMenu
  links = (links || []).filter(isVisible)

  const transparent = overlay && !scrolled
  const textColor = transparent ? '#ffffff' : 'var(--deep-text)'

  return (
    <header
      className='sticky top-0 z-50 w-full transition-colors duration-300'
      style={{
        background: transparent ? 'transparent' : 'var(--card-bg)',
        boxShadow: transparent ? 'none' : '0 1px 0 var(--line-divider)'
      }}>
      <div
        className='mx-auto flex h-[4.5rem] items-center justify-between px-4'
        style={{ maxWidth: 'var(--layout-page-width)' }}>
        <SmartLink href='/' className='flex min-w-0 items-center gap-2 no-underline'>
          <span
            className='h-8 w-8 shrink-0 rounded-lg'
            style={{
              background:
                'linear-gradient(135deg, var(--primary), var(--btn-regular-bg-hover))'
            }}
          />
          <span
            className='truncate text-[15px] font-bold'
            style={{ color: textColor }}>
            {siteInfo?.title || siteConfig('TITLE')}
          </span>
        </SmartLink>

        <nav className='hidden items-center gap-1 md:flex'>
          {links.map((link, index) => (
            <SmartLink
              key={`${link.href || link.name}-${index}`}
              href={link.href}
              target={link.target}
              className='btn-plain px-3 py-1.5 text-[14px] font-medium no-underline'
              style={{ color: textColor }}>
              {link.name}
            </SmartLink>
          ))}
        </nav>

        <div className='flex items-center gap-1'>
          <SmartLink
            href='/search'
            aria-label={locale.NAV.SEARCH}
            className='btn-plain h-10 w-10 no-underline'
            style={{ color: textColor }}>
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'>
              <circle cx='11' cy='11' r='7' />
              <path d='m20 20-3.5-3.5' />
            </svg>
          </SmartLink>
          <button
            type='button'
            aria-label='dark-mode'
            onClick={toggleDarkMode}
            className='btn-plain h-10 w-10 cursor-pointer'
            style={{ color: textColor }}>
            {isDarkMode ? '☀' : '☾'}
          </button>
          <button
            type='button'
            aria-label='menu'
            onClick={() => setMenuOpen(v => !v)}
            className='btn-plain h-10 w-10 cursor-pointer md:hidden'
            style={{ color: textColor }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className='grid gap-1 px-4 pb-3 md:hidden'
          style={{ background: 'var(--card-bg)' }}>
          {links.map((link, index) => (
            <SmartLink
              key={`m-${link.href || link.name}-${index}`}
              href={link.href}
              target={link.target}
              onClick={() => setMenuOpen(false)}
              className='btn-plain justify-start px-3 py-2.5 text-sm no-underline'
              style={{ color: 'var(--deep-text)' }}>
              {link.name}
            </SmartLink>
          ))}
        </div>
      )}
    </header>
  )
}
