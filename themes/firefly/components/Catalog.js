'use client'

import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState } from 'react'

/**
 * 文章目录（Firefly 右侧 TOC）
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
      <div className='mb-3'>
        <span className='ff-section-title'>
          {locale.COMMON.TABLE_OF_CONTENTS}
        </span>
      </div>
      <nav
        ref={navRef}
        className='max-h-[62vh] space-y-0.5 overflow-y-auto'
        style={{ scrollbarWidth: 'thin' }}>
        {post.toc.map(item => {
          const id = uuidToId(item.id)
          const active = activeSection === id
          return (
            <a
              key={id}
              href={`#${id}`}
              className='block rounded-lg px-2.5 py-1.5 text-[0.75rem] leading-snug no-underline transition-colors duration-150'
              style={{
                marginLeft: (item.indentLevel || 0) * 8,
                background: active ? 'var(--btn-regular-bg)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--content-meta)',
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
