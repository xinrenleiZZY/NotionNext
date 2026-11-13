'use client'

import { useEffect, useState } from 'react'

/**
 * 回到顶部
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640)
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
      className='aurora-glass aurora-glass-hover fixed bottom-6 right-5 z-30 grid h-11 w-11 place-items-center rounded-full'
      style={{ color: 'var(--aurora-text-soft)' }}>
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'>
        <path d='M12 19V5M6 11l6-6 6 6' />
      </svg>
    </button>
  )
}
