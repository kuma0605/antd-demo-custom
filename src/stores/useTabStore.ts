// src/store/useTabStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { type RouterState } from '@tanstack/react-router'
import { router } from '@/lib/router'

// 定义 Tab 数据结构
export interface TabItem {
  title: string
  fullPath: string // 完整路径 (包含 search) 用于跳转
  path: string // 纯路径，用于判断唯一性
  closable: boolean
}

interface TabState {
  tabs: TabItem[]
  activeTab: string // 当前激活的 Tab fullPath
  addTab: (routeState: RouterState) => void
  removeTab: (fullPath: string) => void
  clearTabs: () => void
}

const MAX_TABS = 20

export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTab: '',

      /**
       * 核心逻辑：添加 Tab
       * 被 Router 订阅调用
       */
      addTab: state => {
        const { location, matches } = state
        const fullPath = location.href
        const path = location.pathname

        // 1. 获取路由标题 (从 staticData 查找最后一个有 title 的路由)
        // matches 是从根到叶子的数组，我们需要找最深层的 title
        const matchWithTitle = [...matches].reverse().find(m => m.staticData?.title)
        const title = (matchWithTitle?.staticData?.title as string) || '未命名页面'

        // 2. 更新当前激活状态
        set({ activeTab: fullPath })

        const currentTabs = get().tabs

        // 3. 查重：如果已经存在（根据 path 或 fullPath 判断，视需求而定）
        // 这里假设：同一个页面带不同参数视为不同 Tab？通常后台管理是视为同一个。
        // 如果你希望 /user?id=1 和 /user?id=2 是两个 Tab，用 fullPath 对比
        // 如果你希望 /user?id=1 和 /user?id=2 覆盖同一个 Tab，用 path 对比
        const exists = currentTabs.find(t => t.fullPath === fullPath)

        if (exists) {
          // 如果已存在，除了设置 activeTab 外，什么都不做 (不改变顺序)
          return
        }

        // 4. 数量限制 (FIFO: 移除最早的，但保留固定的)
        const newTabs = [...currentTabs]
        if (newTabs.length >= MAX_TABS) {
          // 假设第0个是首页(不可关闭)，我们删第1个；如果都可以关，删第0个
          // 这里简单处理：删掉第一个非固定的 Tab
          const deleteIndex = newTabs.findIndex(t => t.closable !== false)
          if (deleteIndex !== -1) {
            newTabs.splice(deleteIndex, 1)
          }
        }

        // 5. 添加新 Tab
        newTabs.push({
          title,
          fullPath,
          path,
          closable: true, // 可以根据 staticData 控制
        })

        set({ tabs: newTabs })
      },

      /**
       * 移除 Tab
       */
      removeTab: targetPath => {
        const { tabs, activeTab } = get()

        // 1. 如果只剩一个，可能不允许删，或者删了跳首页
        if (tabs.length === 1) return

        // 2. 计算删除后的跳转逻辑
        let nextPath = activeTab
        if (activeTab === targetPath) {
          const index = tabs.findIndex(t => t.fullPath === targetPath)
          // 优先跳到右边的，没有则跳左边
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            nextPath = nextTab.fullPath
            router.navigate({ to: nextPath }) // 执行路由跳转
          }
        }

        set({
          tabs: tabs.filter(t => t.fullPath !== targetPath),
          activeTab: nextPath,
        })
      },

      clearTabs: () => set({ tabs: [] }),
    }),
    {
      name: 'admin-tabs-storage', // sessionStorage key
      storage: createJSONStorage(() => sessionStorage), // 使用 sessionStorage
    }
  )
)
