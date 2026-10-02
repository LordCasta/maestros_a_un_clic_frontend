import type { ModuleRoutes } from '@/shared/types/router'

export const homeRoutes: ModuleRoutes = {
  public: [
    {
      path: '',
      name: 'home',
      component: () => import('./views/HomeView.vue'),
      // La portada tiene su propio encabezado: PublicLayout no muestra la barra de navegación.
      meta: { title: 'Profesionales del hogar a un clic', hideNavbar: true },
    },
  ],
}
