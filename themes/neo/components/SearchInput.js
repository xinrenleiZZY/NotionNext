'use client'

import { useRouter } from 'next/router'
import { useState } from 'react'

/**
 * 搜索页输入框
 */
export default function SearchInput({ keyword }) {
  const router = useRouter()
  const [value, setValue] = useState(keyword || '')

  const submit = () => {
    const key = String(value || '').trim()
    if (!key) return
    router.push({ pathname: `/search/${encodeURIComponent(key)}` })
  }

  return (
    <div className='neo-card mb-6 flex items-center gap-2 px-3 py-2.5'>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyUp={e => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') setValue('')
        }}
        autoComplete='off'
        placeholder='输入关键词后回车'
        className='w-full bg-transparent text-sm font-semibold outline-none'
        style={{ color: 'var(--neo-ink)' }}
      />
      <button type='button' onClick={submit} className='neo-btn'>
        搜索
      </button>
    </div>
  )
}
