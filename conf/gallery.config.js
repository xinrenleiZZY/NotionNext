/**
 * 相册 / 照片墙配置
 *
 * 图片来源三种：
 *  1) 本地图片：src: '/Camera Roll/xxx.jpg'（public 目录相对路径）
 *  2) 外部图片：src: 'https://example.com/a.jpg'
 *  3) Pixiv 作品：src 填 i.pximg.net 直链（组件自动走 /api/pximg 代理）
 *     并带 author / link / rank（显示「作者出处」与 NO.xx）
 *
 * Pixiv 数据由 `node scripts/pixiv-fetch-ranking.mjs` 自动生成到
 * conf/gallery-pixiv.config.js（排行榜 → 过滤敏感内容 → 生成条目）
 *
 * 注意：Pixiv 作品版权归原作者所有，请保留作者与原始链接，不要商用。
 */

let PIXIV_ITEMS = []
try {
  PIXIV_ITEMS = require('./gallery-pixiv.config')
} catch (e) {
  PIXIV_ITEMS = []
}

/** 本地收藏（public/Camera Roll 下的图） */
const LOCAL_ITEMS = [
  {
    src: '/Camera Roll/D.C.5 to 4 Luminous Memories 壁紙A 横.jpg',
    title: 'Luminous Memories · A',
    author: 'D.C.5 to 4',
    tags: ['壁纸', 'D.C.']
  },
  {
    src: '/Camera Roll/D.C.5 to 4 Luminous Memories 壁紙B 横.jpg',
    title: 'Luminous Memories · B',
    author: 'D.C.5 to 4',
    tags: ['壁纸', 'D.C.']
  },
  {
    src: '/Camera Roll/D.C.5 to 4 Luminous Memories 壁紙カレンダー9月(横).jpg',
    title: 'September Calendar',
    author: 'D.C.5 to 4',
    tags: ['壁纸', '日历']
  },
  {
    src: '/Camera Roll/banner-arina-hashimoto-pure-no-ui(1).png',
    title: 'Arina Hashimoto',
    author: '未知',
    tags: ['插画', '横幅']
  },
  {
    src: '/Camera Roll/创始人.png',
    title: '创始人',
    author: '聚星',
    tags: ['人物']
  },
  {
    src: '/Camera Roll/20260701-105244.jpg',
    title: '夏日日常',
    author: '收藏',
    tags: ['日常']
  }
]

const GALLERY = {
  ENABLE: true,
  TITLE: '星轨相册',
  DESCRIPTION:
    'Pixiv 月榜精选与个人收藏。点击可放大查看，卡片右下角可跳转作者原出处。',
  COLUMNS: 4,
  SHOW_TAGS: true,
  ITEMS: [...PIXIV_ITEMS, ...LOCAL_ITEMS]
}

module.exports = GALLERY
