#!/usr/bin/env node
/**
 * pixiv-fetch-ranking.mjs
 * 抓 Pixiv 排行榜（默认月榜插画），生成 conf/gallery-pixiv.config.js
 *
 * 用法：
 *   PIXIV_COOKIE="PHPSESSID=xxx; cf_clearance=yyy" node scripts/pixiv-fetch-ranking.mjs --limit 16
 *   PIXIV_COOKIE="..." node scripts/pixiv-fetch-ranking.mjs --mode daily --limit 12
 *
 * 说明：
 *  - 需要登录 Cookie（PHPSESSID + cf_clearance）；只读取公开排行榜数据
 *  - 自动过滤 sexual / grotesque / violent 等敏感标记的作品
 *  - 生成条目中的 src 是 i.pximg.net 直链，页面里由 /api/pximg 代理
 *  - 版权归原作者：保留 author 与 link，勿商用
 */

import fs from 'node:fs'
import path from 'node:path'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36'

function parseArgs() {
  const args = { mode: 'monthly', limit: 16, out: 'conf/gallery-pixiv.config.js' }
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--mode') args.mode = argv[++i]
    else if (a === '--limit') args.limit = Number(argv[++i]) || 16
    else if (a === '--out') args.out = argv[++i]
  }
  return args
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function getJson(url, cookie) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Referer: 'https://www.pixiv.net/ranking.php',
      Cookie: cookie,
      Accept: 'application/json'
    }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch (e) {
    // ranking.php 有时会返回带 BOM 的 JSON
    return JSON.parse(text.replace(/^\uFEFF/, ''))
  }
}

function isSafe(item) {
  const t = item?.illust_content_type || {}
  // 站点是公开博客：只保留完全无敏感标记的作品
  if (Number(t.sexual) > 0) return false
  if (t.grotesque || t.violent) return false
  if (item?.illust_type !== '0') return false // 只收单图/多图插画，跳过动图、漫画
  return true
}

function normalizeTag(tag) {
  // 过滤掉 "オリジナル10000users入り" 这类统计标签
  if (/users入り|1000users|10000users|5000users|100users/i.test(tag)) return ''
  return tag
}

async function main() {
  const cookie = process.env.PIXIV_COOKIE || ''
  if (!cookie) {
    console.log('⚠️  缺少 PIXIV_COOKIE，请在浏览器登录 pixiv 后复制 Cookie')
    console.log('   PIXIV_COOKIE="PHPSESSID=...; cf_clearance=..." node scripts/pixiv-fetch-ranking.mjs')
    process.exitCode = 1
    return
  }

  const { mode, limit, out } = parseArgs()
  console.log(`抓取 Pixiv 排行榜：mode=${mode} limit=${limit}`)

  const rankingUrl = `https://www.pixiv.net/ranking.php?mode=${mode}&content=illust&format=json&p=1`
  const ranking = await getJson(rankingUrl, cookie)
  const items = [...(ranking?.contents || [])]
  // 一页 50 条不够（过滤后偏少）时再抓第二页
  if (items.length < limit * 3) {
    try {
      const page2 = await getJson(
        `https://www.pixiv.net/ranking.php?mode=${mode}&content=illust&format=json&p=2`,
        cookie
      )
      items.push(...(page2?.contents || []))
    } catch (e) {
      console.log(`  第二页抓取失败：${e.message}`)
    }
  }
  console.log(`榜单候选 ${items.length} 条`)

  const entries = []
  let rank = 0
  for (const item of items) {
    if (entries.length >= limit) break
    rank++
    if (!isSafe(item)) continue

    let detail = null
    try {
      const ajax = await getJson(
        `https://www.pixiv.net/ajax/illust/${item.illust_id}`,
        cookie
      )
      detail = ajax?.body || null
    } catch (e) {
      console.log(`  ajax 失败 ${item.illust_id}: ${e.message}`)
    }

    const src =
      detail?.urls?.regular ||
      detail?.urls?.original ||
      item.url
    const tags = (detail?.tags?.tags?.map(t => t.tag) || item.tags || [])
      .map(normalizeTag)
      .filter(Boolean)
      .slice(0, 3)

    entries.push({
      src,
      title: detail?.title || item.title,
      author: detail?.userName || item.user_name,
      tags: ['Pixiv', ...tags],
      link: `https://www.pixiv.net/artworks/${item.illust_id}`,
      pixivId: String(item.illust_id),
      rank: entries.length + 1
    })
    console.log(`  ✅ #${entries.length} ${item.illust_id} ${detail?.title || item.title}`)
    await sleep(700)
  }

  const header = `/**
 * 自动生成：node scripts/pixiv-fetch-ranking.mjs --limit ${limit}
 * 来源：Pixiv ${mode} 排行榜（抓取时间 ${new Date().toISOString()}）
 * 版权归原作者；请保留 author / link，勿商用。
 */

module.exports = `
  fs.writeFileSync(path.resolve(out), header + JSON.stringify(entries, null, 2) + '\n', 'utf8')
  console.log(`\n已生成 ${out}（${entries.length} 条）`)
}

main().catch(e => {
  console.error(`❌ ${e.message}`)
  process.exitCode = 1
})
