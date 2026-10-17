import { http } from '@/shared/http/client'
import type { ApiSuccess } from '@/shared/types/api'
import type {
  VerificationDocument,
  VerificationRequest,
  VerificationState,
} from '@/shared/types/models'

/** Contrato: backend/docs/api/endpoints.md § Verificación de cuenta y documentos KYC */
export const verificationApi = {
  /** GET /verification */
  getStatus: () => http.get<ApiSuccess<VerificationState>>('/verification'),

  /** POST /verification (multipart/form-data) */
  submit: (formData: FormData) =>
    http.post<ApiSuccess<VerificationRequest>>('/verification', formData),

  /** POST /verification/documents/:id (multipart/form-data) */
  replaceDocument: (documentId: number, formData: FormData) =>
    http.post<ApiSuccess<VerificationDocument>>(`/verification/documents/${documentId}`, formData),
}
