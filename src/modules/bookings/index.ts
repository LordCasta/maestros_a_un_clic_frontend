/**
 * Módulo de reservas: listado, detalle y cancelación (HU012, HU016, HU017, HU026).
 * API pública del módulo: lo que no se exporta aquí es interno.
 */
export type { CreateBookingPayload } from './api'
export { default as BookingStatusBadge } from './components/BookingStatusBadge.vue'
export { bookingKeys, useBooking, useBookings } from './queries'
export { bookingsRoutes } from './routes'
export { BOOKING_STATUS, CANCELLABLE } from './status'
