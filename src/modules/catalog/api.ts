import { http } from '@/shared/http/client'
import type { ApiSuccess } from '@/shared/types/api'
import type { Category, Commune } from '@/shared/types/models'

/** Endpoints: backend/docs/api/endpoints.md § Catálogos */
export const catalogApi = {
  communes: () => http.get<ApiSuccess<Commune[]>>('/communes'),
  categories: () => http.get<ApiSuccess<Category[]>>('/categories'),
}
