/**
 * Formato de respuesta de la API. Contrato: backend/docs/api/convenciones.md
 */

export interface ApiSuccess<T> {
  success: true
  /** Texto para mostrar al usuario en acciones; null en lecturas. */
  message: string | null
  data: T
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ApiPaginated<T> extends ApiSuccess<T[]> {
  meta: PaginationMeta
}

export interface ApiErrorBody {
  success: false
  message: string
  /** Solo en 422: { campo: [mensajes] }. Los nombres de campo son los mismos del request. */
  errors?: Record<string, string[]>
}

export interface PageQuery {
  page?: number
  per_page?: number
}
