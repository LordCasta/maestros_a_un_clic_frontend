import { useQueryCache } from '@pinia/colada'
import { onBeforeUnmount, onMounted, toValue, watch, type MaybeRefOrGetter } from 'vue'

import { useAuthStore } from '@/modules/auth'
import { getRealtime } from '@/shared/realtime/echo'
import { useToastStore } from '@/shared/stores/toast'
import type { AppNotification, Booking, NotificationType } from '@/shared/types/models'

import { bookingKeys } from './queries'

const BOOKING_NOTIFICATIONS: NotificationType[] = [
  'booking.requested',
  'booking.accepted',
  'booking.rejected',
  'booking.confirmed',
  'booking.started',
  'booking.completed',
]

/**
 * Avisos de reservas al instante: nueva solicitud y confirmación para el profesional
 * (HU004, HU036); aceptada, rechazada, iniciada o finalizada para el cliente (HU004, HU027,
 * HU028). Muestra un toast y refresca las reservas en pantalla.
 * Se usa una sola vez, en el layout de cada área. Sin Reverb configurado no hace nada.
 */
export function useBookingAlerts() {
  const auth = useAuthStore()
  const toast = useToastStore()
  const queryCache = useQueryCache()
  let channel: string | null = null

  function onNotification(notification: AppNotification) {
    if (!BOOKING_NOTIFICATIONS.includes(notification.type)) return

    toast.info(`${notification.title}. ${notification.body}`)
    void queryCache.invalidateQueries({ key: bookingKeys.all })
  }

  onMounted(() => {
    const echo = getRealtime()
    if (!echo || !auth.user) return

    channel = `App.Models.User.${auth.user.id}`
    echo.private(channel).notification(onNotification)
  })

  onBeforeUnmount(() => {
    if (channel) getRealtime()?.private(channel).stopListeningForNotification(onNotification)
  })
}

/**
 * HU026: mientras el detalle de una reserva está abierto, su estado se actualiza solo.
 * Escucha `.booking.status-changed` en el canal de presencia `booking.{id}`: el evento trae el
 * mismo BookingResource de la API, así que reemplaza la reserva en caché sin pedirla de nuevo.
 *
 * Al salir se abandona el canal. El chat (HU011) usará el mismo canal desde esta misma vista:
 * cuando llegue, ambos deben compartir una sola suscripción en lugar de unirse cada uno.
 */
export function useBookingUpdates(bookingId: MaybeRefOrGetter<number>) {
  const queryCache = useQueryCache()
  let channel: string | null = null

  function onStatusChanged(booking: Booking) {
    // Se muestra al instante y luego se refrescan historial y listados.
    queryCache.setQueryData(bookingKeys.detail(booking.id), booking)
    void queryCache.invalidateQueries({ key: bookingKeys.all })
  }

  function leave() {
    if (channel) getRealtime()?.leave(channel)
    channel = null
  }

  watch(
    () => toValue(bookingId),
    (id) => {
      leave()
      const echo = getRealtime()
      if (!echo || !id) return
      channel = `booking.${id}`
      echo.join(channel).listen('.booking.status-changed', onStatusChanged)
    },
    { immediate: true },
  )

  onBeforeUnmount(leave)
}
