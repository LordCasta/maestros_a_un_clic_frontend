import type { ModuleRoutes } from '@/shared/types/router'

export const dashboardRoutes: ModuleRoutes = {
  client: [
    {
      path: 'dashboard',
      name: 'client-dashboard',
      component: () => import('./views/ClientDashboardView.vue'),
      meta: { title: 'Inicio' },
    },
  ],
  professional: [
    {
      path: 'dashboard',
      name: 'professional-dashboard',
      component: () => import('./views/ProfessionalDashboardView.vue'),
      meta: { title: 'Panel profesional' },
    },
  ],
}
