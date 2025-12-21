import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, List, Avatar, Spin, Alert } from 'antd'
import { UserOutlined } from '@ant-design/icons'

export const Route = createFileRoute('/users')({
  component: Users,
})

// 模拟 API 数据
interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

// 模拟 API 函数
const fetchUsers = async (): Promise<User[]> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com' },
  ]
}

function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
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

