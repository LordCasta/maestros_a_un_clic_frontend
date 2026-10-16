import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'

import { scheduleKeys } from '@/modules/schedule'
import type { BookingStatus } from '@/shared/types/models'

import { bookingsApi, type CreateBookingPayload } from './api'

export const bookingKeys = {
  all: ['bookings'] as const,
  list: (page: number, status?: BookingStatus) =>
    ['bookings', 'list', page, status ?? 'all'] as const,
  pending: ['bookings', 'pending'] as const,
  detail: (id: number) => ['bookings', 'detail', id] as const,
}

/** Reservas del usuario según su rol (el backend filtra). */
export function useBookings(page: MaybeRefOrGetter<number>) {
  return useQuery({
    key: () => bookingKeys.list(toValue(page)),
    query: () => bookingsApi.list({ page: toValue(page) }),
    placeholderData: (previous) => previous,
  })
}

/** HU004: solicitudes por responder del profesional (las más recientes y el total). */
export function usePendingRequests(limit = 5) {
  return useQuery({
    key: bookingKeys.pending,
    query: () => bookingsApi.list({ status: 'pending', per_page: limit }),
  })
}

export function useBooking(id: MaybeRefOrGetter<number>) {
  return useQuery({
    key: () => bookingKeys.detail(toValue(id)),
    query: async () => (await bookingsApi.find(toValue(id))).data,
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

/** HU012. El manejo del error (toast o alerta) lo decide quien la usa. */
export function useCancelBooking() {
  const invalidate = useInvalidateBookings()

  return useMutation({
    mutation: ({ id, reason }: { id: number; reason: string }) => bookingsApi.cancel(id, reason),
    onSettled: invalidate,
  })
}
