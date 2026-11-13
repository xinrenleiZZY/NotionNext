const puppeteer = require('puppeteer-core')
const fs = require('fs')
const path = require('path')

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'https://www.juxingspacestation.top/'
const OUT = 'E:\\ZY2026\\ZY2026-GS-GR\\NotionNext\\screenshots'

const targets = [
  { name: 'current-endspace', url: BASE },
  { name: 'mizuki', url: BASE + '?theme=mizuki' },
  { name: 'aurora', url: BASE + '?theme=aurora' },
  { name: 'neo', url: BASE + '?theme=neo' }
]

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--lang=zh-CN']
  })
  const report = []
  for (const t of targets) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    const errors = []
    page.on('pageerror', e => errors.push('pageerror: ' + e.message))
    page.on('console', m => {
      if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200))
    })
    try {
      await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 90000 })
      await new Promise(r => setTimeout(r, 3500))
      const info = await page.evaluate(() => {
        const el = document.querySelector('[id^="theme-"]')
        const canonical = document.querySelector('link[rel="canonical"]')
        return {
          themeId: el ? el.id : null,
          title: document.title,
          canonical: canonical ? canonical.href : null,
          h1: document.querySelector('h1') ? document.querySelector('h1').innerText.slice(0, 80) : null,
          bodyBg: getComputedStyle(document.body).backgroundColor,
          cards: document.querySelectorAll('article, .card-base, .mz-card, .neo-card').length
        }
      })
      await page.screenshot({ path: path.join(OUT, t.name + '.png') })
      report.push({ name: t.name, ...info, errors: errors.slice(0, 5) })
    } catch (e) {
      report.push({ name: t.name, fatal: String(e).slice(0, 300), errors })
    }
    await page.close()
  }
  await browser.close()
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2), 'utf8')
  console.log(JSON.stringify(report, null, 2))
})()
