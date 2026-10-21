/**
 * Módulo de cuenta y perfil (HU019).
 * API pública del módulo: lo que no se exporta aquí es interno.
 */
export { accountApi } from './api'
export { accountKeys, useChangePassword } from './queries'
export { accountRoutes } from './routes'
export { changePasswordSchema, type ChangePasswordPayload } from './schemas'
