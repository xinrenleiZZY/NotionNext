// 注: process.env.XX是Vercel的环境变量，配置方式见：https://docs.tangly1024.com/article/how-to-config-notion-next#c4768010ae7d44609b744e79e2f9959a

// ============================================================================
// 🔒 启动期环境变量健康检查（仙帝·永恒仙庭·强校验模式）
// ============================================================================
(function bootSanityCheck() {
  const PLACEHOLDER_NOTION_PAGE_ID = 'a335633a431182edbf048156d97c43eb'
  const NOTION_PAGE_ID = (process.env.NOTION_PAGE_ID || PLACEHOLDER_NOTION_PAGE_ID).trim()

  // 1) 占位符 ID 检测 + 强警告
  if (NOTION_PAGE_ID === PLACEHOLDER_NOTION_PAGE_ID) {
    const line = '═'.repeat(78)
    const banner = [
      '',
      line,
      ' ⚠️   NOTION_PAGE_ID 仍然使用【示例占位符】！',
      ' ──────────────────────────────────────────────────────────────────────────',
      '   当前值：' + PLACEHOLDER_NOTION_PAGE_ID,
      '',
      '   👉 Notion API 会返回 403 Forbidden，你会遇到：',
      '      · 所有文章列表为空，点击文章"跳转后没内容"',
      '      · 分类页/标签页/搜索页虽然 200 但没有任何博文',
      '      · /api/rss 返回 503',
      '',
      '   👉 30 秒修复步骤：',
      '      1) 打开项目根目录 → 创建/编辑 .env.local',
      '      2) 复制官方模板  https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5',
      '      3) 重复该页面到自己的 Notion 工作区后，复制新的 Page ID 粘贴进去：',
      '          NOTION_PAGE_ID=你自己的32位Notion页面ID（可带或不带 - ）',
      '      4) 如需解除 403，建议额外填：NOTION_TOKEN_V2=你的notion_token_v2 Cookie值',
      '      5) 重启 npm run dev',
      line,
      ''
    ].join('\n')
    console.warn(banner)
  }

  // 2) 生产态（Vercel）下 LINK 域名必须和真实访问域名一致，避免跳转资源加载跨域
  const LINK = process.env.NEXT_PUBLIC_LINK || 'https://jxspace.top'
  try {
    const url = new URL(LINK)
    if (!['http:', 'https:'].includes(url.protocol)) {
      console.warn('⚠️  [blog.config] NEXT_PUBLIC_LINK 协议必须是 http:// 或 https://，当前：', LINK)
    }
  } catch (_) {
    console.warn('⚠️  [blog.config] NEXT_PUBLIC_LINK 不是合法 URL：', LINK, '—— 内部拼接的 canonical 链接会出错')
  }

  // 3) NOTION_TOKEN_V2 空值 + 生产环境：给一条提醒（403 时用户才知道怎么办）
  if (
    process.env.NODE_ENV === 'production' &&
    !(process.env.NOTION_TOKEN_V2 || '').trim()
  ) {
    console.warn(
      'ℹ️  [blog.config] 生产环境未设置 NOTION_TOKEN_V2；若 Notion API 报 403，请在 .env.local 中填写',
      'NOTION_TOKEN_V2=（从浏览器 Notion Cookie 中提取 token_v2 的值）'
    )
  }
})()

/**
 * 布尔环境变量解析器：区分 string/false/0/off → false
 * 避免 process.env 里的 "false"/"0"/"" 被 || 逻辑当成 truthy
 */
function envBool(envValue, fallback = false) {
  if (envValue === undefined || envValue === null) return fallback
  const v = String(envValue).trim().toLowerCase()
  if (['', 'false', '0', 'off', 'no', 'n', 'disabled'].includes(v)) return false
  if (['true', '1', 'on', 'yes', 'y', 'enabled'].includes(v)) return true
  return fallback
}

const BLOG = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://www.notion.so/api/v3', // API默认请求地址,可以配置成自己的地址例如：https://[xxxxx].notion.site/api/v3
  // Important page_id！！！Duplicate Template from  https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5
  NOTION_PAGE_ID:
    process.env.NOTION_PAGE_ID ||
    'a335633a431182edbf048156d97c43eb',
  THEME: process.env.NEXT_PUBLIC_THEME || 'endspace', // 当前主题，在themes文件夹下可找到所有支持的主题；主题名称就是文件夹名，例如 claude,endspace,example,fukasawa,fuwari,gitbook,heo,hexo,landing,matery,medium,next,nobelium,plog,simple
  LANG: process.env.NEXT_PUBLIC_LANG || 'zh-CN', // e.g 'zh-CN','en-US'  see /lib/lang.js for more.
  SINCE: process.env.NEXT_PUBLIC_SINCE || 2025, // e.g if leave this empty, current year will be used.

  PSEUDO_STATIC: envBool(process.env.NEXT_PUBLIC_PSEUDO_STATIC, false), // 伪静态路径，开启后所有文章URL都以 .html 结尾。
  NEXT_REVALIDATE_SECOND: process.env.NEXT_PUBLIC_REVALIDATE_SECOND || 10, // 更新缓存间隔 单位(秒)；即每个页面有10秒的纯静态期、此期间无论多少次访问都不会抓取notion数据。调小该值让 Notion 数据库的更新能更快在网站生效（默认10秒），代价是 Vercel 资源消耗略增。
  REVALIDATION_TOKEN: process.env.REVALIDATION_TOKEN || '', // On-Demand Revalidation Token，设置后可通过 POST /api/revalidate 立即刷新页面缓存（解决 Notion 内容更新延迟问题）
  APPEARANCE: process.env.NEXT_PUBLIC_APPEARANCE || 'light', // ['light', 'dark', 'auto'], // light 日间模式 ， dark夜间模式， auto根据时间和主题自动夜间模式
  APPEARANCE_DARK_TIME: process.env.NEXT_PUBLIC_APPEARANCE_DARK_TIME || [18, 6], // 夜间模式起至时间，false时关闭根据时间自动切换夜间模式

  AUTHOR: process.env.NEXT_PUBLIC_AUTHOR || '仙帝·Zeyan', // 您的昵称
  BIO: process.env.NEXT_PUBLIC_BIO || '放下本仙尊的阔乐！本仙尊乃永恒仙庭仙尊·游走于数据星系与修仙世界的技术修士', // 作者简介
  LINK: process.env.NEXT_PUBLIC_LINK || 'https://jxspace.top', // 网站地址
  KEYWORDS: process.env.NEXT_PUBLIC_KEYWORD || '仙帝, Zeyan, 永恒仙庭, 聚星知识产权, AI, 技术博客, Python, Docker, Next.js', // 网站关键词 英文逗号隔开
  BLOG_FAVICON: process.env.NEXT_PUBLIC_FAVICON || '/favicon.ico', // blog favicon 配置, 默认使用 /public/favicon.ico，支持在线图片，如 https://img.imesong.com/favicon.png
  BEI_AN: process.env.NEXT_PUBLIC_BEI_AN || '', // 备案号 闽ICP备XXXXXX
  BEI_AN_LINK: process.env.NEXT_PUBLIC_BEI_AN_LINK || 'https://beian.miit.gov.cn/', // 备案查询链接，如果用了萌备等备案请在这里填写
  BEI_AN_GONGAN: process.env.NEXT_PUBLIC_BEI_AN_GONGAN || '', // 公安备案号，例如 '浙公网安备3xxxxxxxx8号'

  // RSS订阅
  ENABLE_RSS: envBool(process.env.NEXT_PUBLIC_ENABLE_RSS, true), // 是否开启RSS订阅功能

  // 其它复杂配置
  // 原配置文件过长，且并非所有人都会用到，故此将配置拆分到/conf/目录下, 按需找到对应文件并修改即可
  ...require('./conf/comment.config'), // 评论插件
  ...require('./conf/contact.config'), // 作者联系方式配置
  ...require('./conf/post.config'), // 文章与列表配置
  ...require('./conf/analytics.config'), // 站点访问统计
  ...require('./conf/image.config'), // 网站图片相关配置
  ...require('./conf/font.config'), // 网站字体
  ...require('./conf/right-click-menu'), // 自定义右键菜单相关配置
  ...require('./conf/code.config'), // 网站代码块样式
  ...require('./conf/animation.config'), // 动效美化效果
  ...require('./conf/widget.config'), // 悬浮在网页上的挂件，聊天客服、宠物挂件、音乐播放器等
  ...require('./conf/ad.config'), // 广告营收插件
  ...require('./conf/plugin.config'), // 其他第三方插件 algolia全文索引
  ...require('./conf/ai.config'), // AI 相关配置（AI摘要、AI聊天机器人等）
  ...require('./conf/performance.config'), // 性能优化配置
  ...require('./conf/top-tag.config'), // 置顶文章全局配置

  // 高级用法
  ...require('./conf/layout-map.config'), // 路由与布局映射自定义，例如自定义特定路由的页面布局
  ...require('./conf/notion.config'), // 读取notion数据库相关的扩展配置，例如自定义表头
  ...require('./conf/dev.config'), // 开发、调试时需要关注的配置

  // 自定义外部脚本，外部样式
  CUSTOM_EXTERNAL_JS: [''], // e.g. ['http://xx.com/script.js','http://xx.com/script.js']
  CUSTOM_EXTERNAL_CSS: [''], // e.g. ['http://xx.com/style.css','http://xx.com/style.css']

  // 自定义菜单
  CUSTOM_MENU: process.env.NEXT_PUBLIC_CUSTOM_MENU || true, // 支持Menu类型的菜单，替代了3.12版本前的Page类型

  // 文章列表相关设置
  CAN_COPY: process.env.NEXT_PUBLIC_CAN_COPY || true, // 是否允许复制页面内容 默认允许，如果设置为false、则全栈禁止复制内容。

  ...require('./conf/techgrow.config'), // 公众号导流插件（TechGrow）

  // 侧栏布局 是否反转(左变右,右变左) 已支持主题: hexo next medium fukasawa example
  LAYOUT_SIDEBAR_REVERSE:
    envBool(process.env.NEXT_PUBLIC_LAYOUT_SIDEBAR_REVERSE, false),

  // 欢迎语打字效果,Hexo,Matery主题支持, 英文逗号隔开多个欢迎语。（仙帝·永恒仙庭风格）
  GREETING_WORDS:
    process.env.NEXT_PUBLIC_GREETING_WORDS ||
    '道友，你来了！,放下本仙尊的阔乐！,本仙尊乃永恒仙庭仙尊,游走于数据星系的技术修士,聚星知识产权·数据确权,欢迎来到永恒仙庭 🎉',

  // 欢迎语打字效果类型速度
  GREETING_WORDS_TYPE_SPEED:
    process.env.NEXT_PUBLIC_GREETING_WORDS_TYPE_SPEED || 120,

  // 欢迎语打字效果回退速度
  GREETING_WORDS_BACK_SPEED:
    process.env.NEXT_PUBLIC_GREETING_WORDS_BACK_SPEED || 60,

  // uuid重定向至 slug
  UUID_REDIRECT: envBool(process.env.UUID_REDIRECT, false)
}

module.exports = BLOG
