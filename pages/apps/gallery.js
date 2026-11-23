import GalleryWall from '@/components/GalleryWall'
import GALLERY from '@/conf/gallery.config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'

/**
 * 照片墙 / 相册页
 * 地址：/apps/gallery
 * 数据源：conf/gallery.config.js（本地图片 / 外链 / Pixiv 代理）
 */
export default function GalleryPage(props) {
  return <GalleryWall config={GALLERY} />
}

export async function getStaticProps(req) {
  const { locale } = req
  const props = (await fetchGlobalAllData({ from: 'gallery', locale })) || {}
  return { props, revalidate: 60 }
}
