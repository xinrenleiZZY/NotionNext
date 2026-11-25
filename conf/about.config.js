/**
 * “关于本尊”页面内容配置
 *
 * GitHub API 只负责实时数据；个人叙事、精选项目与展示顺序在这里维护。
 */
const WALLPAPERS = require('./wallpaper.config')

const ABOUT = {
  canonical: 'https://www.juxingspacestation.top/apps/about',
  name: '仙帝 · Zeyan',
  englishName: 'ZENYTH ZHENGYANG',
  role: 'Full-stack Builder · AI Automation · Data & IP',
  headline: '把重复工作交给系统，把时间还给创造。',
  intro:
    '我在 AI 时代做真实可用的软件：从数据采集、自动化决策到企业门户和个人工具。白天处理数据、知识产权与业务系统，晚上继续写代码、做桌面宠物，也把过程沉淀到博客和开源仓库。',
  quote: '能够藏起自己的才能与本事，本身就是一种极高的才能。',
  company: '广州聚星知识产权有限公司',
  location: '中国 · 广州',
  companyDescription:
    '聚焦数据资产确权、知识产权布局与数据合规风控，把复杂规则转化为可执行的业务流程。',
  notice: {
    title: '目前关注',
    body: 'AI 自动化、采购补货决策、企业数据工具，以及可持续维护的个人知识系统。'
  },
  links: [
    {
      label: 'GitHub',
      hint: '@xinrenleiZZY',
      icon: 'fab fa-github',
      href: 'https://github.com/xinrenleiZZY'
    },
    {
      label: '博客',
      hint: 'juxingspacestation.top',
      icon: 'fas fa-globe',
      href: 'https://www.juxingspacestation.top'
    },
    {
      label: '邮箱',
      hint: '2787326121@qq.com',
      icon: 'fas fa-envelope',
      href: 'mailto:2787326121@qq.com'
    },
    {
      label: 'Bilibili',
      hint: '动态与视频',
      icon: 'fab fa-bilibili',
      href: 'https://b23.tv/DH67si5'
    },
    {
      label: '聚星知识产权',
      hint: '公司官网',
      icon: 'fas fa-building-columns',
      href: 'https://www.jxspace.top'
    }
  ],
  currentWork: [
    'AI 驱动的采购补货决策',
    '亚马逊 ASIN 排名监控',
    '企业内部自动化工具',
    'NotionNext 个人站与内容系统'
  ],
  techGroups: [
    {
      title: 'AI & Automation',
      items: ['Python', 'FastAPI', 'LLM', 'Dify', 'OpenClaw', '飞书']
    },
    {
      title: 'Data & Backend',
      items: ['PostgreSQL', 'Redis', 'Docker', 'Linux', 'Hadoop']
    },
    {
      title: 'Product & Frontend',
      items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS']
    }
  ],
  projects: [
    {
      title: 'AutoReplenishment',
      eyebrow: 'AI DECISION SYSTEM',
      description:
        '把采购补货从人工试算变成数据闭环：采集、预测、评分与建议输出集中在一个流程里。',
      result: '采集 → 预测 → 决策 → 建议',
      stack: ['Python', 'FastAPI', 'Next.js'],
      href: 'https://github.com/xinrenleiZZY/AutoReplenishment',
      accent: '#27b88b',
      featured: true
    },
    {
      title: 'amazon_scraper_system',
      eyebrow: 'DATA PIPELINE',
      description:
        '面向亚马逊 ASIN 的排名监控系统，覆盖数据采集、清洗、入库和可视化看板。',
      result: '采集 → 清洗 → 入库 → 看板',
      stack: ['Python', 'FastAPI', 'PostgreSQL'],
      href: 'https://github.com/xinrenleiZZY/amazon_scraper_system',
      accent: '#3c8ce7',
      featured: true
    },
    {
      title: 'openclaw-sync-tray',
      eyebrow: 'MODEL HEALTH CENTER',
      description:
        '多机 OpenClaw 健康监控中心，用统一视图观察模型用量、成本与同步状态。',
      result: '多机监控 · 用量 · 成本',
      stack: ['TypeScript', 'Next.js', 'FastAPI'],
      href: 'https://github.com/xinrenleiZZY/openclaw-sync-tray',
      accent: '#d85d91'
    },
    {
      title: 'Scheduled-Task-System',
      eyebrow: 'WORKFLOW AUTOMATION',
      description:
        '定时触发自动化任务，并把执行结果直接推送到飞书，减少重复巡检和人工提醒。',
      result: '定时触发 → 自动执行 → 飞书通知',
      stack: ['Python', '飞书'],
      href: 'https://github.com/xinrenleiZZY/Scheduled-Task-System',
      accent: '#e49a45'
    }
  ],
  wallpapers: WALLPAPERS
}

module.exports = ABOUT
