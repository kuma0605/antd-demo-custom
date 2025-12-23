# 项目配置说明

## 已安装的依赖

### 核心框架

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4

### UI 和工具库

- Ant Design 6.1.1
- dayjs 1.11.19

### TanStack 生态

- @tanstack/react-query 5.90.12 - 服务端状态管理
- @tanstack/react-router 1.141.4 - 路由管理
- @tanstack/router-plugin 1.141.4 - 路由插件
- @tanstack/router-devtools 1.141.4 - 路由开发工具

### 新增依赖

- axios 1.7.9 - HTTP 请求库
- zustand 5.0.2 - 客户端状态管理

## 项目结构

```
src/
├── api/              # API 接口定义
│   └── users.ts      # 用户相关 API
├── components/       # 组件
│   └── RootComponent.tsx
├── lib/              # 工具库
│   └── axios.ts      # axios 实例配置
├── routes/           # 路由文件（file-based routing）
│   ├── __root.tsx    # 根路由
│   ├── index.tsx     # 首页
│   ├── about.tsx     # 关于页面
│   ├── users.tsx     # 用户列表（使用 React Query）
│   └── profile.tsx   # 个人中心（使用 Zustand）
├── stores/           # Zustand 状态管理
│   ├── useUserStore.ts  # 用户状态
│   └── useAppStore.ts   # 应用状态
└── main.tsx          # 入口文件
```

## 安装依赖

运行以下命令安装所有依赖：

```bash
pnpm install
```

## 使用方法

### 1. Axios 使用

```typescript
import { apiClient } from '@/lib/axios'

// 在 API 文件中使用
export const getUsers = async () => {
  const response = await apiClient.get('/users')
  return response
}
```

### 2. React Query 使用

```typescript
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/api/users'

function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
  // ...
}
```

### 3. Zustand 使用

```typescript
import { useUserStore } from '@/stores/useUserStore'

function Component() {
  const { user, login, logout } = useUserStore()
  // ...
}
```

## 环境变量

创建 `.env` 文件配置 API 地址：

```env
VITE_API_BASE_URL=https://api.example.com
```

## 开发

```bash
pnpm dev
```

## 构建

```bash
pnpm build
```
