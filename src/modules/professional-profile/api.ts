import { http, toFormData } from '@/shared/http/client'
import type { ApiSuccess } from '@/shared/types/api'
import type {
  Earnings,
  MyProfessionalProfile,
  PortfolioItem,
  PriceType,
  ProfessionalService,
} from '@/shared/types/models'

/** Contrato: backend/docs/api/endpoints.md § Perfil, servicios y portafolio del profesional */

export interface UpdateProfilePayload {
  description?: string | null
  experience_years?: number | null
  hourly_rate?: number
  service_radius_km?: number
  commune_id?: number | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
}

export interface ServicePayload {
  category_id: number
  title: string
  description?: string | null
  price_type: PriceType
  price: number
  estimated_duration_minutes: number
  is_active?: boolean
}

export const professionalProfileApi = {
  profile: () => http.get<ApiSuccess<MyProfessionalProfile>>('/professional/profile'),
  updateProfile: (payload: UpdateProfilePayload) =>
    http.patch<ApiSuccess<MyProfessionalProfile>>('/professional/profile', payload),
  syncCategories: (categoryIds: number[]) =>
    http.put<ApiSuccess<MyProfessionalProfile>>('/professional/categories', {
      category_ids: categoryIds,
    }),

  services: () => http.get<ApiSuccess<ProfessionalService[]>>('/professional/services'),
  createService: (payload: ServicePayload) =>
    http.post<ApiSuccess<ProfessionalService>>('/professional/services', payload),
  updateService: (id: number, payload: Partial<ServicePayload>) =>
    http.patch<ApiSuccess<ProfessionalService>>(`/professional/services/${id}`, payload),
  deleteService: (id: number) => http.delete<ApiSuccess<null>>(`/professional/services/${id}`),

  earnings: (from: string, to: string) =>
    http.get<ApiSuccess<Earnings>>('/professional/earnings', { query: { from, to } }),

  portfolio: () => http.get<ApiSuccess<PortfolioItem[]>>('/professional/portfolio'),
  addPortfolioItem: (image: File, description?: string) =>
    http.post<ApiSuccess<PortfolioItem>>(
      '/professional/portfolio',
      toFormData({ image, description }),
    ),
  removePortfolioItem: (id: number) =>
    http.delete<ApiSuccess<null>>(`/professional/portfolio/${id}`),
}
