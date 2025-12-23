import { apiClient } from '../lib/axios'

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

// 获取用户列表
export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users')
  return response
}

// 根据 ID 获取用户
export const getUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${id}`)
  return response
}

// 创建用户
export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const response = await apiClient.post<User>('/users', user)
  return response
}

// 更新用户
export const updateUser = async (id: number, user: Partial<Omit<User, 'id'>>): Promise<User> => {
  const response = await apiClient.put<User>(`/users/${id}`, user)
  return response
}

// 删除用户
export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`)
}
