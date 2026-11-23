#!/usr/bin/env node
/**
 * pixiv-fetch-ranking.mjs
 * 抓 Pixiv 多个排行榜（月/周/日/新人…），过滤敏感内容，合并生成
 * conf/gallery-pixiv.config.js
 *
 * 用法：
 *   PIXIV_COOKIE="PHPSESSID=xxx; cf_clearance=yyy" node scripts/pixiv-fetch-ranking.mjs
 *   PIXIV_COOKIE="..." node scripts/pixiv-fetch-ranking.mjs --modes monthly,weekly,daily,rookie --pages 4 --limit 120
 *   PIXIV_COOKIE="..." node scripts/pixiv-fetch-ranking.mjs --rebuild   # 不合并旧数据，全部重建
 *
 * 说明：
 *  - 需要登录 Cookie（PHPSESSID + cf_clearance）
 *  - 自动过滤 sexual / grotesque / violent / 动图 / 漫画
 *  - 默认「合并」旧条目（按 pixivId 去重），重复运行会越攒越多
 *  - 图片由 /api/pximg 代理，版权归原作者，保留 author 与 link
 */

import fs from 'node:fs'
import path from 'node:path'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36'

const sleep = ms => new Promise(r => setTimeout(r, ms))

function parseArgs() {
  const args = {
    modes: ['monthly', 'weekly', 'daily', 'rookie'],
    pages: 4,
    limit: 120,
    out: 'conf/gallery-pixiv.config.js',
    merge: true,
    includeSensitive: false
  }
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--modes') args.modes = String(argv[++i]).split(',').map(s => s.trim()).filter(Boolean)
    else if (a === '--pages') args.pages = Math.max(1, Number(argv[++i]) || 4)
    else if (a === '--limit') args.limit = Number(argv[++i]) || 120
    else if (a === '--out') args.out = argv[++i]
    else if (a === '--rebuild') args.merge = false
    else if (a === '--include-sensitive') args.includeSensitive = true
  }
  return args
}

async function getJson(url, cookie, referer = 'https://www.pixiv.net/ranking.php') {
  const maxAttempts = 3
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': UA,
          Referer: referer,
          Cookie: cookie,
          Accept: 'application/json'
        }
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      return JSON.parse(text.replace(/^\uFEFF/, ''))
    } catch (e) {
      if (attempt === maxAttempts) throw e
      await sleep(1500 * attempt)
    }
  }
}

function isSafe(item, includeSensitive) {
  const t = item?.illust_content_type || {}
  // 任何模式都排除猎奇/暴力
  if (t.grotesque || t.violent) return false
  if (item?.illust_type !== '0') return false // 只要插画（跳过动图/漫画）
  // 多页作品（漫画/分镜）不要，照片墙只要单张插画
  if (Number(item?.illust_page_count) > 1) return false
  // 默认只要全年龄；--include-sensitive 时允许 sexual 标记（页面侧有 18+ 门禁）
  if (!includeSensitive && Number(t.sexual) > 0) return false
  return true
}

function isSensitive(item) {
  const t = item?.illust_content_type || {}
  return Number(t.sexual) > 0
}

function normalizeTag(tag) {
  if (/users入り|users入$|1000users|10000users|5000users|100users/i.test(tag)) return ''
  return tag
}

function loadExisting(file) {
  try {
    const full = path.resolve(file)
    if (!fs.existsSync(full)) return []
    delete require.cache[require.resolve(full)]
    const mod = require(full)
    return Array.isArray(mod) ? mod : []
  } catch (e) {
    return []
  }
}

async function main() {
  const cookie = process.env.PIXIV_COOKIE || ''
  if (!cookie) {
    console.log('⚠️  缺少 PIXIV_COOKIE（需要 PHPSESSID + cf_clearance）')
    process.exitCode = 1
    return
  }

  const { modes, pages, limit, out, merge, includeSensitive } = parseArgs()
  console.log(`抓取模式：${modes.join(', ')} | 每榜 ${pages} 页 | 目标 ${limit} 张`)

  // 1) 收集候选
  const candidates = new Map()
  for (const mode of modes) {
    for (let p = 1; p <= pages; p++) {
      try {
        const data = await getJson(
          `https://www.pixiv.net/ranking.php?mode=${mode}&content=illust&format=json&p=${p}`,
          cookie
        )
        const list = data?.contents || []
        for (const item of list) {
          const id = String(item.illust_id)
          if (!candidates.has(id)) candidates.set(id, { ...item, _mode: mode })
        }
        console.log(`  ${mode} p${p}: +${list.length}（累计候选 ${candidates.size}）`)
      } catch (e) {
        console.log(`  ${mode} p${p} 失败：${e.message}`)
      }
      await sleep(1500)
    }
  }

  // 2) 过滤 + 打散（各榜交替，保证多样性）
  const byMode = new Map()
  for (const item of candidates.values()) {
    if (!isSafe(item, includeSensitive)) continue
    if (!byMode.has(item._mode)) byMode.set(item._mode, [])
    byMode.get(item._mode).push(item)
  }
  const picked = []
  const queues = [...byMode.values()]
  while (picked.length < limit && queues.some(q => q.length)) {
    for (const q of queues) {
      if (picked.length >= limit) break
      if (q.length) picked.push(q.shift())
    }
  }
  console.log(`过滤后候选 ${picked.length} 张`)

  // 3) 抓详情
  const entries = []
  for (const item of picked) {
    const id = String(item.illust_id)
    let detail = null
    try {
      const ajax = await getJson(`https://www.pixiv.net/ajax/illust/${id}`, cookie, `https://www.pixiv.net/artworks/${id}`)
      detail = ajax?.body || null
    } catch (e) {
      console.log(`  ajax 失败 ${id}: ${e.message}`)
    }
    const src = detail?.urls?.regular || detail?.urls?.original || item.url
    const tags = (detail?.tags?.tags?.map(t => t.tag) || item.tags || [])
      .map(normalizeTag)
      .filter(Boolean)
      .slice(0, 3)
    // 网格用 540 缩略图（省流量），灯箱用 regular 原图
    const thumb =
      src && src.includes('https://i.pximg.net/') && !src.includes('/c/')
        ? src.replace('https://i.pximg.net/', 'https://i.pximg.net/c/540x540_70/')
        : src
    entries.push({
      src,
      thumb,
      title: detail?.title || item.title,
      author: detail?.userName || item.user_name,
      tags: ['Pixiv', ...tags],
      link: `https://www.pixiv.net/artworks/${id}`,
      pixivId: id,
      mode: item._mode,
      ...(isSensitive(item) ? { sensitive: true } : {})
    })
    if (entries.length % 10 === 0) console.log(`  详情进度 ${entries.length}/${picked.length}`)
    await sleep(700)
  }

  // 4) 合并旧数据（新抓的在前，旧条目补在后面）
  const existing = merge ? loadExisting(out) : []
  const merged = []
  const seen = new Set()
  for (const e of [...entries, ...existing]) {
    if (!e?.src || !e?.pixivId) continue
    if (seen.has(e.pixivId)) continue
    seen.add(e.pixivId)
    merged.push(e)
  }
  merged.forEach((e, i) => {
    e.rank = i + 1
  })

  const header = `/**
 * 自动生成：node scripts/pixiv-fetch-ranking.mjs
 * 来源：Pixiv 排行榜（${modes.join('/')}）
 * 抓取时间：${new Date().toISOString()}
 * 共 ${merged.length} 张；版权归原作者，请保留 author / link，勿商用。
 */

module.exports = `
  const target = path.resolve(out)
  fs.writeFileSync(target, header + JSON.stringify(merged, null, 2) + '\n', 'utf8')
  console.log(`\n已生成 ${out}：${merged.length} 张（本次新增 ${entries.length}，历史保留 ${merged.length - entries.length}）`)
}

main().catch(e => {
  console.error(`❌ ${e.message}`)
  process.exitCode = 1
})
