// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  data: {
    user: User
    token: string
  }
}

// 猫咪相关类型
export interface Cat {
  _id: string
  userId: string
  name: string
  breed: string
  gender: 'male' | 'female'
  birthDate: string
  color: string
  weight: number
  isNeutered: boolean
  photo: string
  photos: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

export interface CatFormData {
  name: string
  breed: string
  gender: 'male' | 'female'
  birthDate: string
  color: string
  weight: number
  isNeutered: boolean
  photo: string
  photos: string[]
  notes: string
}

export interface CatsResponse {
  message: string
  data: Cat[]
}

export interface CatResponse {
  message: string
  data: Cat
}

export interface UploadResponse {
  message: string
  data: {
    url: string
  }
}

// 通用响应类型
export interface ApiResponse<T = unknown> {
  message: string
  data: T
  error?: string
}
