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

/** Una hora libre de GET /professionals/{id}/slots (HU025). */
export interface AvailableSlot {
  starts_at: string
  ends_at: string
}

/** GET /professionals/{id}/slots */
export interface ProfessionalSlots {
  /** Y-m-d */
  date: string
  service_id: number
  duration_minutes: number
  slots: AvailableSlot[]
}

/** MyProfessionalProfileResource: el perfil propio para editarlo (HU009). */
export interface MyProfessionalProfile {
  description: string | null
  experience_years: number | null
  hourly_rate: number | null
  service_radius_km: number | null
  commune: Commune | null
  address: string | null
  latitude: number | null
  longitude: number | null
  categories: Category[]
  verification_status: VerificationStatus
}

/** AvailabilityRuleResource: franja del horario semanal. weekday: 0 = domingo … 6 = sábado. */
export interface AvailabilityRule {
  id: number
  weekday: number
  /** H:i */
  start_time: string
  end_time: string
}

/** AvailabilityBlockResource: intervalo marcado como ocupado. */
export interface AvailabilityBlock {
  id: number
  starts_at: string
  ends_at: string
  reason: string | null
}

/** GET /professional/availability (HU003) */
export interface ProfessionalAvailability {
  buffer_minutes: number
  rules: AvailabilityRule[]
  blocks: AvailabilityBlock[]
}

/** Tipos de notificación. Contrato: backend/docs/api/endpoints.md § Notificaciones */
export type NotificationType =
  | 'booking.requested'
  | 'booking.accepted'
  | 'booking.rejected'
  | 'booking.confirmed'
  | 'booking.started'
  | 'booking.completed'
  | 'booking.cancelled'
  | 'booking.rescheduled'
  | 'message.received'

/** Notificación recibida por el canal privado App.Models.User.{id}. */
export interface AppNotification {
  id: string
  type: NotificationType
  booking_id: number
  title: string
  body: string
}

/** GET /bookings/summary (HU017): cuántas reservas tiene el usuario en cada estado. */
export interface BookingSummary {
  total: number
  by_status: Record<BookingStatus, number>
}

/** BookingStatusChangeResource: un paso del historial de una reserva (HU026). */
export interface BookingStatusChange {
  id: number
  from_status: BookingStatus | null
  to_status: BookingStatus
  reason: string | null
  /** Solo al reprogramar (HU012). */
  previous_starts_at: string | null
  changed_by: { id: number; name: string } | null
  created_at: string
}

/** NotificationResource: una notificación guardada (HU018). */
export interface NotificationItem {
  id: string
  type: NotificationType
  booking_id: number | null
  title: string
  body: string
  read_at: string | null
  created_at: string
}

/** MessageResource: un mensaje del chat de una reserva (HU011, HU042). */
export interface Message {
  id: number
  booking_id: number
  sender: UserSummary
  body: string | null
  /** URL firmada que vence: se renueva al pedir el historial. */
  attachment_url: string | null
  read_at: string | null
  created_at: string
}

/** GET /bookings/{id}/messages */
export interface Conversation {
  can_send: boolean
  messages: Message[]
}

/** FavoriteResource */
export interface Favorite {
  id: number
  professional: Professional
  created_at: string
}
