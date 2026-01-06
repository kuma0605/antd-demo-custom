import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // 重定向到 /index
    throw redirect({
      to: '/index',
      replace: true,
    })
  },
})
