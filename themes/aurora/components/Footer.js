'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'

/**
 * 页脚
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
    <footer className='relative z-10 mt-8'>
      <div className='mx-auto w-full max-w-[1180px] px-5 pb-10'>
        <div className='aurora-divider mb-6' />
        <div
          className='flex flex-col items-center justify-between gap-3 text-[12px] md:flex-row'
          style={{ color: 'var(--aurora-text-mute)' }}>
          <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
            <span>© {range}</span>
            <span style={{ color: 'var(--aurora-text-soft)' }}>
              {author || title}
            </span>
            <span>·</span>
            <span>Powered by NotionNext</span>
          </div>
          <div className='flex items-center gap-3'>
            {enableRss && (
              <SmartLink
                href='/rss/feed.xml'
                className='no-underline transition-colors duration-200 hover:text-[var(--aurora-accent)]'>
                {locale.NAV.RSS}
              </SmartLink>
            )}
            {beiAn && (
              <a
                href={beiAnLink || 'https://beian.miit.gov.cn/'}
                target='_blank'
                rel='noopener noreferrer'
                className='no-underline transition-colors duration-200 hover:text-[var(--aurora-accent)]'>
                {beiAn}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
