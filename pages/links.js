import FriendsPage from '@/components/FriendsPage'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { compactPageProps } from '@/lib/site/compactPageProps'
import { fixThemeDOM } from '@/themes/theme'
import { useEffect } from 'react'

export default function LinksPage() {
  useEffect(() => {
    fixThemeDOM()
    const timer = setTimeout(fixThemeDOM, 400)
    return () => clearTimeout(timer)
  }, [])

  return <FriendsPage />
}

export async function getStaticProps({ locale }) {
  const siteData = (await fetchGlobalAllData({ from: 'friends', locale })) || {}
  return { props: compactPageProps(siteData), revalidate: 300 }
}
