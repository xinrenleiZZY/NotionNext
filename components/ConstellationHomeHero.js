'use client'

import ConstellationExperience from '@/components/ConstellationExperience'

export default function ConstellationHomeHero() {
  return (
    <ConstellationExperience
      variant='home'
      eyebrow='Orbital archive · 2026'
      title='仙帝 · Zeyan'
      role='Full-stack builder · AI automation · Data & IP'
      headline='把重复工作交给系统，把时间还给创造。'
      actions={[
        {
          label: '沿星图探索',
          href: '#home-feed',
          primary: true,
          icon: 'fas fa-arrow-down text-[10px]'
        },
        {
          label: 'GitHub',
          href: 'https://github.com/xinrenleiZZY',
          icon: 'fab fa-github'
        }
      ]}
    />
  )
}
