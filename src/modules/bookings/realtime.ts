import { useQueryCache } from '@pinia/colada'
import { onBeforeUnmount, onMounted } from 'vue'

import { useAuthStore } from '@/modules/auth'
import { getRealtime } from '@/shared/realtime/echo'
import { useToastStore } from '@/shared/stores/toast'
import type { AppNotification, NotificationType } from '@/shared/types/models'

import { bookingKeys } from './queries'

const BOOKING_NOTIFICATIONS: NotificationType[] = [
  'booking.requested',
  'booking.accepted',
  'booking.rejected',
  'booking.confirmed',
]

/**
 * Avisos de reservas al instante: nueva solicitud y confirmación para el profesional
 * (HU004, HU036); aceptada o rechazada para el cliente (HU004). Muestra un toast y refresca
 * las reservas en pantalla.
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
