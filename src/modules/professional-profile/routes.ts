import type { ModuleRoutes } from '@/shared/types/router'

export const professionalProfileRoutes: ModuleRoutes = {
  professional: [
    {
      path: 'about-me',
      name: 'professional-about',
      component: () => import('./views/AboutMeView.vue'),
      meta: { title: 'Mi perfil' },
    },
    {
      path: 'services',
      name: 'professional-services',
      component: () => import('./views/MyServicesView.vue'),
      meta: { title: 'Mis servicios' },
    },
  ],
}
