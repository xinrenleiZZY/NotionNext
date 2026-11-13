/**
 * Aurora 主题配置
 * 极光玻璃风格：深空底 + 极光渐变 + 半透明玻璃卡片
 * 所有配置均可被 Notion Config 表 / 环境变量同名项覆盖
 */
const CONFIG = {
  // 首页是否播放背景视频（其余页面一律静态渐变）
  AURORA_HOME_VIDEO: true,
  // 首页主视觉文案（为空则用站点 TITLE / BIO）
  AURORA_HERO_TAGLINE: '',
  // 列表是否显示封面
  AURORA_POST_COVER: true,
  // 列表是否显示摘要
  AURORA_POST_EXCERPT: true,
  // 文章页是否显示右侧目录
  AURORA_TOC: true,
  // 是否显示噪点颗粒（关闭可省一点性能）
  AURORA_GRAIN: true,
  // 首页是否显示统计胶囊
  AURORA_HERO_STATS: true
}

export default CONFIG
