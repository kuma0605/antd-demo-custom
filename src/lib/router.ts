import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'

// 创建路由实例
export const router = createRouter({ routeTree })

// 注册路由类型
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// 路由历史记录管理
interface RouteHistoryItem {
  path: string
  timestamp: number
  search?: string
  hash?: string
}

const HISTORY_KEY = 'router_history'
const MAX_HISTORY_LENGTH = 50 // 最多保存 50 条历史记录

// 获取历史记录
export const getRouteHistory = (): RouteHistoryItem[] => {
  try {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}

// 保存历史记录
const saveRouteHistory = (item: RouteHistoryItem) => {
  try {
    const history = getRouteHistory()
    // 避免重复记录相同的路径（如果最后一条记录就是当前路径，则不添加）
    if (history.length > 0 && history[history.length - 1].path === item.path) {
      return
    }

    history.push(item)

    // 限制历史记录长度
    if (history.length > MAX_HISTORY_LENGTH) {
      history.shift() // 移除最旧的记录
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('[Router History] Failed to save route history:', error)
  }
}

// 清除历史记录
export const clearRouteHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    console.error('[Router History] Failed to clear route history:', error)
  }
}

// 订阅路由变化，记录历史
router.subscribe('onLoad', () => {
  // 从 router.state 获取当前 location
  const location = router.state.location
  const historyItem: RouteHistoryItem = {
    path: location.pathname,
    timestamp: Date.now(),
    search: typeof location.search === 'string' && location.search ? location.search : undefined,
    hash: typeof location.hash === 'string' && location.hash ? location.hash : undefined,
  }
  saveRouteHistory(historyItem)

  // 开发环境下可以打印历史记录
  if (import.meta.env.DEV) {
    console.log('[Router History]', historyItem)
  }
})

// 导出一些有用的工具函数
export const getLastRoute = (): RouteHistoryItem | null => {
  const history = getRouteHistory()
  return history.length > 0 ? history[history.length - 1] : null
}

export const getPreviousRoute = (): RouteHistoryItem | null => {
  const history = getRouteHistory()
  return history.length > 1 ? history[history.length - 2] : null
}
