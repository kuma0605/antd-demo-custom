import { createRootRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
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
        <div className="w-screen h-screen">
          {/* 页面内容 */}
          <Outlet />

          {/* 开发工具 */}
          <TanStackRouterDevtools />
        </div>
      </ConfigProvider>
    </QueryClientProvider>
  )
}
