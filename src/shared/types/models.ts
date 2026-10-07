/**
 * Espejo de los Resources del backend (app/Http/Resources). Si el backend cambia
 * un Resource, se actualiza aquí en el mismo par de PRs. Ver docs/arquitectura.md.
 *
 * Fechas: strings ISO 8601 con desfase (2026-10-02T09:00:00-05:00). Dinero: número en COP.
 */

// Enums (backend: app/Enums)

export type Role = 'client' | 'professional' | 'admin'

export type VerificationStatus = 'unverified' | 'pending' | 'approved' | 'rejected'

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type PriceType = 'hourly' | 'fixed'

export type CommuneType = 'comuna' | 'corregimiento'

// Recursos

export interface Rating {
  average: number
  count: number
}

/** CommuneResource */
export interface Commune {
  id: number
  code: string
  name: string
  type: CommuneType
}

/** CategoryResource. `children` solo viene en GET /categories. */
export interface Category {
  id: number
  parent_id: number | null
  name: string
  slug: string
  /** Nombre de un ícono de lucide (https://lucide.dev/icons). */
  icon: string | null
  children?: Category[]
}

/** UserResource: la cuenta autenticada (login, registro, /auth/me). */
export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  avatar_url: string | null
  role: Role
  commune: Commune | null
  address: string | null
  latitude: number | null
  longitude: number | null
  verification_status: VerificationStatus
  rating: Rating
  created_at: string
}

/** UserSummaryResource: la contraparte dentro de otro recurso. */
export interface UserSummary {
  id: number
  name: string
  avatar_url: string | null
  rating: Rating
}

/** ProfessionalServiceResource */
export interface ProfessionalService {
  id: number
  title: string
  description: string | null
  category?: Category | null
  price_type: PriceType
  price: number
  estimated_duration_minutes: number
  is_active: boolean
}

export interface PortfolioItem {
  id: number
  image_url: string
  description: string | null
}

/**
 * ProfessionalResource: perfil público. `services` y `portfolio` solo vienen
 * en el detalle (GET /professionals/{id}).
 */
export interface Professional {
  id: number
  name: string
  avatar_url: string | null
  commune?: Commune | null
  is_verified: boolean
  rating: Rating
  description: string | null
  experience_years: number | null
  hourly_rate: number | null
  categories?: Category[]
  services?: ProfessionalService[]
  portfolio?: PortfolioItem[]
}

/** BookingResource */
export interface Booking {
  id: number
  status: BookingStatus
  service: ProfessionalService
  client: UserSummary
  professional: UserSummary
  description: string | null
  address: string
  commune: Commune | null
  starts_at: string
  ends_at: string
  agreed_price: number
  started_at: string | null
  completed_at: string | null
  created_at: string
}

/** FavoriteResource */
export interface Favorite {
  id: number
  professional: Professional
  created_at: string
}
