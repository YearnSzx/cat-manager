import request from './request'
import type { UploadResponse } from '@/types'

export function uploadCatPhoto(file: File) {
  const formData = new FormData()
  formData.append('photo', file)

  return request.post<UploadResponse>('/upload/cat-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
