/**
 * GitHub 数据代理（关于本尊页使用）
 * - 默认用户名 xinrenleiZZY，可用 GITHUB_USERNAME 覆盖
 * - 可选 GITHUB_TOKEN 提升额度
 * - 结果做 1 小时 CDN 缓存
 */
const USERNAME = process.env.GITHUB_USERNAME || 'xinrenleiZZY'

const headers = () => {
  const h = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'juxingspacestation-blog'
  }
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return h
}

export default async function handler(req, res) {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`, { headers: headers() }),
      fetch(
        `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100&type=owner`,
        { headers: headers() }
      )
    ])

    if (!userRes.ok || !reposRes.ok) {
      res.status(502).json({ error: 'github api failed' })
      return
    }

    const user = await userRes.json()
    const repos = (await reposRes.json()).filter(repo => !repo.fork)

    const languages = {}
    for (const repo of repos) {
      if (!repo.language) continue
      languages[repo.language] = (languages[repo.language] || 0) + 1
    }

    const topRepos = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count || b.size - a.size)
      .slice(0, 9)
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated_at: repo.updated_at,
        topics: repo.topics || []
      }))

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.json({
      user: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        location: user.location,
        blog: user.blog,
        html_url: user.html_url,
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos,
        created_at: user.created_at
      },
      stats: {
        repos: repos.length,
        stars: totalStars,
        languages: Object.entries(languages)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, count]) => ({ name, count }))
      },
      repos: topRepos
    })
  } catch (e) {
    res.status(500).json({ error: 'unexpected error' })
  }
}
