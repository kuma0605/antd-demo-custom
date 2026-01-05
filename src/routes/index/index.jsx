import { createFileRoute } from '@tanstack/react-router'
import logoIndex from '@/assets/img/logo_index.png'
import { DownOutlined, UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons'
import { Space, Dropdown } from 'antd'
import { useUserStore } from '@/stores/useUserStore'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/index/')({
  component: IndexComponent,
})

function IndexComponent() {
  const { user, isAuthenticated, logout } = useUserStore()
  const navigate = useNavigate()
  const items = [
    {
      label: '修改密码',
      key: 'changePassword',
      onClick: () => {
        navigate({ to: '/changePassword', replace: true })
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
    <div className="flex flex-col">
      <div className="w-full h-[57px] bg-[url(@/assets/img/bg_index_top.png)] bg-no-repeat bg-size-[100%_100%] flex justify-between items-center px-[20px]">
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
    </div>
  )
}
