# 技术栈框架说明

## 核心工具栈

### 🛣️ 路由

- **[TanStack Router](https://tanstack.com/router)** `v1.141.4`
  - 类型安全的路由，file-based routing，将 URL 视为状态来源
  - 官网：https://tanstack.com/router

### 🔄 状态管理

- **[TanStack Query](https://tanstack.com/query)** `v5.90.12` - 服务端状态
  - 自动管理服务端状态、缓存、加载与错误处理
  - 官网：https://tanstack.com/query

- **[Zustand](https://zustand-demo.pmnd.rs/)** `v5.0.2` - 客户端状态
  - 轻量级全局状态管理（用户、主题、侧边栏等）
  - 官网：https://zustand-demo.pmnd.rs/

- **[TanStack Form](https://tanstack.com/form)** `v1.27.6` - 表单管理
  - 高性能表单处理，复杂的输入验证与状态管理
  - 官网：https://tanstack.com/form

### 🌐 网络请求

- **[Axios](https://axios-http.com/)** `v1.7.9`
  - 处理 HTTP 请求、拦截器封装、Token 注入
  - 官网：https://axios-http.com/

### 🎨 UI 组件与样式

- **[Ant Design](https://ant.design/)** `v6.1.1`
  - 企业级 UI 组件库，提供丰富的组件和设计系统
  - 官网：https://ant.design/

- **[Tailwind CSS](https://tailwindcss.com/)** `v4.1.18`
  - 实用优先的 CSS 框架，快速构建现代化界面
  - 官网：https://tailwindcss.com/

### 🛠️ 工具库

- **[dayjs](https://day.js.org/)** `v1.11.19` - 日期处理
  - 轻量级日期处理库，与 Ant Design 完美集成
  - 官网：https://day.js.org/

- **[TinyMCE](https://www.tiny.cloud/)** `v8.3.1` - 富文本编辑器
  - 功能强大的富文本编辑器，支持拖拽上传、本地化配置
  - 官网：https://www.tiny.cloud/

### 🔧 开发工具

- **[Prettier](https://prettier.io/)** `v3.4.2` - 代码格式化
  - 统一代码风格，自动格式化，与 ESLint 完美配合
  - 官网：https://prettier.io/

- **[Husky](https://typicode.github.io/husky/)** `v9.1.7` + **[lint-staged](https://github.com/okonet/lint-staged)** `v15.2.11` - Git Hooks
  - 提交前自动检查代码，确保代码质量
  - 官网：https://typicode.github.io/husky/ / https://github.com/okonet/lint-staged

- **[commitlint](https://commitlint.js.org/)** `v19.6.0` - Commit 规范
  - 规范 commit message 格式，统一提交信息
  - 官网：https://commitlint.js.org/

## 技术栈特点

### ✅ 完备的全家桶

这是一个**现代化、类型安全、高性能**的 React 全栈技术栈，覆盖了前端开发的各个领域：

1. **TanStack 生态统一**
   - Router、Query、Form 来自同一生态
   - 设计理念一致，完美集成
   - 完整的 TypeScript 类型支持

2. **职责清晰，各司其职**
   - **TanStack Query**：服务端状态（数据获取、缓存、同步）
   - **Zustand**：客户端状态（用户信息、主题、UI 状态）
   - **TanStack Form**：表单状态（表单验证、字段管理）
   - **Axios**：网络请求（API 调用、拦截器）
   - **TinyMCE**：富文本编辑（内容编辑、拖拽上传、媒体插入）
   - **Prettier**：代码格式化（统一代码风格）
   - **Husky + lint-staged**：代码质量保障（提交前自动检查）
   - **commitlint**：Commit 信息规范（统一提交格式）

3. **现代化技术栈**
   - React 19.2.0
   - TypeScript 5.9.3
   - Vite 7.2.4 (SWC)
   - 所有库都是最新稳定版本

4. **UI 方案灵活**
   - Ant Design：企业级组件库
   - Tailwind CSS：实用优先的样式方案
   - TinyMCE：功能强大的富文本编辑器
   - 三者可以完美配合使用

5. **富文本编辑能力**
   - TinyMCE 8.3.1：最新版本的富文本编辑器
   - 支持拖拽上传图片和视频
   - 本地化配置（中文界面）
   - 本地资源部署（避免云端依赖）
   - 与 Ant Design 完美集成

## 技术栈评估

### 🎯 完备度：⭐⭐⭐⭐⭐

这个技术栈已经非常完备，涵盖了：

- ✅ 路由管理
- ✅ 状态管理（服务端 + 客户端 + 表单）
- ✅ 网络请求
- ✅ UI 组件
- ✅ 样式方案
- ✅ 富文本编辑器（TinyMCE）
- ✅ 类型安全
- ✅ 代码格式化（Prettier）
- ✅ 代码质量检查（ESLint + Git Hooks）
- ✅ Commit 信息规范（commitlint）

### 💡 可选补充（按需）

如果需要进一步完善，可以考虑：

- **测试框架**：Vitest + Testing Library
  - 单元测试和组件测试
  - 与 Vite 完美集成，快速执行
- **国际化**：react-i18next（如果需要多语言）
- **图表库**：Recharts / ECharts（如果需要数据可视化，已安装 ECharts）

## 总结

这是一个**生产就绪**的现代化 React 技术栈，适合：

- 🚀 中大型项目开发
- 📱 企业级应用
- 🎨 需要丰富 UI 组件的项目
- 🔒 需要类型安全的项目
- ⚡ 追求高性能的项目

技术栈选择合理，各工具职责清晰，可以高效开发各种类型的 React 应用。
