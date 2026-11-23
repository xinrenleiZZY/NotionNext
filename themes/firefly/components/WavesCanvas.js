'use client'

import { useEffect, useRef } from 'react'

/**
 * 首页 Banner 底部水波纹（Canvas 版）
 *
 * 为什么不用 SVG 平移：
 *  - SVG 需要「两个周期 + 平移 50%」才能无缝，宽屏下 preserveAspectRatio="none"
 *    会把波形横向压缩，斜率失真，看起来像一条带小锯齿的直线
 *  - Canvas 直接画连续正弦波，相位随时间推进，横向本来就没有拼接边界，
 *    任意宽度都平滑；三层不同频率/振幅/速度叠加，流动感更强
 *
 * 细节：
 *  - 适配 devicePixelRatio，避免锯齿
 *  - 页面不可见时暂停 rAF；prefers-reduced-motion 时只画静态一帧
 *  - 跟随主题色：读取 canvas 计算后的 --page-bg，主题切换时重绘
 */

const LAYERS = [
  // y: 基线高度比例；amp: 振幅（相对高度）；freq: 周期数；speed: 相位速度；alpha: 透明度
  // 从后往前画：最后一层近乎不透明，形成清晰的「波形前缘」，看起来才像水
  { y: 0.48, amp: 0.2, freq: 2.4, speed: 0.85, alpha: 0.34, phase: 0 },
  { y: 0.62, amp: 0.17, freq: 3.2, speed: -0.65, alpha: 0.56, phase: 1.7 },
  { y: 0.8, amp: 0.14, freq: 4.2, speed: 1.0, alpha: 0.98, phase: 3.4 }
]

export default function WavesCanvas({ className }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({ raf: 0, running: false, color: '#f0fdf4', t0: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = stateRef.current
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const readColor = () => {
      try {
        const styles = getComputedStyle(canvas)
        const value =
          styles.getPropertyValue('--page-bg').trim() ||
          styles.getPropertyValue('--card-bg').trim()
        if (value) state.color = value
      } catch (e) {}
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width))
      const h = Math.max(1, Math.round(rect.height))
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      state.w = w
      state.h = h
    }

    const drawAt = time => {
      const { w, h } = state
      if (!w || !h) return
      ctx.clearRect(0, 0, w, h)
      for (const layer of LAYERS) {
        const phase = state.t0 + time * layer.speed + layer.phase
        ctx.beginPath()
        ctx.moveTo(0, h)
        const baseY = h * layer.y
        const amp = h * layer.amp
        const step = Math.max(2, Math.round(w / 96))
        for (let x = 0; x <= w + step; x += step) {
          const theta = (x / w) * Math.PI * 2 * layer.freq + phase
          // 叠加一点二次谐波，波形更像水，而不是标准正弦
          const y =
            baseY +
            Math.sin(theta) * amp +
            Math.sin(theta * 2 + phase * 0.7) * amp * 0.28
          ctx.lineTo(x, y)
        }
        ctx.lineTo(w, h)
        ctx.closePath()
        ctx.globalAlpha = layer.alpha
        ctx.fillStyle = state.color
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = time => {
      drawAt(time / 1000)
      state.raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (state.running) return
      state.running = true
      state.raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      state.running = false
      cancelAnimationFrame(state.raf)
    }

    readColor()
    resize()
    drawAt(0)

    if (reduceMotion) {
      // 静态一帧即可
    } else {
      start()
    }

    const onResize = () => {
      resize()
      if (reduceMotion) drawAt(0)
    }
    const onVisibility = () => {
      if (document.hidden) stop()
      else if (!reduceMotion) start()
    }
    const observer =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            readColor()
            if (reduceMotion) drawAt(0)
          })
        : null
    observer?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    })

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      observer?.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden='true' />
}
