/**
 * 仙术展示（项目作品集）数据
 * 参考 jlern.com：大标题 + 分类筛选 + 作品网格（悬停动效）
 *
 * cover 建议用本地图（public 下路径），避免外链加载慢
 */
const SHOWCASE = {
  TITLE: '仙术展示',
  SUBTITLE: '把做过的东西摆成一面墙：开源项目、企业系统、AI 实验与小工具。',
  CATEGORIES: ['全部', 'AI / 自动化', '数据采集', 'Web / 建站', '工具', '企业服务'],

  ITEMS: [
    {
      title: 'yours_doro_baby',
      subtitle: '桌面宠物 · 修仙系统',
      desc: 'Electron 44 + 295 个动作帧，内置修仙境界、AI 聊天（OpenAI 兼容）、局域网社交与麦克风音频驱动口型。',
      tags: ['Electron', 'AI', '动画'],
      category: 'AI / 自动化',
      year: '2025',
      href: 'https://github.com/xinrenleiZZY/yours_doro_baby',
      cover: '/Camera Roll/45712896.png'
    },
    {
      title: 'MHC 模型健康监控中心',
      subtitle: '多机 AI 用量可视化',
      desc: '三容器（Web / API / PostgreSQL），采集 CLI、桌面端、OpenClaw 的 token 用量，成本折算与额度告警一条链路打通。',
      tags: ['Next.js 15', 'FastAPI', 'PG16'],
      category: 'AI / 自动化',
      year: '2025',
      href: 'https://github.com/xinrenleiZZY/openclaw-sync-tray',
      cover: '/Camera Roll/D.C.5 to 4 Luminous Memories XヘッダーA.jpg'
    },
    {
      title: 'anti_scraping',
      subtitle: '亚马逊采集系统',
      desc: 'FastAPI + PostgreSQL 分层架构：任务队列、断点续采、UA/节奏控制、失败退避与代理分流，准生产级采集。',
      tags: ['FastAPI', '爬虫', 'PostgreSQL'],
      category: '数据采集',
      year: '2025',
      href: 'https://github.com/xinrenleiZZY/anti_scraping',
      cover: '/Camera Roll/D.C.5 to 4 Luminous Memories 壁紙カレンダー8月(横).jpg'
    },
    {
      title: 'AutoReplenishment',
      subtitle: '自动补货决策系统',
      desc: '采集 → 预测 → 评分 → 建议的完整闭环，把补货从「拍脑袋」变成可解释的分数与阈值。',
      tags: ['Python', '预测', '决策'],
      category: '企业服务',
      year: '2025',
      href: 'https://github.com/xinrenleiZZY/AutoReplenishment',
      cover: '/Camera Roll/banner-arina-hashimoto-pure-no-ui(1).png'
    },
    {
      title: '实时物流追踪库',
      subtitle: '多源数据汇聚',
      desc: '物流轨迹的实时写入与查询，按运单聚合、异常节点标记，支撑客服与运营的查件场景。',
      tags: ['Python', 'PostgreSQL', '实时'],
      category: '企业服务',
      year: '2025',
      href: 'https://github.com/xinrenleiZZY/Real-time-Logistics-Tracking-Database',
      cover: '/Camera Roll/D.C.5 to 4 Luminous Memories XヘッダーB.jpg'
    },
    {
      title: 'Scheduled-Task-System',
      subtitle: '定时任务 + 飞书通知',
      desc: '定时触发、失败重试、结果推飞书；把「每天该跑的事」变成不会忘记的自动化。',
      tags: ['Python', '调度', '飞书 API'],
      category: '工具',
      year: '2025',
      href: 'https://github.com/xinrenleiZZY/Scheduled-Task-System',
      cover: '/Camera Roll/创始人.png'
    },
    {
      title: 'NotionNext · Firefly 主题',
      subtitle: '本站源码与主题',
      desc: 'Notion 作 CMS 的博客，复刻 Firefly 布局并扩展：无缝水波纹、Lenis 平滑滚动、入场动画、相册/照片墙。',
      tags: ['Next.js', 'Notion API', 'Tailwind'],
      category: 'Web / 建站',
      year: '2026',
      href: 'https://github.com/xinrenleiZZY/NotionNext',
      cover: '/Camera Roll/D.C.5 to 4 Luminous Memories 壁紙A 横.jpg'
    },
    {
      title: 'qixi-sur',
      subtitle: '七夕互动页面',
      desc: '星轨入场、时间轴与彩蛋解锁，单页无框架实现，移动端优先，首屏 1.5 秒内出字。',
      tags: ['Canvas', '动效', '单页'],
      category: 'Web / 建站',
      year: '2025',
      href: 'https://github.com/xinrenleiZZY/qixi-sur',
      cover: '/Camera Roll/cb2.png'
    },
    {
      title: '数据知识产权服务',
      subtitle: '聚星 · 企业能力',
      desc: '数据资产盘点、登记辅导、合规评估与数据产品设计，把「数据」变成可确权、可入表的资产。',
      tags: ['合规', '数据资产', '咨询'],
      category: '企业服务',
      year: '2026',
      href: '/article/data-ip-rights',
      cover: '/Camera Roll/D.C.5 to 4 Luminous Memories 壁紙B 横.jpg'
    }
  ],

  /**
   * 关于合作（原 /portfolio 页面内容合并到这里）
   */
  COOPERATION: {
    TITLE: '关于合作',
    DESC: '数据资产确权 · 知识产权布局 · 数据合规风控。技术之外，也做「把数据变成资产」这件事。',
    CAPABILITIES: [
      {
        title: '数据资产盘点',
        desc: '梳理数据来源、类型与权属链，明确哪些数据可登记、可入表、可交易。'
      },
      {
        title: '登记与合规辅导',
        desc: '数据知识产权登记材料准备、流程跟进；采集合法性、个人信息与跨境传输评估。'
      },
      {
        title: '数据产品设计',
        desc: '把原始数据加工成可交付的产品：指标、报表、接口或数据集，并配套合规边界。'
      }
    ],
    DIRECTIONS: [
      'Notion + Next.js 建站与主题定制',
      '合规范围内的准生产级数据采集',
      'AI 工程化：多模型接入 / 成本监控 / 工作流',
      '桌面与工具应用（Electron / Python）',
      '数据合规咨询（跨境电商 / 个人信息 / 出境评估）'
    ],
    CONTACTS: [
      { label: 'GitHub', value: '@xinrenleiZZY', href: 'https://github.com/xinrenleiZZY' },
      { label: '邮箱', value: '2787326121@qq.com', href: 'mailto:2787326121@qq.com' },
      { label: '博客', value: 'juxingspacestation.top', href: 'https://www.juxingspacestation.top' }
    ]
  }
}

module.exports = SHOWCASE
