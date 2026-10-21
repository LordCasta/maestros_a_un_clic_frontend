import type { ModuleRoutes } from '@/shared/types/router'

export const accountRoutes: ModuleRoutes = {
  client: [
    {
      path: 'security',
      name: 'client-security',
      component: () => import('./views/SecuritySettingsView.vue'),
      meta: { title: 'Seguridad y contraseña' },
    },
  ],
  professional: [
    {
      path: 'security',
      name: 'professional-security',
      component: () => import('./views/SecuritySettingsView.vue'),
      meta: { title: 'Seguridad y contraseña' },
    },
  ],
}
