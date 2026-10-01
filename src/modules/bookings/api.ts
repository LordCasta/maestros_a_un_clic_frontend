import { http } from '@/shared/http/client'
import type { ApiPaginated, ApiSuccess, PageQuery } from '@/shared/types/api'
import type { Booking } from '@/shared/types/models'

/** Contrato: backend/docs/api/endpoints.md § Reservas */

export interface CreateBookingPayload {
  professional_service_id: number
  /** ISO 8601. */
  starts_at: string
  address: string
  description?: string
  commune_id?: number | null
}

export const bookingsApi = {
  list: (query: PageQuery) => http.get<ApiPaginated<Booking>>('/bookings', { query: { ...query } }),
  find: (id: number) => http.get<ApiSuccess<Booking>>(`/bookings/${id}`),
  create: (payload: CreateBookingPayload) => http.post<ApiSuccess<Booking>>('/bookings', payload),
  cancel: (id: number, reason: string) =>
    http.post<ApiSuccess<Booking>>(`/bookings/${id}/cancel`, { reason }),
}
