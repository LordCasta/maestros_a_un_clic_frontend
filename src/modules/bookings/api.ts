import { http } from '@/shared/http/client'
import type { ApiPaginated, ApiSuccess, PageQuery } from '@/shared/types/api'
import type { Booking, BookingStatus } from '@/shared/types/models'

/** Contrato: backend/docs/api/endpoints.md § Reservas */

export interface CreateBookingPayload {
  professional_service_id: number
  /** ISO 8601. Una de las horas de GET /professionals/{id}/slots. */
  starts_at: string
  address: string
  description?: string
  commune_id?: number | null
}

export interface BookingListQuery extends PageQuery {
  status?: BookingStatus
}

export const bookingsApi = {
  list: (query: BookingListQuery) =>
    http.get<ApiPaginated<Booking>>('/bookings', { query: { ...query } }),
  find: (id: number) => http.get<ApiSuccess<Booking>>(`/bookings/${id}`),
  create: (payload: CreateBookingPayload) => http.post<ApiSuccess<Booking>>('/bookings', payload),
  accept: (id: number) => http.post<ApiSuccess<Booking>>(`/bookings/${id}/accept`),
  reject: (id: number, reason?: string) =>
    http.post<ApiSuccess<Booking>>(`/bookings/${id}/reject`, reason ? { reason } : {}),
  confirm: (id: number) => http.post<ApiSuccess<Booking>>(`/bookings/${id}/confirm`),
  cancel: (id: number, reason: string) =>
    http.post<ApiSuccess<Booking>>(`/bookings/${id}/cancel`, { reason }),
}
