'use client'

import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'

/**
 * 分类 Tab 行（Firefly 内容栏顶部）
 * 首页态显示：主页 / 归档 / 最近分类 / 更多
 */
export default function CategoryTabs(props) {
  const { locale, categoryOptions } = useGlobal()
  const router = useRouter()
  const categories = (categoryOptions || props.categoryOptions || []).slice(0, 4)
  const path = String(router.asPath || '').split('?')[0].replace(/\/$/, '') || '/'

  const tabs = [
    { name: locale.NAV.INDEX, href: '/', icon: 'fas fa-house', match: '/' },
    {
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      icon: 'fas fa-box-archive',
      match: '/archive'
    }
  ]

  return (
    <div className='card-base mb-4 flex items-center gap-1.5 overflow-x-auto px-3 py-2.5'>
      {tabs.map(tab => (
        <SmartLink
          key={tab.href}
          href={tab.href}
          className={`ff-tab shrink-0 no-underline ${path === tab.match ? 'ff-tab-active' : ''}`}>
          <i className={`${tab.icon} text-[0.7rem]`} />
          {tab.name}
        </SmartLink>
      ))}

      {categories.map(category => (
        <SmartLink
          key={category.name}
          href={`/category/${category.name}`}
          className={`ff-tab shrink-0 no-underline ${
            path === `/category/${category.name}` ? 'ff-tab-active' : ''
          }`}>
          {category.name}
          <span className='opacity-60'>{category.count}</span>
        </SmartLink>
      ))}

      <SmartLink
        href='/category'
        className='ff-tab ml-auto shrink-0 no-underline'>
        {locale.COMMON.MORE}
        <i className='fas fa-angle-right text-[0.65rem]' />
      </SmartLink>
    </div>
  )
}
