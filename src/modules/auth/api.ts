import { http, toFormData } from '@/shared/http/client'
import type { ApiSuccess } from '@/shared/types/api'
import type { User } from '@/shared/types/models'

import type { LoginForm, RegisterClientForm, RegisterProfessionalForm } from './schemas'

/** Endpoints: backend/docs/api/endpoints.md § Autenticación */

export interface Session {
  user: User
  token: string
}

export const authApi = {
  login: (credentials: LoginForm) => http.post<ApiSuccess<Session>>('/auth/login', credentials),

  registerClient: (form: RegisterClientForm) =>
    http.post<ApiSuccess<Session>>('/auth/register/client', toFormData(form)),

  registerProfessional: (form: RegisterProfessionalForm) =>
    http.post<ApiSuccess<Session>>('/auth/register/professional', toFormData(form)),

  logout: () => http.post<ApiSuccess<null>>('/auth/logout'),

  me: () => http.get<ApiSuccess<User>>('/auth/me'),
}
