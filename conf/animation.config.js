/**
 * 网站美化动效相关
 */
module.exports = {
  // 鼠标点击烟花特效
  FIREWORKS: process.env.NEXT_PUBLIC_FIREWORKS || true, // 开关
  // 烟花色彩（仙帝仙庭风：金+粉+青+紫）
  FIREWORKS_COLOR: [
    '255, 215, 0',
    '236, 72, 153',
    '90, 135, 255',
    '168, 85, 247'
  ],

  // 鼠标跟随特效
  MOUSE_FOLLOW: process.env.NEXT_PUBLIC_MOUSE_FOLLOW || true, // 开关
  // 鼠标类型 11：转圈随机颜色粒子（仙气缭绕感）
  MOUSE_FOLLOW_EFFECT_TYPE: 11, // 1-12
  MOUSE_FOLLOW_EFFECT_COLOR: '#EC4899', // 粉色主色调 契合仙帝·永恒仙庭

  // 樱花飘落特效（仙庭氛围）
  SAKURA: process.env.NEXT_PUBLIC_SAKURA || true, // 开关
  // 漂浮线段特效
  NEST: process.env.NEXT_PUBLIC_NEST || false, // 开关
  // 动态彩带特效
  FLUTTERINGRIBBON: process.env.NEXT_PUBLIC_FLUTTERINGRIBBON || false, // 开关
  // 静态彩带特效
  RIBBON: process.env.NEXT_PUBLIC_RIBBON || false, // 开关
  // 星空雨特效 黑夜模式才会生效（星空=仙庭）
  STARRY_SKY: process.env.NEXT_PUBLIC_STARRY_SKY || true, // 开关
  // ANIMATE.css 动画
  ANIMATE_CSS_URL:
    process.env.NEXT_PUBLIC_ANIMATE_CSS_URL ||
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' // 动画CDN
}
