import { createFileRoute, redirect } from '@tanstack/react-router'
import logoIndex from '@/assets/img/logo_index.png'
import { DownOutlined, UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons'
import { Space, Dropdown, Tabs } from 'antd'
import { useUserStore } from '@/stores/useUserStore'
import { useNavigate } from '@tanstack/react-router'
import { ChangePassword } from '@/components/ChangePassword'
import { useState } from 'react'
import { CustomMenu } from '@/components/CustomMenu'
import { Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  beforeLoad: () => {
    // 获取登录状态
    const { isAuthenticated, token } = useUserStore.getState()

    // 判断是否登录（同时检查 isAuthenticated 和 token）
    if (!isAuthenticated || !token) {
      // 未登录，跳转到登录页
      throw redirect({
        to: '/login',
        replace: true,
      })
    }
  },
  component: IndexComponent,
})

function IndexComponent() {
  const { user, logout } = useUserStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const items = [
    {
      label: '修改密码',
      key: 'changePassword',
      onClick: () => {
        setOpen(true)
      },
      icon: <LockOutlined />,
    },
    {
      label: '退出登录',
      key: 'logout',
      onClick: () => {
        logout()
        navigate({ to: '/login', replace: true })
      },
      icon: <LogoutOutlined />,
    },
  ]

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-[57px] bg-[url(@/assets/img/bg_index_top.png)] bg-no-repeat bg-size-[100%_100%] flex justify-between items-center px-[20px] shrink-0">
        <img src={logoIndex} alt="" className="w-[274px] h-[40px]" />
        <div className="flex items-center">
          <Dropdown menu={{ items }}>
            <a className="cursor-pointer" onClick={e => e.preventDefault()}>
              <Space>
                <UserOutlined />
                <span>{user?.name}</span>
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
      <ChangePassword open={open} setOpen={setOpen} />
      <div className="flex-1 flex min-h-0">
        {/* 左侧菜单 */}
        <CustomMenu />
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 右侧内容 */}
          <Tabs
            defaultActiveKey="1"
            className="flex-shrink-0"
            items={Array.from({ length: 30 }, (_, i) => {
              const id = String(i)
              return {
                label: `Tab-${id}`,
                key: id,
              }
            })}
          />
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
