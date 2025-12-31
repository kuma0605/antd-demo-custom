import { createRootRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, Spin } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useLoadingStore } from '../stores/useLoadingStore'

// 设置 dayjs 为中文
dayjs.locale('zh-cn')

export const Route = createRootRoute({
  component: RootComponent,
})

// 创建 QueryClient
const queryClient = new QueryClient()

function RootComponent() {
  // 直接在 selector 中计算，更简洁高效
  const isLoading = useLoadingStore(state => state.count > 0)

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={zhCN}>
        <div className="w-screen h-screen">
          {/* 页面内容 */}
          <Outlet />

          {/* 开发工具 */}
          <TanStackRouterDevtools />
          <Spin spinning={isLoading} size="large" tip="加载中..." fullscreen></Spin>
        </div>
      </ConfigProvider>
    </QueryClientProvider>
  )
}
