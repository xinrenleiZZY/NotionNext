import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * Build the repeated watermark string used by the marquee.
 */
const repeatWatermark = text => {
  const items = []
  for (let i = 0; i < 6; i++) {
    items.push(
      <span key={i}>
        {text}
        <span className='mx-[5vw] text-[var(--endspace-text-muted)]'>
          &#x2022;
        </span>
      </span>
    )
  }
  return items
}

/**
 * TitleBar Component - Endfield Style (Light Industrial)
 * - Article pages: post cover banner.
 * - Other pages (incl. homepage): pink banner, height = 1/3 of the original,
 *   original scrolling watermark band (50% height) + site title at the bottom.
 */
export const TitleBar = ({ post }) => {
  const marqueeText = siteConfig(
    'ENDSPACE_BANNER_WATERMARK_TEXT',
    'CLOUD09_SPACE',
    CONFIG
  )
  const siteTitle = String(siteConfig('TITLE') || marqueeText)

  return (
    <div
      className={`relative border-b-2 border-[var(--endspace-border-base)] overflow-hidden ${
        post
          ? 'py-10 md:py-14 bg-[var(--endspace-bg-base)]'
          : 'endspace-hero-banner flex flex-col justify-end'
      }`}
    >
      {/* Post Cover Image Background - shown on article pages */}
      {post && post.pageCoverThumbnail && (
        <div className='absolute inset-0'>
          <img
            src={post.pageCoverThumbnail}
            alt={post.title || 'Cover'}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-black/40' />
        </div>
      )}

      {/* Background Pattern - Grid overlay effect */}
      <div className='absolute inset-0 opacity-10 pointer-events-none'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, var(--endspace-text-muted) 2px, var(--endspace-text-muted) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, var(--endspace-text-muted) 2px, var(--endspace-text-muted) 4px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {!post && (
        <>
          {/* Scrolling Watermark band - 50% of the banner height */}
          <div className='absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1/2 flex items-center opacity-[0.15] pointer-events-none overflow-hidden'>
            <div className='endspace-watermark-scroll whitespace-nowrap leading-none'>
              <span className='text-[1.6rem] md:text-[2.2rem] font-black text-white select-none'>
                {repeatWatermark(marqueeText)}
              </span>
            </div>
          </div>

          {/* Site title - placed at the lower part of the banner */}
          <div className='relative z-10 w-full max-w-screen-xl mx-auto px-6 pb-3 md:pb-4 flex flex-col items-center text-center'>
            <h1 className='artistic-title text-sm md:text-xl font-black tracking-tight uppercase break-words max-w-full'>
              {siteTitle.split('').map((ch, i) => (
                <span
                  key={`${ch}-${i}`}
                  className='artistic-char'
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </h1>
            <div className='hzx-divider w-16 md:w-24 mx-auto' />
          </div>
        </>
      )}
    </div>
  )
}

export default TitleBar
