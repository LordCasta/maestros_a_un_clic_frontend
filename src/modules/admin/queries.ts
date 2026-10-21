import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'

import {
  adminApi,
  type AdminAlertFilters,
  type AdminReportFilters,
  type AdminUserFilters,
} from './api'

export const adminKeys = {
  all: ['admin'] as const,
  users: (filters: AdminUserFilters) => ['admin', 'users', { ...filters }] as const,
  reports: (filters: AdminReportFilters) => ['admin', 'reports', { ...filters }] as const,
  alerts: (filters: AdminAlertFilters) => ['admin', 'alerts', { ...filters }] as const,
}

export function useAdminUsers(filters: MaybeRefOrGetter<AdminUserFilters>) {
  return useQuery({
    key: () => adminKeys.users(toValue(filters)),
    query: () => adminApi.listUsers(toValue(filters)),
    placeholderData: (previous) => previous,
  })
}

export function useBlockUser() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: ({ id, reason }: { id: number; reason: string }) =>
      adminApi.blockUser(id, { reason }),
    onSettled: () => queryCache.invalidateQueries({ key: ['admin', 'users'] }),
  })
}

export function useUnblockUser() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (id: number) => adminApi.unblockUser(id),
    onSettled: () => queryCache.invalidateQueries({ key: ['admin', 'users'] }),
  })
}

export function useAdminReports(filters: MaybeRefOrGetter<AdminReportFilters>) {
  return useQuery({
    key: () => adminKeys.reports(toValue(filters)),
    query: () => adminApi.listReports(toValue(filters)),
    placeholderData: (previous) => previous,
  })
}

export function useResolveReport() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: ({
      id,
      payload,
    }: {
      id: number
      payload: { status: 'resolved' | 'dismissed'; resolution_notes: string; block_user?: boolean }
    }) => adminApi.resolveReport(id, payload),
    onSettled: () => {
      queryCache.invalidateQueries({ key: ['admin', 'reports'] })
      queryCache.invalidateQueries({ key: ['admin', 'users'] })
    },
  })
}

export function useAdminAlerts(filters: MaybeRefOrGetter<AdminAlertFilters>) {
  return useQuery({
    key: () => adminKeys.alerts(toValue(filters)),
    query: () => adminApi.listAlerts(toValue(filters)),
    placeholderData: (previous) => previous,
  })
}

export function useResolveAlert() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (id: number) => adminApi.resolveAlert(id),
    onSettled: () => queryCache.invalidateQueries({ key: ['admin', 'alerts'] }),
  })
}
