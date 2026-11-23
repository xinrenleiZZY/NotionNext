---
title: 七夕特辑：当代码写满浪漫——qixi-sur 项目揭秘
date: 2026-11-23
category: 次元漫谈
tags: 七夕, 浪漫, 前端, HTML, CSS, 项目
summary: 一个「给 TA 的七夕页面」是怎么从想法变成可上线作品的：结构、动效、素材与移动端适配，以及比技术更重要的那部分。
author: 仙帝·Zeyan
slug: qixi-sur
pin: false
---

# 七夕特辑：当代码写满浪漫——qixi-sur 项目揭秘

> 最好的情话不是「我爱你」，是「我为你写了个页面，按 F12 才能看到」。

`qixi-sur` 是一个七夕主题的互动页面：点开是一段动画，往下滑是回忆，最后是一个需要「按对顺序」才能解锁的彩蛋。这篇拆一下实现。

## 一、结构：单页 + 三幕

```
第一幕  星轨入场：粒子汇聚成一句话
第二幕  时间轴：逐年滚动，配图与短句
第三幕  彩蛋：输入正确日期解锁隐藏内容
```

技术上就是一个 `index.html` + CSS + 少量 JS，不引入框架——**加载快、能直接丢到任何静态托管**。

## 二、动效：少而准

| 效果 | 实现 |
| --- | --- |
| 星轨粒子汇聚 | Canvas 粒子 + 缓动函数 |
| 文字渐显 | `IntersectionObserver` + CSS transition |
| 背景星空 | 多层 radial-gradient + 缓慢位移 |
| 彩蛋解锁 | 输入校验 + 关键帧动画 |

关键是**克制**：动效只服务情绪，不做炫技。首屏 1.5 秒内必须能看到第一句话。

## 三、移动端优先

这类页面 90% 的访问来自手机。三个动作：

1. `viewport` 正确设置，`user-scalable` 不锁死
2. 字号用 `clamp()`，高度用 `dvh` 而不是 `vh`（避开手机地址栏）
3. 动效在 `prefers-reduced-motion` 下降级

```css
.title { font-size: clamp(1.5rem, 6vw, 3rem); }
.hero  { min-height: 100dvh; }
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

## 四、素材：比代码更花时间

- 图片统一压到 WebP，单张 < 200KB
- 背景图用模糊 + 暗化，保证文字可读
- 音乐可选，默认静音，给按钮

「好看」的一半是素材处理，不是 CSS 技巧。

## 五、彩蛋设计

彩蛋的本质是「只属于两个人的暗号」：

- 输入一个日期（如第一次见面的日子）
- 校验通过后播放一段隐藏内容
- 输错不报错，只给一句温柔的提示

技术上就是一次字符串比较，但体验上的差别在于**提示语怎么写**。

## 六、上线

静态托管即可（GitHub Pages / Vercel / OSS），成本几乎为零。注意：

- 不要放真实姓名、电话、地址（公开页面）
- 图片如果有他人肖像，先获得授权
- 加一个 `<meta name="robots" content="noindex">`，避免被搜索引擎收录

## 七、比代码更重要的

写这个页面让我意识到：技术的浪漫不在技术本身，而在**你愿意为一个人花时间做一件「没有产出」的事**。

## 结语

如果你也想做一个，别追求复杂：一句话、三段回忆、一个只有你们懂的彩蛋，就够了。

---

*相关教程：[给 TA 写个浪漫网页：七夕表白页制作教程](https://www.juxingspacestation.top/article/valentine-web-tutorial)*
