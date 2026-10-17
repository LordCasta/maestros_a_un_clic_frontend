import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

import { notificationsApi } from './api'

export const notificationKeys = {
  all: ['notifications'] as const,
  latest: ['notifications', 'latest'] as const,
  unread: ['notifications', 'unread'] as const,
}

/** HU018: las más recientes, para la campana. */
export function useLatestNotifications(limit = 20) {
  return useQuery({
    key: notificationKeys.latest,
    query: async () => (await notificationsApi.list({ per_page: limit })).data,
  })
}

/** HU018: cuántas no leídas (el `meta.total` de las no leídas). */
export function useUnreadCount() {
  return useQuery({
    key: notificationKeys.unread,
    query: async () => (await notificationsApi.list({ unread: true, per_page: 1 })).meta.total,
  })
}

function useInvalidate() {
  const queryCache = useQueryCache()
  return () => void queryCache.invalidateQueries({ key: notificationKeys.all })
}

export function useMarkAsRead() {
  const invalidate = useInvalidate()
  return useMutation({
    mutation: (id: string) => notificationsApi.markAsRead(id),
    onSettled: invalidate,
  })
}

export function useMarkAllAsRead() {
  const invalidate = useInvalidate()
  return useMutation({
    mutation: () => notificationsApi.markAllAsRead(),
    onSettled: invalidate,
  })
}
