import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, Button, Space } from 'antd'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import MyEditor from '../components/tinymce'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 className="text-3xl font-bold underline">Hello world, baby!</h1>
      <MyEditor />
      <div style={{ marginBottom: '20px' }}>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <Card title="欢迎使用 TanStack Router, dylan" style={{ marginBottom: '20px' }}>
        <h1>Vite + React + TanStack Router</h1>
        <div className="card">
          <Space direction="vertical" size="middle">
            <Button type="primary" onClick={() => setCount(count => count + 1)} size="large">
              count is {count}
            </Button>
            <p>
              编辑 <code>src/routes/index.tsx</code> 并保存以测试 HMR
            </p>
          </Space>
        </div>
      </Card>

      <Card title="路由功能演示">
        <p>这是一个使用 file-based routing 的示例：</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>✅ 文件系统路由（file-based routing）</li>
          <li>✅ 类型安全的路由</li>
          <li>✅ 自动代码分割</li>
          <li>✅ 与 React Query 集成</li>
          <li>✅ 与 Ant Design 集成</li>
        </ul>
      </Card>

      <p className="read-the-docs">点击 Vite 和 React 的 logo 了解更多</p>
    </div>
  )
}
