/* global jest, describe, it, expect */
/**
 * Navigation & 环境变量校验 TDD 套件
 *
 * 覆盖 3 组修复：
 *   1) middleware.ts matcher 放行 /sign-up /dashboard
 *   2) next.config.js rewrites 伪静态重写受 NEXT_PUBLIC_PSEUDO_STATIC 开关控制
 *   3) blog.config.js 启动期强校验：NOTION_PAGE_ID 是占位符时打印 WARNING
 *
 * 运行： npx jest __tests__/navigation-env-fixes.test.js --runInBand --no-coverage
 */
const path = require('node:path')
const fs = require('node:fs')

const ROOT = path.resolve(__dirname, '..')
const MW_PATH = path.join(ROOT, 'middleware.ts')
const NC_PATH = path.join(ROOT, 'next.config.js')
const BC_PATH = path.join(ROOT, 'blog.config.js')

// ================== Test 1: middleware.ts matcher 放行 ==================
describe('🛡️ Page Navigation & Env Sanity Fixes', () => {
  describe('middleware.ts matcher 放行规则', () => {
    const mwSource = fs.readFileSync(MW_PATH, 'utf8')
    // 修复前的对照（历史 bug 版本）
    const BUGGY_EXCLUDE = '.*\\..*|_next|/sign-in|/auth'

    it('[RED-FAIL 1a] 原始 BUGGY_EXCLUDE 的正则里不包含 sign-up → 证明 bug 存在', () => {
      expect(/sign-up/.test(BUGGY_EXCLUDE)).toBe(false)
      expect(/dashboard/.test(BUGGY_EXCLUDE)).toBe(false)
    })

    it('[GREEN 1b] 修复后：middleware.ts 的 matcher 字符串必须包含 /sign-up 和 /dashboard', () => {
      // matcher 必须是 regex 或数组里的 exclude 模式包含这些路径
      const matcherInSource = mwSource.match(/matcher\s*:\s*(\[[\s\S]*?\n\s*\])/)
      expect(matcherInSource).toBeTruthy()
      const matcherBlock = matcherInSource[1]
      expect(/\/sign-up/.test(matcherBlock)).toBe(true)
      expect(/\/dashboard/.test(matcherBlock)).toBe(true)
      expect(/\/sign-in/.test(matcherBlock)).toBe(true)
    })

    it('[GREEN 1c] 修复后的 exclude 列表正确放行认证页面', () => {
      // 正则负向前瞻排除的路径
      const excludes = ['sign-up', 'dashboard', 'sign-in', 'auth', 'api', 'trpc', '_next']
      excludes.forEach(key => {
        expect(mwSource.includes(key)).toBe(true)
      })
    })
  })

  // ============= Test 2: 伪静态 rewrite 规则 =============
  describe('next.config.js rewrites: 伪静态规则开关', () => {
    /**
     * 核心工具：在隔离模块环境下模拟 next.config.js rewrites() 调用
     * 用 jest.resetModules + 独立 require 上下文。
     */
    async function loadRewritesWithEnv(envOverrides = {}) {
      // 重置所有模块缓存（关键！否则 next/jest 的预加载会污染 env）
      jest.resetModules()

      // 清空 target 缓存
      for (const k of Object.keys(require.cache)) {
        if (k === NC_PATH || k === BC_PATH || k.startsWith(ROOT + path.sep + 'conf' + path.sep)) {
          delete require.cache[k]
        }
      }

      // 保存旧 env
      const prev = { ...process.env }
      try {
        // 应用覆盖
        for (const [k, v] of Object.entries(envOverrides)) {
          if (v === undefined) delete process.env[k]; else process.env[k] = v
        }
        // 强制设置 JEST_WORKER_ID 以便 next.config.js getBlogRuntime 检测测试分支
        process.env.JEST_WORKER_ID = process.env.JEST_WORKER_ID || '1'
        process.env.NODE_ENV = 'test'
        // EXPORT 必须是空，否则 rewrites 直接 undefined
        delete process.env.EXPORT
        const nc = require(NC_PATH)
        const fn = nc.rewrites || nc.default?.rewrites
        if (typeof fn !== 'function') return []
        const r = fn()
        return (await r) || []
      } finally {
        // 还原 env
        for (const k of Object.keys(process.env)) delete process.env[k]
        for (const [k, v] of Object.entries(prev)) {
          if (v !== undefined) process.env[k] = v
        }
        // 清理缓存
        jest.resetModules()
        for (const k of Object.keys(require.cache)) {
          if (k === NC_PATH || k === BC_PATH || k.startsWith(ROOT + path.sep + 'conf' + path.sep)) {
            delete require.cache[k]
          }
        }
      }
    }

    it('[RED→GREEN 2ab] NEXT_PUBLIC_PSEUDO_STATIC 开关正确控制伪静态 rewrite 注入', async () => {
      // Case A: = false / 不注入
      {
        const rewrites = await loadRewritesWithEnv({
          NEXT_PUBLIC_PSEUDO_STATIC: 'false',
          NOTION_PAGE_ID: '097e5f674880459d8e1b4407758dc4fb'
        })
        const pseudo = rewrites.find(r => r && r.source && r.source.endsWith('.html'))
        expect(pseudo).toBeUndefined()
      }

      // Case B: = true / 必须注入
      {
        const rewrites = await loadRewritesWithEnv({
          NEXT_PUBLIC_PSEUDO_STATIC: 'true',
          NOTION_PAGE_ID: '097e5f674880459d8e1b4407758dc4fb'
        })
        const pseudo = rewrites.find(r => r && r.source && r.source.endsWith('.html'))
        expect(pseudo).toBeDefined()
        expect(pseudo.destination).toBe('/:path*')
      }

      // Case C: 不设置（undefined）→ 默认为 false / 不注入
      {
        const rewrites = await loadRewritesWithEnv({
          NEXT_PUBLIC_PSEUDO_STATIC: undefined,
          NOTION_PAGE_ID: '097e5f674880459d8e1b4407758dc4fb'
        })
        const pseudo = rewrites.find(r => r && r.source && r.source.endsWith('.html'))
        expect(pseudo).toBeUndefined()
      }
    })
  })

  // ============= Test 3: 启动时 env 校验必须挂载，禁止占位符 NOTION_PAGE_ID =============
  describe('blog.config.js 启动时 env 校验 & 占位符拦截', () => {
    const PLACEHOLDER_ID = 'a335633a431182edbf048156d97c43eb'

    it('[RED-FAIL→GREEN 3a] NOTION_PAGE_ID 默认值仍保持占位符兼容（但启动时有告警）', () => {
      jest.resetModules()
      jest.isolateModules(() => {
        delete process.env.NOTION_PAGE_ID
        for (const k of Object.keys(require.cache)) {
          if (k === BC_PATH || k.startsWith(ROOT + path.sep + 'conf' + path.sep)) delete require.cache[k]
        }
        const BLOG = require(BC_PATH)
        expect(typeof BLOG.NOTION_PAGE_ID).toBe('string')
        expect(BLOG.NOTION_PAGE_ID.length).toBeGreaterThanOrEqual(32)
      })
    })

    it('[RED-FAIL→GREEN 3b] 当使用占位符 ID 时必须在启动期打印显式 WARNING', () => {
      jest.resetModules()
      const prevEnv = { ...process.env }
      // 先清 blog.config 和 conf/* 缓存
      for (const k of Object.keys(require.cache)) {
        if (k === BC_PATH || k.startsWith(ROOT + path.sep + 'conf' + path.sep)) delete require.cache[k]
      }
      let captured = ''
      const origWarn = console.warn
      try {
        delete process.env.NOTION_PAGE_ID
        process.env.JEST_WORKER_ID = process.env.JEST_WORKER_ID || '1'
        process.env.NODE_ENV = 'test'
        console.warn = (...args) => { captured += args.join(' ') + '\n' }
        require(BC_PATH)
      } finally {
        console.warn = origWarn
        // 还原 env
        for (const k of Object.keys(process.env)) delete process.env[k]
        for (const [k, v] of Object.entries(prevEnv)) if (v !== undefined) process.env[k] = v
        // 清缓存
        jest.resetModules()
        for (const k of Object.keys(require.cache)) {
          if (k === BC_PATH || k.startsWith(ROOT + path.sep + 'conf' + path.sep)) delete require.cache[k]
        }
      }
      expect(captured.length).toBeGreaterThan(0)
      expect(/NOTION_PAGE_ID/i.test(captured)).toBe(true)
      expect(/403|跳转后没内容|文章列表为空|\.env\.local/i.test(captured)).toBe(true)
    })
  })
})
