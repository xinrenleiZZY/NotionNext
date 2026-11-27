import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import ABOUT from '@/conf/about.config'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 页面的Head头，有用于SEO
 * @param {*} param0
 * @returns
 */
const SEO = props => {
  const { children, siteInfo, post, NOTION_CONFIG } = props
  const PATH = siteConfig('PATH')
  const LINK = siteConfig('LINK')
  const SUB_PATH = siteConfig('SUB_PATH', '')
  let url = PATH?.length ? `${LINK}/${SUB_PATH}` : LINK
  let image
  const router = useRouter()
  const meta = getSEOMeta(props, router, useGlobal()?.locale)
  const webFontUrl = siteConfig('FONT_URL')

  useEffect(() => {
    if (!webFontUrl) return

    const timeoutId = window.setTimeout(() => {
      // 使用WebFontLoader字体加载
      loadExternalResource(
        'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js',
        'js'
      ).then(url => {
        const WebFont = window?.WebFont
        if (WebFont) {
          // console.log('LoadWebFont', webFontUrl)
          WebFont.load({
            custom: {
              // families: ['"LXGW WenKai"'],
              urls: webFontUrl
            }
          })
        }
      })
    }, 1500)

    return () => window.clearTimeout(timeoutId)
  }, [webFontUrl])

  // SEO关键词
  const KEYWORDS = siteConfig('KEYWORDS')
  let keywords = meta?.tags || KEYWORDS
  if (post?.tags && post?.tags?.length > 0) {
    keywords = post?.tags?.join(',')
  }
  if (meta) {
    url = `${url}/${meta.slug}`
    image = meta.image || '/bg_image.jpg'
  }

  // canonical / OG 统一以站点主域名（LINK）为准
  const SITE_BASE = String(
    PATH?.length ? `${LINK}/${SUB_PATH}` : LINK || ''
  ).replace(/\/+$/, '')
  const asPath = String(router.asPath || '/')
    .split('#')[0]
    .split('?')[0]
  const canonicalPath =
    asPath
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '')
      .replace(/\/+$/, '') || '/'
  const canonicalUrl = meta?.canonical || `${SITE_BASE}${canonicalPath}`
  const metadataBase = meta?.canonical
    ? new URL(meta.canonical).origin
    : SITE_BASE
  // OG/Twitter 图片必须是绝对地址，社交平台不解析相对路径
  const ogImage =
    image && /^https?:\/\//i.test(image)
      ? image
      : `${metadataBase}${image || '/bg_image.jpg'}`
  const TITLE = siteConfig('TITLE')
  const title = meta?.title || TITLE
  const description = meta?.description || `${siteInfo?.description}`
  const type = meta?.type || 'website'
  const lang = siteConfig('LANG').replace('-', '_') // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
  const category = meta?.category || KEYWORDS // section 主要是像是 category 這樣的分類，Facebook 用這個來抓連結的分類
  const favicon = siteConfig('BLOG_FAVICON')
  const BACKGROUND_DARK = siteConfig('BACKGROUND_DARK', '', NOTION_CONFIG)

  const SEO_BAIDU_SITE_VERIFICATION = siteConfig(
    'SEO_BAIDU_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const SEO_GOOGLE_SITE_VERIFICATION = siteConfig(
    'SEO_GOOGLE_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const BLOG_FAVICON = siteConfig('BLOG_FAVICON', null, NOTION_CONFIG)

  const COMMENT_WEBMENTION_ENABLE = siteConfig(
    'COMMENT_WEBMENTION_ENABLE',
    null,
    NOTION_CONFIG
  )

  const COMMENT_WEBMENTION_HOSTNAME = siteConfig(
    'COMMENT_WEBMENTION_HOSTNAME',
    null,
    NOTION_CONFIG
  )
  const COMMENT_WEBMENTION_AUTH = siteConfig(
    'COMMENT_WEBMENTION_AUTH',
    null,
    NOTION_CONFIG
  )
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig(
    'ANALYTICS_BUSUANZI_ENABLE',
    null,
    NOTION_CONFIG
  )

  const FACEBOOK_PAGE = siteConfig('FACEBOOK_PAGE', null, NOTION_CONFIG)

  const AUTHOR = siteConfig('AUTHOR')
  return (
    <Head>
      <link rel='icon' href={favicon} />
      <link rel='canonical' href={canonicalUrl} />
      <title>{title}</title>
      <meta name='theme-color' content={BACKGROUND_DARK} />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0'
      />
      <meta
        name='robots'
        content='follow, index, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
      />
      <meta charSet='UTF-8' />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content={title} />

      {/* 搜索引擎验证 */}
      {SEO_GOOGLE_SITE_VERIFICATION && (
        <meta
          name='google-site-verification'
          content={SEO_GOOGLE_SITE_VERIFICATION}
        />
      )}
      {SEO_BAIDU_SITE_VERIFICATION && (
        <meta
          name='baidu-site-verification'
          content={SEO_BAIDU_SITE_VERIFICATION}
        />
      )}

      {/* 基础SEO元数据 */}
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      <meta name='author' content={AUTHOR} />
      <meta name='generator' content='NotionNext' />

      {/* 语言和地区 */}
      <meta httpEquiv='content-language' content={siteConfig('LANG')} />
      <meta name='geo.region' content={siteConfig('GEO_REGION', 'CN')} />
      <meta name='geo.country' content={siteConfig('GEO_COUNTRY', 'CN')} />
      {/* Open Graph 元数据 */}
      <meta property='og:locale' content={lang} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={canonicalUrl} />
      <meta property='og:image' content={ogImage} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:image:alt' content={title} />
      <meta property='og:site_name' content={siteConfig('TITLE')} />
      <meta property='og:type' content={type} />

      {/* Twitter Card 元数据 */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta
        name='twitter:site'
        content={siteConfig('TWITTER_SITE', '@NotionNext')}
      />
      <meta
        name='twitter:creator'
        content={siteConfig('TWITTER_CREATOR', '@NotionNext')}
      />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={ogImage} />
      <meta name='twitter:image:alt' content={title} />

      <link rel='icon' href={BLOG_FAVICON} />

      {COMMENT_WEBMENTION_ENABLE && (
        <>
          <link
            rel='webmention'
            href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/webmention`}
          />
          <link
            rel='pingback'
            href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/xmlrpc`}
          />
          {COMMENT_WEBMENTION_AUTH && (
            <link href={COMMENT_WEBMENTION_AUTH} rel='me' />
          )}
        </>
      )}

      {ANALYTICS_BUSUANZI_ENABLE && (
        <meta name='referrer' content='no-referrer-when-downgrade' />
      )}
      {/* 文章特定元数据 */}
      {meta?.type === 'Post' && (
        <>
          <meta property='article:published_time' content={meta.publishDay} />
          <meta property='article:modified_time' content={meta.lastEditedDay} />
          <meta property='article:author' content={AUTHOR} />
          <meta property='article:section' content={category} />
          <meta property='article:tag' content={keywords} />
          <meta property='article:publisher' content={FACEBOOK_PAGE} />
        </>
      )}

      {/* 结构化数据 */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData(
              meta,
              siteInfo,
              canonicalUrl,
              ogImage,
              AUTHOR
            )
          )
        }}
      />

      {/* DNS预取和预连接 */}
      {webFontUrl && <link rel='dns-prefetch' href='//fonts.googleapis.com' />}
      <link rel='dns-prefetch' href='//www.google-analytics.com' />
      <link rel='dns-prefetch' href='//www.googletagmanager.com' />
      {webFontUrl && (
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
      )}

      {children}
    </Head>
  )
}

/**
 * 生成结构化数据
 * @param {*} meta
 * @param {*} siteInfo
 * @param {*} url
 * @param {*} image
 * @param {*} author
 * @returns
 */
const generateStructuredData = (meta, siteInfo, url, image, author) => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteInfo?.title,
    description: siteInfo?.description,
    url: siteConfig('LINK'),
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: siteInfo?.title,
      logo: {
        '@type': 'ImageObject',
        url: siteInfo?.icon
      }
    }
  }

  // 如果是文章页面，添加文章结构化数据
  if (meta?.type === 'Post') {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: meta.title,
      description: meta.description,
      image: image,
      url: url,
      datePublished: meta.publishDay,
      dateModified: meta.lastEditedDay || meta.publishDay,
      author: {
        '@type': 'Person',
        name: author
      },
      publisher: {
        '@type': 'Organization',
        name: siteInfo?.title,
        logo: {
          '@type': 'ImageObject',
          url: siteInfo?.icon
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      },
      keywords: meta.tags?.join(', '),
      articleSection: meta.category
    }
  }

  if (meta?.type === 'profile') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: meta.title,
      description: meta.description,
      url,
      mainEntity: {
        '@type': 'Person',
        name: ABOUT.name,
        alternateName: 'xinrenleiZZY',
        description: ABOUT.intro,
        image,
        jobTitle: ABOUT.role,
        worksFor: {
          '@type': 'Organization',
          name: ABOUT.company
        },
        sameAs: [
          'https://github.com/xinrenleiZZY',
          'https://www.juxingspacestation.top',
          'https://www.jxspace.top'
        ]
      }
    }
  }

  return baseData
}

/**
 * 获取SEO信息
 * @param {*} props
 * @param {*} router
 */
const getSEOMeta = (props, router, locale) => {
  const { post, siteInfo, tag, category, page } = props
  const keyword = router?.query?.s

  const TITLE = siteConfig('TITLE')
  switch (router.route) {
    case '/':
      return {
        title: `${siteInfo?.title} | ${siteInfo?.description}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: '',
        type: 'website'
      }
    case '/archive':
      return {
        title: `${locale.NAV.ARCHIVE} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'archive',
        type: 'website'
      }
    case '/page/[page]':
      return {
        title: `${page} | Page | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'page/' + page,
        type: 'website'
      }
    case '/category/[category]': {
      const categoryTitle = category === '技术分享' ? '修行日志' : category
      return {
        title: `${categoryTitle} | ${siteInfo?.title}`,
        description:
          category === '技术分享'
            ? '工程实践、项目复盘与持续构建记录。'
            : `${siteInfo?.description}`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    }
    case '/category/[category]/page/[page]': {
      const categoryTitle = category === '技术分享' ? '修行日志' : category
      return {
        title: `${categoryTitle} | ${siteInfo?.title}`,
        description:
          category === '技术分享'
            ? '工程实践、项目复盘与持续构建记录。'
            : `${siteInfo?.description}`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    }
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} | ${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag/' + tag,
        type: 'website'
      }
    case '/search':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'search',
        type: 'website'
      }
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: TITLE,
        image: `${siteInfo?.pageCover}`,
        slug: 'search/' + (keyword || ''),
        type: 'website'
      }
    case '/404':
      return {
        title: `${siteInfo?.title} | ${locale.NAV.PAGE_NOT_FOUND}`,
        image: `${siteInfo?.pageCover}`
      }
    case '/tag':
      return {
        title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag',
        type: 'website'
      }
    case '/category':
      return {
        title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'category',
        type: 'website'
      }
    case '/apps/about':
      return {
        title: '仙帝 Zeyan｜关于本尊',
        description:
          '仙帝（Zeyan，xinrenleiZZY）的个人主页：AI 自动化、企业数据系统、全栈开发与知识产权实践。',
        image: '/banner/bubble-nebula.webp',
        canonical: ABOUT.canonical,
        slug: 'apps/about',
        type: 'profile'
      }
    case '/apps/showcase':
      return {
        title: `仙术展示｜项目作品墙 | ${TITLE}`,
        description: '精选项目、开源仓库、AI 自动化与企业数据系统实践。',
        image: '/banner/circuit-board.webp',
        canonical: 'https://www.juxingspacestation.top/apps/showcase',
        slug: 'apps/showcase',
        type: 'website'
      }
    case '/apps/gallery':
      return {
        title: `星轨相册｜动漫收藏 | ${TITLE}`,
        description: '精选动漫插画、壁纸和收藏记录。',
        image: '/banner/starfield.webp',
        canonical: 'https://www.juxingspacestation.top/apps/gallery',
        slug: 'apps/gallery',
        type: 'website'
      }
    case '/apps/wall':
      return {
        title: `动漫照片墙 | ${TITLE}`,
        description: '按标签浏览动漫照片与壁纸收藏。',
        image: '/banner/bubble-nebula.webp',
        canonical: 'https://www.juxingspacestation.top/apps/wall',
        slug: 'apps/wall',
        type: 'website'
      }
    case '/links':
      return {
        title: '仙盟友链｜伙伴与收藏｜仙帝 Zeyan',
        description:
          '仙盟友链：长期可访问的技术博客、开源主页、独立创作者与收藏书签。',
        image: '/banner/starfield.webp',
        canonical: 'https://www.juxingspacestation.top/links',
        slug: 'links',
        type: 'website'
      }
    default:
      return {
        title: post
          ? `${post?.title} | ${siteInfo?.title}`
          : `${siteInfo?.title} | loading`,
        description: post?.summary,
        type: post?.type,
        slug: post?.slug,
        image: post?.pageCoverThumbnail || `${siteInfo?.pageCover}`,
        category: post?.category?.[0],
        tags: post?.tags
      }
  }
}

export default SEO
