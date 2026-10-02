import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { computed } from 'vue'

import { useAuthStore } from '@/modules/auth'
import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import type { ApiSuccess } from '@/shared/types/api'
import type { Favorite } from '@/shared/types/models'

import { favoritesApi } from './api'

/**
 * Datos del servidor con Pinia Colada (patrón de todos los módulos):
 *  - Una función `use…` por consulta, con su key en `favoriteKeys`.
 *  - Las mutaciones invalidan las keys afectadas para que la UI se actualice sola.
 */

export const favoriteKeys = {
  all: ['favorites'] as const,
}

/** Favoritos del cliente. Solo consulta si hay sesión de cliente. */
export function useFavorites() {
  const auth = useAuthStore()

  return useQuery({
    key: favoriteKeys.all,
    query: async () => (await favoritesApi.list()).data,
    enabled: () => auth.role === 'client',
  })
}

/** ¿Este profesional está en favoritos? Reutiliza la consulta de la lista (sin pedidos extra). */
export function useIsFavorite(professionalId: () => number) {
  const { data } = useFavorites()
  return computed(() =>
    (data.value ?? []).some((favorite) => favorite.professional.id === professionalId()),
  )
}

export function useToggleFavorite() {
  const queryCache = useQueryCache()
  const toast = useToastStore()

  return useMutation({
    mutation: ({
      professionalId,
      isFavorite,
    }: {
      professionalId: number
      isFavorite: boolean
    }): Promise<ApiSuccess<Favorite | null>> =>
      isFavorite ? favoritesApi.remove(professionalId) : favoritesApi.add(professionalId),
    onSuccess: (response) => {
      if (response.message) toast.success(response.message)
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : 'No pudimos actualizar tus favoritos.',
      )
    },
    onSettled: () => queryCache.invalidateQueries({ key: favoriteKeys.all }),
  })
}
