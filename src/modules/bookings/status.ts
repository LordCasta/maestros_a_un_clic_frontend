import type { BadgeTone } from '@/shared/ui'
import type { BookingStatus } from '@/shared/types/models'

/**
 * Presentación de los estados de una reserva. La máquina de estados real vive en el
 * backend (app/Enums/BookingStatus.php); aquí solo se refleja para la UI.
 */
export const BOOKING_STATUS: Record<BookingStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pendiente', tone: 'warning' },
  accepted: { label: 'Aceptada', tone: 'info' },
  rejected: { label: 'Rechazada', tone: 'danger' },
  confirmed: { label: 'Confirmada', tone: 'primary' },
  in_progress: { label: 'En proceso', tone: 'info' },
  completed: { label: 'Completada', tone: 'success' },
  cancelled: { label: 'Cancelada', tone: 'neutral' },
}

/** Filtros del listado de reservas (HU016, HU017, HU049). Cada uno agrupa uno o más estados. */
export const BOOKING_FILTERS: { key: string; label: string; status: BookingStatus[] }[] = [
  { key: 'all', label: 'Todas', status: [] },
  { key: 'requested', label: 'Por confirmar', status: ['pending', 'accepted'] },
  { key: 'upcoming', label: 'Próximas', status: ['confirmed'] },
  { key: 'in-progress', label: 'En proceso', status: ['in_progress'] },
  { key: 'done', label: 'Realizadas', status: ['completed'] },
  { key: 'cancelled', label: 'Canceladas', status: ['cancelled', 'rejected'] },
]

/**
 * Estados desde los que se puede cancelar o reprogramar (BookingStatus::allowedTransitions).
 * En los dos casos, además, solo antes de la hora programada (HU012).
 */
export const CANCELLABLE: BookingStatus[] = ['pending', 'accepted', 'confirmed']
export const RESCHEDULABLE: BookingStatus[] = ['pending', 'accepted', 'confirmed']
