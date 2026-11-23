# 照片墙 / 相册（/apps/gallery）

照片墙页面：`https://www.juxingspacestation.top/apps/gallery`

- 数据源：`conf/gallery.config.js`
- 组件：`components/GalleryWall.js`（瀑布流 + 标签筛选 + 灯箱，键盘 ← → Esc）
- Pixiv 代理：`pages/api/pximg.js`（服务端补 Referer，绕开 i.pximg.net 的 403）

## 一、添加图片（三种来源）

编辑 `conf/gallery.config.js` 的 `ITEMS`：

```js
{
  src: '/Camera Roll/xxx.jpg',   // 1) 本地：public 下的相对路径
  title: '标题',
  author: '作者',
  tags: ['壁纸'],
  link: ''                        // 可选：原图/作品页
}
```

```js
{
  src: 'https://example.com/a.jpg',  // 2) 任意外链
  title: '外部图片', author: '', tags: ['外链']
}
```

```js
{
  src: 'https://i.pximg.net/img-original/...',  // 3) Pixiv 直链
  title: '作品标题',
  author: '画师名',
  tags: ['Pixiv'],
  link: 'https://www.pixiv.net/artworks/12345678'
}
```

> Pixiv 图片必须带 `Referer: https://www.pixiv.net/` 才能访问。组件会自动把 `*.pximg.net` 的地址改写成 `/api/pximg?url=...`，由服务端代理，不需要你手动处理。

## 二、批量导入 Pixiv

### 方式 A：直接抓排行榜（已内置，当前 120 张 Pixiv 即由此生成）

```bash
# 浏览器登录 pixiv 后取 Cookie：PHPSESSID + cf_clearance
# 默认抓 月榜/周榜/日榜/新人榜 各 4 页，取 120 张，并与已有数据合并
PIXIV_COOKIE="PHPSESSID=xxx; cf_clearance=yyy" node scripts/pixiv-fetch-ranking.mjs
# 想扩到更多：加大页数与目标数
PIXIV_COOKIE="..." node scripts/pixiv-fetch-ranking.mjs --modes monthly,weekly,daily,rookie,original --pages 8 --limit 240
# 全部重建（不合并旧数据）
PIXIV_COOKIE="..." node scripts/pixiv-fetch-ranking.mjs --rebuild
```

脚本会：

1. 抓多个排行榜 JSON（每页 50 条），按 `illust_id` 去重
2. **过滤** `sexual>0` / `grotesque` / `violent` 的作品，并打散各榜条目保证多样性
3. 逐条补 `ajax/illust/{id}` 拿到 regular 原图、作者、标签（自动退避重试）
4. 生成 `conf/gallery-pixiv.config.js`，每条含 `src / thumb / title / author / tags / link / pixivId / rank / mode`
5. **默认合并**旧条目：重复运行会越攒越多（排行榜会变化，每次都能补进新图）

> 遇到少量 `429` 时，该条目会先用榜单缩略图兜底；隔一段时间重跑即可补成高清。

### 方式 B：指定作品 ID

```bash
PIXIV_COOKIE="PHPSESSID=xxxxx" node scripts/pixiv-import.mjs 152294495 12345678
# 或从文件读取（每行一个 ID / 链接）
PIXIV_COOKIE="PHPSESSID=xxxxx" node scripts/pixiv-import.mjs --file ids.txt
```

脚本会输出可直接粘贴到 `ITEMS` 数组的条目。

**版权提醒**：Pixiv 作品版权归原作者所有。请保留 `author` 与 `link`，不要商用，不要去除水印。

## 三、替换首页轮播图与全站背景

两处都通过站点配置（`blog.config.js` / Notion Config / 环境变量）控制，**改配置就能换，不用改代码**：

| 配置项 | 说明 | 示例 |
| --- | --- | --- |
| `FIREFLY_BANNER_IMAGES` | 首页轮播图，逗号分隔或 JSON 数组；留空则用「站点封面 + 最近文章封面」 | `/Camera Roll/a.jpg,/Camera Roll/b.jpg` |
| `FIREFLY_WALLPAPER` | 全站固定背景图 | `/Camera Roll/D.C.5 to 4 Luminous Memories 壁紙A 横.jpg` |
| `FIREFLY_WALLPAPER_OPACITY` | 背景不透明度 0–1，默认 0.28 | `0.2` |
| `FIREFLY_WALLPAPER_BLUR` | 背景模糊 px，默认 2 | `4` |

生效优先级：URL `?theme=` > 代码配置 > Notion Config。改完部署/等 ISR 刷新即可。

## 四、本地预览

```bash
yarn dev
# 打开 http://localhost:3000/apps/gallery
```

`/api/pximg` 在本地也能用（需要能访问 pixiv 的网络）。

## 五、性能与限流

- 图片全部 `loading="lazy"`
- 代理接口带 7 天 CDN 缓存（`s-maxage=604800`）
- 建议单页图不超过 **60 张**，超过用标签分开；Pixiv 原图较大时优先用 `urls.regular`
