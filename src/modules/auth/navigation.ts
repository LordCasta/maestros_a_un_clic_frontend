import type { RouteLocationRaw } from 'vue-router'

import type { Role } from '@/shared/types/models'

/** A dónde va cada rol al iniciar sesión. */
export function homeRouteFor(role: Role | null): RouteLocationRaw {
  switch (role) {
    case 'professional':
      return { name: 'professional-dashboard' }
    case 'client':
      return { name: 'client-dashboard' }
    default:
      // El panel de administración llega con su módulo.
      return { name: 'home' }
  }
}
