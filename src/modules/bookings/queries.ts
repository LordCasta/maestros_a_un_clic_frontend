import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'

import { bookingsApi } from './api'

export const bookingKeys = {
  all: ['bookings'] as const,
  list: (page: number) => ['bookings', 'list', page] as const,
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

export function useBooking(id: MaybeRefOrGetter<number>) {
  return useQuery({
    key: () => bookingKeys.detail(toValue(id)),
    query: async () => (await bookingsApi.find(toValue(id))).data,
  })
}

/** HU012. El manejo del error (toast o alerta) lo decide quien la usa. */
export function useCancelBooking() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, reason }: { id: number; reason: string }) => bookingsApi.cancel(id, reason),
    onSettled: () => queryCache.invalidateQueries({ key: bookingKeys.all }),
  })
}
