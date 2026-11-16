#!/usr/bin/env node
/**
 * article-to-notion.mjs
 * ------------------------------------------------------------
 * 把 article-contents/*.md 一键发布到 Notion 数据库，供 NotionNext 渲染。
 *
 * 用法：
 *   node scripts/article-to-notion.mjs article-contents/foo.md
 *   node scripts/article-to-notion.mjs article-contents/foo.md --dry-run
 *   node scripts/article-to-notion.mjs article-contents/foo.md --update
 *   node scripts/article-to-notion.mjs article-contents/foo.md --update --replace
 *   node scripts/article-to-notion.mjs --list-databases
 *
 * 环境变量（放 .env.local，脚本会自动读取）：
 *   NOTION_API_KEY       必填，Notion 内部集成 Token（secret_xxx）
 *   NOTION_DATABASE_ID   可选，文章数据库 ID；不填则自动在 NOTION_PAGE_ID 下查找 child_database
 *   NOTION_PAGE_ID       站点根页面 ID（默认从 blog.config.js 读取）
 *
 * 说明：默认属性名与 conf/notion.config.js 的 NOTION_PROPERTY_NAME 对齐
 *       （title / slug / date / category / tags / summary / type / status），
 *       若你的 Notion 用了自定义表头，脚本会按「类型 + 名称别名」自动匹配。
 * ------------------------------------------------------------
 */

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const ROOT = process.cwd()
const API = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

// ============================================================
// 1. 环境变量
// ============================================================

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return
  const text = fs.readFileSync(file, 'utf8')
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

function loadEnv() {
  loadEnvFile(path.join(ROOT, '.env.local'))
  loadEnvFile(path.join(ROOT, '.env'))
}

function readBlogConfig() {
  try {
    const cfg = require(path.join(ROOT, 'blog.config.js'))
    return cfg || {}
  } catch (e) {
    return {}
  }
}

// ============================================================
// 2. Front-matter
// ============================================================

function parseFrontMatter(text) {
  const normalized = text.replace(/^\uFEFF/, '')
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { data: {}, body: normalized.trim() }
  }
  const [, head, body] = match
  const data = {}
  for (const rawLine of head.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const idx = line.indexOf(':')
    if (idx < 0) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    } else if (value === 'true') {
      value = true
    } else if (value === 'false') {
      value = false
    } else if (/^-?\d+(\.\d+)?$/.test(value)) {
      value = Number(value)
    } else if (value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value)
      } catch (e) {
        value = value.slice(1, -1).split(',')
      }
    }
    data[key] = value
  }
  return { data, body: body.trim() }
}

// ============================================================
// 3. Markdown -> Notion blocks
// ============================================================

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*|_[^_\n]+_|\[[^\]]+\]\([^)]+\))/g

function richText(text, options = {}) {
  const source = String(text ?? '')
  if (!source) return []
  const chunks = source.split(INLINE_PATTERN).filter(Boolean)
  const result = []
  for (const chunk of chunks) {
    if (/^\*\*[^*]+\*\*$/.test(chunk)) {
      result.push(rt(chunk.slice(2, -2), { bold: true }, options))
    } else if (/^`[^`]+`$/.test(chunk)) {
      result.push(rt(chunk.slice(1, -1), { code: true }, options))
    } else if (/^\*[^*\n]+\*$/.test(chunk)) {
      result.push(rt(chunk.slice(1, -1), { italic: true }, options))
    } else if (/^_[^_\n]+_$/.test(chunk)) {
      result.push(rt(chunk.slice(1, -1), { italic: true }, options))
    } else if (/^\[[^\]]+\]\([^)]+\)$/.test(chunk)) {
      const m = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      result.push(rt(m[1], {}, { ...options, link: m[2] }))
    } else {
      result.push(rt(chunk, {}, options))
    }
  }
  return result.filter(item => item.text.content !== '')
}

function rt(content, annotations, options = {}) {
  const item = {
    type: 'text',
    text: { content: String(content).slice(0, 2000) }
  }
  const keys = Object.keys(annotations || {})
  if (keys.length) {
    item.annotations = {}
    for (const key of keys) item.annotations[key] = annotations[key]
  }
  if (options.link) {
    item.text.link = { url: options.link }
  }
  return item
}

function blockParagraph(text) {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: richText(text) }
  }
}

function blockHeading(level, text) {
  const type = `heading_${Math.min(Math.max(level, 1), 3)}`
  return {
    object: 'block',
    type,
    [type]: { rich_text: richText(text) }
  }
}

function blockQuote(text) {
  return {
    object: 'block',
    type: 'quote',
    quote: { rich_text: richText(text) }
  }
}

function blockCode(language, content) {
  return {
    object: 'block',
    type: 'code',
    code: {
      rich_text: [
        { type: 'text', text: { content: String(content).slice(0, 2000) } }
      ],
      language: normalizeLanguage(language)
    }
  }
}

function normalizeLanguage(language) {
  const supported = [
    'javascript', 'typescript', 'python', 'json', 'bash', 'shell', 'html',
    'css', 'sql', 'yaml', 'markdown', 'java', 'go', 'rust', 'c', 'c++',
    'c#', 'php', 'ruby', 'kotlin', 'swift', 'docker', 'plain text'
  ]
  const raw = String(language || 'plain text').toLowerCase()
  const alias = {
    js: 'javascript', ts: 'typescript', py: 'python', sh: 'bash',
    zsh: 'bash', yml: 'yaml', md: 'markdown', dockerfile: 'docker',
    'plaintext': 'plain text', text: 'plain text', '': 'plain text'
  }
  const mapped = alias[raw] || raw
  return supported.includes(mapped) ? mapped : 'plain text'
}

function blockDivider() {
  return { object: 'block', type: 'divider', divider: {} }
}

function blockImage(url, alt) {
  return {
    object: 'block',
    type: 'image',
    image: {
      type: 'external',
      external: { url },
      caption: alt ? richText(alt) : []
    }
  }
}

function blockTable(rows) {
  const header = rows[0] || []
  const width = header.length
  const dataRows = rows.map(cells => {
    const normalized = []
    for (let i = 0; i < width; i++) {
      normalized.push(richText(cells[i] || ''))
    }
    return {
      object: 'block',
      type: 'table_row',
      table_row: { cells: normalized }
    }
  })
  return {
    object: 'block',
    type: 'table',
    table: {
      table_width: width,
      has_column_header: true,
      has_row_header: false,
      children: dataRows
    }
  }
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(cell => cell.trim())
}

function isTableDivider(line) {
  return /^\|?[\s:|-]+\|?$/.test(line) && line.includes('-')
}

function markdownToBlocks(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // 空行
    if (!line.trim()) {
      i++
      continue
    }

    // 代码块
    const fence = line.match(/^```(\w*)\s*$/)
    if (fence) {
      const language = fence[1]
      const buffer = []
      i++
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buffer.push(lines[i])
        i++
      }
      i++ // 跳过结束 ```
      blocks.push(blockCode(language, buffer.join('\n')))
      continue
    }

    // 标题
    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      blocks.push(blockHeading(heading[1].length, heading[2].trim()))
      i++
      continue
    }

    // 分隔线
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push(blockDivider())
      i++
      continue
    }

    // 表格
    if (line.trim().startsWith('|')) {
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        if (!isTableDivider(lines[i])) {
          rows.push(splitTableRow(lines[i]))
        }
        i++
      }
      if (rows.length) blocks.push(blockTable(rows))
      continue
    }

    // 引用
    if (/^>\s?/.test(line)) {
      const buffer = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buffer.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push(blockQuote(buffer.join('\n').trim()))
      continue
    }

    // 图片
    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/)
    if (image) {
      blocks.push(blockImage(image[2], image[1]))
      i++
      continue
    }

    // 无序列表
    if (/^\s*[-*+]\s+/.test(line)) {
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        const text = lines[i].replace(/^\s*[-*+]\s+/, '').trim()
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: { rich_text: richText(text) }
        })
        i++
      }
      continue
    }

    // 有序列表
    if (/^\s*\d+\.\s+/.test(line)) {
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        const text = lines[i].replace(/^\s*\d+\.\s+/, '').trim()
        blocks.push({
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: { rich_text: richText(text) }
        })
        i++
      }
      continue
    }

    // 普通段落（连续行合并）
    const buffer = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6}\s|```|>\s?|\s*[-*+]\s+|\s*\d+\.\s+|!\[|\||-{3,}\s*$)/.test(lines[i])
    ) {
      buffer.push(lines[i].trim())
      i++
    }
    if (buffer.length) {
      blocks.push(blockParagraph(buffer.join('\n')))
    } else {
      i++
    }
  }

  return blocks
}

// ============================================================
// 4. Notion API 客户端
// ============================================================

function getToken() {
  return process.env.NOTION_API_KEY || process.env.NOTION_TOKEN || ''
}

async function notionRequest(method, endpoint, body, retries = 3) {
  const token = getToken()
  if (!token) {
    throw new Error(
      '缺少 NOTION_API_KEY。请在 .env.local 里配置内部集成 Token（secret_xxx）。'
    )
  }
  const url = endpoint.startsWith('http') ? endpoint : `${API}${endpoint}`
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })
    if (response.status === 429 || response.status >= 500) {
      const retryAfter = Number(response.headers.get('retry-after')) || 1
      if (attempt < retries) {
        await sleep(retryAfter * 1000)
        continue
      }
    }
    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Notion API ${method} ${endpoint} 失败 (${response.status}): ${text}`)
    }
    return response.status === 204 ? {} : response.json()
  }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function listChildDatabases(pageId) {
  const databases = []
  let cursor
  do {
    const query = cursor ? `?start_cursor=${cursor}&page_size=100` : '?page_size=100'
    const data = await notionRequest('GET', `/blocks/${pageId}/children${query}`)
    for (const block of data.results || []) {
      if (block.type === 'child_database') {
        databases.push({ id: block.id, title: block.child_database?.title || '(未命名数据库)' })
      }
      if (block.has_children && block.type === 'column_list') {
        // 跳过复杂嵌套，避免无谓请求
      }
    }
    cursor = data.has_more ? data.next_cursor : null
  } while (cursor)
  return databases
}

async function resolveDatabase(explicitId, blogConfig) {
  if (explicitId) return explicitId
  if (process.env.NOTION_DATABASE_ID) return process.env.NOTION_DATABASE_ID
  const pageId = process.env.NOTION_PAGE_ID || blogConfig.NOTION_PAGE_ID
  if (!pageId) {
    throw new Error('未指定数据库：请设置 NOTION_DATABASE_ID，或在 .env.local 配置 NOTION_PAGE_ID。')
  }
  const databases = await listChildDatabases(pageId)
  if (databases.length === 1) return databases[0].id
  if (databases.length === 0) {
    throw new Error(`页面 ${pageId} 下没有找到 child_database。请把文章数据库分享给集成，或直接设置 NOTION_DATABASE_ID。`)
  }
  const list = databases.map(db => `  - ${db.title}  →  ${db.id}`).join('\n')
  throw new Error(
    `页面下发现多个数据库，请用 --database <id> 指定：\n${list}`
  )
}

async function getSchema(databaseId) {
  const data = await notionRequest('GET', `/databases/${databaseId}`)
  const map = {}
  for (const [name, property] of Object.entries(data.properties || {})) {
    map[name] = property
  }
  return { title: data.title, properties: map }
}

// ============================================================
// 5. 属性映射
// ============================================================

const FIELD_ALIASES = {
  title: ['title', '标题', '名称', 'name'],
  slug: ['slug', '别名', '路径', 'url'],
  date: ['date', '日期', '发布时间', 'published'],
  category: ['category', '分类', '类别'],
  tags: ['tags', 'tag', '标签'],
  summary: ['summary', '摘要', '描述', 'description'],
  type: ['type', '类型', '文章类型'],
  status: ['status', '状态'],
  icon: ['icon', '图标'],
  password: ['password', '密码'],
  pin: ['pin', '置顶', 'top']
}

function pickProperty(schemaProps, field) {
  const entries = Object.entries(schemaProps)
  const aliases = (FIELD_ALIASES[field] || [field]).map(a => a.toLowerCase())
  // 1) 名称完全匹配（忽略大小写）
  for (const [name, prop] of entries) {
    if (aliases.includes(name.toLowerCase())) return { name, prop }
  }
  // 2) 名称包含匹配 + 类型校验
  for (const [name, prop] of entries) {
    const lower = name.toLowerCase()
    if (aliases.some(a => lower.includes(a))) return { name, prop }
  }
  return null
}

function pickByType(schemaProps, types) {
  for (const [name, prop] of Object.entries(schemaProps)) {
    if (types.includes(prop.type)) return { name, prop }
  }
  return null
}

function toPropertyValue(prop, value) {
  if (value === undefined || value === null || value === '') return null
  switch (prop.type) {
    case 'title':
      return { title: richText(value) }
    case 'rich_text':
      return { rich_text: richText(value) }
    case 'select':
      return { select: { name: String(value) } }
    case 'multi_select':
      return {
        multi_select: (Array.isArray(value) ? value : String(value).split(','))
          .map(item => String(item).trim())
          .filter(Boolean)
          .map(name => ({ name }))
      }
    case 'date':
      return { date: { start: normalizeDate(value) } }
    case 'checkbox':
      return { checkbox: value === true || value === 'true' }
    case 'number':
      return { number: Number(value) }
    case 'url':
      return { url: String(value) }
    case 'email':
      return { email: String(value) }
    case 'status':
      return { status: { name: String(value) } }
    default:
      return null
  }
}

function normalizeDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const raw = String(value).trim()
  // 支持 2026-11-16 / 2026/11/16 / 2026年11月16日
  const cn = raw.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/)
  if (cn) {
    return `${cn[1]}-${String(cn[2]).padStart(2, '0')}-${String(cn[3]).padStart(2, '0')}`
  }
  const m = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  if (m) {
    return `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}`
  }
  return raw
}

function buildProperties(frontMatter, schemaProps, options = {}) {
  const mapped = {}
  const warnings = []
  const assign = (field, value) => {
    if (value === undefined || value === null || value === '') return
    const found = pickProperty(schemaProps, field)
    if (!found) {
      warnings.push(`数据库缺少「${field}」对应属性，已跳过（值：${String(value).slice(0, 40)}）`)
      return
    }
    const converted = toPropertyValue(found.prop, value)
    if (!converted) {
      warnings.push(`属性「${found.name}」类型 ${found.prop.type} 不支持写入「${field}」，已跳过`)
      return
    }
    mapped[found.name] = converted
  }

  assign('title', frontMatter.title)
  assign('slug', frontMatter.slug)
  assign('date', frontMatter.date)
  assign('category', frontMatter.category)
  assign('tags', frontMatter.tags)
  assign('summary', frontMatter.summary)
  assign('type', options.type || frontMatter.type || 'Post')
  assign('status', options.status || frontMatter.status || 'Published')
  assign('icon', frontMatter.icon)
  assign('password', frontMatter.password)

  // title 兜底：数据库唯一的 title 类型属性
  const hasTitle = Object.values(mapped).some(value => value.title)
  if (!hasTitle) {
    const titleProp = pickByType(schemaProps, ['title'])
    if (titleProp && frontMatter.title) {
      mapped[titleProp.name] = { title: richText(frontMatter.title) }
    }
  }

  // tags 兜底：数据库里唯一的 multi_select 属性
  const hasTags = Object.values(mapped).some(value => value.multi_select)
  if (!hasTags && frontMatter.tags) {
    const multiProp = pickByType(schemaProps, ['multi_select'])
    if (multiProp) {
      mapped[multiProp.name] = toPropertyValue(multiProp.prop, frontMatter.tags)
    }
  }

  // pin: true 时注入 TOP_TAG（NotionNext 的置顶机制是按标签）
  const topTag = process.env.TOP_TAG || process.env.NEXT_PUBLIC_TOP_TAG
  if ((frontMatter.pin === true || frontMatter.pin === 'true') && topTag) {
    const tagsProp = pickProperty(schemaProps, 'tags')
    if (tagsProp && tagsProp.prop.type === 'multi_select') {
      const name = tagsProp.name
      const existing = mapped[name]?.multi_select || []
      if (!existing.some(item => item.name === topTag)) {
        mapped[name] = { multi_select: [...existing, { name: topTag }] }
      }
    } else {
      warnings.push('pin=true 但未找到 multi_select 类型的 tags 属性，置顶未生效')
    }
  } else if (frontMatter.pin === true && !topTag) {
    warnings.push('pin=true 但未配置 TOP_TAG，置顶未生效（NotionNext 用标签实现置顶）')
  }

  return { mapped, warnings }
}

// ============================================================
// 6. 查询 / 创建 / 更新
// ============================================================

async function findExistingPage(databaseId, schemaProps, slug) {
  if (!slug) return null
  const slugField = pickProperty(schemaProps, 'slug')
  if (!slugField) return null
  const filter = buildFilter(slugField, slug)
  if (!filter) return null
  const data = await notionRequest('POST', `/databases/${databaseId}/query`, {
    filter,
    page_size: 1
  })
  return data.results?.[0] || null
}

function buildFilter({ name, prop }, slug) {
  switch (prop.type) {
    case 'rich_text':
      return { property: name, rich_text: { equals: slug } }
    case 'title':
      return { property: name, title: { equals: slug } }
    case 'select':
      return { property: name, select: { equals: slug } }
    case 'url':
      return { property: name, url: { equals: slug } }
    default:
      return null
  }
}

async function appendBlocks(pageId, blocks) {
  const chunkSize = 100
  for (let i = 0; i < blocks.length; i += chunkSize) {
    const chunk = blocks.slice(i, i + chunkSize)
    await notionRequest('PATCH', `/blocks/${pageId}/children`, { children: chunk })
  }
}

async function deleteChildren(pageId) {
  let cursor
  const ids = []
  do {
    const query = cursor ? `?start_cursor=${cursor}&page_size=100` : '?page_size=100'
    const data = await notionRequest('GET', `/blocks/${pageId}/children${query}`)
    for (const block of data.results || []) ids.push(block.id)
    cursor = data.has_more ? data.next_cursor : null
  } while (cursor)

  for (const id of ids) {
    await notionRequest('DELETE', `/blocks/${id}`)
    await sleep(120)
  }
  return ids.length
}

// ============================================================
// 7. CLI
// ============================================================

function parseArgs(argv) {
  const options = { files: [], flags: {} }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dry-run') options.flags.dryRun = true
    else if (arg === '--update') options.flags.update = true
    else if (arg === '--replace') options.flags.replace = true
    else if (arg === '--list-databases') options.flags.listDatabases = true
    else if (arg === '--help' || arg === '-h') options.flags.help = true
    else if (arg === '--database') options.flags.database = argv[++i]
    else if (arg === '--status') options.flags.status = argv[++i]
    else if (arg === '--type') options.flags.type = argv[++i]
    else if (arg.startsWith('--')) options.flags[arg.slice(2)] = true
    else options.files.push(arg)
  }
  return options
}

function printHelp() {
  console.log(`
用法：
  node scripts/article-to-notion.mjs <file.md> [更多文件...] [选项]

选项：
  --dry-run           只解析与预览，不写 Notion（无需 Token 也能跑）
  --update            按 slug 查找已存在页面并更新属性
  --replace           配合 --update：先删除旧正文再重写（危险，默认只更新属性）
  --database <id>     指定 Notion 数据库 ID（默认自动查找）
  --status <值>       发布状态，默认 Published
  --type <值>         文章类型，默认 Post
  --list-databases    列出站点根页面下的 child_database

环境变量（.env.local）：
  NOTION_API_KEY      必填：内部集成 Token
  NOTION_DATABASE_ID  可选：文章数据库 ID
  NOTION_PAGE_ID      可选：站点根页面 ID（默认读 blog.config.js）
`)
}

function printSummary({ file, data, warnings, blockStats, mapped, dryRun }) {
  const lines = []
  lines.push('')
  lines.push(`📄 ${path.relative(ROOT, file)}`)
  lines.push(`   标题: ${data.title || '(缺少 title)'}`)
  lines.push(`   slug: ${data.slug || '(缺少 slug)'}`)
  const tagList = (Array.isArray(data.tags) ? data.tags : String(data.tags || '').split(','))
    .map(item => String(item).trim())
    .filter(Boolean)
  lines.push(`   分类: ${data.category || '-'}  | 标签: ${tagList.join(' / ') || '-'}`)
  if (blockStats) {
    lines.push(`   正文: ${blockStats.total} 个 block（${blockStats.detail}）`)
  }
  if (mapped) {
    const fields = Object.keys(mapped)
    lines.push(`   将写入属性: ${fields.length ? fields.join(', ') : '(无)'}`)
  }
  if (warnings?.length) {
    for (const warning of warnings) lines.push(`   ⚠️  ${warning}`)
  }
  lines.push(dryRun ? '   [dry-run] 未写入 Notion' : '')
  console.log(lines.join('\n'))
}

function summarizeBlocks(blocks) {
  const counter = {}
  for (const block of blocks) {
    counter[block.type] = (counter[block.type] || 0) + 1
  }
  const detail = Object.entries(counter)
    .map(([type, count]) => `${type}×${count}`)
    .join(', ')
  return { total: blocks.length, detail }
}

async function publishFile(file, options, context) {
  const absolute = path.resolve(ROOT, file)
  if (!fs.existsSync(absolute)) {
    throw new Error(`文件不存在：${file}`)
  }
  const raw = fs.readFileSync(absolute, 'utf8')
  const { data, body } = parseFrontMatter(raw)
  if (!data.title) throw new Error(`${file} 缺少 front-matter 字段 title`)
  if (!data.slug) throw new Error(`${file} 缺少 front-matter 字段 slug`)

  const blocks = markdownToBlocks(body)
  const blockStats = summarizeBlocks(blocks)

  // dry-run：无 Token 也能看解析结果
  if (options.flags.dryRun) {
    const pseudoSchema = null
    printSummary({
      file: absolute,
      data,
      warnings: [],
      blockStats,
      mapped: pseudoSchema,
      dryRun: true
    })
    return { file: absolute, status: 'dry-run', blocks: blockStats.total }
  }

  const databaseId = context.databaseId
  const { properties: schemaProps } = context.schema
  const { mapped, warnings } = buildProperties(data, schemaProps, {
    status: options.flags.status,
    type: options.flags.type
  })

  const existing = options.flags.update
    ? await findExistingPage(databaseId, schemaProps, data.slug)
    : null

  if (existing) {
    await notionRequest('PATCH', `/pages/${existing.id}`, { properties: mapped })
    let replaced = 0
    if (options.flags.replace) {
      replaced = await deleteChildren(existing.id)
    }
    await appendBlocks(existing.id, blocks)
    printSummary({ file: absolute, data, warnings, blockStats, mapped })
    console.log(`   ♻️  已更新页面 ${existing.id}${replaced ? `（清空 ${replaced} 个旧 block）` : ''}`)
    return { file: absolute, status: 'updated', pageId: existing.id }
  }

  const page = await notionRequest('POST', '/pages', {
    parent: { database_id: databaseId },
    properties: mapped
  })
  await appendBlocks(page.id, blocks)
  printSummary({ file: absolute, data, warnings, blockStats, mapped })
  console.log(`   ✅ 已创建页面 ${page.id}`)
  console.log(`   ${page.url}`)
  return { file: absolute, status: 'created', pageId: page.id, url: page.url }
}

async function main() {
  loadEnv()
  const options = parseArgs(process.argv.slice(2))
  if (options.flags.help) {
    printHelp()
    return
  }

  const blogConfig = readBlogConfig()

  if (options.flags.listDatabases) {
    const pageId = process.env.NOTION_PAGE_ID || blogConfig.NOTION_PAGE_ID
    if (!pageId) throw new Error('请先配置 NOTION_PAGE_ID')
    const databases = await listChildDatabases(pageId)
    if (!databases.length) {
      console.log('未找到 child_database')
      return
    }
    for (const db of databases) console.log(`${db.title}  →  ${db.id}`)
    return
  }

  if (!options.files.length) {
    printHelp()
    process.exitCode = 1
    return
  }

  const hasToken = Boolean(getToken())
  const needsNotion = !options.flags.dryRun
  if (needsNotion && !hasToken) {
    console.log('\n⚠️  未检测到 NOTION_API_KEY。')
    console.log('   1) 在 https://www.notion.so/my-integrations 新建内部集成，拿到 secret_xxx')
    console.log('   2) 把你的文章数据库页面「分享」给这个集成')
    console.log('   3) 在 .env.local 写入：NOTION_API_KEY=secret_xxx')
    console.log('\n先用 --dry-run 看解析结果：')
    console.log(`   node scripts/article-to-notion.mjs ${options.files[0]} --dry-run\n`)
    process.exitCode = 1
    return
  }

  let context = {}
  if (needsNotion) {
    const databaseId = await resolveDatabase(options.flags.database, blogConfig)
    const schema = await getSchema(databaseId)
    context = { databaseId, schema }
    console.log(`\n🗂  数据库：${schema.title?.map?.(t => t.plain_text).join('') || databaseId}`)
    console.log(`   属性：${Object.entries(schema.properties).map(([name, prop]) => `${name}(${prop.type})`).join(', ')}\n`)
  }

  const results = []
  for (const file of options.files) {
    try {
      const result = await publishFile(file, options, context)
      results.push({ file, ok: true, ...result })
    } catch (error) {
      console.error(`\n❌ ${file}: ${error.message}`)
      results.push({ file, ok: false, error: error.message })
    }
    await sleep(300)
  }

  const failed = results.filter(item => !item.ok)
  console.log(`\n===== 完成：成功 ${results.length - failed.length}，失败 ${failed.length} =====`)
  if (failed.length) process.exitCode = 1
}

main().catch(error => {
  console.error(`\n❌ ${error.message}`)
  process.exitCode = 1
})
