#!/usr/bin/env node
/**
 * pixiv-import.mjs
 * 把 Pixiv 插画 ID 批量转成 conf/gallery.config.js 的 ITEMS 条目。
 *
 * 用法：
 *   PIXIV_COOKIE="PHPSESSID=xxxx" node scripts/pixiv-import.mjs 12345678 23456789
 *   PIXIV_COOKIE="PHPSESSID=xxxx" node scripts/pixiv-import.mjs --file ids.txt
 *
 * 说明：
 *  - Pixiv 的 ajax 接口需要登录 Cookie（PHPSESSID），否则返回 403。
 *    浏览器登录 pixiv 后，F12 → Application → Cookies → https://www.pixiv.net → PHPSESSID。
 *  - 输出的 src 是 i.pximg.net 直链，站点里的相册组件会自动走 /api/pximg 代理。
 *  - 版权归原作者，请保留 author 与 link，勿商用。
 */

import fs from 'node:fs'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'

function parseIds(argv) {
  const ids = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--file') {
      const file = argv[++i]
      if (file && fs.existsSync(file)) {
        for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
          const m = line.match(/(\d{5,})/)
          if (m) ids.push(m[1])
        }
      }
      continue
    }
    const m = String(arg).match(/(\d{5,})/)
    if (m) ids.push(m[1])
  }
  return [...new Set(ids)]
}

async function fetchIllust(id, cookie) {
  const res = await fetch(`https://www.pixiv.net/ajax/illust/${id}`, {
    headers: {
      'User-Agent': UA,
      Referer: `https://www.pixiv.net/artworks/${id}`,
      Cookie: cookie,
      Accept: 'application/json'
    }
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  const data = await res.json()
  if (data?.error) throw new Error(data.message || 'pixiv error')
  return data.body
}

function toEntry(body, id) {
  const tags = (body?.tags?.tags || []).map(t => t.tag).slice(0, 4)
  return {
    src: body?.urls?.regular || body?.urls?.original || '',
    title: body?.title || `pixiv ${id}`,
    author: body?.userName || '',
    tags: ['Pixiv', ...tags],
    link: `https://www.pixiv.net/artworks/${id}`
  }
}

function printEntries(entries) {
  console.log('\n// 把下面条目追加到 conf/gallery.config.js 的 ITEMS 数组里：\n')
  for (const entry of entries) {
    console.log('    {')
    console.log(`      src: ${JSON.stringify(entry.src)},`)
    console.log(`      title: ${JSON.stringify(entry.title)},`)
    console.log(`      author: ${JSON.stringify(entry.author)},`)
    console.log(`      tags: ${JSON.stringify(entry.tags)},`)
    console.log(`      link: ${JSON.stringify(entry.link)}`)
    console.log('    },')
  }
  console.log('')
}

async function main() {
  const ids = parseIds(process.argv.slice(2))
  if (!ids.length) {
    console.log('用法：PIXIV_COOKIE="PHPSESSID=xxx" node scripts/pixiv-import.mjs <插画ID...> [--file ids.txt]')
    process.exitCode = 1
    return
  }

  const cookie = process.env.PIXIV_COOKIE || ''
  if (!cookie) {
    console.log('⚠️  未设置 PIXIV_COOKIE。Pixiv ajax 接口需要登录 Cookie。')
    console.log('   设置方式：PIXIV_COOKIE="PHPSESSID=xxxx" node scripts/pixiv-import.mjs ' + ids[0])
    process.exitCode = 1
    return
  }

  const entries = []
  for (const id of ids) {
    try {
      const body = await fetchIllust(id, cookie)
      entries.push(toEntry(body, id))
      console.log(`✅ ${id} ${body.title}`)
    } catch (e) {
      console.log(`❌ ${id}: ${e.message}`)
    }
    await new Promise(r => setTimeout(r, 800))
  }
  if (entries.length) printEntries(entries)
}

main().catch(e => {
  console.error(e.message)
  process.exitCode = 1
})
