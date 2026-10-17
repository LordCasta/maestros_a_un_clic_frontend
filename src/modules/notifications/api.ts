import { http } from '@/shared/http/client'
import type { ApiPaginated, ApiSuccess } from '@/shared/types/api'
import type { NotificationItem } from '@/shared/types/models'

/** Contrato: backend/docs/api/endpoints.md § Notificaciones */
export const notificationsApi = {
  list: (query: { unread?: boolean; per_page?: number } = {}) =>
    http.get<ApiPaginated<NotificationItem>>('/notifications', {
      query: { per_page: query.per_page, ...(query.unread ? { unread: 1 } : {}) },
    }),
  markAsRead: (id: string) => http.post<ApiSuccess<NotificationItem>>(`/notifications/${id}/read`),
  markAllAsRead: () => http.post<ApiSuccess<{ marked: number }>>('/notifications/read-all'),
}
