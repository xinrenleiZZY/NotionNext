/**
 * 首页 / 关于本尊共用的北斗项目索引。
 * start/end 坐标为星图区域百分比；end 对应北斗七星的视觉位置。
 */
const CONSTELLATION = {
  projects: [
    {
      id: 'z',
      letter: 'Z',
      title: 'AutoReplenishment',
      shortTitle: 'AI 补货决策',
      description: '采集、预测、评分与补货建议闭环。',
      href: 'https://github.com/xinrenleiZZY/AutoReplenishment',
      start: [17, 82],
      end: [25, 28],
      label: [26.2, 25.4]
    },
    {
      id: 'e',
      letter: 'E',
      title: 'Amazon Monitor',
      shortTitle: 'ASIN 排名监控',
      description: 'ASIN 排名采集、清洗与趋势看板。',
      href: 'https://github.com/xinrenleiZZY/amazon_scraper_system',
      start: [44, 15],
      end: [30, 50],
      label: [31.4, 47.4]
    },
    {
      id: 'y',
      letter: 'Y',
      title: 'OpenClaw MHC',
      shortTitle: '模型健康中心',
      description: '多机模型用量、成本与额度监控。',
      href: 'https://github.com/xinrenleiZZY/openclaw-sync-tray',
      start: [79, 84],
      end: [50, 58],
      label: [51.3, 55.2]
    },
    {
      id: 'a',
      letter: 'A',
      title: 'Scheduled Tasks',
      shortTitle: '定时任务',
      description: '定时触发、自动执行并推送飞书。',
      href: 'https://github.com/xinrenleiZZY/Scheduled-Task-System',
      start: [67, 47],
      end: [61, 34],
      label: [62.4, 31.5]
    },
    {
      id: 'n',
      letter: 'N',
      title: 'NotionNext',
      shortTitle: '聚星空间站',
      description: 'NotionNext 个人站、知识库与内容系统。',
      href: 'https://github.com/xinrenleiZZY/NotionNext',
      start: [9, 23],
      end: [78, 45],
      label: [79.2, 42.4]
    }
  ],
  auxStars: [
    {
      id: 'project-archive',
      title: '查看全部项目',
      href: '/apps/showcase',
      start: [88, 12],
      end: [88, 35]
    },
    {
      id: 'contact',
      title: '联系我',
      href: '/apps/about#about',
      start: [58, 91],
      end: [96, 20]
    }
  ],
  path: 'M250 168 L300 300 L500 348 L610 204 L250 168 M610 204 L780 270 L880 210 L960 120'
}

module.exports = CONSTELLATION
