import { request } from './axios'

type FavoriteResponse = {
  success: boolean
  message?: string
  data: {
    id: number
    professional: {
      id: number
      name: string
    }
  }
}

type FavoriteDeleteResponse = {
  success: boolean
  message?: string
}

export const addFavorite = (professionalId: number | string) => {
  return request<FavoriteResponse>(`/favorites/${professionalId}`, {
    method: 'POST',
  })
}

export const removeFavorite = (professionalId: number | string) => {
  return request<FavoriteDeleteResponse>(`/favorites/${professionalId}`, {
    method: 'DELETE',
  })
}
