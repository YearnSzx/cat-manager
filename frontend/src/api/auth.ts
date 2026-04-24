import request from './request'
import type { LoginData, RegisterData, AuthResponse } from '@/types'

export function login(data: LoginData) {
  return request.post<AuthResponse>('/auth/login', data)
}

export function register(data: RegisterData) {
  return request.post<AuthResponse>('/auth/register', data)
}

export function getMe() {
  return request.get<AuthResponse>('/auth/me')
}
