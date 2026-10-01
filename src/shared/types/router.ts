import type { RouteRecordRaw } from 'vue-router'

import type { Role } from './models'

/**
 * Cada módulo declara sus rutas por área; app/router las monta en el layout que corresponde.
 * Las rutas de un área son hijas relativas: `bookings/:id` dentro de `client` → /client/bookings/:id
 */
export interface ModuleRoutes {
  /** PublicLayout, sin sesión requerida. */
  public?: RouteRecordRaw[]
  /** AuthLayout, solo sin sesión (login, registro). */
  guest?: RouteRecordRaw[]
  /** ClientLayout, bajo /client. */
  client?: RouteRecordRaw[]
  /** ProfessionalLayout, bajo /professional. */
  professional?: RouteRecordRaw[]
}

declare module 'vue-router' {
  interface RouteMeta {
    /** Título de la pestaña: "<title> · Maestros a un clic". */
    title?: string
    guestOnly?: boolean
    requiresAuth?: boolean
    roles?: Role[]
    /** PublicLayout oculta su barra de navegación (la portada tiene la suya). */
    hideNavbar?: boolean
  }
}
