import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'

import type { AdminVerificationFilters } from '@/shared/types/models'

import { verificationApi } from './api'

export const verificationKeys = {
  all: ['verification'] as const,
  status: () => ['verification', 'status'] as const,
  adminAll: ['admin-verifications'] as const,
  adminList: (filters?: MaybeRefOrGetter<AdminVerificationFilters | undefined>) =>
    ['admin-verifications', 'list', (toValue(filters) ?? {}) as Record<string, string | number | undefined>] as const,
  adminDetail: (id: MaybeRefOrGetter<number>) =>
    ['admin-verifications', 'detail', toValue(id)] as const,
}

export function useVerificationStatus() {
  return useQuery({
    key: () => verificationKeys.status(),
    query: async () => {
      const response = await verificationApi.getStatus()
      return response.data
    },
  })
}

export function useSubmitVerification() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (formData: FormData) => verificationApi.submit(formData),
    onSettled: () => {
      queryCache.invalidateQueries({ key: verificationKeys.all })
    },
  })
}

export function useReplaceVerificationDocument() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ documentId, formData }: { documentId: number; formData: FormData }) =>
      verificationApi.replaceDocument(documentId, formData),
    onSettled: () => {
      queryCache.invalidateQueries({ key: verificationKeys.all })
    },
  })
}

/** HU014: bandeja de solicitudes para el administrador */
export function useAdminVerifications(
  filters: MaybeRefOrGetter<AdminVerificationFilters | undefined> = {},
) {
  return useQuery({
    key: () => verificationKeys.adminList(filters),
    query: async () => {
      const currentFilters = toValue(filters)
      const response = await verificationApi.listForAdmin(currentFilters)
      return response
    },
  })
}

/** HU014: detalle de solicitud para el administrador */
export function useAdminVerificationDetail(id: MaybeRefOrGetter<number>) {
  return useQuery({
    key: () => verificationKeys.adminDetail(id),
    query: async () => {
      const currentId = toValue(id)
      const response = await verificationApi.getAdminDetail(currentId)
      return response.data
    },
  })
}

/** HU014: aprobar solicitud de verificación */
export function useApproveVerification() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (id: number) => verificationApi.approve(id),
    onSettled: () => {
      queryCache.invalidateQueries({ key: verificationKeys.adminAll })
      queryCache.invalidateQueries({ key: verificationKeys.all })
    },
  })
}

/** HU014: rechazar solicitud de verificación */
export function useRejectVerification() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, reason }: { id: number; reason: string }) =>
      verificationApi.reject(id, { reason }),
    onSettled: () => {
      queryCache.invalidateQueries({ key: verificationKeys.adminAll })
      queryCache.invalidateQueries({ key: verificationKeys.all })
    },
  })
}

/** HU014: marcar documento como aprobado o rechazado */
export function useUpdateVerificationDocument() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({
      documentId,
      status,
      rejectionReason,
    }: {
      documentId: number
      status: 'approved' | 'rejected'
      rejectionReason?: string
    }) =>
      verificationApi.updateDocumentStatus(documentId, {
        status,
        rejection_reason: rejectionReason,
      }),
    onSettled: () => {
      queryCache.invalidateQueries({ key: verificationKeys.adminAll })
    },
  })
}
