/**
 * 独立应用页只需要主题外壳和轻量导航数据。
 * 避免把完整 allPages / block 查询结果重复序列化进每个页面。
 */
export function compactPageProps(siteData = {}, extra = {}) {
  return {
    NOTION_CONFIG: siteData.NOTION_CONFIG,
    siteInfo: siteData.siteInfo,
    customNav: siteData.customNav || [],
    customMenu: siteData.customMenu || [],
    categoryOptions: siteData.categoryOptions || [],
    tagOptions: siteData.tagOptions || [],
    latestPosts: siteData.latestPosts || [],
    postCount: siteData.postCount || 0,
    ...extra
  }
}
