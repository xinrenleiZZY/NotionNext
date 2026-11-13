/**
 * Mizuki 主题配置（复刻 matsuzaka-yuki/Mizuki 的 MD3 + 二次元风格）
 * 色相驱动：改 MIZUKI_HUE 即整套换色（Mizuki 原版默认 240，粉色 345）
 */
const CONFIG = {
  // 主题色相 0-360：0 红 / 200 青 / 240 蓝紫(Mizuki 默认) / 345 粉
  MIZUKI_HUE: 345,
  // 首页 banner 轮播
  MIZUKI_BANNER: true,
  // 轮播间隔（秒）
  MIZUKI_BANNER_INTERVAL: 6,
  // banner 高度（vh）
  MIZUKI_BANNER_HEIGHT: 62,
  // banner 水波纹
  MIZUKI_BANNER_WAVES: true,
  // banner 文字（留空用站点 TITLE / BIO）
  MIZUKI_BANNER_TITLE: '',
  MIZUKI_BANNER_SUBTITLE: '',
  // 樱花飘落
  MIZUKI_SAKURA: true,
  // 列表封面 / 摘要
  MIZUKI_POST_COVER: true,
  MIZUKI_POST_EXCERPT: true,
  // 首页右侧栏
  MIZUKI_SIDEBAR: true,
  // 文章页目录
  MIZUKI_TOC: true
}

export default CONFIG
