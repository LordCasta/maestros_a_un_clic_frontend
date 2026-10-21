import { useMutation, useQueryCache } from '@pinia/colada'

import { accountApi } from './api'
import type { ChangePasswordPayload, UpdateLocationPayload } from './schemas'

export const accountKeys = {
  all: ['account'] as const,
  profile: () => ['account', 'profile'] as const,
}

export function useChangePassword() {
  return useMutation({
    mutation: (payload: ChangePasswordPayload) => accountApi.updatePassword(payload),
  })
}

export function useUpdateLocation() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (payload: UpdateLocationPayload) => accountApi.updateProfile(payload),
    onSettled: () => {
      queryCache.invalidateQueries({ key: accountKeys.all })
    },
  })
}
