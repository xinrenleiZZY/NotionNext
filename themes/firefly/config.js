/**
 * Firefly 主题配置
 * 视觉参考：CuteLeaf/Firefly（Astro，Fuwari 派生）—— 在 NotionNext 内复刻
 * 原版默认 hue=165（青绿），可任意改
 */
const CONFIG = {
  // 主题色相 0-360：165 青绿(原版默认) / 200 青 / 250 蓝 / 300 紫 / 345 粉
  FIREFLY_HUE: 165,
  // 首页 banner
  FIREFLY_BANNER: true,
  FIREFLY_BANNER_HEIGHT: 62,
  FIREFLY_BANNER_INTERVAL: 6,
  // banner 底部水波纹
  FIREFLY_WAVES: true,
  // 首页左右侧栏（左：资料卡 / 右：最新动态+统计）
  FIREFLY_LEFT_SIDEBAR: true,
  FIREFLY_RIGHT_SIDEBAR: true,
  // 列表封面 / 摘要
  FIREFLY_POST_COVER: true,
  FIREFLY_POST_EXCERPT: true,
  // 文章页目录
  FIREFLY_TOC: true,
  // 列表每页条数（覆盖全局 POSTS_PER_PAGE 时不生效，仅作默认）
  FIREFLY_BANNER_DESC: '',

  // ===== 可替换素材 =====
  // banner 轮播图：JSON 数组字符串或逗号分隔 URL，例如
  //   '/Camera Roll/a.jpg,/Camera Roll/b.jpg' 或 '["https://a.jpg","https://b.jpg"]'
  // 留空(null)则自动用「站点封面 + 最近文章封面」；可在 blog.config.js / Notion Config 覆盖
  FIREFLY_BANNER_IMAGES: null,
  // 全站背景图（固定层），留空则用主题底色；支持本地路径或外链
  FIREFLY_WALLPAPER: null,
  // 背景图不透明度 0–1
  // 轮播里是否混入相册图片（数量）
  FIREFLY_BANNER_GALLERY_ENABLE: true,
  FIREFLY_BANNER_GALLERY: 4,
  FIREFLY_WALLPAPER_OPACITY: 0.28,
  // 背景图模糊像素
  FIREFLY_WALLPAPER_BLUR: 2
}

export default CONFIG
