/**
 * Módulo de reservas: solicitud y respuesta (HU004), confirmación (HU036), inicio y fin del
 * servicio (HU027, HU028), listado, detalle, cancelación y reprogramación (HU012, HU016, HU017,
 * HU026).
 * API pública del módulo: lo que no se exporta aquí es interno.
 */
export type { CreateBookingPayload } from './api'
export { default as BookingStatusBadge } from './components/BookingStatusBadge.vue'
export { default as PendingRequestsPanel } from './components/PendingRequestsPanel.vue'
export { bookingKeys, useBooking, useBookings, usePendingRequests } from './queries'
export { useBookingAlerts } from './realtime'
export { bookingsRoutes } from './routes'
export { BOOKING_STATUS, CANCELLABLE } from './status'
