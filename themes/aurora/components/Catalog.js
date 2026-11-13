'use client'

import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState } from 'react'

/**
 * 文章目录（桌面端右侧常驻）
 * 滚动联动高亮当前标题
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
          if (bbox.top - 140 <= 0) {
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
        className='mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase'
        style={{ color: 'var(--aurora-text-mute)' }}>
        <span
          className='h-1 w-1 rounded-full'
          style={{ background: 'var(--aurora-accent)' }}
        />
        {locale.COMMON.TABLE_OF_CONTENTS}
      </div>
      <nav
        ref={navRef}
        className='max-h-[62vh] overflow-y-auto pr-1'
        style={{ scrollbarWidth: 'thin' }}>
        {post.toc.map(item => {
          const id = uuidToId(item.id)
          const active = activeSection === id
          return (
            <a
              key={id}
              href={`#${id}`}
              className='block border-l py-1.5 pl-3 text-[13px] leading-snug no-underline transition-colors duration-200'
              style={{
                borderColor: active
                  ? 'var(--aurora-accent)'
                  : 'var(--aurora-border)',
                color: active
                  ? 'var(--aurora-text)'
                  : 'var(--aurora-text-soft)',
                fontWeight: active ? 600 : 400,
                marginLeft: (item.indentLevel || 0) * 10
              }}>
              {item.text}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
