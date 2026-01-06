import { createFileRoute, redirect } from '@tanstack/react-router'
import { useUserStore } from '@/stores/useUserStore'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // 获取登录状态
    const { isAuthenticated, token } = useUserStore.getState()

    // 判断是否登录（同时检查 isAuthenticated 和 token）
    if (isAuthenticated && token) {
      // 已登录，跳转到首页
      throw redirect({
        to: '/index',
        replace: true,
      })
    } else {
      // 未登录，跳转到登录页
      throw redirect({
        to: '/login',
        replace: true,
      })
    }
  },
})
