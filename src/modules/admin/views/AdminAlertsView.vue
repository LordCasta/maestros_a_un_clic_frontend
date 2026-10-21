<script setup lang="ts">
import { AlertTriangle, CheckCircle } from '@lucide/vue'
import { reactive } from 'vue'

import { useToastStore } from '@/shared/stores/toast'
import type { AdminAlert as AdminAlertType } from '@/shared/types/models'
import {
  BaseAlert,
  BaseAvatar,
  BaseBadge,
  BaseButton,
  BaseCard,
  BaseEmptyState,
  BasePagination,
  BaseSelect,
  BaseSkeleton,
  type SelectOption,
} from '@/shared/ui'
import { formatDateTime } from '@/shared/utils/format'

import { useAdminAlerts, useResolveAlert } from '../queries'

const toast = useToastStore()

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'Todas las alertas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'resolved', label: 'Resueltas' },
]

const filters = reactive({
  page: 1,
  status: undefined as string | undefined,
})

const { data: alertsData, isPending, error, refetch } = useAdminAlerts(filters)
const { mutateAsync: resolveAlertMutation, isLoading: isResolving } = useResolveAlert()

async function handleResolve(alert: AdminAlertType) {
  try {
    await resolveAlertMutation(alert.id)
    toast.success('Alerta marcada como resuelta.')
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Error al resolver la alerta.')
  }
}

function typeLabel(type: string): string {
  switch (type) {
    case 'low_rating':
      return 'Baja calificación'
    case 'report':
      return 'Reporte de usuario'
    default:
      return type
  }
}

function typeTone(type: string): 'warning' | 'danger' | 'info' {
  switch (type) {
    case 'low_rating':
      return 'warning'
    case 'report':
      return 'danger'
    default:
      return 'info'
  }
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <div
        class="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700"
      >
        <AlertTriangle class="size-4" />
        Control y monitoreo
      </div>
      <h1 class="text-3xl font-black text-neutral-900">Alertas de calidad y servicio</h1>
      <p class="mt-2 text-sm text-neutral-500">
        Monitoreo automático de bajas calificaciones, anomalías y situaciones que requieren atención
        del equipo.
      </p>
    </div>

    <!-- Filtros -->
    <BaseCard class="mb-6 p-4">
      <div class="max-w-xs">
        <BaseSelect
          v-model="filters.status"
          label="Estado de la alerta"
          :options="STATUS_OPTIONS"
        />
      </div>
    </BaseCard>

    <!-- Estados -->
    <div v-if="isPending" class="space-y-4">
      <BaseSkeleton v-for="n in 3" :key="n" class="h-28 rounded-2xl" />
    </div>

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar las alertas">
      {{ error.message }}
      <BaseButton variant="ghost" size="sm" class="mt-2" @click="refetch()">
        Reintentar
      </BaseButton>
    </BaseAlert>

    <BaseEmptyState
      v-else-if="!alertsData?.data?.length"
      :icon="CheckCircle"
      title="No hay alertas pendientes"
      description="El sistema no ha registrado problemas de calidad ni bajas calificaciones recientes."
    />

    <!-- Lista de alertas -->
    <div v-else class="space-y-4">
      <div class="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-card">
        <ul class="divide-y divide-neutral-100">
          <li
            v-for="alert in alertsData.data"
            :key="alert.id"
            class="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-start gap-4">
              <BaseAvatar
                v-if="alert.user"
                :name="alert.user.name"
                :src="alert.user.avatar_url"
                size="md"
              />

              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <BaseBadge :tone="typeTone(alert.type)" size="sm">
                    {{ typeLabel(alert.type) }}
                  </BaseBadge>

                  <span class="font-bold text-neutral-900">
                    {{ alert.user?.name ?? 'Usuario del sistema' }}
                  </span>

                  <BaseBadge v-if="alert.resolved_at" tone="success" size="sm">
                    Atendida
                  </BaseBadge>
                  <BaseBadge v-else tone="warning" size="sm"> Pendiente </BaseBadge>
                </div>

                <!-- Detalle de la alerta -->
                <div v-if="alert.type === 'low_rating'" class="text-xs text-neutral-600">
                  <span class="font-semibold text-danger-600">
                    Calificación de {{ alert.data?.rating ?? 1 }} estrellas recibida.
                  </span>
                  <span v-if="alert.data?.comment"> Comentario: "{{ alert.data.comment }}" </span>
                  <span v-if="alert.data?.current_avg">
                    · Promedio actual: {{ alert.data.current_avg }}
                  </span>
                </div>

                <div v-else-if="alert.type === 'report'" class="text-xs text-neutral-600">
                  <span>Reporte generado por: {{ alert.data?.reason ?? 'Motivo general' }}</span>
                </div>

                <p class="text-xs text-neutral-400">
                  Registrada: {{ formatDateTime(alert.created_at) }}
                  <span v-if="alert.resolved_at"
                    >· Resuelta el {{ formatDateTime(alert.resolved_at) }}</span
                  >
                </p>
              </div>
            </div>

            <div class="shrink-0">
              <BaseButton
                v-if="!alert.resolved_at"
                variant="outline"
                size="sm"
                :loading="isResolving"
                @click="handleResolve(alert)"
              >
                <CheckCircle class="size-4 text-success-600" />
                Marcar como resuelta
              </BaseButton>
            </div>
          </li>
        </ul>
      </div>

      <!-- Paginación -->
      <div v-if="alertsData.meta && alertsData.meta.last_page > 1" class="flex justify-center pt-4">
        <BasePagination v-model:page="filters.page" :meta="alertsData.meta" />
      </div>
    </div>
  </div>
</template>
