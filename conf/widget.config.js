/**
 * 悬浮在网页上的挂件
 */
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
    // 永恒仙庭仙尊 专属歌单：古风+国风+二次元
    {
      name: '广寒宫',
      artist: '吴琼 / 平生不晚',
      url: 'https://music.163.com/song/media/outer/url?id=1488358212.mp3',
      cover: 'https://p1.music.126.net/2w-57f6L6aRXX0cBc8Z7SQ==/109951165212817022.jpg'
    },
    {
      name: '赤伶',
      artist: 'HITA',
      url: 'https://music.163.com/song/media/outer/url?id=1330348068.mp3',
      cover: 'https://p2.music.126.net/QF-RfV290Rr5aV1d6JcKdQ==/109951163871312354.jpg'
    },
    {
      name: '踏山河',
      artist: '是七叔呢',
      url: 'https://music.163.com/song/media/outer/url?id=1490156730.mp3',
      cover: 'https://p1.music.126.net/DcVATKQp2QpM8Yp_Y8sLpA==/109951165248384863.jpg'
    },
    {
      name: '崩坏星穹铁道-啁啾小调',
      artist: 'HOYO-MiX',
      url: 'https://music.163.com/song/media/outer/url?id=2101290513.mp3',
      cover: 'https://p1.music.126.net/BQvFv3U0V2w204f-P_2n4Q==/109951168836270357.jpg'
    },
    {
      name: '仙瑶',
      artist: '叶里',
      url: 'https://music.163.com/song/media/outer/url?id=1830131947.mp3',
      cover: 'https://p2.music.126.net/CG56Jq2oT0eDwQ5Fh4d8Xw==/109951166059442198.jpg'
    }
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
