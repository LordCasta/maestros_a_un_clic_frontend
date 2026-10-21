import { http } from '@/shared/http/client'
import type { ApiSuccess } from '@/shared/types/api'
import type { User } from '@/shared/types/models'
import type { ChangePasswordPayload, UpdateLocationPayload, UpdateProfilePayload } from './schemas'

/** Contrato: backend/docs/api/endpoints.md § Cuenta y perfil */
export const accountApi = {
  updateProfile: (payload: UpdateProfilePayload | UpdateLocationPayload) =>
    http.patch<ApiSuccess<User>>('/me', payload),
  updatePassword: (payload: ChangePasswordPayload) =>
    http.put<ApiSuccess<null>>('/me/password', payload),
  uploadAvatar: (formData: FormData) => http.post<ApiSuccess<User>>('/me/avatar', formData),
  deleteAccount: (payload: { current_password: string }) =>
    http.delete<ApiSuccess<null>>('/me', { body: payload }),
}
