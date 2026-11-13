'use client'

import { useGlobal } from '@/lib/global'
import { useEffect, useRef, useState } from 'react'

/**
 * 加密文章解锁
 */
export default function ArticleLock({ validPassword }) {
  const { locale } = useGlobal()
  const inputRef = useRef(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submit = () => {
    setError(!validPassword(inputRef.current?.value))
  }

  return (
    <div className='relative z-10 mx-auto flex min-h-[50vh] w-full max-w-[460px] items-center px-4'>
      <div className='neo-card w-full px-6 py-8 text-center'>
        <div
          className='text-sm font-black uppercase'
          style={{ color: 'var(--neo-ink)' }}>
          {locale.COMMON.ARTICLE_LOCK_TIPS}
        </div>
        <div className='mt-5 flex gap-2'>
          <input
            ref={inputRef}
            type='password'
            onKeyDown={e => {
              if (e.key === 'Enter') submit()
            }}
            className='w-full px-3 py-2 text-sm outline-none'
            style={{
              color: 'var(--neo-ink)',
              background: 'var(--neo-card)',
              border: '3px solid var(--neo-ink)',
              borderRadius: '4px'
            }}
          />
          <button type='button' onClick={submit} className='neo-btn'>
            {locale.COMMON.SUBMIT}
          </button>
        </div>
        {error && (
          <div className='mt-3 text-xs font-bold' style={{ color: '#e11d48' }}>
            {locale.COMMON.PASSWORD_ERROR}
          </div>
        )}
      </div>
    </div>
  )
}
