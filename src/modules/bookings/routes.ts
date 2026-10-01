import type { ModuleRoutes } from '@/shared/types/router'

const detail = () => import('./views/BookingDetailView.vue')

export const bookingsRoutes: ModuleRoutes = {
  client: [
    {
      path: 'bookings',
      name: 'client-bookings',
      component: () => import('./views/MyBookingsView.vue'),
      meta: { title: 'Mis reservas' },
    },
    {
      path: 'bookings/:id(\\d+)',
      name: 'client-booking-detail',
      component: detail,
      meta: { title: 'Detalle de la reserva' },
    },
  ],
  professional: [
    {
      path: 'bookings',
      name: 'professional-bookings',
      component: () => import('./views/ProfessionalBookingsView.vue'),
      meta: { title: 'Reservas recibidas' },
    },
    {
      path: 'bookings/:id(\\d+)',
      name: 'professional-booking-detail',
      component: detail,
      meta: { title: 'Detalle de la reserva' },
    },
  ],
}
