import type { ModuleRoutes } from '@/shared/types/router'

export const scheduleRoutes: ModuleRoutes = {
  professional: [
    {
      path: 'availability',
      name: 'professional-availability',
      component: () => import('./views/AvailabilityView.vue'),
      meta: { title: 'Disponibilidad' },
    },
  ],
}
