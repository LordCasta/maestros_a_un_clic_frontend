import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'

import { scheduleApi, type CreateBlockPayload, type UpdateRulesPayload } from './api'

export const scheduleKeys = {
  all: ['schedule'] as const,
  mine: ['schedule', 'mine'] as const,
  /** Prefijo de todas las horas libres de un profesional (para invalidarlas juntas). */
  professionalSlots: (professionalId: number) => ['schedule', 'slots', professionalId] as const,
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

/** HU003: horario, descanso y bloqueos del profesional autenticado. */
export function useMyAvailability() {
  return useQuery({
    key: scheduleKeys.mine,
    query: async () => (await scheduleApi.mine()).data,
  })
}

function useInvalidateSchedule() {
  const queryCache = useQueryCache()
  return () => void queryCache.invalidateQueries({ key: scheduleKeys.all })
}

export function useUpdateRules() {
  const invalidate = useInvalidateSchedule()

  return useMutation({
    mutation: (payload: UpdateRulesPayload) => scheduleApi.updateRules(payload),
    onSettled: invalidate,
  })
}

export function useAddBlock() {
  const invalidate = useInvalidateSchedule()

  return useMutation({
    mutation: (payload: CreateBlockPayload) => scheduleApi.addBlock(payload),
    onSettled: invalidate,
  })
}

export function useRemoveBlock() {
  const invalidate = useInvalidateSchedule()

  return useMutation({
    mutation: (id: number) => scheduleApi.removeBlock(id),
    onSettled: invalidate,
  })
}
