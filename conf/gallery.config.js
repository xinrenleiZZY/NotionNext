/**
 * 相册 / 照片墙配置
 *
 * 使用方式：
 *  - 图片来源三种：
 *    1) 本地图片：src: '/Camera Roll/xxx.jpg'（public 目录下的相对路径）
 *    2) 外部图片：src: 'https://example.com/a.jpg'
 *    3) Pixiv 作品：src 填 i.pximg.net 的直链（组件会自动走 /api/pximg 代理），
 *       并可用 link 指向作品原页，author 署名
 *  - 可用 `node scripts/pixiv-import.mjs <插画ID...>` 自动生成条目
 *
 * 注意：Pixiv 作品版权归原作者所有，请保留作者与原始链接，不要商用。
 */

const GALLERY = {
  ENABLE: true,
  TITLE: '星轨相册',
  DESCRIPTION: '一些喜欢的画面：壁纸、插画与日常收藏。点击可放大查看。',
  /** 瀑布流列数（大屏）：2 / 3 / 4 */
  COLUMNS: 3,
  /** 是否显示标签筛选 */
  SHOW_TAGS: true,

  ITEMS: [
    {
      src: '/Camera Roll/D.C.5 to 4 Luminous Memories 壁紙A 横.jpg',
      title: 'Luminous Memories · A',
      author: 'D.C.5 to 4',
      tags: ['壁纸', 'D.C.'],
      link: ''
    },
    {
      src: '/Camera Roll/D.C.5 to 4 Luminous Memories 壁紙B 横.jpg',
      title: 'Luminous Memories · B',
      author: 'D.C.5 to 4',
      tags: ['壁纸', 'D.C.'],
      link: ''
    },
    {
      src: '/Camera Roll/D.C.5 to 4 Luminous Memories 壁紙カレンダー9月(横).jpg',
      title: 'September Calendar',
      author: 'D.C.5 to 4',
      tags: ['壁纸', '日历'],
      link: ''
    },
    {
      src: '/Camera Roll/banner-arina-hashimoto-pure-no-ui(1).png',
      title: 'Arina Hashimoto',
      author: '未知',
      tags: ['插画', '横幅'],
      link: ''
    },
    {
      src: '/Camera Roll/D.C.5 to 4 Luminous Memories XヘッダーA.jpg',
      title: 'Header A',
      author: 'D.C.5 to 4',
      tags: ['横幅', 'D.C.'],
      link: ''
    },
    {
      src: '/Camera Roll/D.C.5 to 4 Luminous Memories XヘッダーB.jpg',
      title: 'Header B',
      author: 'D.C.5 to 4',
      tags: ['横幅', 'D.C.'],
      link: ''
    },
    {
      src: '/Camera Roll/D.C.5 to 4 Luminous Memories XアイコンA.jpg',
      title: 'Icon A',
      author: 'D.C.5 to 4',
      tags: ['头像'],
      link: ''
    },
    {
      src: '/Camera Roll/D.C.5 to 4 Luminous Memories XアイコンC.jpg',
      title: 'Icon C',
      author: 'D.C.5 to 4',
      tags: ['头像'],
      link: ''
    },
    {
      src: '/Camera Roll/创始人.png',
      title: '创始人',
      author: '聚星',
      tags: ['人物'],
      link: ''
    },
    {
      src: '/Camera Roll/cb2.png',
      title: 'cb2',
      author: '收藏',
      tags: ['插画'],
      link: ''
    },
    {
      src: '/Camera Roll/45712896.png',
      title: '插画收藏 45712896',
      author: '收藏',
      tags: ['插画'],
      link: ''
    },
    {
      src: '/Camera Roll/20260701-105244.jpg',
      title: '夏日日常',
      author: '收藏',
      tags: ['日常'],
      link: ''
    }
  ]
}

module.exports = GALLERY
