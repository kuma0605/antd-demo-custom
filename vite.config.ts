import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const serverUrl = 'https://ntgxefw.com:9002' //online
// const serverUrl = 'http://172.168.8.224:9521' //邱磊
// const serverUrl = "http://172.168.8.20:9521"; //顾建新
// const serverUrl = "http://192.168.3.39:9521"; //许灵慧
// const serverUrl = "http://172.168.8.190:9521"; //顾婧怡
// const serverUrl = "http://172.168.8.23:9521"; //邱煜鹏
// const serverUrl = "http://172.168.8.77:9521"; //张柯柯

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // TanStack Router 插件必须在 React 插件之前
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5178,
    proxy: {
      // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
      '/api/admin': {
        target: serverUrl,
        changeOrigin: true,
      },
    },
  },
})
