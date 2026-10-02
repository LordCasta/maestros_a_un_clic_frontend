import { useQuery } from '@pinia/colada'
import { computed } from 'vue'

import type { SelectOption } from '@/shared/ui'

import { catalogApi } from './api'

/**
 * Catálogos casi estáticos: se piden una vez por sesión y se reutilizan en toda la app.
 */
const ONE_HOUR = 60 * 60 * 1000

export const catalogKeys = {
  communes: ['catalog', 'communes'] as const,
  categories: ['catalog', 'categories'] as const,
}

export function useCommunes() {
  const query = useQuery({
    key: catalogKeys.communes,
    query: async () => (await catalogApi.communes()).data,
    staleTime: ONE_HOUR,
  })

  const options = computed<SelectOption[]>(() =>
    (query.data.value ?? []).map((commune) => ({
      value: commune.id,
      label: commune.type === 'comuna' ? `Comuna ${commune.code} · ${commune.name}` : commune.name,
    })),
  )

  return { ...query, options }
}

export function useCategories() {
  const query = useQuery({
    key: catalogKeys.categories,
    query: async () => (await catalogApi.categories()).data,
    staleTime: ONE_HOUR,
  })

  /** Categorías raíz (especialidades) como opciones de selección. */
  const rootOptions = computed(() =>
    (query.data.value ?? []).map((category) => ({ value: category.id, label: category.name })),
  )

  return { ...query, rootOptions }
}
