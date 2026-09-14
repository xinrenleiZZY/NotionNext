/**
 * 悬浮在网页上的挂件
 */

// 网易云歌曲信息构造器
// 说明：music.163.com 的 outer/url 直链在 Vercel 等海外/无 Cookie 环境经常返回 404（版权/风控），
//       因此统一改用 Meting 代理解析真实音频地址，播放更稳定。
// 换歌只需替换 id（歌曲页 https://music.163.com/song?id=xxxxx 里的数字）与封面 picId。
const NETEASE = 'https://api.injahow.cn/meting/'
const song = (id, name, artist, picId) => ({
  name,
  artist,
  url: `${NETEASE}?server=netease&type=url&id=${id}`,
  cover: `${NETEASE}?server=netease&type=pic&id=${picId}`
})

module.exports = {
  THEME_SWITCH: process.env.NEXT_PUBLIC_THEME_SWITCH || true, // 是否显示切换主题按钮
  // AI 聊天机器人相关配置已迁移至 conf/ai.config.js

  // 悬浮挂件
  WIDGET_PET: process.env.NEXT_PUBLIC_WIDGET_PET || true, // 是否显示宠物挂件（换成仙庭风模型）
  WIDGET_PET_LINK:
    process.env.NEXT_PUBLIC_WIDGET_PET_LINK ||
    'https://cdn.jsdelivr.net/npm/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json', // 仙庭风猫又模型
  WIDGET_PET_SWITCH_THEME:
    process.env.NEXT_PUBLIC_WIDGET_PET_SWITCH_THEME || true, // 点击宠物挂件切换博客主题

  SPOILER_TEXT_TAG: process.env.NEXT_PUBLIC_SPOILER_TEXT_TAG || '[sp]', // Spoiler文本隐藏功能，如Notion中 [sp]希望被spoiler的文字[sp]

  // 音乐播放插件（仙帝·仙庭BGM）
  MUSIC_PLAYER: process.env.NEXT_PUBLIC_MUSIC_PLAYER || true, // 是否使用音乐播放插件
  MUSIC_PLAYER_VISIBLE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_VISIBLE || true, // 是否在左下角显示播放和切换
  MUSIC_PLAYER_AUTO_PLAY:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_AUTO_PLAY || false, // 建议不自动播放（现代浏览器限制）
  MUSIC_PLAYER_LRC_TYPE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_LRC_TYPE || '0', // 歌词显示类型
  MUSIC_PLAYER_CDN_URL:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_CDN_URL ||
    'https://cdn.jsdelivr.net/npm/aplayer@1.10.0/dist/APlayer.min.js',
  MUSIC_PLAYER_ORDER: process.env.NEXT_PUBLIC_MUSIC_PLAYER_ORDER || 'random', // 默认播放方式：随机
  MUSIC_PLAYER_AUDIO_LIST: [
    // 仙庭 BGM 歌单：古风 / 国风
    // 注：网易云对部分歌曲只放 30 秒试听（fee=1 VIP），下列曲目均已实测为完整版
    song('1454730043', '赤伶', '李玉刚', '109951165054951989'),
    song('30352891', '牵丝戏', '银临 / Aki阿杰', '7725168696876736'),
    song('1330348068', '起风了', '冯沁苑(买辣椒也用券)', '109951163699673355'),
    song('1332489493', '不染', '毛不易', '109951163718627428'),
    song('28754846', '卷珠帘', '霍尊', '19202970579205912'),
    song('33162226', '悟空', '戴荃', '3333719255417035'),
    song('478693748', '琵琶行', '奇然 / 沈谧仁', '109951162929107589'),
    song('416385506', '大鱼 (Cover 周深)', '双笙（陈元汐）', '109951167829176428'),
    song('28496172', '山鬼', '赵景旭（Winky诗）', '109951164503300910'),
    song('2045806409', '野火 Wildfire', 'HOYO-MiX / Jonathan Steingard', '109951168599498949')
  ],
  MUSIC_PLAYER_METING: process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING || false, // 是否要开启 MetingJS，从平台获取歌单
  MUSIC_PLAYER_METING_SERVER:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_SERVER || 'netease', // 音乐平台
  MUSIC_PLAYER_METING_ID:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_ID || '8152207372', // 国风仙庭歌单ID
  MUSIC_PLAYER_METING_LRC_TYPE:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_LRC_TYPE || '1',

  // 一个小插件展示你的facebook fan page~ @see https://tw.andys.pro/article/add-facebook-fanpage-notionnext
  FACEBOOK_PAGE_TITLE: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_TITLE || null, // 邊欄 Facebook Page widget 的標題欄，填''則無標題欄 e.g FACEBOOK 粉絲團'
  FACEBOOK_PAGE: process.env.NEXT_PUBLIC_FACEBOOK_PAGE || null, // Facebook Page 的連結 e.g https://www.facebook.com/tw.andys.pro
  FACEBOOK_PAGE_ID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '', // Facebook Page ID 來啟用 messenger 聊天功能
  FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '' // Facebook App ID 來啟用 messenger 聊天功能 获取: https://developers.facebook.com/
}
