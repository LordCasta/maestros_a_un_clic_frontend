import { http } from '@/shared/http/client'
import type { ApiPaginated, ApiSuccess, PageQuery } from '@/shared/types/api'
import type {
  Booking,
  BookingStatus,
  BookingStatusChange,
  BookingSummary,
} from '@/shared/types/models'

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
  /** Uno o varios estados; la API los recibe separados por coma. */
  status?: BookingStatus[]
}

export const bookingsApi = {
  list: ({ status, ...query }: BookingListQuery) =>
    http.get<ApiPaginated<Booking>>('/bookings', {
      query: { ...query, ...(status?.length ? { status: status.join(',') } : {}) },
    }),
  summary: () => http.get<ApiSuccess<BookingSummary>>('/bookings/summary'),
  find: (id: number) => http.get<ApiSuccess<Booking>>(`/bookings/${id}`),
  history: (id: number) => http.get<ApiSuccess<BookingStatusChange[]>>(`/bookings/${id}/history`),
  create: (payload: CreateBookingPayload) => http.post<ApiSuccess<Booking>>('/bookings', payload),
  accept: (id: number) => http.post<ApiSuccess<Booking>>(`/bookings/${id}/accept`),
  reject: (id: number, reason?: string) =>
    http.post<ApiSuccess<Booking>>(`/bookings/${id}/reject`, reason ? { reason } : {}),
  confirm: (id: number) => http.post<ApiSuccess<Booking>>(`/bookings/${id}/confirm`),
  start: (id: number) => http.post<ApiSuccess<Booking>>(`/bookings/${id}/start`),
  complete: (id: number) => http.post<ApiSuccess<Booking>>(`/bookings/${id}/complete`),
  reschedule: (id: number, startsAt: string) =>
    http.post<ApiSuccess<Booking>>(`/bookings/${id}/reschedule`, { starts_at: startsAt }),
  cancel: (id: number, reason: string) =>
    http.post<ApiSuccess<Booking>>(`/bookings/${id}/cancel`, { reason }),
}
