'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'

/**
 * 页脚：黑底反白贴纸条
 */
export default function Footer() {
  const { locale } = useGlobal()
  const title = siteConfig('TITLE')
  const author = siteConfig('AUTHOR')
  const since = siteConfig('SINCE')
  const year = new Date().getFullYear()
  const startYear = Number(since) > 1900 ? Number(since) : year
  const range = startYear < year ? `${startYear}-${year}` : `${year}`
  const beiAn = siteConfig('BEI_AN')
  const beiAnLink = siteConfig('BEI_AN_LINK')
  const enableRss = siteConfig('ENABLE_RSS')

  return (
    <footer className='relative z-10 mt-10'>
      <div className='mx-auto w-full max-w-[1120px] px-4 pb-10 md:px-6'>
        <div
          className='flex flex-col items-center justify-between gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] md:flex-row'
          style={{
            background: '#111111',
            color: '#f5f2e8',
            border: '3px solid var(--neo-ink)',
            borderRadius: 'var(--neo-radius)',
            boxShadow: '5px 5px 0 var(--neo-yellow)'
          }}>
          <div className='flex flex-wrap items-center gap-2'>
            <span>© {range}</span>
            <span>{author || title}</span>
            <span>·</span>
            <span>Powered by NotionNext</span>
          </div>
          <div className='flex items-center gap-3'>
            {enableRss && (
              <SmartLink href='/rss/feed.xml' className='no-underline' style={{ color: '#ffd84d' }}>
                {locale.NAV.RSS}
              </SmartLink>
            )}
            {beiAn && (
              <a
                href={beiAnLink || 'https://beian.miit.gov.cn/'}
                target='_blank'
                rel='noopener noreferrer'
                className='no-underline'
                style={{ color: '#ffd84d' }}>
                {beiAn}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
