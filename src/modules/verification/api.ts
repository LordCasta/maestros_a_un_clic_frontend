import { http } from '@/shared/http/client'
import type { ApiPaginated, ApiSuccess } from '@/shared/types/api'
import type {
  AdminVerificationFilters,
  RejectVerificationPayload,
  UpdateDocumentPayload,
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

  /** GET /admin/verifications (HU014) */
  listForAdmin: (filters?: AdminVerificationFilters) =>
    http.get<ApiPaginated<VerificationRequest>>('/admin/verifications', {
      query: filters as Record<string, string | number | undefined>,
    }),

  /** GET /admin/verifications/:id (HU014) */
  getAdminDetail: (id: number) =>
    http.get<ApiSuccess<VerificationRequest>>(`/admin/verifications/${id}`),

  /** POST /admin/verifications/:id/approve (HU014) */
  approve: (id: number) =>
    http.post<ApiSuccess<VerificationRequest>>(`/admin/verifications/${id}/approve`),

  /** POST /admin/verifications/:id/reject (HU014) */
  reject: (id: number, payload: RejectVerificationPayload) =>
    http.post<ApiSuccess<VerificationRequest>>(`/admin/verifications/${id}/reject`, payload),

  /** PATCH /admin/verification-documents/:id (HU014) */
  updateDocumentStatus: (documentId: number, payload: UpdateDocumentPayload) =>
    http.patch<ApiSuccess<VerificationDocument>>(
      `/admin/verification-documents/${documentId}`,
      payload,
    ),
}
