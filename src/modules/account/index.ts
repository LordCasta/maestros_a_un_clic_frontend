/**
 * Módulo de cuenta y perfil (HU019, HU022).
 * API pública del módulo: lo que no se exporta aquí es interno.
 */
export { accountApi } from './api'
export { accountKeys, useChangePassword, useUpdateLocation } from './queries'
export { accountRoutes } from './routes'
export {
  changePasswordSchema,
  updateLocationSchema,
  type ChangePasswordPayload,
  type UpdateLocationPayload,
} from './schemas'
