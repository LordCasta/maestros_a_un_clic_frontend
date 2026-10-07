import { useQuery } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'

import { professionalsApi, type ProfessionalFilters } from './api'

export const professionalKeys = {
  all: ['professionals'] as const,
  search: (filters: ProfessionalFilters) => ['professionals', 'search', { ...filters }] as const,
  detail: (id: number) => ['professionals', 'detail', id] as const,
}

/** Búsqueda paginada. Mantiene los resultados anteriores en pantalla mientras llegan los nuevos. */
export function useProfessionalSearch(filters: MaybeRefOrGetter<ProfessionalFilters>) {
  return useQuery({
    key: () => professionalKeys.search(toValue(filters)),
    query: () => professionalsApi.search(toValue(filters)),
    placeholderData: (previous) => previous,
  })
}

export function useProfessional(id: MaybeRefOrGetter<number>) {
  return useQuery({
    key: () => professionalKeys.detail(toValue(id)),
    query: async () => (await professionalsApi.find(toValue(id))).data,
  })
}
