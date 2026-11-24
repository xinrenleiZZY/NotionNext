'use client'

import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

/**
 * 动效层：入场编排 + 丝滑滚动 + 滚动揭示 + Banner 视差
 *
 * 入场分镜（参考 aonnoysengupta.com，节奏放慢）：
 *   1. 遮罩已由首屏内联脚本显示
 *   2. 中间「打印」域名（打字机 + 光标）
 *   3. 域名收缩消失 → 站点标题从模糊中放大浮现
 *   4. 底部进度条扫过 + `// loading xx%` 计数，右下角显示城市/时间
 *   5. 等页面 load（最多再等 3.5s）
 *   6. 标题上移淡出 + 整块遮罩上拉（yPercent -100）揭开首页
 *
 * 技术：Lenis（平滑滚动）+ GSAP/ScrollTrigger/TextPlugin（已在依赖中）
 */

const INTRO_KEY = 'ff-intro-played'
const DOMAIN = 'juxingspacestation.top'

const sleep = ms => new Promise(r => setTimeout(r, ms))

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-src="${src}"]`)) return resolve()
    const el = document.createElement('script')
    el.src = src
    el.async = true
    el.dataset.src = src
    el.onload = resolve
    el.onerror = reject
    document.head.appendChild(el)
  })
}

export default function MotionLayer() {
  const introRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer =
      window.matchMedia &&
      (window.matchMedia('(pointer: fine)').matches ||
        window.matchMedia('(hover: hover)').matches ||
        !('ontouchstart' in window))

    let disposed = false
    let cleanup = []
    let gsap = null
    let ScrollTrigger = null
    let lenis = null

    const introEl = introRef.current
    const firstVisit = (() => {
      try {
        return sessionStorage.getItem(INTRO_KEY) !== '1'
      } catch (e) {
        return false
      }
    })()

    const boot = async () => {
      // ---------- Lenis 平滑滚动 ----------
      if (!reduceMotion && finePointer) {
        try {
          let LenisCtor = null
          try {
            const mod = await import(/* webpackIgnore: true */ '/vendor/lenis.mjs')
            LenisCtor = mod?.default || mod?.Lenis || null
          } catch (e) {
            await loadScript('/vendor/lenis.min.js')
            LenisCtor = window.Lenis || null
          }
          if (disposed) return
          if (LenisCtor) {
            lenis = new LenisCtor({
              lerp: 0.085,
              wheelMultiplier: 1,
              smoothWheel: true,
              smoothTouch: false,
              touchMultiplier: 1.6
            })
            window.__ffLenis = lenis
            let frame = 0
            const raf = time => {
              lenis.raf(time)
              frame = requestAnimationFrame(raf)
            }
            frame = requestAnimationFrame(raf)
            cleanup.push(() => {
              cancelAnimationFrame(frame)
              window.__ffLenis = null
              lenis?.destroy()
            })
          }
        } catch (e) {
          console.warn('[MotionLayer] lenis init failed', e)
        }
      }

      // ---------- GSAP ----------
      try {
        const gsapMod = await import('gsap')
        const stMod = await import('gsap/ScrollTrigger')
        const textMod = await import('gsap/TextPlugin')
        if (disposed) return
        gsap = gsapMod.gsap || gsapMod.default
        ScrollTrigger = stMod.ScrollTrigger
        const TextPlugin = textMod.TextPlugin || textMod.default
        gsap.registerPlugin(ScrollTrigger, TextPlugin)

        if (lenis) {
          const onScroll = () => ScrollTrigger.update()
          lenis.on('scroll', onScroll)
          cleanup.push(() => lenis?.off?.('scroll', onScroll))
        }

        // ---------- 入场 ----------
        const pending = document.documentElement.classList.contains('ff-intro-pending')
        const startedAt = window.__ffIntroStart || Date.now()
        const bootDelay = Date.now() - startedAt

        if (introEl && firstVisit && !reduceMotion && bootDelay < 9000) {
          document.documentElement.classList.remove('ff-intro-pending')
          introEl.classList.add('is-on')
          // 兜底：异常时 12 秒强制放行
          cleanup.push(
            setTimeout(() => {
              if (introEl.classList.contains('is-on')) {
                introEl.classList.remove('is-on')
                introEl.style.display = 'none'
                try {
                  sessionStorage.setItem(INTRO_KEY, '1')
                } catch (e) {}
              }
            }, 12000)
          )

          const hourText = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Shanghai'
          }).format(new Date())
          const meta = introEl.querySelector('.ff-intro-meta')
          if (meta) meta.textContent = `guangzhou, cn ${hourText} GMT+8`

          const domainEl = introEl.querySelector('.ff-intro-domain-text')
          const titleEl = introEl.querySelector('.ff-intro-title')
          const progressEl = introEl.querySelector('.ff-intro-progress i')
          const loadingEl = introEl.querySelector('.ff-intro-loading')

          // 页面 load（最多等 3.5s，避免因为个别图片一直等）
          const loadPromise = new Promise(resolve => {
            if (document.readyState === 'complete') return resolve()
            const done = () => resolve()
            window.addEventListener('load', done, { once: true })
            setTimeout(done, 3500)
          })

          // 1) 打印域名
          await gsap.to(domainEl, {
            text: { value: DOMAIN },
            duration: 1.5,
            ease: 'none'
          })
          await sleep(260)

          // 2) 域名退场 → 标题浮现
          await gsap.to(introEl.querySelector('.ff-intro-domain'), {
            opacity: 0,
            scale: 0.86,
            filter: 'blur(6px)',
            duration: 0.45,
            ease: 'power2.in'
          })
          await gsap.fromTo(
            titleEl,
            { opacity: 0, scale: 0.74, filter: 'blur(18px)', y: 20 },
            {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              y: 0,
              duration: 1.15,
              ease: 'expo.out'
            }
          )

          // 3) 进度条扫过（同时更新百分比文案）
          const progress = { v: 0 }
          await gsap.to(progress, {
            v: 100,
            duration: 1.7,
            ease: 'power1.inOut',
            onUpdate: () => {
              const v = Math.round(progress.v)
              if (progressEl) progressEl.style.transform = `scaleX(${v / 100})`
              if (loadingEl) loadingEl.textContent = `// loading ${v}%`
            }
          })

          // 4) 等页面真正 load（给内容加载时间）
          await Promise.race([loadPromise, sleep(3500)])
          await sleep(320)

          // 5) 标题上移 + 遮罩上拉揭开
          await gsap.to(titleEl, {
            y: -70,
            opacity: 0,
            scale: 1.03,
            duration: 0.7,
            ease: 'power2.in'
          })
          await gsap.to(introEl, {
            yPercent: -100,
            duration: 1.05,
            ease: 'power4.inOut'
          })

          introEl.classList.remove('is-on')
          introEl.style.display = 'none'
          try {
            sessionStorage.setItem(INTRO_KEY, '1')
          } catch (e) {}

          // 首页 hero 跟随入场
          gsap.fromTo(
            '.ff-banner-title',
            { y: 54, opacity: 0, filter: 'blur(10px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out' }
          )
          gsap.fromTo(
            '.ff-banner-subtitle, .ff-banner-social, .ff-banner-dots',
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out', delay: 0.15 }
          )
        } else if (introEl && pending) {
          // JS 太慢 / 非首次：直接放行，不遮挡
          document.documentElement.classList.remove('ff-intro-pending')
          introEl.classList.remove('is-on')
          introEl.style.display = 'none'
          try {
            sessionStorage.setItem(INTRO_KEY, '1')
          } catch (e) {}
          if (!reduceMotion) {
            gsap.fromTo(
              '.ff-banner-title, .ff-banner-subtitle',
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
            )
          }
        } else {
          document.documentElement.classList.remove('ff-intro-pending')
          if (introEl) introEl.style.display = 'none'
          if (!reduceMotion) {
            gsap.fromTo(
              '.ff-banner-title, .ff-banner-subtitle',
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
            )
          }
        }

        // ---------- 滚动揭示 ----------
        if (!reduceMotion) {
          const revealTargets = gsap.utils.toArray(
            '.ff-card-shadow, .ff-section-title, .ff-profile-card'
          )
          if (revealTargets.length) {
            gsap.set(revealTargets, { opacity: 0, y: 26 })
            ScrollTrigger.batch(revealTargets, {
              start: 'top 92%',
              once: true,
              onEnter: batch =>
                gsap.to(batch, {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  stagger: 0.07,
                  ease: 'power2.out',
                  overwrite: true
                })
            })
            cleanup.push(
              setTimeout(() => {
                revealTargets.forEach(el => {
                  if (getComputedStyle(el).opacity === '0') {
                    gsap.to(el, { opacity: 1, y: 0, duration: 0.4 })
                  }
                })
              }, 5000)
            )
          }

          // Banner 视差
          const banner = document.querySelector('.ff-banner-parallax')
          if (banner) {
            const parallax = gsap.to(banner, {
              yPercent: 14,
              opacity: 0.45,
              ease: 'none',
              scrollTrigger: {
                trigger: banner,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6
              }
            })
            cleanup.push(() => {
              parallax.scrollTrigger?.kill()
              parallax.kill()
            })
          }
        }

        // 路由切换后刷新触发器
        const onRoute = () => {
          setTimeout(() => {
            introEl?.classList.remove('is-on')
            ScrollTrigger?.refresh()
          }, 400)
        }
        router.events.on('routeChangeComplete', onRoute)
        cleanup.push(() => router.events.off('routeChangeComplete', onRoute))
      } catch (e) {
        console.warn('[MotionLayer] gsap init failed', e)
        introEl?.classList.remove('is-on')
        document.documentElement.classList.remove('ff-intro-pending')
        if (introEl) introEl.style.display = 'none'
      }
    }

    boot()

    return () => {
      disposed = true
      cleanup.forEach(fn => {
        try {
          typeof fn === 'function' ? fn() : clearTimeout(fn)
        } catch (e) {}
      })
      ScrollTrigger?.getAll?.().forEach(t => t.kill())
      gsap?.globalTimeline?.clear?.()
    }
  }, [])

  const title = siteConfig('TITLE') || ''

  return (
    <div ref={introRef} className='ff-intro' aria-hidden='true'>
      <div className='ff-intro-inner'>
        <div className='ff-intro-domain'>
          <span className='ff-intro-domain-text' />
          <span className='ff-intro-caret' />
        </div>
        <h1 className='ff-intro-title'>{title}</h1>
      </div>

      <div className='ff-intro-foot'>
        <span className='ff-intro-loading'>// loading 0%</span>
        <span className='ff-intro-meta'>guangzhou, cn</span>
      </div>
      <div className='ff-intro-progress'>
        <i />
      </div>
    </div>
  )
}
