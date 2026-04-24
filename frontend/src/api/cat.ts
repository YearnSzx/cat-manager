import request from './request'
import type { CatFormData, CatsResponse, CatResponse } from '@/types'

export function getCats() {
  return request.get<CatsResponse>('/cats')
}

export function getCatById(id: string) {
  return request.get<CatResponse>(`/cats/${id}`)
}

export function createCat(data: CatFormData) {
  return request.post<CatResponse>('/cats', data)
}

export function updateCat(id: string, data: CatFormData) {
  return request.put<CatResponse>(`/cats/${id}`, data)
}

export function deleteCat(id: string) {
  return request.delete<CatResponse>(`/cats/${id}`)
}
