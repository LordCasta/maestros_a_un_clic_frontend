/**
 * Módulo de administración: moderación de usuarios, reportes y alertas (HU024, HU038, HU045).
 * API pública del módulo: lo que no se exporta aquí es interno.
 */
export { adminApi } from './api'
export { adminKeys, useAdminAlerts, useAdminReports, useAdminUsers } from './queries'
export { adminRoutes } from './routes'
