import PhotoWall from '@/components/PhotoWall'
import GALLERY from '@/conf/gallery.config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { fixThemeDOM } from '@/themes/theme'
import { useEffect } from 'react'

/**
 * 动漫照片墙
 * 地址：/apps/wall
 * 数据源与相册相同（conf/gallery.config.js），按标签随机抽 12 张
 */
export default function WallPage() {
  // 独立页面不走 DynamicLayout，手动清理重复的主题根节点
  useEffect(() => {
    fixThemeDOM()
    const timer = setTimeout(fixThemeDOM, 400)
    return () => clearTimeout(timer)
  }, [])

  return <PhotoWall config={GALLERY} />
}

export async function getStaticProps(req) {
  const { locale } = req
  const props = (await fetchGlobalAllData({ from: 'wall', locale })) || {}
  return { props, revalidate: 60 }
}
