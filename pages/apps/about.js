import GitHubShowcase from '@/components/GitHubShowcase'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { fixThemeDOM } from '@/themes/theme'
import { useEffect } from 'react'

/**
 * 关于本尊（GitHub 主页展示）
 * 地址：/apps/about
 */
export default function AboutPage({ githubFallback }) {
  useEffect(() => {
    fixThemeDOM()
    const timer = setTimeout(fixThemeDOM, 400)
    return () => clearTimeout(timer)
  }, [])

  return <GitHubShowcase fallback={githubFallback} />
}

async function fetchGitHubFallback() {
  try {
    const username = process.env.GITHUB_USERNAME || 'xinrenleiZZY'
    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'juxingspacestation-blog'
    }
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`,
        { headers }
      )
    ])
    if (!userRes.ok || !reposRes.ok) return null
    const user = await userRes.json()
    const repos = (await reposRes.json()).filter(repo => !repo.fork)
    const languages = {}
    for (const repo of repos) {
      if (!repo.language) continue
      languages[repo.language] = (languages[repo.language] || 0) + 1
    }
    return {
      user: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        location: user.location,
        html_url: user.html_url,
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos
      },
      stats: {
        repos: repos.length,
        stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        languages: Object.entries(languages)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, count]) => ({ name, count }))
      },
      repos: [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 9)
        .map(repo => ({
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updated_at: repo.updated_at
        }))
    }
  } catch (e) {
    return null
  }
}

export async function getStaticProps(req) {
  const { locale } = req
  const props = (await fetchGlobalAllData({ from: 'about', locale })) || {}
  const githubFallback = await fetchGitHubFallback()
  return { props: { ...props, githubFallback }, revalidate: 3600 }
}
