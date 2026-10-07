import type { ModuleRoutes } from '@/shared/types/router'

export const authRoutes: ModuleRoutes = {
  guest: [
    {
      path: 'login',
      name: 'login',
      component: () => import('./views/LoginView.vue'),
      meta: { title: 'Iniciar sesión' },
    },
    {
      path: 'register/client',
      name: 'register-client',
      component: () => import('./views/RegisterClientView.vue'),
      meta: { title: 'Registro de cliente' },
    },
    {
      path: 'register/professional',
      name: 'register-professional',
      component: () => import('./views/RegisterProfessionalView.vue'),
      meta: { title: 'Registro profesional' },
    },
  ],
}
