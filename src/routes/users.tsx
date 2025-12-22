import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, List, Avatar, Spin, Alert } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { getUsers } from '../api/users'

export const Route = createFileRoute('/users')({
  component: Users,
})

function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '20px' }}>加载中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        message="加载失败"
        description="无法加载用户列表，请稍后重试"
        type="error"
        showIcon
      />
    )
  }

  return (
    <Card title="用户列表" extra={<span>共 {data?.length || 0} 个用户</span>}>
      <List
        dataSource={data}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
              }
              title={user.name}
              description={user.email}
            />
          </List.Item>
        )}
      />
    </Card>
  )
}

