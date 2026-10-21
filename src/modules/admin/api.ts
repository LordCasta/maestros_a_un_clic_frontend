import { http } from '@/shared/http/client'
import type { ApiPaginated, ApiSuccess, PageQuery } from '@/shared/types/api'
import type { AdminAlert, AdminUser, Report } from '@/shared/types/models'

export interface AdminUserFilters extends PageQuery {
  role?: string
  status?: string
  q?: string
}

export interface AdminReportFilters extends PageQuery {
  status?: string
}

export interface AdminAlertFilters extends PageQuery {
  status?: string
}

export const adminApi = {
  // Users (HU038)
  listUsers: (filters: AdminUserFilters = {}) =>
    http.get<ApiPaginated<AdminUser>>('/admin/users', { query: { ...filters } }),
  blockUser: (id: number, payload: { reason: string }) =>
    http.post<ApiSuccess<AdminUser>>(`/admin/users/${id}/block`, payload),
  unblockUser: (id: number) => http.post<ApiSuccess<AdminUser>>(`/admin/users/${id}/unblock`),

  // Reports (HU024)
  listReports: (filters: AdminReportFilters = {}) =>
    http.get<ApiPaginated<Report>>('/admin/reports', { query: { ...filters } }),
  resolveReport: (
    id: number,
    payload: { status: 'resolved' | 'dismissed'; resolution_notes: string; block_user?: boolean },
  ) => http.post<ApiSuccess<Report>>(`/admin/reports/${id}/resolve`, payload),

  // Alerts (HU045)
  listAlerts: (filters: AdminAlertFilters = {}) =>
    http.get<ApiPaginated<AdminAlert>>('/admin/alerts', { query: { ...filters } }),
  resolveAlert: (id: number) => http.post<ApiSuccess<AdminAlert>>(`/admin/alerts/${id}/resolve`),
}
