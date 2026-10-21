import type { ModuleRoutes } from '@/shared/types/router'

export const verificationRoutes: ModuleRoutes = {
  client: [
    {
      path: 'verification',
      name: 'client-verification',
      component: () => import('./views/VerificationView.vue'),
      meta: { title: 'Verificación de identidad' },
    },
  ],
  professional: [
    {
      path: 'verification',
      name: 'professional-verification',
      component: () => import('./views/VerificationView.vue'),
      meta: { title: 'Verificación de documentos' },
    },
  ],
  admin: [
    {
      path: 'verifications',
      name: 'admin-verifications',
      component: () => import('./views/AdminVerificationsView.vue'),
      meta: { title: 'Bandeja de verificaciones' },
    },
  ],
}
