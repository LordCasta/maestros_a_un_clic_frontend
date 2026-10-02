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

/** Estados desde los que se puede cancelar (BookingStatus::allowedTransitions). */
export const CANCELLABLE: BookingStatus[] = ['pending', 'accepted', 'confirmed']
