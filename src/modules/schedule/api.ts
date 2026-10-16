import { http } from '@/shared/http/client'
import type { ApiSuccess } from '@/shared/types/api'
import type {
  AvailabilityBlock,
  AvailabilityRule,
  ProfessionalAvailability,
  ProfessionalSlots,
} from '@/shared/types/models'

/** Contrato: backend/docs/api/endpoints.md § Agenda del profesional y § Profesionales (slots) */

export interface UpdateRulesPayload {
  buffer_minutes: number
  rules: Omit<AvailabilityRule, 'id'>[]
}

export interface CreateBlockPayload {
  /** ISO 8601 */
  starts_at: string
  ends_at: string
  reason?: string
}

export const scheduleApi = {
  slots: (professionalId: number, date: string, serviceId: number) =>
    http.get<ApiSuccess<ProfessionalSlots>>(`/professionals/${professionalId}/slots`, {
      query: { date, service_id: serviceId },
    }),

  mine: () => http.get<ApiSuccess<ProfessionalAvailability>>('/professional/availability'),
  updateRules: (payload: UpdateRulesPayload) =>
    http.put<ApiSuccess<ProfessionalAvailability>>('/professional/availability/rules', payload),
  addBlock: (payload: CreateBlockPayload) =>
    http.post<ApiSuccess<AvailabilityBlock>>('/professional/availability/blocks', payload),
  removeBlock: (id: number) =>
    http.delete<ApiSuccess<null>>(`/professional/availability/blocks/${id}`),
}
