/**
 * 首页与“关于本尊”页共用壁纸。
 *
 * 素材来自 Unsplash，统一裁切为无文字、无水印的宽幅画面。
 * 路径保持本地，避免第三方图片源失效或拖慢首屏。
 */
const WALLPAPERS = [
  {
    src: '/banner/starfield.webp',
    title: '深空星场',
    source: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3'
  },
  {
    src: '/banner/bubble-nebula.webp',
    title: '气泡星云',
    source: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564'
  },
  {
    src: '/banner/earth-at-night.webp',
    title: '夜航地球',
    source: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa'
  },
  {
    src: '/banner/snow-mountain.webp',
    title: '雪山银河',
    source: 'https://images.unsplash.com/photo-1519681393784-d120267933ba'
  },
  {
    src: '/banner/neon-street.webp',
    title: '霓虹街道',
    source: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455'
  },
  {
    src: '/banner/circuit-board.webp',
    title: '电路星河',
    source: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'
  }
]

module.exports = WALLPAPERS
