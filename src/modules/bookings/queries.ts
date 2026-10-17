import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'

import { scheduleKeys } from '@/modules/schedule'
import type { BookingStatus } from '@/shared/types/models'

import { bookingsApi, type CreateBookingPayload } from './api'

export const bookingKeys = {
  all: ['bookings'] as const,
  list: (page: number, status: BookingStatus[] = []) =>
    ['bookings', 'list', page, status.join(',') || 'all'] as const,
  summary: ['bookings', 'summary'] as const,
  pending: ['bookings', 'pending'] as const,
  detail: (id: number) => ['bookings', 'detail', id] as const,
  history: (id: number) => ['bookings', 'history', id] as const,
}

/** Reservas del usuario según su rol (el backend filtra), opcionalmente por estados. */
export function useBookings(
  page: MaybeRefOrGetter<number>,
  status: MaybeRefOrGetter<BookingStatus[]> = [],
) {
  return useQuery({
    key: () => bookingKeys.list(toValue(page), toValue(status)),
    query: () => bookingsApi.list({ page: toValue(page), status: toValue(status) }),
    placeholderData: (previous) => previous,
  })
}

/** HU017: total de reservas por estado (realizadas, canceladas, próximas…). */
export function useBookingSummary() {
  return useQuery({
    key: bookingKeys.summary,
    query: async () => (await bookingsApi.summary()).data,
  })
}

/** HU004: solicitudes por responder del profesional (las más recientes y el total). */
export function usePendingRequests(limit = 5) {
  return useQuery({
    key: bookingKeys.pending,
    query: () => bookingsApi.list({ status: ['pending'], per_page: limit }),
  })
}

export function useBooking(id: MaybeRefOrGetter<number>) {
  return useQuery({
    key: () => bookingKeys.detail(toValue(id)),
    query: async () => (await bookingsApi.find(toValue(id))).data,
  })
}

/** HU026: historial de cambios de estado de una reserva. */
export function useBookingHistory(id: MaybeRefOrGetter<number>) {
  return useQuery({
    key: () => bookingKeys.history(toValue(id)),
    query: async () => (await bookingsApi.history(toValue(id))).data,
  })
}

/**
 * Invalida reservas y agenda tras cualquier cambio: la hora reservada o liberada
 * debe desaparecer o volver a aparecer en las horas libres.
 */
function useInvalidateBookings() {
  const queryCache = useQueryCache()

  return () => {
    void queryCache.invalidateQueries({ key: bookingKeys.all })
    void queryCache.invalidateQueries({ key: scheduleKeys.all })
  }
}

/** HU004: el cliente solicita una reserva. */
export function useCreateBooking() {
  const invalidate = useInvalidateBookings()

  return useMutation({
    mutation: (payload: CreateBookingPayload) => bookingsApi.create(payload),
    onSettled: invalidate,
  })
}

/** HU004: el profesional acepta. */
export function useAcceptBooking() {
  const invalidate = useInvalidateBookings()

  return useMutation({
    mutation: (id: number) => bookingsApi.accept(id),
    onSettled: invalidate,
  })
}

/** HU004: el profesional rechaza, con motivo opcional. */
export function useRejectBooking() {
  const invalidate = useInvalidateBookings()

  return useMutation({
    mutation: ({ id, reason }: { id: number; reason?: string }) => bookingsApi.reject(id, reason),
    onSettled: invalidate,
  })
}

/** HU036: el cliente confirma una reserva aceptada. */
export function useConfirmBooking() {
  const invalidate = useInvalidateBookings()

  return useMutation({
    mutation: (id: number) => bookingsApi.confirm(id),
    onSettled: invalidate,
  })
}

/** HU027: el profesional inicia el servicio (desde la hora pactada). */
export function useStartBooking() {
  const invalidate = useInvalidateBookings()

  return useMutation({
    mutation: (id: number) => bookingsApi.start(id),
    onSettled: invalidate,
  })
}

/** HU028: el profesional finaliza el servicio. */
export function useCompleteBooking() {
  const invalidate = useInvalidateBookings()

  return useMutation({
    mutation: (id: number) => bookingsApi.complete(id),
    onSettled: invalidate,
  })
}

/** HU012: mover la reserva a otra hora libre (vuelve a pendiente). */
export function useRescheduleBooking() {
  const invalidate = useInvalidateBookings()

  return useMutation({
    mutation: ({ id, startsAt }: { id: number; startsAt: string }) =>
      bookingsApi.reschedule(id, startsAt),
    onSettled: invalidate,
  })
}

/** HU012. El manejo del error (toast o alerta) lo decide quien la usa. */
export function useCancelBooking() {
  const invalidate = useInvalidateBookings()

  return useMutation({
    mutation: ({ id, reason }: { id: number; reason: string }) => bookingsApi.cancel(id, reason),
    onSettled: invalidate,
  })
}

/** HU005: calificar la reserva tras completarse. */
export function useReviewBooking() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, rating, comment }: { id: number; rating: number; comment?: string | null }) =>
      bookingsApi.review(id, { rating, comment }),
    onSettled: (_data, _error, variables) => {
      if (variables?.id) {
        void queryCache.invalidateQueries({ key: bookingKeys.detail(variables.id) })
      }
      void queryCache.invalidateQueries({ key: bookingKeys.all })
    },
  })
}
