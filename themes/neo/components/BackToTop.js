'use client'

import { useEffect, useState } from 'react'

/**
 * 回到顶部：方块贴纸
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
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
      className='neo-card neo-hover fixed bottom-5 right-4 z-30 grid h-11 w-11 cursor-pointer place-items-center text-base font-black'
      style={{ color: 'var(--neo-ink)' }}>
      ↑
    </button>
  )
}
