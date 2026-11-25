import GalleryWall from '@/components/GalleryWall'
import GALLERY from '@/conf/gallery.config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { compactPageProps } from '@/lib/site/compactPageProps'
import { fixThemeDOM } from '@/themes/theme'
import { useEffect } from 'react'

/**
 * 照片墙 / 相册页
 * 地址：/apps/gallery
 * 数据源：conf/gallery.config.js（本地图片 / 外链 / Pixiv 代理）
 */
export default function GalleryPage(props) {
  // 独立页面不走 DynamicLayout，需手动清理重复的主题根节点（直接访问时会出现 SSR 副本）
  useEffect(() => {
    fixThemeDOM()
    const timer = setTimeout(fixThemeDOM, 400)
    return () => clearTimeout(timer)
  }, [])

  return <GalleryWall config={GALLERY} />
}

export async function getStaticProps(req) {
  const { locale } = req
  const siteData = (await fetchGlobalAllData({ from: 'gallery', locale })) || {}
  return { props: compactPageProps(siteData), revalidate: 60 }
}
