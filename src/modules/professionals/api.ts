import { http } from '@/shared/http/client'
import type { ApiPaginated, ApiSuccess, PageQuery } from '@/shared/types/api'
import type { ClientProfile, Professional, Report, Review } from '@/shared/types/models'

/** Filtros de GET /professionals. Contrato: backend/docs/api/endpoints.md § Profesionales */
export interface ProfessionalFilters extends PageQuery {
  q?: string
  commune_id?: number
  category_id?: number
  subcategory_id?: number
  min_price?: number
  max_price?: number
  sort?: 'rating' | 'price_asc' | 'price_desc' | 'distance'
  lat?: number
  lng?: number
  available_now?: boolean
}

export const professionalsApi = {
  search: (filters: ProfessionalFilters) =>
    http.get<ApiPaginated<Professional>>('/professionals', { query: { ...filters } }),

  find: (id: number) => http.get<ApiSuccess<Professional>>(`/professionals/${id}`),

  reviews: (id: number, page: number = 1) =>
    http.get<ApiPaginated<Review>>(`/professionals/${id}/reviews`, { query: { page } }),

  report: (payload: {
    reported_user_id: number
    reason: string
    description: string
    booking_id?: number | null
  }) => http.post<ApiSuccess<Report>>('/reports', payload),

  clientProfile: (id: number) => http.get<ApiSuccess<ClientProfile>>(`/clients/${id}`),
}
