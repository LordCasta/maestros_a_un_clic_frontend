import type { ModuleRoutes } from '@/shared/types/router'

/** Catálogo visual del sistema de diseño. El router solo lo incluye en desarrollo. */
export const styleguideRoutes: ModuleRoutes = {
  public: [
    {
      path: '_ui',
      name: 'styleguide',
      component: () => import('./views/StyleguideView.vue'),
      meta: { title: 'Sistema de diseño' },
    },
  ],
}
