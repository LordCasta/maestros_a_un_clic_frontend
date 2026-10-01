import {
  CalendarClock,
  CalendarDays,
  Heart,
  LayoutDashboard,
  Search,
  UserRound,
  Wrench,
} from '@lucide/vue'
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import type { Role } from '@/shared/types/models'

export interface NavItem {
  label: string
  to: RouteLocationRaw
  icon: Component
}

/** Enlaces principales de cada rol (barra superior y menú móvil). */
export const NAV_ITEMS: Record<Role | 'guest', NavItem[]> = {
  guest: [{ label: 'Buscar profesionales', to: { name: 'search' }, icon: Search }],
  client: [
    { label: 'Inicio', to: { name: 'client-dashboard' }, icon: LayoutDashboard },
    { label: 'Buscar', to: { name: 'search' }, icon: Search },
    { label: 'Mis reservas', to: { name: 'client-bookings' }, icon: CalendarDays },
    { label: 'Favoritos', to: { name: 'client-favorites' }, icon: Heart },
  ],
  professional: [
    { label: 'Panel', to: { name: 'professional-dashboard' }, icon: LayoutDashboard },
    { label: 'Reservas', to: { name: 'professional-bookings' }, icon: CalendarDays },
    { label: 'Servicios', to: { name: 'professional-services' }, icon: Wrench },
    { label: 'Disponibilidad', to: { name: 'professional-availability' }, icon: CalendarClock },
    { label: 'Mi perfil', to: { name: 'professional-about' }, icon: UserRound },
  ],
  // El panel de administración llega con el módulo de verificación y administración.
  admin: [{ label: 'Buscar profesionales', to: { name: 'search' }, icon: Search }],
}
