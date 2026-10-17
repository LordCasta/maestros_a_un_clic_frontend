import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

import { verificationApi } from './api'

export const verificationKeys = {
  all: ['verification'] as const,
  status: () => ['verification', 'status'] as const,
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
