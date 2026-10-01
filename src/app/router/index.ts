import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { authRoutes } from '@/modules/auth'
import { bookingsRoutes } from '@/modules/bookings'
import { dashboardRoutes } from '@/modules/dashboard'
import { favoritesRoutes } from '@/modules/favorites'
import { homeRoutes } from '@/modules/home'
import { professionalProfileRoutes } from '@/modules/professional-profile'
import { professionalsRoutes } from '@/modules/professionals'
import { scheduleRoutes } from '@/modules/schedule'
import { styleguideRoutes } from '@/modules/styleguide'
import type { ModuleRoutes } from '@/shared/types/router'

import AuthLayout from '../layouts/AuthLayout.vue'
import ClientLayout from '../layouts/ClientLayout.vue'
import ProfessionalLayout from '../layouts/ProfessionalLayout.vue'
import PublicLayout from '../layouts/PublicLayout.vue'
import { installGuards } from './guards'

/**
 * Para agregar un módulo: exporta sus rutas desde su index.ts (ModuleRoutes) y súmalo aquí.
 * Cada área se monta en su layout y con sus reglas de acceso (ver guards.ts).
 */
const MODULES: ModuleRoutes[] = [
  homeRoutes,
  authRoutes,
  professionalsRoutes,
  favoritesRoutes,
  bookingsRoutes,
  dashboardRoutes,
  professionalProfileRoutes,
  scheduleRoutes,
  ...(import.meta.env.DEV ? [styleguideRoutes] : []),
]

const collect = (area: keyof ModuleRoutes): RouteRecordRaw[] =>
  MODULES.flatMap((module) => module[area] ?? [])

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: collect('guest'),
  },
  {
    path: '/client',
    component: ClientLayout,
    meta: { requiresAuth: true, roles: ['client'] },
    children: [{ path: '', redirect: { name: 'client-dashboard' } }, ...collect('client')],
  },
  {
    path: '/professional',
    component: ProfessionalLayout,
    meta: { requiresAuth: true, roles: ['professional'] },
    children: [
      { path: '', redirect: { name: 'professional-dashboard' } },
      ...collect('professional'),
    ],
  },
  {
    path: '/',
    component: PublicLayout,
    children: [
      ...collect('public'),
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('../views/NotFoundView.vue'),
        meta: { title: 'Página no encontrada' },
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
})

installGuards(router)
