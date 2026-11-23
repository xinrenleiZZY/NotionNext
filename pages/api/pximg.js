/**
 * Pixiv 图片代理
 *
 * Pixiv 的图片 CDN（i.pximg.net）会校验 Referer，直接 <img src> 会被 403。
 * 这个接口在服务端补上 Referer 再回传图片，同时做域名白名单与长缓存。
 *
 * 用法：/api/pximg?url=<encodeURIComponent(https://i.pximg.net/...)> 
 */

const ALLOWED_HOSTS = ['i.pximg.net', 'embed.pixiv.net', 'pixiv.pximg.net']

export default async function handler(req, res) {
  const raw = req.query?.url
  if (!raw) {
    res.status(400).json({ error: 'missing url' })
    return
  }

  let target
  try {
    target = new URL(String(raw))
  } catch (e) {
    res.status(400).json({ error: 'invalid url' })
    return
  }

  const allowed = ALLOWED_HOSTS.some(
    host => target.hostname === host || target.hostname.endsWith(`.${host}`)
  )
  if (!allowed) {
    res.status(403).json({ error: 'host not allowed' })
    return
  }
  if (!/^https?:$/.test(target.protocol)) {
    res.status(400).json({ error: 'invalid protocol' })
    return
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        Referer: 'https://www.pixiv.net/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
      }
    })
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: `upstream ${upstream.status}` })
      return
    }
    const contentType = upstream.headers.get('content-type') || 'image/jpeg'
    const buffer = Buffer.from(await upstream.arrayBuffer())
    res.setHeader('Content-Type', contentType)
    res.setHeader(
      'Cache-Control',
      'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
    )
    res.send(buffer)
  } catch (e) {
    res.status(502).json({ error: 'proxy failed' })
  }
}
