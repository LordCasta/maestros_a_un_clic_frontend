import type { ModuleRoutes } from '@/shared/types/router'

export const adminRoutes: ModuleRoutes = {
  admin: [
    {
      path: 'users',
      name: 'admin-users',
      component: () => import('./views/AdminUsersView.vue'),
      meta: { title: 'Gestión de usuarios' },
    },
    {
      path: 'reports',
      name: 'admin-reports',
      component: () => import('./views/AdminReportsView.vue'),
      meta: { title: 'Bandeja de reportes' },
    },
    {
      path: 'alerts',
      name: 'admin-alerts',
      component: () => import('./views/AdminAlertsView.vue'),
      meta: { title: 'Alertas del sistema' },
    },
  ],
}
