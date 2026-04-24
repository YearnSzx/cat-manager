import type { Cat } from '@/types'

export function getCatPhotos(cat: Pick<Cat, 'photo' | 'photos'>) {
  if (Array.isArray(cat.photos) && cat.photos.length > 0) {
    return cat.photos
  }

  return cat.photo ? [cat.photo] : []
}

export function getCatCover(cat: Pick<Cat, 'photo' | 'photos'>) {
  return getCatPhotos(cat)[0] || ''
}
