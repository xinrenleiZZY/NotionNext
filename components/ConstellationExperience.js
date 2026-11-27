'use client'

import SmartLink from '@/components/SmartLink'
import LazyImage from '@/components/LazyImage'
import CONSTELLATION from '@/conf/constellation.config'
import WavesCanvas from '@/themes/firefly/components/WavesCanvas'
import { useEffect, useRef } from 'react'
import styles from './ConstellationExperience.module.css'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const lerp = (start, end, progress) => start + (end - start) * progress
const easeOut = value => 1 - Math.pow(1 - value, 3)

const isExternalHref = href => /^https?:\/\//i.test(href || '')

export default function ConstellationExperience({
  variant = 'home',
  title,
  role,
  headline,
  eyebrow,
  actions = [],
  showWaves = true
}) {
  const sectionRef = useRef(null)
  const pathRef = useRef(null)
  const starRefs = useRef({})
  const labelRefs = useRef({})

  useEffect(() => {
    const section = sectionRef.current
    const path = pathRef.current
    if (!section || !path) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    section.classList.toggle(styles.reduced, reduceMotion)
    let frame = 0

    const update = () => {
      frame = 0
      const distance = Math.max(
        1,
        section.getBoundingClientRect().height - window.innerHeight
      )
      const rect = section.getBoundingClientRect()
      const rawProgress = clamp(-rect.top / distance, 0, 1)
      const progress = reduceMotion ? 0.72 : rawProgress
      const assembly = easeOut(clamp(progress / 0.58, 0, 1))
      const reveal = easeOut(clamp((progress - 0.42) / 0.31, 0, 1))
      const labels = easeOut(clamp((progress - 0.56) / 0.2, 0, 1))
      const collapse = easeOut(clamp((progress - 0.76) / 0.22, 0, 1))

      section.style.setProperty('--cp', progress.toFixed(3))
      section.style.setProperty('--assembly', assembly.toFixed(3))
      section.style.setProperty('--reveal', reveal.toFixed(3))
      section.style.setProperty('--labels', labels.toFixed(3))
      section.style.setProperty('--collapse', collapse.toFixed(3))
      section.style.setProperty('--copy-fade', (1 - collapse).toFixed(3))
      section.style.setProperty('--line-progress', assembly.toFixed(3))
      path.style.strokeDashoffset = String(1200 - assembly * 1200)

      const allStars = [...CONSTELLATION.projects, ...CONSTELLATION.auxStars]
      allStars.forEach(star => {
        const node = starRefs.current[star.id]
        if (node) {
          node.style.left = `${lerp(star.start[0], star.end[0], assembly)}%`
          node.style.top = `${lerp(star.start[1], star.end[1], assembly)}%`
        }
      })

      CONSTELLATION.projects.forEach(project => {
        const label = labelRefs.current[project.id]
        if (!label) return
        label.style.left = `${project.label[0]}%`
        label.style.top = `${project.label[1]}%`
      })

      document.documentElement.style.setProperty(
        '--constellation-orb',
        collapse.toFixed(3)
      )

      const phase =
        progress < 0.22
          ? 'DRIFT'
          : progress < 0.58
            ? 'ALIGN'
            : progress < 0.76
              ? 'CONNECT'
              : 'LOCKED'
      section.dataset.constellationPhase = phase
      section.dataset.constellationReady = String(progress > 0.72)
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    window.addEventListener('orientationchange', requestUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.removeEventListener('orientationchange', requestUpdate)
      document.documentElement.style.removeProperty('--constellation-orb')
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`${styles.flow} ${
        variant === 'about' ? styles.flowAbout : ''
      }`}
      aria-label={
        variant === 'about' ? '关于本尊星空入口' : '聚星空间站星空入口'
      }
    >
      <div className={styles.pin}>
        <div className={styles.backdrop} aria-hidden='true'>
          <LazyImage src='/banner/starfield.webp' alt='' priority />
        </div>

        <div className={styles.layout}>
          <div className={styles.copy}>
            <div className={styles.eyebrow}>{eyebrow}</div>
            <h1 className={styles.title}>
              {title}
              <span>{role}</span>
            </h1>
            <p className={styles.headline}>{headline}</p>
            <div className={styles.actions}>
              {actions.map(action => {
                const className = action.primary ? styles.primaryAction : ''
                if (isExternalHref(action.href)) {
                  return (
                    <a
                      key={action.label}
                      className={className}
                      href={action.href}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {action.label}
                      {action.icon && <i className={action.icon} />}
                    </a>
                  )
                }
                return (
                  <SmartLink
                    key={action.label}
                    className={className}
                    href={action.href}
                  >
                    {action.label}
                    {action.icon && <i className={action.icon} />}
                  </SmartLink>
                )
              })}
            </div>
          </div>

          <div className={styles.map} aria-label='北斗七星项目索引'>
            <div className={styles.orbit} aria-hidden='true' />
            <svg
              className={styles.lines}
              viewBox='0 0 1000 600'
              preserveAspectRatio='none'
              aria-hidden='true'
            >
              <path
                ref={pathRef}
                className={styles.line}
                d={CONSTELLATION.path}
              />
              <path className={styles.linePulse} d={CONSTELLATION.path} />
            </svg>

            {CONSTELLATION.projects.map(project => (
              <div
                key={project.id}
                ref={node => {
                  starRefs.current[project.id] = node
                }}
                className={styles.starWrap}
                style={{
                  left: `${project.start[0]}%`,
                  top: `${project.start[1]}%`
                }}
              >
                <a
                  className={styles.star}
                  href={project.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={`${project.letter} 星：${project.title}，${project.description}`}
                >
                  <span className={styles.starLetter}>{project.letter}</span>
                </a>
                <div className={styles.starPop} aria-hidden='true'>
                  <small>STAR {project.letter}</small>
                  <strong>{project.title}</strong>
                  <span>{project.description}</span>
                </div>
              </div>
            ))}

            {CONSTELLATION.auxStars.map(star => (
              <div
                key={star.id}
                ref={node => {
                  starRefs.current[star.id] = node
                }}
                className={`${styles.starWrap} ${styles.starWrapAux}`}
                style={{
                  left: `${star.start[0]}%`,
                  top: `${star.start[1]}%`
                }}
              >
                {isExternalHref(star.href) ? (
                  <a
                    className={styles.star}
                    href={star.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={star.title}
                  />
                ) : (
                  <SmartLink
                    className={styles.star}
                    href={star.href}
                    aria-label={star.title}
                  />
                )}
              </div>
            ))}

            {CONSTELLATION.projects.map(project => (
              <div
                key={`label-${project.id}`}
                ref={node => {
                  labelRefs.current[project.id] = node
                }}
                className={styles.projectLabel}
                data-side={project.id === 'n' ? 'right' : undefined}
                style={{
                  left: `${project.label[0]}%`,
                  top: `${project.label[1]}%`
                }}
              >
                <b>{project.letter}</b>
                <strong>{project.shortTitle}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.hint}>上滑，让星图归位</div>
        <div className={styles.status} aria-hidden='true'>
          <span>ZEYAN CONSTELLATION</span>
          <span className={styles.statusLine} />
          <span>
            {variant === 'about' ? 'PERSONAL ORBIT' : 'ORBITAL ARCHIVE'}
          </span>
        </div>
        {showWaves && <WavesCanvas className={styles.waves} />}
      </div>
    </section>
  )
}
