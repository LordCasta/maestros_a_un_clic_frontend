import { useQueryCache } from '@pinia/colada'
import { onBeforeUnmount, onMounted, toValue, type MaybeRefOrGetter } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth'
import { getRealtime } from '@/shared/realtime/echo'
import { usePresenceChannel } from '@/shared/realtime/presence'
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
  'booking.cancelled',
  'booking.rescheduled',
  'message.received',
]

/**
 * Avisos de reservas al instante: nueva solicitud y confirmación para el profesional
 * (HU004, HU036); aceptada, rechazada, iniciada o finalizada para el cliente (HU004, HU027,
 * HU028), cancelación o reprogramación para la otra parte (HU012) y mensajes nuevos del chat
 * (HU011). Muestra un toast y refresca las reservas en pantalla.
 * Se usa una sola vez, en el layout de cada área. Sin Reverb configurado no hace nada.
 */
export function useBookingAlerts() {
  const auth = useAuthStore()
  const toast = useToastStore()
  const queryCache = useQueryCache()
  let channel: string | null = null

  const router = useRouter()

  function onNotification(notification: AppNotification) {
    if (!BOOKING_NOTIFICATIONS.includes(notification.type)) return

    // Mensaje nuevo con ese chat abierto: ya se ve en pantalla, no hace falta el aviso.
    const route = router.currentRoute.value
    const viewingThatBooking =
      route.name?.toString().endsWith('booking-detail') &&
      Number(route.params.id) === notification.booking_id
    if (notification.type === 'message.received' && viewingThatBooking) return

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
 * El canal se comparte con el chat (usePresenceChannel).
 */
export function useBookingUpdates(bookingId: MaybeRefOrGetter<number>) {
  const queryCache = useQueryCache()
  const { listen } = usePresenceChannel(() => {
    const id = toValue(bookingId)
    return id ? `booking.${id}` : null
  })

  listen<Booking>('.booking.status-changed', (booking) => {
    // Se muestra al instante y luego se refrescan historial y listados.
    queryCache.setQueryData(bookingKeys.detail(booking.id), booking)
    void queryCache.invalidateQueries({ key: bookingKeys.all })
  })
}
