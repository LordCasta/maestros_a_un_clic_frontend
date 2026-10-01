import type { ModuleRoutes } from '@/shared/types/router'

export const professionalsRoutes: ModuleRoutes = {
  public: [
    {
      path: 'search',
      name: 'search',
      component: () => import('./views/SearchResultsView.vue'),
      meta: { title: 'Buscar profesionales' },
    },
    {
      path: 'professionals/:id(\\d+)',
      name: 'professional-detail',
      component: () => import('./views/ProfessionalDetailView.vue'),
      meta: { title: 'Perfil del profesional' },
    },
  ],
}
