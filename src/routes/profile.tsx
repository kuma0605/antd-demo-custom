import { createFileRoute } from '@tanstack/react-router'
import { Card, Button, Space, Avatar, Tag, Divider } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useUserStore } from '../stores/useUserStore'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: Profile,
})

function Profile() {
  const { user, isAuthenticated, logout } = useUserStore()
  const navigate = useNavigate()

  // 模拟登录功能
  const handleLogin = () => {
    useUserStore.getState().login(
      {
        id: 1,
        name: 'Dylan',
        email: 'dylan@example.com',
      },
      'mock-token-12345'
    )
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  if (!isAuthenticated || !user) {
    return (
      <Card title="用户信息">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>您尚未登录</p>
          <Button type="primary" onClick={handleLogin}>
            模拟登录
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div>
      <Card title="个人资料">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
            <div>
              <h2 style={{ margin: 0 }}>{user.name}</h2>
              <p style={{ margin: '8px 0 0 0', color: '#666' }}>{user.email}</p>
            </div>
          </div>

          <Divider />

          <div>
            <h3>状态信息</h3>
            <Space>
              <Tag color="green">已登录</Tag>
              <Tag color="blue">用户 ID: {user.id}</Tag>
            </Space>
          </div>

          <div>
            <h3>Zustand Store 演示</h3>
            <p>
              这个页面展示了如何使用 Zustand 管理用户状态。用户信息会自动持久化到 localStorage。
            </p>
            <ul>
              <li>✅ 使用 Zustand 管理用户状态</li>
              <li>✅ 自动持久化到 localStorage</li>
              <li>✅ 与 React Query 配合使用</li>
            </ul>
          </div>

          <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout} block>
            退出登录
          </Button>
        </Space>
      </Card>
    </div>
  )
}
