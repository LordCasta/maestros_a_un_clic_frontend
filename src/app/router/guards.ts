import type { Router } from 'vue-router'

import { homeRouteFor, useAuthStore } from '@/modules/auth'

/**
 * Reglas de acceso por ruta (meta de vue-router; se heredan del área):
 * - requiresAuth: sin sesión → login, y vuelve a la página pedida después.
 * - guestOnly: con sesión → su inicio (no tiene sentido ver el login).
 * - roles: rol distinto → su inicio.
 *
 * Esto es comodidad de navegación: la seguridad real la aplica el backend en cada endpoint.
 */
export function installGuards(router: Router) {
  router.beforeEach((to) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.guestOnly && auth.isAuthenticated) {
      return homeRouteFor(auth.role)
    }

    if (to.meta.roles && auth.role && !to.meta.roles.includes(auth.role)) {
      return homeRouteFor(auth.role)
    }
  })

  router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} · Maestros a un clic` : 'Maestros a un clic'
  })
}
