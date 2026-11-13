'use client'

import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState } from 'react'

/**
 * 文章目录（MD3 便签卡）
 */
export default function Catalog({ post }) {
  const { locale } = useGlobal()
  const navRef = useRef(null)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = throttle(
      () => {
        const sections = document.getElementsByClassName('notion-h')
        let currentId = ''
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i]
          if (!(section instanceof Element)) continue
          const bbox = section.getBoundingClientRect()
          if (bbox.top - 150 <= 0) {
            currentId = section.getAttribute('data-id') || currentId
            continue
          }
          break
        }
        setActiveSection(currentId)
        const index = (post?.toc || []).findIndex(
          item => uuidToId(item.id) === currentId
        )
        if (index > -1 && navRef.current) {
          navRef.current.scrollTo({ top: index * 30, behavior: 'smooth' })
        }
      },
      180,
      { passive: true }
    )

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      onScroll.cancel?.()
    }
  }, [post])

  if (!post?.toc?.length) return null

  return (
    <div>
      <div
        className='mb-3 text-[12px] font-bold uppercase tracking-[0.14em]'
        style={{ color: 'var(--mz-on-surface-variant)' }}>
        {locale.COMMON.TABLE_OF_CONTENTS}
      </div>
      <nav
        ref={navRef}
        className='max-h-[62vh] space-y-1 overflow-y-auto'
        style={{ scrollbarWidth: 'thin' }}>
        {post.toc.map(item => {
          const id = uuidToId(item.id)
          const active = activeSection === id
          return (
            <a
              key={id}
              href={`#${id}`}
              className='block rounded-lg px-2.5 py-1.5 text-[12px] leading-snug no-underline transition-colors duration-200'
              style={{
                marginLeft: (item.indentLevel || 0) * 8,
                background: active ? 'var(--mz-primary-container)' : 'transparent',
                color: active
                  ? 'var(--mz-on-primary-container)'
                  : 'var(--mz-on-surface-variant)',
                fontWeight: active ? 600 : 400
              }}>
              {item.text}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
