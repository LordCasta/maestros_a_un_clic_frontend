export type AuthRole = 'client' | 'professional'

export interface AuthUser {
  id: number
  name?: string
  email: string
  role: AuthRole
}

export interface AuthSession {
  user: AuthUser
  token: string
}

export interface ApiValidationErrors {
  [key: string]: string[] | undefined
}
