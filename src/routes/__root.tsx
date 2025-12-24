import { createRootRoute } from '@tanstack/react-router'
import { Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 设置 dayjs 为中文
dayjs.locale('zh-cn')

export const Route = createRootRoute({
  component: RootComponent,
})

// 创建 QueryClient
const queryClient = new QueryClient()

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={zhCN}>
        <div style={{ minHeight: '100vh' }}>
          {/* 导航栏 */}
          <nav
            style={{
              padding: '20px',
              borderBottom: '1px solid #e8e8e8',
              backgroundColor: '#fafafa',
            }}
          >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link
                  to="/"
                  style={{
                    textDecoration: 'none',
                    color: '#1890ff',
                    fontWeight: 500,
                  }}
                  activeProps={{
                    style: { color: '#1890ff', fontWeight: 'bold' },
                  }}
                >
                  首页
                </Link>
                <Link
                  to="/about"
                  style={{
                    textDecoration: 'none',
                    color: '#1890ff',
                    fontWeight: 500,
                  }}
                  activeProps={{
                    style: { color: '#1890ff', fontWeight: 'bold' },
                  }}
                >
                  关于
                </Link>
                <Link
                  to="/users"
                  style={{
                    textDecoration: 'none',
                    color: '#1890ff',
                    fontWeight: 500,
                  }}
                  activeProps={{
                    style: { color: '#1890ff', fontWeight: 'bold' },
                  }}
                >
                  用户列表
                </Link>
                <Link
                  to="/profile"
                  style={{
                    textDecoration: 'none',
                    color: '#1890ff',
                    fontWeight: 500,
                  }}
                  activeProps={{
                    style: { color: '#1890ff', fontWeight: 'bold' },
                  }}
                >
                  个人中心
                </Link>
              </div>
            </div>
          </nav>

          {/* 页面内容 */}
          <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <Outlet />
          </main>

          {/* 开发工具 */}
          <TanStackRouterDevtools />
        </div>
      </ConfigProvider>
    </QueryClientProvider>
  )
}
