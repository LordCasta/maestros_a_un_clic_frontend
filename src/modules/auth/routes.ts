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
    {
      path: 'forgot-password',
      name: 'forgot-password',
      component: () => import('./views/ForgotPasswordView.vue'),
      meta: { title: 'Recuperar contraseña' },
    },
    {
      path: 'reset-password',
      name: 'reset-password',
      component: () => import('./views/ResetPasswordView.vue'),
      meta: { title: 'Restablecer contraseña' },
    },
  ],
}
