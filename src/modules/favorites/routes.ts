import type { ModuleRoutes } from '@/shared/types/router'

export const favoritesRoutes: ModuleRoutes = {
  client: [
    {
      path: 'favorites',
      name: 'client-favorites',
      component: () => import('./views/MyFavoritesView.vue'),
      meta: { title: 'Mis favoritos' },
    },
  ],
}
