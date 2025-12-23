import { createFileRoute } from '@tanstack/react-router'
import { Card, List, Tag } from 'antd'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  const techStack = [
    { name: 'React', version: '19.2.0', color: 'blue' },
    { name: 'TypeScript', version: '5.9.3', color: 'cyan' },
    { name: 'Vite', version: '7.2.4', color: 'purple' },
    { name: 'Ant Design', version: '6.1.1', color: 'red' },
    { name: 'TanStack Query', version: '5.90.12', color: 'green' },
    { name: 'TanStack Router', version: '1.141.4', color: 'orange' },
  ]

  return (
    <div>
      <Card title="关于项目" style={{ marginBottom: '20px' }}>
        <p>这是一个使用 TanStack Router 实现 file-based routing 的演示项目。</p>
        <p>TanStack Router 提供了类型安全的路由系统，与 React Query 完美集成，支持自动代码分割。</p>
      </Card>

      <Card title="技术栈">
        <List
          dataSource={techStack}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={
                  <span>
                    {item.name} <Tag color={item.color}>{item.version}</Tag>
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="路由特性" style={{ marginTop: '20px' }}>
        <ul>
          <li>
            <strong>文件系统路由：</strong>在 <code>src/routes/</code>{' '}
            目录下创建文件即可自动生成路由
          </li>
          <li>
            <strong>类型安全：</strong>路由参数和查询参数都有完整的 TypeScript 类型支持
          </li>
          <li>
            <strong>代码分割：</strong>每个路由自动进行代码分割，优化加载性能
          </li>
          <li>
            <strong>数据预加载：</strong>可以在路由级别预加载数据，与 React Query 完美配合
          </li>
        </ul>
      </Card>
    </div>
  )
}
