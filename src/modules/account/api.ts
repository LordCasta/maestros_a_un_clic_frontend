import { http } from '@/shared/http/client'
import type { ApiSuccess } from '@/shared/types/api'
import type { ChangePasswordPayload } from './schemas'

/** Contrato: backend/docs/api/endpoints.md § Cuenta y perfil */
export const accountApi = {
  updatePassword: (payload: ChangePasswordPayload) =>
    http.put<ApiSuccess<null>>('/me/password', payload),
}
