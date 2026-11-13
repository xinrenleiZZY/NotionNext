'use client'

import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

/**
 * 搜索输入框（搜索页顶部）
 */
export default function SearchInput({ keyword }) {
  const router = useRouter()
  const inputRef = useRef(null)
  const [value, setValue] = useState(keyword || '')

  const submit = () => {
    const key = String(value || '').trim()
    if (!key) return
    router.push({ pathname: `/search/${encodeURIComponent(key)}` })
  }

  return (
    <div className='aurora-glass mb-6 flex items-center gap-2 px-4 py-3'>
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        style={{ color: 'var(--aurora-text-mute)', flexShrink: 0 }}>
        <circle cx='11' cy='11' r='7' />
        <path d='m20 20-3.5-3.5' />
      </svg>
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyUp={e => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') setValue('')
        }}
        autoComplete='off'
        placeholder='输入关键词后回车'
        className='w-full bg-transparent text-sm outline-none'
        style={{ color: 'var(--aurora-text)' }}
      />
      <button
        type='button'
        onClick={submit}
        className='shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold'
        style={{
          color: '#fff',
          background: 'var(--aurora-accent)'
        }}>
        搜索
      </button>
    </div>
  )
}
