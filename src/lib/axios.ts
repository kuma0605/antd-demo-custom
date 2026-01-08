import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import { notification } from 'antd'
import { useLoadingStore } from '../stores/useLoadingStore'
import { useUserStore } from '../stores/useUserStore'

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
      config.headers.Authorization = token
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
    /* // 开发环境模拟延迟（可选，用于测试 loading 效果）
    if (import.meta.env.DEV) {
      const delay = 5000 // 延迟 2 秒，可以根据需要调整
      await new Promise(resolve => setTimeout(resolve, delay))
    } */

    // 统一处理响应数据
    // 减少 loading 计数
    const config = response.config
    const url = config.url || ''
    if (shouldShowLoading(url)) {
      useLoadingStore.getState().decrement()
    }

    // --- 处理业务状态码 401 (未授权) ---
    // 注意：这里假设你的后端在 Token 无效时，即使是 API 调用成功 (HTTP 200)，
    // 也会在响应体 data 中包含一个特定的 code (例如 401) 来表示需要重新登录。
    if (
      response.data &&
      typeof response.data === 'object' &&
      'code' in response.data &&
      response.data.code === 401 &&
      window.location.pathname !== '/login'
    ) {
      // 清除用户状态和 token
      useUserStore.getState().logout()

      // 显示错误提示
      notification.error({
        message: '登录信息已过期',
        description:
          (response.data as { message?: string })?.message || '登录信息已过期，请重新登录！',
        duration: 3,
      })

      // 延迟跳转到登录页，让用户看到提示信息
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)

      // 返回一个被拒绝的 Promise，防止后续代码错误地处理数据
      return Promise.reject(new Error('Business logic unauthorized'))
    }

    return response
  },
  async (error: AxiosError) => {
    // 统一处理错误
    const config = error.config as InternalAxiosRequestConfig | undefined

    // 减少 loading 计数（只有在 config 存在时才减少，因为只有 config 存在才可能增加了计数）
    if (config) {
      const url = config.url || ''
      if (shouldShowLoading(url)) {
        useLoadingStore.getState().decrement()
      }
    }

    // 1. 如果 config 不存在，说明请求配置有严重错误，无法继续处理
    if (!config) {
      console.error('[Axios Error] Request config missing in error.', error)
      return Promise.reject(error)
    }

    // 2. 网络错误或其他无响应错误 (error.response 不存在)
    if (!error.response) {
      if (error.request) {
        // 请求已发出，但没有收到响应
        console.error(
          '[Axios Error] Network or other error without response for:',
          config.url,
          error.message
        )
      } else {
        // 其他错误
        console.error('[Axios Error] Request configuration error:', error.message)
      }
      return Promise.reject(error)
    }

    // --- 以下是有 response 的错误 ---
    const { response } = error

    // 3. 处理 HTTP 401 (未授权) - 服务器直接返回 401 状态码
    if (response.status === 401 && window.location.pathname !== '/login') {
      // 清除用户状态和 token
      useUserStore.getState().logout()

      // 显示错误提示
      notification.error({
        message: '登录认证失败',
        description:
          (response.data as { message?: string })?.message || '登录认证失败，请重新登录！',
        duration: 3,
      })

      // 延迟跳转到登录页，让用户看到提示信息
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)

      // 抛出一个特定错误，中断 Promise 链，避免后续处理
      return Promise.reject(new Error('Unauthorized - Redirecting to login'))
    }

    // 4. 处理其他 HTTP 错误状态码
    switch (response.status) {
      case 400:
        console.error('[Axios Error] Bad Request:', response.data)
        notification.error({
          message: '请求参数错误',
          description:
            (response.data as { message?: string })?.message || '请求参数有误，请检查后重试',
          duration: 3,
        })
        break
      case 403:
        console.error('[Axios Error] Forbidden:', response.data)
        notification.error({
          message: '权限不足',
          description: (response.data as { message?: string })?.message || '您没有权限执行此操作',
          duration: 3,
        })
        break
      case 404:
        console.warn('[Axios Error] Not Found:', config.url)
        // 404 通常不需要全局提示，由具体业务处理
        break
      case 500:
      case 502:
      case 504:
        console.error(`[Axios Error] Server Error ${response.status}:`, response.data)
        notification.error({
          message: '服务器错误',
          description:
            (response.data as { message?: string })?.message ||
            '服务器内部错误，请稍后再试或联系管理员',
          duration: 3,
        })
        break
      default:
        console.error(
          '[Axios Error] Request failed:',
          (response.data as { message?: string })?.message || error.message
        )
        // 其他错误可以显示通用提示
        if (response.status >= 400) {
          notification.error({
            message: '请求失败',
            description: (response.data as { message?: string })?.message || error.message,
            duration: 3,
          })
        }
        break
    }

    // 将最终的、未经处理的错误传递下去
    return Promise.reject(error)
  }
)

export default apiClient
