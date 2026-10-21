import { useMutation } from '@pinia/colada'

import { accountApi } from './api'
import type { ChangePasswordPayload } from './schemas'

export const accountKeys = {
  all: ['account'] as const,
}

export function useChangePassword() {
  return useMutation({
    mutation: (payload: ChangePasswordPayload) => accountApi.updatePassword(payload),
  })
}
