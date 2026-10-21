/**
 * Módulo de verificación de cuentas y documentos KYC (HU008, HU013).
 * API pública del módulo.
 */
export { verificationApi } from './api'
export {
  useAdminVerificationDetail,
  useAdminVerifications,
  useApproveVerification,
  useRejectVerification,
  useReplaceVerificationDocument,
  useSubmitVerification,
  useUpdateVerificationDocument,
  useVerificationStatus,
  verificationKeys,
} from './queries'
export { verificationRoutes } from './routes'
