import { createRootRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, Spin, type SpinProps } from 'antd'
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

const stylesObject: SpinProps['styles'] = {
  indicator: {
    color: '#1677ff',
  },
  /* tip: {
    color: '#1677ff',
  }, */
}

function RootComponent() {
  // 直接在 selector 中计算，更简洁高效
  const isLoading = useLoadingStore(state => state.count > 0)

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={zhCN}>
        <div className="w-screen h-screen">
          {/* 页面内容 */}
          <Outlet />
          {/* 遮罩 */}
          {/* 全局 loading 遮罩 - 使用更高的 z-index 确保能覆盖 Modal */}
          {isLoading && (
            <div className="fixed inset-0 " style={{ zIndex: 10000 }}>
              <Spin size="large" fullscreen styles={stylesObject} />
            </div>
          )}
          {/* 开发工具 */}
          <TanStackRouterDevtools />
        </div>
      </ConfigProvider>
    </QueryClientProvider>
  )
}
