import { useState } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button, Menu, Alert } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import apiClient from '@/lib/axios'

type MenuItem = Required<MenuProps>['items'][number]

interface ApiMenu {
  id: string
  name?: string
  icon?: string
  level: string //'CATALOG' | 'MENU' | 'BUTTON'
  enable: boolean
  type: string
  router: string | null
  sort: number
  permission: string
  parentId: string
  parentIds: string
  createTime: string
  createUser: string
  delFlag: number
  children?: ApiMenu[]
  [key: string]: unknown
}

// 将 API 返回的菜单数据转换为 Ant Design Menu 需要的格式
// 同时建立 key -> router 的映射
const convertMenuToItems = (
  menus: ApiMenu[],
  routerMap: Map<string, string | null> = new Map()
): MenuItem[] => {
  return menus
    .filter(menu => menu.level !== 'BUTTON' && menu.enable) // 过滤掉 BUTTON 类型的菜单
    .map(menu => {
      const icon = menu.icon ? (
        <div className="w-[24px] h-[24px]">
          <img className="w-full h-full " src={menu.icon} alt={menu.name} />
        </div>
      ) : undefined

      // 保存 router 到映射表（即使为 null 也保存，方便判断）
      routerMap.set(menu.id, menu.router)

      const item: MenuItem = {
        key: menu.id,
        label: menu.name || menu.id,
        icon: icon,
        // 可以根据 menu 的其他字段添加 icon、children 等
      } as MenuItem

      // 递归处理子菜单（子菜单中的 BUTTON 也会被过滤）
      if (menu.children && menu.children.length > 0) {
        ;(item as MenuItem & { children?: MenuItem[] }).children = convertMenuToItems(
          menu.children,
          routerMap
        )
        if ((item as MenuItem & { children?: MenuItem[] }).children?.length === 0) {
          delete (item as MenuItem & { children?: MenuItem[] }).children
        }
      }
      return item
    })
    .filter(item => item !== undefined)
}

// 获取用户菜单并转换为 Ant Design Menu 格式
// 返回 items 和 routerMap
const getUserMenu = async (): Promise<{
  items: MenuItem[]
  routerMap: Map<string, string | null>
}> => {
  const options = {
    method: 'POST',
    url: '/sys/resource/findTree',
  }
  const res = await apiClient.request(options)
  if (res.data.code === 200) {
    const data = res.data.data
    const children = data.children as ApiMenu[]
    let menu_pc: ApiMenu[] = []
    children.some((item: ApiMenu) => {
      if (item.id === 'PC') {
        menu_pc = item.children || []
        return true
      }
    })
    // 在 queryFn 中完成数据转换，同时建立 routerMap
    const routerMap = new Map<string, string | null>()
    const items = convertMenuToItems(menu_pc, routerMap)
    return { items, routerMap }
  }
  return { items: [], routerMap: new Map() }
}

export const CustomMenu = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  // 在组件内部获取菜单数据（已经是 Ant Design Menu 格式）
  const {
    data: menuData,
    isError,
    error,
  } = useQuery({
    queryKey: ['menus'],
    queryFn: getUserMenu,
  })

  // 从 menuData 中提取 items 和 routerMap
  const menuItems = menuData?.items || []
  const routerMap = menuData?.routerMap || new Map<string, string | null>()

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  // 错误处理
  if (isError) {
    return (
      <div className="p-4">
        <Alert description={error?.message || '未知错误'} type="error" />
      </div>
    )
  }

  const handleClick: MenuProps['onClick'] = e => {
    // 直接从 Map 中获取 router，O(1) 时间复杂度
    const router = routerMap.get(e.key as string)
    if (router) {
      navigate({ to: router })
    }
  }

  return (
    <div className="flex flex-col w-fit h-full bg-[url(@/assets/img/bg_left_menu.png)] bg-no-repeat bg-size-[100%_100%] ">
      <div className="flex-1 overflow-y-auto ">
        <Menu
          className="bg-transparent! border-r-0!"
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={menuItems}
          onClick={handleClick}
        />
      </div>
      <Button
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        className="m-4"
      />
    </div>
  )
}
