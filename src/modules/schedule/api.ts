import { http } from '@/shared/http/client'
import type { ApiSuccess } from '@/shared/types/api'
import type { ProfessionalSlots } from '@/shared/types/models'

/** Contrato: backend/docs/api/endpoints.md § Profesionales → GET /professionals/{id}/slots */
export const scheduleApi = {
  slots: (professionalId: number, date: string, serviceId: number) =>
    http.get<ApiSuccess<ProfessionalSlots>>(`/professionals/${professionalId}/slots`, {
      query: { date, service_id: serviceId },
    }),
}
