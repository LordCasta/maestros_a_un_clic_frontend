import type { ModuleRoutes } from '@/shared/types/router'

export const accountRoutes: ModuleRoutes = {
  client: [
    {
      path: 'location',
      name: 'client-location',
      component: () => import('./views/LocationSettingsView.vue'),
      meta: { title: 'Mi ubicación' },
    },
    {
      path: 'security',
      name: 'client-security',
      component: () => import('./views/SecuritySettingsView.vue'),
      meta: { title: 'Seguridad y contraseña' },
    },
  ],
  professional: [
    {
      path: 'location',
      name: 'professional-location',
      component: () => import('./views/LocationSettingsView.vue'),
      meta: { title: 'Mi ubicación' },
    },
    {
      path: 'security',
      name: 'professional-security',
      component: () => import('./views/SecuritySettingsView.vue'),
      meta: { title: 'Seguridad y contraseña' },
    },
  ],
}
