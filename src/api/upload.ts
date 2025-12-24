import axios from 'axios'
// import { apiClient } from '../lib/axios'

export interface UploadResponse {
  url: string
  filename: string
  size: number
  type: string
}

// 上传文件（支持图片、视频等）
export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  // 使用原生 axios 实例，因为需要 multipart/form-data
  const response = await axios.post<UploadResponse>(
    `${import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    }
  )

  return response.data
}
