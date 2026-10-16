import { useQuery } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'

import { scheduleApi } from './api'

export const scheduleKeys = {
  all: ['schedule'] as const,
  slots: (professionalId: number, date: string, serviceId: number) =>
    ['schedule', 'slots', professionalId, date, serviceId] as const,
}

/**
 * HU025: horas libres de un profesional para un servicio en una fecha (Y-m-d).
 * No consulta hasta que haya un servicio elegido.
 */
export function useProfessionalSlots(
  professionalId: MaybeRefOrGetter<number>,
  date: MaybeRefOrGetter<string>,
  serviceId: MaybeRefOrGetter<number | null>,
) {
  return useQuery({
    key: () => scheduleKeys.slots(toValue(professionalId), toValue(date), toValue(serviceId) ?? 0),
    query: async () =>
      (await scheduleApi.slots(toValue(professionalId), toValue(date), toValue(serviceId) ?? 0))
        .data,
    enabled: () => toValue(serviceId) !== null,
  })
}
