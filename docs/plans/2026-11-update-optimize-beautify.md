# 站点更新 / 优化 / 美化方案（2026-11）

对象：`www.juxingspacestation.top` ← 仓库 `github.com/xinrenleiZZY/NotionNext`（本地 main = `e7f6269`，基线 NotionNext 4.10.3）
状态：**方案待确认，尚未改动任何代码**

---

## 0. 现状诊断（已核实，均带证据）

### 0.1 仓库与更新基线

| 项 | 现状 | 位置 |
| --- | --- | --- |
| 版本 | 4.10.3，next 实锁 14.2.35 | `package.json:3,87`、`yarn.lock:6756` |
| 上游关系 | 只有 origin（本 fork），**没有 upstream remote** | `.git/config:8-14` |
| 本地提交 | 12 条，最近一次 2026-07-14（距今约 4 个月） | `.git/logs/HEAD` |
| 依赖安装 | 无 `node_modules`、无 `.next`（本地不能直接 build） | — |
| 明显过期 | `eslint-config-next ^13`、`next-sitemap ^1.9`、`@next/bundle-analyzer ^12`；`resolutions.lodash ^4.18.1` 是非官方版本 | `package.json:73,114,124,140` |

### 0.2 域名错配（最高优先级问题）

- `blog.config.js:21` → `LINK = https://jxspace.top`，而线上是 `www.juxingspacestation.top`。**`jxspace.top` 是公司站域名**，出现在本站配置里属于串站（2026-11-07 已确认，代码侧已改）。
- **且 Notion 里的 Config 表优先于代码**：`lib/config.js:48-68`、`lib/db/SiteDataApi.js:904,935`，导出的 Config CSV 第 3 行仍是 `jxspace.top` → 只改文件无效。
- 派生后果：canonical / OG / JSON-LD（`components/SEO.js:16-18,56,152,203-207,242`）、sitemap（`pages/sitemap.xml.js:27-31`、`next-sitemap.config.js:7`）、RSS（`pages/api/rss.js:61`）、CORS（`lib/middleware/security.js:226`）**全部指向旧域名**。
- 全站**没有 `<link rel="canonical">`**（全仓库仅 `lighthouserc.js:46` 提到该词）。
- 无 301 迁移规则：`next.config.js:254-264` 只有 `/feed`，`vercel.json` 无 redirects。

### 0.3 性能

- `themes/endspace/components/VideoBackground.js:22-34`：全屏 mp4 `autoPlay muted loop`，**无 poster、无 preload 策略、无移动端降级、无 prefers-reduced-motion 降级**，`blur(3px)+scale(1.05)` 强制合成层；`blog.config.js:16` 默认 light → 每页常驻播放；`themes/endspace/index.js:77` 在 LayoutBase 挂载（所有页面）。
- `LoadingCover.js:99-103,126,186`：全屏 `z-index:99999` 遮罩，最长 5s 才结束，首屏 LCP 被遮罩接管。
- `BlogPostCard.js:22` 用原生 `<img>`，未走 `next/image`（无 srcset/AVIF）。
- `next.config.js:234-243` `remotePatterns` 放行 `**` → 图片优化器成开放代理（有成本/滥用风险）。
- `conf/performance.config.js` 里除 `ENABLE_WEB_VITALS`/`PERFORMANCE_BUDGET` 外，多数开关无人消费（假配置）。
- 静态资源无长缓存头：`next.config.js:325-404` 只给 fontawesome 配了 immutable，`vercel.json` headers 为空。
- `@tabler/icons-react` 未纳入 `next.config.js:436-441` 的 `optimizePackageImports`。

### 0.4 视觉 / 交互

- **色板名实不符**：`style.js:25-28,58-61` 变量名 `accent-yellow` / `accent-cyan`，值却是粉 `#EC4899`，而 dim 色仍是黄 `rgba(251,251,69,.15)`；`BlogPostCard.js:40` 又硬编码亮黄 `#FBFB45` 做 hover 大色块 → 粉/黄两套主色打架。
- **字体**：`'Inter'`、`'JetBrains Mono'` 无自托管，国产设备回退到雅黑；`font-black`(900) 在中文上多是伪加粗。
- **双轨视口缩放**：`style.js:84-91` 的 CSS 与 `useViewportScale.js:31-80` 的 JS 各算一遍 html 字号，正文随视口在 14–24px 间漂移，伤可访问性与 CLS。
- **缺 reduced-motion / focus-visible / next/image**：`themes/endspace` 全目录 grep 无匹配。
- 装饰性全屏视频未加 `aria-hidden`；自定义 SVG 光标（`style.js:103,108`）无开关、移动端无效。

---

## 1. 阶段划分（按「先止血、再提质、最后升级」排序）

| 阶段 | 内容 | 工作量 | 风险 | 需要网络 |
| --- | --- | --- | --- | --- |
| **P0 止血** | 域名归一 + canonical/OG + 首屏体验 | 0.5–1 天 | 低 | 否 |
| **P1 性能** | 视频降级、遮罩、图片、缓存头、缩放收敛 | 1 天 | 低-中 | 否 |
| **P2 视觉** | token 体系 + 排版 + 移动端 | 1–2 天 | 中 | 否 |
| **P3 更新** | 同步上游 + 依赖升级 | 2–4 天 | **高** | **是** |
| **P4 进阶** | 首页重做、暗色皮肤、CI 性能门禁 | 2 天（可选） | 中 | 部分 |

---

## 2. P0 止血（建议本周先做）

**P0-1 域名统一（0.5h + Vercel 操作）**
1. 定主域：裸域 `juxingspacestation.top` 与 `www` 二选一，另一个 301。
2. 改三处：`blog.config.js:21`、**Notion Config 表 LINK 行（必改，否则被覆盖）**、`README.md:10,14,43` 与 `article-contents/notionnext-vercel-blog.md:36,72`。
3. `vercel.json` 加 host 级 301（apex ↔ www）。
4. Google Search Console 站点换址 + 旧域 301 至少保留 6 个月。

**P0-2 补 canonical 与绝对 OG（2h）**
- `components/SEO.js`：输出 `<link rel="canonical" href="{LINK + 规范化路径}">`（去 query、去尾斜杠、伪静态 `.html` 统一）。
- `SEO.js:57,153` 的 `og:image` 相对路径改绝对 URL；`og:url` 用同一 canonical 值。
- 校验：`/`、文章页、`/category/*`、`/tag/*`、分页页 各一条。

**P0-3 首屏体验（2h）**
- `LoadingCover.js`：5s 上限 → 1.5s；同会话只播一次（sessionStorage）；`z-index` 降到正文层之上但不遮 LCP 主体；文案改中文。
- `index.js:124-137` 的 700ms Transition → 200ms。

---

## 3. P1 性能

1. **视频背景降级（2h）**：加 poster（首帧导出的 webp）；`preload="none"`；移动端 `<768px` 与 `prefers-reduced-motion: reduce` 不渲染；`navigator.connection.saveData` 判断；**只在首页挂载**（改 `index.js:77`）。
2. **视频资产**：H.264 720p、6–10s 循环、目标 <1.5MB；桌面端 poster 走 AVIF。用 `ffprobe` 先看当前体积（当前无法读取，需在有 shell 的机器执行）。
3. **图片**：`BlogPostCard.js:22` → `next/image`，`sizes="(max-width:768px) 100vw, 50vw"`，首页前两张 `priority`。
4. **remotePatterns 收敛**（`next.config.js:234-243`）：只放行 notion.so / amazonaws / 实际图床域名。
5. **缓存头**：`/bg-video.mp4`、`/videos/:path*`、`/fonts/:path*`、`/_next/static/:path*` → `immutable, max-age=31536000`。
6. **打包**：`@tabler/icons-react` 加入 `optimizePackageImports`。
7. **视口缩放收敛（2h）**：**二选一** —— ① 关掉 `useViewportScale`，全站用 CSS `clamp()`（推荐，可访问性好）；② 保留等比但去掉 CSS 那一路，只留 JS。
8. **a11y**：muted 文本色对比提到 ≥4.5:1；加 `:focus-visible` 焦点环；首页补唯一 h1；装饰视频 `aria-hidden`；光标做开关（或直接移除）。
9. **CI 门禁**：`lighthouserc.js`（LCP≤2500 / CLS≤0.1）接 GitHub Actions 定时跑；`scripts/check-page-data-budget.js` 当作构建产物体积门禁。

---

## 4. P2 美化（三档，可按预算选做）

**档位 A · 低成本打磨（1–2h，当天可上线）**
1. 色板正名：`accent-yellow`→`accent-primary`、`accent-cyan`→`accent-soft`，值统一到 `#EC4899` 及其 8%/15% 透明阶（`style.js:25-28,58-61`）。
2. 干掉 `#FBFB45` 大色块 hover（`BlogPostCard.js:40`），改为「主色 4% 底色 + 1px 主色描边 + 标题轻微位移」，300ms→200ms。
3. 中文字重：`font-black`→`font-bold`，标题加 `letter-spacing:-0.01em`。
4. 自定义光标默认关闭（或跟随系统），LoadingCover 文案汉化。

**档位 B · 体系化重构（半天–1 天）**
1. 新建 `themes/endspace/tokens.css`：颜色 12 个 / 间距 4px 栅格 / 字号 7 级 / 圆角 3 档 / 阴影 3 档 / 动效 3 档时长，`style.js` 与 `tailwind.config` 双向映射，杜绝散落硬编码。
2. 玻璃拟态统一：`backdrop-blur(8px)` + 卡片底 `rgba(...,0.72)` + 1px 内描边；网格背景降到 0.02。
3. 排版节奏：文章页 `max-width:72ch`、行高 1.8、段距 1em；代码块/引用/表格/图片统一圆角与间距；代码块主题对齐暗色。
4. 移动端：断点收敛 768/1024；触控目标 ≥44px；浮动 TOC 改底部抽屉；`EndspacePlayer`/`FloatingRecentLogs` 移动端默认折叠。

**档位 C · 风格升级（1–2 天，可选）**
1. 首页 Hero 重做：视频/静帧 + 网格视差 + 打字机（复用 `GREETING_WORDS` 现有配置）+ 精选 3 卡。
2. 暗色模式做差异皮肤（星空 + 网格），现在只是变量翻转。
3. 文章页：阅读进度条 + TOC 滚动高亮 + 图片灯箱。
4. 动效统一：CSS transition + 单个 IntersectionObserver 替换零散实现；顺手确认 `gsap` 是否真被用到，未用则移出依赖。

**验收页（每档改完必看 5 张截图）**：首页列表 / 文章详情 / 归档 / 标签页 / 移动端首页。

---

## 5. P3 同步上游（需要网络，风险最高，单独排期）

1. 备份：`git branch backup/pre-sync-e7f6269`（回滚点）。
2. 加远端：`git remote add upstream https://github.com/tangly1024/NotionNext.git`（先确认本 fork 的源是 tangly1024 还是 notionnext-org）。
3. **先把定制抽成 patch**：`git diff 85072ef..e7f6269 > patches/custom.patch`，重点 `themes/endspace/**`、`blog.config.js`、`README.md`、`conf/*`。
4. 开 `sync/upstream-2026-11` 分支 **merge（不要 rebase）** `upstream/main`，避免 force-push 破坏 Vercel 部署历史。
5. 冲突策略：`themes/endspace/` 整体取上游再套 patch；`blog.config.js` 保留本 fork 值；`README` 取本 fork。
6. 依赖分两步：先修显然错配（eslint-config-next→14.x、next-sitemap→4.x、去掉可疑 `lodash ^4.18.1`），再评估 Next 15（**若上游已升 15 就跟随上游，不要自己生升**）。
7. 验收：`yarn install --frozen-lockfile && yarn build` → `/`、文章页、`/sitemap.xml`、`/rss/feed.xml`、canonical、移动端。

**回滚**：Vercel instant rollback + `backup/pre-sync-e7f6269`。

---

## 6. 决策记录

1. **主域名（已定，2026-11-07）**：本仓库 = **个人博客 `https://www.juxingspacestation.top`**；`jxspace.top` 是**公司站**，与本项目无关，不得出现在本站配置里。canonical 与 301 方向以 `www` 为准。
2. **更新范围**：待定 —— ① 只做 P0–P2（不碰上游）；② 追加 P3 同步上游。
3. **美化方向**：待定 —— 保留「视频背景 + 科技工业风」深化，还是转轻量（视频仅首页 / 静帧）。

---

## 7. 已执行改动（2026-11-07，代码侧 P0）

> 注意：**改代码不够**，见下方「必须手动完成」。

| 文件 | 改动 |
| --- | --- |
| `blog.config.js:21` | `LINK` → `https://www.juxingspacestation.top` |
| `components/SEO.js` | 新增 `<link rel="canonical">`（以 `LINK` + 规范化 `asPath` 为准，去 query/hash/尾斜杠）；`og:url` 改用 canonical；`og:image`、`twitter:image` 与 JSON-LD 的 image 改为绝对地址 |
| `vercel.json` | 新增 `juxingspacestation.top` → `https://www.juxingspacestation.top/$1` 的 301 |
| `README.md` | 3 处站内链接改为新域名 |
| `article-contents/notionnext-vercel-blog.md` | 示例配置与「当前配置」表更新为新域名 |

### 必须手动完成（否则代码改动会被覆盖）

1. **Notion 的 Config 表**：把 `LINK` 一行从 `https://jxspace.top` 改为 `https://www.juxingspacestation.top`
   （证据：`ExportBlock-.../CONFIG-TABLE 1995633a431182f8bbed81e2a9dfd4be.csv:3`）；
   优先级规则：NotionConfig > 环境变量 > `blog.config.js`（`lib/config.js:7-24,48-68,99-113`）。
   → 最省事：直接把这一行**删掉**，让 `blog.config.js` 生效；但不建议，因为后台还有编辑需求时容易再写错。
2. **Vercel 域名**：把 `juxingspacestation.top` 与 `www.juxingspacestation.top` 都绑到项目，设 `www` 为主域。
3. **Vercel 环境变量**：若设过 `NEXT_PUBLIC_LINK`，同步改成新域；没有就留空。
4. 确认公司站 `jxspace.top` 是**独立 Notion 页面 / 独立 Vercel 项目**，不要与本项目共用 Config 表。

---

## 8. 待办下一步

- [x] **主题 Aurora（极光玻璃）**：`themes/aurora/`（15 个文件，见 `docs/user-guide/themes/aurora.md`）
- [x] **主题 Neo Brutal（贴纸粗野风）**：`themes/neo/`（15 个文件，见 `docs/user-guide/themes/neo.md`）
- [x] **主题 Mizuki（二次元 MD3，按 matsuzaka-yuki/Mizuki 源码复刻）**：`themes/mizuki/`（10 个文件，见 `docs/user-guide/themes/mizuki.md`）
- [x] **P0-3 首屏遮罩**：`LoadingCover` 最长等待 5s→1.5s，同会话只播一次（sessionStorage），退出动画 800ms→540ms
- [x] **P1 视频背景降级**：只在首页挂载；移动端 / `prefers-reduced-motion` / `saveData` / 2G 不加载视频，只保留 poster；`preload=none` 不抢首屏带宽
- [x] **P1 列表图**：`endspace/BlogPostCard` 的原生 `<img>` → `LazyImage`（放大压缩宽度、懒加载、占位图）
- [x] **P1 打包**：`@tabler/icons-react` 加入 `optimizePackageImports`
- [x] **P1 缓存头**：`bg-video.mp4` / `bg_image.jpg` / `/videos/*` / `/fonts/*` 加一年 immutable 缓存
- [ ] ⚠️ **部署阻塞（第一优先级）**：本地改动尚未 commit/push，线上仍是旧构建；本机 `pwsh` 与网络均不可用，需在你自己终端执行 `git add -A && git commit && git push`
- [ ] ⚠️ **Notion Config 表 `LINK` 仍是 `https://jxspace.top`**，会覆盖 `blog.config.js`，canonical/OG/sitemap 继续指公司站
- [ ] 建议先本地 `yarn install --frozen-lockfile && yarn build` 验证（所有 `themes/*` 都会参与编译，任一语法错会导致整站构建失败）
- [ ] 预览：`/?theme=aurora`、`/?theme=neo`、`/?theme=mizuki`，`/?theme=endspace` 切回
- [ ] P1 剩余：`next/image` 全量替换、`remotePatterns` 收敛、视口缩放双轨收敛、a11y（对比度 / focus-visible / 首页 h1）
- [ ] P2 视觉体系（三档，见第 4 节）
- [ ] P3 同步上游（见第 5 节，需网络，当前环境无法执行）


---

## 9. 当前执行环境限制（影响落地方式）

- 本机 `pwsh` 完全不可用（`exit code 3221225794`），无法执行 `git / yarn / node / ffprobe`。
- 外网抓取被拦（域名解析到非公网 IP），无法拉上游、抓线上页面、跑 Lighthouse。
- 因此：P0–P2 的**代码修改可以由我直接在仓库里做**（读写文件正常），但 `yarn build`、`yarn dev`、截图、Lighthouse **必须在有 Node + Chrome + 网络的环境**（你的本机终端 / Vercel 预览部署）验证。
- 建议落点：本地改 → push 到 fork 的 `plan/2026-11` 分支 → Vercel 预览环境验收 → 合并到 main。
