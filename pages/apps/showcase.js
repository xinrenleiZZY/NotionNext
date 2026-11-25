import ShowcaseGrid from '@/components/ShowcaseGrid'
import SHOWCASE from '@/conf/showcase.config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { fixThemeDOM } from '@/themes/theme'
import { useEffect } from 'react'

/**
 * 仙术展示（作品墙）
 * 地址：/apps/showcase
 */
export default function ShowcasePage() {
  useEffect(() => {
    fixThemeDOM()
    const timer = setTimeout(fixThemeDOM, 400)
    return () => clearTimeout(timer)
  }, [])

  return <ShowcaseGrid config={SHOWCASE} />
}

export async function getStaticProps(req) {
  const { locale } = req
  const props = (await fetchGlobalAllData({ from: 'showcase', locale })) || {}
  return { props, revalidate: 300 }
}
