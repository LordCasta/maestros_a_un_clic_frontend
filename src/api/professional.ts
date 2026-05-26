import { request } from './axios'

export type ProfessionalSpecialty = {
  id: number
  name: string
}

export type ProfessionalSummary = {
  id: number
  name: string
  specialty?: string
  specialties?: ProfessionalSpecialty[]
  rating?: number
  reviews?: number
  distance?: string
  price?: string
  hourly_rate?: string | number
  image?: string
  profile_photo_url?: string
  online?: boolean
  commune?: string
  description?: string
}

export type ProfessionalDetail = ProfessionalSummary & {
  email?: string
  phone?: string
  experience_years?: number
  years_experience?: number
  services?: Array<{
    id?: number
    name: string
    description?: string
    price?: string | number
  }>
  certificates?: Array<{
    id?: number
    name?: string
    url?: string
  }>
  portfolio_images?: Array<{
    id?: number
    url?: string
  }>
  availability?: Array<{
    day: string
    hours: string
  }>
}

type ProfessionalListResponse = {
  success: boolean
  data: ProfessionalSummary[]
  meta?: {
    current_page: number
    per_page: number
    total: number
  }
}

type ProfessionalDetailResponse = {
  success: boolean
  data: ProfessionalDetail
}

export type ProfessionalFilters = {
  commune?: string
  specialty_id?: number | string
  min_price?: number | string
  max_price?: number | string
  per_page?: number
}

const buildQueryString = (filters: ProfessionalFilters = {}) => {
  const params = new URLSearchParams()

  if (filters.commune) params.set('commune', String(filters.commune))
  if (filters.specialty_id !== undefined && filters.specialty_id !== '') {
    params.set('specialty_id', String(filters.specialty_id))
  }
  if (filters.min_price !== undefined && filters.min_price !== '') {
    params.set('min_price', String(filters.min_price))
  }
  if (filters.max_price !== undefined && filters.max_price !== '') {
    params.set('max_price', String(filters.max_price))
  }
  if (filters.per_page) params.set('per_page', String(filters.per_page))

  const query = params.toString()
  return query ? `?${query}` : ''
}

export const listProfessionals = (filters: ProfessionalFilters = {}) => {
  return request<ProfessionalListResponse>(`/professionals${buildQueryString(filters)}`)
}

export const getProfessional = (id: number | string) => {
  return request<ProfessionalDetailResponse>(`/professionals/${id}`)
}
