import { http } from '@/shared/http/client'
import type { ApiPaginated, ApiSuccess, PageQuery } from '@/shared/types/api'
import type { Professional } from '@/shared/types/models'

/** Filtros de GET /professionals. Contrato: backend/docs/api/endpoints.md § Profesionales */
export interface ProfessionalFilters extends PageQuery {
  q?: string
  commune_id?: number
  category_id?: number
  min_price?: number
  max_price?: number
  sort?: 'rating' | 'price_asc' | 'price_desc'
}

export const professionalsApi = {
  search: (filters: ProfessionalFilters) =>
    http.get<ApiPaginated<Professional>>('/professionals', { query: { ...filters } }),

  find: (id: number) => http.get<ApiSuccess<Professional>>(`/professionals/${id}`),
}
