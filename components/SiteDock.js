'use client'

import ThemeSwitch from '@/components/ThemeSwitch'
import { useEffect, useState } from 'react'

const MUSIC_VISIBLE_KEY = 'site-music-visible'

const DockButton = ({ label, onClick, children }) => (
  <button
    type='button'
    onClick={onClick}
    className='flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors hover:bg-white/10'
    style={{ color: 'var(--deep-text)' }}
  >
    <span className='grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-black/10'>
      {children}
    </span>
    <span>{label}</span>
  </button>
)

export default function SiteDock({
  themeEnabled = false,
  musicEnabled = false
}) {
  const [open, setOpen] = useState(false)
  const [musicVisible, setMusicVisible] = useState(true)
  const [themePanelOpen, setThemePanelOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MUSIC_VISIBLE_KEY)
      if (saved === '0') setMusicVisible(false)
    } catch (e) {}
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle(
      'site-music-hidden',
      musicEnabled && !musicVisible
    )
    try {
      localStorage.setItem(MUSIC_VISIBLE_KEY, musicVisible ? '1' : '0')
    } catch (e) {}
    return () => {
      document.documentElement.classList.remove('site-music-hidden')
    }
  }, [musicEnabled, musicVisible])

  return (
    <>
      <div className='fixed bottom-[4.65rem] right-4 z-[45] md:right-5'>
        {open && (
          <div
            className='absolute bottom-12 right-0 w-44 rounded-2xl border p-1.5 shadow-xl backdrop-blur-xl'
            style={{
              borderColor: 'var(--line-color)',
              background: 'var(--float-panel-bg)',
              boxShadow: 'var(--shadow-navbar)'
            }}
          >
            {themeEnabled && (
              <DockButton
                label='切换主题皮肤'
                onClick={() => {
                  setOpen(false)
                  setThemePanelOpen(true)
                }}
              >
                <i className='fas fa-palette text-[11px]' />
              </DockButton>
            )}
            {musicEnabled && (
              <DockButton
                label={musicVisible ? '隐藏音乐' : '显示音乐'}
                onClick={() => setMusicVisible(visible => !visible)}
              >
                <i
                  className={`fas ${musicVisible ? 'fa-music' : 'fa-volume-xmark'} text-[11px]`}
                />
              </DockButton>
            )}
            <DockButton
              label='回到顶部'
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <i className='fas fa-angle-up text-[12px]' />
            </DockButton>
          </div>
        )}

        <button
          type='button'
          aria-label={open ? '收起页面工具栏' : '展开页面工具栏'}
          aria-expanded={open}
          onClick={() => setOpen(value => !value)}
          className='grid h-10 w-10 cursor-pointer place-items-center rounded-full border shadow-lg backdrop-blur-xl transition-transform hover:-translate-y-0.5'
          style={{
            borderColor: 'var(--line-color)',
            background: 'var(--float-panel-bg)',
            color: 'var(--deep-text)',
            boxShadow: 'var(--shadow-navbar)'
          }}
        >
          <i
            className={`fas ${open ? 'fa-xmark' : 'fa-sliders'} text-[13px]`}
          />
        </button>
      </div>

      {themeEnabled && (
        <ThemeSwitch
          showTrigger={false}
          open={themePanelOpen}
          onClose={() => setThemePanelOpen(false)}
        />
      )}

      <style jsx global>{`
        .aplayer-fixed {
          transition:
            opacity 220ms ease,
            transform 220ms ease !important;
        }
        html.site-music-hidden .aplayer-fixed {
          opacity: 0 !important;
          pointer-events: none !important;
          transform: translateY(calc(100% + 1.25rem)) !important;
        }
      `}</style>
    </>
  )
}
