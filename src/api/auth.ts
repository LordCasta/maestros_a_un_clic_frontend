export { ApiError } from './axios'

import { request } from './axios'

import type { AuthUser } from '@/types'

export interface RegisterClientPayload {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  selfie: File
  document: File
  commune?: string
  latitude?: string | number | null
  longitude?: string | number | null
  phone?: string
}

export interface RegisterProfessionalPayload {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  description: string
  experienceYears: number
  specialtyIds: Array<string | number>
  hourlyRate?: string | number | null
  profilePhoto?: File | null
  certificates?: File[]
  portfolioImages?: File[]
  commune?: string
  latitude?: string | number | null
  longitude?: string | number | null
  phone?: string
}

export interface LoginPayload {
  email: string
  password: string
}

type AuthResponse<T> = {
  success: boolean
  message?: string
  data: T
}

type LoginResponse = AuthResponse<{
  token: string
  user: AuthUser
  role?: AuthUser['role']
}>

const appendValue = (formData: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null || value === '') {
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item) => appendValue(formData, key, item))
    return
  }

  formData.append(key, value instanceof File || value instanceof Blob ? value : String(value))
}

const buildClientFormData = (payload: RegisterClientPayload) => {
  const formData = new FormData()

  appendValue(formData, 'name', payload.name)
  appendValue(formData, 'email', payload.email)
  appendValue(formData, 'password', payload.password)
  appendValue(formData, 'password_confirmation', payload.passwordConfirmation)
  appendValue(formData, 'selfie', payload.selfie)
  appendValue(formData, 'document', payload.document)
  appendValue(formData, 'commune', payload.commune)
  appendValue(formData, 'latitude', payload.latitude)
  appendValue(formData, 'longitude', payload.longitude)
  appendValue(formData, 'phone', payload.phone)

  return formData
}

const buildProfessionalFormData = (payload: RegisterProfessionalPayload) => {
  const formData = new FormData()

  appendValue(formData, 'name', payload.name)
  appendValue(formData, 'email', payload.email)
  appendValue(formData, 'password', payload.password)
  appendValue(formData, 'password_confirmation', payload.passwordConfirmation)
  appendValue(formData, 'description', payload.description)
  appendValue(formData, 'experience_years', payload.experienceYears)
  appendValue(formData, 'specialties[]', payload.specialtyIds)
  appendValue(formData, 'hourly_rate', payload.hourlyRate)
  appendValue(formData, 'profile_photo', payload.profilePhoto)
  appendValue(formData, 'certificates[]', payload.certificates ?? [])
  appendValue(formData, 'portfolio_images[]', payload.portfolioImages ?? [])
  appendValue(formData, 'commune', payload.commune)
  appendValue(formData, 'latitude', payload.latitude)
  appendValue(formData, 'longitude', payload.longitude)
  appendValue(formData, 'phone', payload.phone)

  return formData
}

export const registerClient = (payload: RegisterClientPayload) => {
  return request<AuthResponse<{ user: AuthUser; token: string }>>('/auth/register/client', {
    method: 'POST',
    body: buildClientFormData(payload),
    auth: false,
  })
}

export const registerProfessional = (payload: RegisterProfessionalPayload) => {
  return request<AuthResponse<{ user: AuthUser; token: string }>>('/auth/register/professional', {
    method: 'POST',
    body: buildProfessionalFormData(payload),
    auth: false,
  })
}

export const login = (payload: LoginPayload) => {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
    auth: false,
  })
}
