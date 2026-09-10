import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * TitleBar Component - Endfield Style (Light Industrial)
 */
export const TitleBar = ({ post }) => {
  const marqueeText = siteConfig(
    'ENDSPACE_BANNER_WATERMARK_TEXT',
    'CLOUD09_SPACE',
    CONFIG
  )
  const siteTitle = String(siteConfig('TITLE') || marqueeText)
  const siteDescription = siteConfig('DESCRIPTION') || ''

  return (
    <div className='relative py-10 md:py-14 border-b-2 border-[var(--endspace-border-base)] overflow-hidden bg-[var(--endspace-bg-base)]'>
      {/* Post Cover Image Background - shown on article pages */}
      {post && post.pageCoverThumbnail && (
        <div className='absolute inset-0'>
          <img
            src={post.pageCoverThumbnail}
            alt={post.title || 'Cover'}
            className='w-full h-full object-cover'
          />
          {/* Dark overlay for better contrast */}
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

      {/* Artistic Gradient Site Title (pink flow title) - only on non-article pages */}
      {!post && (
        <div className='relative z-10 max-w-screen-xl mx-auto px-6 flex flex-col items-center text-center'>
          <h1 className='artistic-title text-4xl md:text-6xl font-black tracking-tight uppercase'>
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
          {siteDescription && (
            <p className='mt-4 text-sm md:text-base font-medium tracking-wide text-[var(--endspace-text-secondary)]'>
              {siteDescription}
            </p>
          )}
          <div className='hzx-divider w-40 md:w-64 mx-auto' />
        </div>
      )}

      {/* Large Background Scrolling Watermark (only on non-article pages) */}
      {!post && (
        <div className='absolute inset-0 flex items-center opacity-[0.15] pointer-events-none overflow-hidden'>
          <div className='bg-watermark-scroll whitespace-nowrap leading-none'>
            <span className='text-[5rem] md:text-[7rem] font-black text-[var(--endspace-text-primary)] select-none'>
              {marqueeText}
              <span className='mx-[5vw] text-[var(--endspace-text-muted)]'>
                &#x2022;
              </span>
              {marqueeText}
              <span className='mx-[5vw] text-[var(--endspace-text-muted)]'>
                &#x2022;
              </span>
              {marqueeText}
              <span className='mx-[5vw] text-[var(--endspace-text-muted)]'>
                &#x2022;
              </span>
              {marqueeText}
              <span className='mx-[5vw] text-[var(--endspace-text-muted)]'>
                &#x2022;
              </span>
              {marqueeText}
              <span className='mx-[5vw] text-[var(--endspace-text-muted)]'>
                &#x2022;
              </span>
              {marqueeText}
              <span className='mx-[5vw] text-[var(--endspace-text-muted)]'>
                &#x2022;
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Marquee Animation Styles for Background Watermark */}
      <style jsx>{`
        .bg-watermark-scroll {
          display: inline-block;
          animation: bgMarquee 30s linear infinite;
        }

        @keyframes bgMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}

export default TitleBar
