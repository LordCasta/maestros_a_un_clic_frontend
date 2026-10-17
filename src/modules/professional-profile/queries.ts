import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'

import { professionalKeys } from '@/modules/professionals'

import { professionalProfileApi, type ServicePayload, type UpdateProfilePayload } from './api'

export const professionalProfileKeys = {
  all: ['professional-profile'] as const,
  profile: ['professional-profile', 'profile'] as const,
  services: ['professional-profile', 'services'] as const,
  portfolio: ['professional-profile', 'portfolio'] as const,
  earnings: (from: string, to: string) => ['professional-profile', 'earnings', from, to] as const,
}

/**
 * Tras cualquier cambio se refrescan los datos propios y el perfil público (búsqueda y detalle),
 * que muestra la descripción, los servicios activos y la galería.
 */
function useInvalidate() {
  const queryCache = useQueryCache()
  return () => {
    void queryCache.invalidateQueries({ key: professionalProfileKeys.all })
    void queryCache.invalidateQueries({ key: professionalKeys.all })
  }
}

export function useMyProfile() {
  return useQuery({
    key: professionalProfileKeys.profile,
    query: async () => (await professionalProfileApi.profile()).data,
  })
}

export function useUpdateProfile() {
  const invalidate = useInvalidate()
  return useMutation({
    mutation: (payload: UpdateProfilePayload) => professionalProfileApi.updateProfile(payload),
    onSettled: invalidate,
  })
}

export function useSyncCategories() {
  const invalidate = useInvalidate()
  return useMutation({
    mutation: (categoryIds: number[]) => professionalProfileApi.syncCategories(categoryIds),
    onSettled: invalidate,
  })
}

export function useMyServices() {
  return useQuery({
    key: professionalProfileKeys.services,
    query: async () => (await professionalProfileApi.services()).data,
  })
}

export function useSaveService() {
  const invalidate = useInvalidate()
  return useMutation({
    mutation: ({ id, payload }: { id?: number; payload: ServicePayload }) =>
      id
        ? professionalProfileApi.updateService(id, payload)
        : professionalProfileApi.createService(payload),
    onSettled: invalidate,
  })
}

export function useToggleService() {
  const invalidate = useInvalidate()
  return useMutation({
    mutation: ({ id, isActive }: { id: number; isActive: boolean }) =>
      professionalProfileApi.updateService(id, { is_active: isActive }),
    onSettled: invalidate,
  })
}

export function useDeleteService() {
  const invalidate = useInvalidate()
  return useMutation({
    mutation: (id: number) => professionalProfileApi.deleteService(id),
    onSettled: invalidate,
  })
}

/**
 * HU037: ingresos del rango (Y-m-d). Se vuelven a pedir al abrir la vista y al volver a la
 * pestaña, así que reflejan los servicios recién finalizados.
 */
export function useEarnings(range: MaybeRefOrGetter<{ from: string; to: string }>) {
  return useQuery({
    key: () => professionalProfileKeys.earnings(toValue(range).from, toValue(range).to),
    query: async () =>
      (await professionalProfileApi.earnings(toValue(range).from, toValue(range).to)).data,
    staleTime: 0,
    refetchOnWindowFocus: true,
    placeholderData: (previous) => previous,
  })
}

export function useMyPortfolio() {
  return useQuery({
    key: professionalProfileKeys.portfolio,
    query: async () => (await professionalProfileApi.portfolio()).data,
  })
}

export function useAddPortfolioItem() {
  const invalidate = useInvalidate()
  return useMutation({
    mutation: ({ image, description }: { image: File; description?: string }) =>
      professionalProfileApi.addPortfolioItem(image, description),
    onSettled: invalidate,
  })
}

export function useRemovePortfolioItem() {
  const invalidate = useInvalidate()
  return useMutation({
    mutation: (id: number) => professionalProfileApi.removePortfolioItem(id),
    onSettled: invalidate,
  })
}
