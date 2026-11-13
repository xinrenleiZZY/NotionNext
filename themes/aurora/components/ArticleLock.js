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
    const pass = inputRef.current?.value
    setError(!validPassword(pass))
  }

  return (
    <div className='relative z-10 mx-auto flex min-h-[50vh] w-full max-w-[480px] items-center px-5'>
      <div className='aurora-glass w-full px-6 py-8 text-center'>
        <div
          className='text-sm font-semibold'
          style={{ color: 'var(--aurora-text)' }}>
          {locale.COMMON.ARTICLE_LOCK_TIPS}
        </div>
        <div className='mt-5 flex gap-2'>
          <input
            ref={inputRef}
            type='password'
            onKeyDown={e => {
              if (e.key === 'Enter') submit()
            }}
            className='w-full rounded-xl px-4 py-2.5 text-sm outline-none'
            style={{
              color: 'var(--aurora-text)',
              background: 'var(--aurora-surface-2)',
              border: '1px solid var(--aurora-border)'
            }}
          />
          <button
            type='button'
            onClick={submit}
            className='shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold'
            style={{ color: '#fff', background: 'var(--aurora-accent)' }}>
            {locale.COMMON.SUBMIT}
          </button>
        </div>
        {error && (
          <div className='mt-3 text-xs' style={{ color: '#ef4444' }}>
            {locale.COMMON.PASSWORD_ERROR}
          </div>
        )}
      </div>
    </div>
  )
}
