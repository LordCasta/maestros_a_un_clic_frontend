import type { ModuleRoutes } from '@/shared/types/router'

export const verificationRoutes: ModuleRoutes = {
  professional: [
    {
      path: 'verification',
      name: 'professional-verification',
      component: () => import('./views/VerificationView.vue'),
      meta: { title: 'Verificación de documentos' },
    },
  ],
}
