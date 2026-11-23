'use client'

import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

/**
 * 动效层：丝滑滚动 + 入场动画 + 滚动揭示 + Banner 视差
 *
 * 技术选型（参考 aonnoysengupta.com：Astro + Lenis + GSAP）
 *  - Lenis：惯性平滑滚动（vendor 到 /vendor/lenis.min.js，避免改 yarn.lock）
 *  - GSAP + ScrollTrigger：入场时间线、滚动揭示、视差（已在 package.json 依赖中）
 *
 * 工程约束
 *  - 全部只动 transform / opacity / clip-path，走 GPU 合成
 *  - prefers-reduced-motion：跳过入场与视差，只保留内容
 *  - 入场层默认 display:none，由 JS 打开；JS 失败不会挡住页面
 *  - 每次会话只播一次入场（sessionStorage）
 */

const INTRO_KEY = 'ff-intro-played'

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
    let gsapInstance = null
    let ScrollTriggerInstance = null
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
          await loadScript('/vendor/lenis.min.js')
          if (disposed) return
          const Lenis = window.Lenis
          if (Lenis) {
            lenis = new Lenis({
              lerp: 0.085,
              wheelMultiplier: 1,
              smoothWheel: true,
              smoothTouch: false,
              touchMultiplier: 1.6
            })
            window.__ffLenis = lenis
            cleanup.push(() => {
              window.__ffLenis = null
              lenis?.destroy()
            })
          }
        } catch (e) {
          console.warn('[MotionLayer] lenis load failed', e)
        }
      }

      // ---------- GSAP ----------
      try {
        const gsapMod = await import('gsap')
        const stMod = await import('gsap/ScrollTrigger')
        if (disposed) return
        gsapInstance = gsapMod.gsap || gsapMod.default
        ScrollTriggerInstance = stMod.ScrollTrigger
        gsapInstance.registerPlugin(ScrollTriggerInstance)

        if (lenis) {
          const onScroll = () => ScrollTriggerInstance.update()
          lenis.on('scroll', onScroll)
          const tick = time => lenis.raf(time * 1000)
          gsapInstance.ticker.add(tick)
          gsapInstance.ticker.lagSmoothing(0)
          cleanup.push(() => {
            gsapInstance?.ticker.remove(tick)
            lenis?.off?.('scroll', onScroll)
          })
        }

        // ---------- 入场动画 ----------
        const pending =
          document.documentElement.classList.contains('ff-intro-pending')
        const startedAt = window.__ffIntroStart || Date.now()
        const bootDelay = Date.now() - startedAt
        // 首屏 JS 就绪太晚（>1.6s，CSS 自动淡出已开始）就不播完整入场，直接收尾
        const playFull = firstVisit && !reduceMotion && bootDelay < 1600

        if (introEl && playFull) {
          document.documentElement.classList.remove('ff-intro-pending')
          introEl.classList.add('is-on')
          // 兜底：动画异常时 6 秒后强制关闭，绝不挡页面
          cleanup.push(
            setTimeout(() => {
              if (introEl.classList.contains('is-on')) {
                introEl.classList.remove('is-on')
                introEl.style.display = 'none'
                try {
                  sessionStorage.setItem(INTRO_KEY, '1')
                } catch (e) {}
              }
            }, 6000)
          )
          const tl = gsapInstance.timeline({
            onComplete: () => {
              introEl.classList.remove('is-on')
              introEl.style.display = 'none'
              try {
                sessionStorage.setItem(INTRO_KEY, '1')
              } catch (e) {}
            }
          })
          tl.fromTo(
            '.ff-intro-logo',
            { scale: 0.82, opacity: 0, y: 12 },
            { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }
          )
            .fromTo(
              '.ff-intro-word',
              { y: '110%', opacity: 0 },
              { y: '0%', opacity: 1, duration: 0.8, ease: 'expo.out' },
              '-=0.45'
            )
            .fromTo(
              '.ff-intro-bar i',
              { scaleX: 0 },
              { scaleX: 1, duration: 0.85, ease: 'power2.inOut' },
              '-=0.55'
            )
            .to(
              introEl,
              {
                clipPath: 'inset(0 0 100% 0)',
                duration: 0.75,
                ease: 'power4.inOut'
              },
              '+=0.12'
            )

          // 首页 hero 内容跟随入场
          tl.fromTo(
            '.ff-banner-title',
            { y: 46, opacity: 0, filter: 'blur(8px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.out' },
            '-=0.5'
          )
            .fromTo(
              '.ff-banner-subtitle, .ff-banner-social, .ff-banner-dots',
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
              '-=0.7'
            )
          cleanup.push(() => tl.kill())
        } else if (introEl && pending) {
          // 遮罩由内联脚本显示，但 JS 就绪时 CSS 已自动淡出：直接收尾，不要二次闪现
          document.documentElement.classList.remove('ff-intro-pending')
          introEl.classList.remove('is-on')
          introEl.style.display = 'none'
          try {
            sessionStorage.setItem(INTRO_KEY, '1')
          } catch (e) {}
          if (!reduceMotion) {
            gsapInstance.fromTo(
              '.ff-banner-title, .ff-banner-subtitle',
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
            )
          }
        } else {
          document.documentElement.classList.remove('ff-intro-pending')
          if (introEl) introEl.style.display = 'none'
          // 非首次：hero 轻微淡入，避免硬切
          if (!reduceMotion) {
            gsapInstance.fromTo(
              '.ff-banner-title, .ff-banner-subtitle',
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
            )
          }
        }

        // ---------- 滚动揭示 ----------
        if (!reduceMotion) {
          const revealTargets = gsapInstance.utils.toArray(
            '.ff-card-shadow, .ff-section-title, .ff-profile-card'
          )
          if (revealTargets.length) {
            gsapInstance.set(revealTargets, { opacity: 0, y: 26 })
            ScrollTriggerInstance.batch(revealTargets, {
              start: 'top 92%',
              once: true,
              onEnter: batch =>
                gsapInstance.to(batch, {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  stagger: 0.07,
                  ease: 'power2.out',
                  overwrite: true
                })
            })
            // 兜底：4 秒后仍在视口内却没触发的，直接显示（防 ScrollTrigger 异常）
            cleanup.push(
              setTimeout(() => {
                revealTargets.forEach(el => {
                  if (getComputedStyle(el).opacity === '0') {
                    gsapInstance.to(el, { opacity: 1, y: 0, duration: 0.4 })
                  }
                })
              }, 4000)
            )
          }

          // ---------- Banner 视差 ----------
          const banner = document.querySelector('.ff-banner-parallax')
          if (banner) {
            const parallax = gsapInstance.to(banner, {
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

          // ---------- 卡片悬停微交互 ----------
          const hovers = gsapInstance.utils.toArray('.ff-card-shadow')
          cleanup.push(() => {
            hovers.forEach(el => {
              el.style.transform = ''
            })
          })
        }

        // 路由切换后刷新触发器
        const onRoute = () => {
          setTimeout(() => {
            introEl?.classList.remove('is-on')
            ScrollTriggerInstance?.refresh()
          }, 400)
        }
        router.events.on('routeChangeComplete', onRoute)
        cleanup.push(() => router.events.off('routeChangeComplete', onRoute))
      } catch (e) {
        console.warn('[MotionLayer] gsap init failed', e)
        introEl?.classList.remove('is-on')
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
      ScrollTriggerInstance?.getAll?.().forEach(t => t.kill())
      gsapInstance?.globalTimeline?.clear?.()
    }
  }, [])

  const title = siteConfig('TITLE') || ''
  const logo = siteConfig('BLOG_LOGO') || ''

  return (
    <div ref={introRef} className='ff-intro' aria-hidden='true'>
      <div className='ff-intro-inner'>
        {logo && <img className='ff-intro-logo' src={logo} alt='' draggable={false} />}
        <div className='ff-intro-word'>{title}</div>
        <span className='ff-intro-bar'>
          <i />
        </span>
      </div>
    </div>
  )
}
