import { create } from 'zustand'

interface AppState {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  sidebarCollapsed: boolean
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: 'zh-CN' | 'en-US') => void
  toggleSidebar: () => void
}

// 简单的应用状态管理（不需要持久化）
export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  language: 'zh-CN',
  sidebarCollapsed: false,
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}))

