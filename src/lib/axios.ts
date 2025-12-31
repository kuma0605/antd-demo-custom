import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import { useLoadingStore } from '../stores/useLoadingStore'

// 请求白名单：这些接口不需要显示全局 loading
const loadingWhitelist: string[] = [
  '/component/captcha', // 验证码接口
  '/component/mobile/captcha', // 手机验证码接口
  // 可以继续添加其他不需要 loading 的接口
]

// 判断请求是否需要 loading
const shouldShowLoading = (url: string): boolean => {
  return !loadingWhitelist.some(path => url.includes(path))
}

// 创建 axios 实例
// 开发环境：使用 Vite proxy，baseURL 为空或使用相对路径
// 生产环境：使用环境变量 VITE_API_URL_PREFIX
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_PREFIX,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可以在这里添加 token 等认证信息
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 管理全局 loading
    const url = config.url || ''
    if (shouldShowLoading(url)) {
      useLoadingStore.getState().increment()
    }

    return config
  },
  (error: AxiosError) => {
    // 请求错误时也要减少 loading 计数
    const config = error.config as InternalAxiosRequestConfig | undefined
    if (config) {
      const url = config.url || ''
      if (shouldShowLoading(url)) {
        useLoadingStore.getState().decrement()
      }
    }
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 统一处理响应数据
    // 减少 loading 计数
    const config = response.config
    const url = config.url || ''
    if (shouldShowLoading(url)) {
      useLoadingStore.getState().decrement()
    }
    return response
  },
  (error: AxiosError) => {
    // 统一处理错误
    // 减少 loading 计数
    const config = error.config as InternalAxiosRequestConfig | undefined
    if (config) {
      const url = config.url || ''
      if (shouldShowLoading(url)) {
        useLoadingStore.getState().decrement()
      }
    }

    if (error.response) {
      // 服务器返回了错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，可以跳转到登录页
          console.error('未授权，请重新登录')
          break
        case 403:
          console.error('拒绝访问')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error(
            '请求失败:',
            (error.response.data as { message?: string })?.message || error.message
          )
          break
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误，请检查网络连接')
    } else {
      // 其他错误
      console.error('请求配置错误:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient
