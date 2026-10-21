<script setup lang="ts">
import { Flag } from '@lucide/vue'
import { reactive, ref } from 'vue'

import { useToastStore } from '@/shared/stores/toast'
import type { Report } from '@/shared/types/models'
import {
  BaseAlert,
  BaseAvatar,
  BaseBadge,
  BaseButton,
  BaseCard,
  BaseEmptyState,
  BaseModal,
  BasePagination,
  BaseSelect,
  BaseSkeleton,
  BaseTextarea,
  type SelectOption,
} from '@/shared/ui'
import { formatDateTime } from '@/shared/utils/format'

import { useAdminReports, useResolveReport } from '../queries'

const toast = useToastStore()

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'open', label: 'Pendientes / Abiertos' },
  { value: 'resolved', label: 'Resueltos' },
  { value: 'dismissed', label: 'Desestimados' },
]

const filters = reactive({
  page: 1,
  status: undefined as string | undefined,
})

const { data: reportsData, isPending, error, refetch } = useAdminReports(filters)
const { mutateAsync: resolveReportMutation, isLoading: isResolving } = useResolveReport()

// Resolve modal
const selectedReport = ref<Report | null>(null)
const resolveModalOpen = ref(false)
const resolveStatus = ref<'resolved' | 'dismissed'>('resolved')
const resolutionNotes = ref('')
const blockUser = ref(false)
const resolveError = ref<string | null>(null)

function openResolveModal(report: Report) {
  selectedReport.value = report
  resolveStatus.value = 'resolved'
  resolutionNotes.value = ''
  blockUser.value = false
  resolveError.value = null
  resolveModalOpen.value = true
}

async function handleResolve() {
  if (!selectedReport.value) return
  if (!resolutionNotes.value || resolutionNotes.value.trim().length < 5) {
    resolveError.value = 'Debes ingresar notas de resolución con al menos 5 caracteres.'
    return
  }

  try {
    await resolveReportMutation({
      id: selectedReport.value.id,
      payload: {
        status: resolveStatus.value,
        resolution_notes: resolutionNotes.value.trim(),
        block_user: blockUser.value,
      },
    })
    resolveModalOpen.value = false
    toast.success('Reporte procesado correctamente.')
  } catch (err: unknown) {
    resolveError.value = err instanceof Error ? err.message : 'Error al resolver el reporte.'
  }
}

function statusTone(status: string): 'warning' | 'success' | 'neutral' {
  switch (status) {
    case 'open':
      return 'warning'
    case 'resolved':
      return 'success'
    default:
      return 'neutral'
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'open':
      return 'Abierto'
    case 'resolved':
      return 'Resuelto'
    case 'dismissed':
      return 'Desestimado'
    default:
      return status
  }
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <div
        class="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700"
      >
        <Flag class="size-4" />
        Moderación de usuarios
      </div>
      <h1 class="text-3xl font-black text-neutral-900">Bandeja de reportes</h1>
      <p class="mt-2 text-sm text-neutral-500">
        Revisa las denuncias recibidas por fraude, incumplimiento o mala conducta y toma medidas.
      </p>
    </div>

    <!-- Filtros -->
    <BaseCard class="mb-6 p-4">
      <div class="max-w-xs">
        <BaseSelect v-model="filters.status" label="Estado del reporte" :options="STATUS_OPTIONS" />
      </div>
    </BaseCard>

    <!-- Estados -->
    <div v-if="isPending" class="space-y-4">
      <BaseSkeleton v-for="n in 3" :key="n" class="h-32 rounded-2xl" />
    </div>

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar los reportes">
      {{ error.message }}
      <BaseButton variant="ghost" size="sm" class="mt-2" @click="refetch()">
        Reintentar
      </BaseButton>
    </BaseAlert>

    <BaseEmptyState
      v-else-if="!reportsData?.data?.length"
      :icon="Flag"
      title="No hay reportes en esta bandeja"
      description="Los nuevos reportes creados por clientes o profesionales aparecerán aquí."
    />

    <!-- Lista de reportes -->
    <div v-else class="space-y-4">
      <div class="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-card">
        <ul class="divide-y divide-neutral-100">
          <li v-for="report in reportsData.data" :key="report.id" class="space-y-4 p-6">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-3">
                <span class="text-xs font-semibold text-neutral-400">#{{ report.id }}</span>
                <span class="text-lg font-bold text-neutral-900">{{ report.reason }}</span>
                <BaseBadge :tone="statusTone(report.status)" size="sm">
                  {{ statusLabel(report.status) }}
                </BaseBadge>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-xs text-neutral-500">
                  {{ formatDateTime(report.created_at) }}
                </span>
                <BaseButton
                  v-if="report.status === 'open'"
                  variant="primary"
                  size="sm"
                  @click="openResolveModal(report)"
                >
                  Resolver reporte
                </BaseButton>
              </div>
            </div>

            <!-- Denunciante y denunciado -->
            <div class="grid gap-4 rounded-2xl bg-surface-muted p-4 sm:grid-cols-2">
              <div class="flex items-center gap-3">
                <BaseAvatar
                  v-if="report.reporter"
                  :name="report.reporter.name"
                  :src="report.reporter.avatar_url"
                  size="sm"
                />
                <div>
                  <p class="text-xs font-semibold text-neutral-500 uppercase">Reportado por</p>
                  <p class="text-sm font-bold text-neutral-900">
                    {{ report.reporter?.name ?? 'Usuario anónimo' }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <BaseAvatar
                  v-if="report.reported_user"
                  :name="report.reported_user.name"
                  :src="report.reported_user.avatar_url"
                  size="sm"
                />
                <div>
                  <p class="text-xs font-semibold text-neutral-500 uppercase">Usuario denunciado</p>
                  <p class="text-sm font-bold text-neutral-900">
                    {{ report.reported_user?.name ?? 'Usuario no disponible' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Descripción -->
            <div class="text-sm text-neutral-700">
              <p class="text-xs font-semibold text-neutral-500 uppercase">
                Descripción de los hechos:
              </p>
              <p class="mt-1 whitespace-pre-line">{{ report.description }}</p>
            </div>

            <!-- Resolución si ya está resuelto -->
            <div
              v-if="report.resolution_notes"
              class="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600"
            >
              <span class="font-bold">Resolución:</span> {{ report.resolution_notes }}
            </div>
          </li>
        </ul>
      </div>

      <!-- Paginación -->
      <div
        v-if="reportsData.meta && reportsData.meta.last_page > 1"
        class="flex justify-center pt-4"
      >
        <BasePagination v-model:page="filters.page" :meta="reportsData.meta" />
      </div>
    </div>

    <!-- Modal para resolver reporte -->
    <BaseModal v-model:open="resolveModalOpen" :title="`Resolver reporte #${selectedReport?.id}`">
      <div class="space-y-4">
        <p class="text-sm text-neutral-600">
          Selecciona la decisión de moderación y añade las notas del caso:
        </p>

        <BaseSelect
          v-model="resolveStatus"
          label="Acción de resolución"
          :options="[
            { value: 'resolved', label: 'Dar por resuelto (con o sin sanción)' },
            { value: 'dismissed', label: 'Desestimar reporte (sin fundamento)' },
          ]"
          required
        />

        <BaseTextarea
          v-model="resolutionNotes"
          label="Notas y justificación"
          placeholder="Describe la decisión tomada y los motivos..."
          :rows="3"
          required
        />

        <label class="flex items-center gap-3 pt-1 cursor-pointer">
          <input
            v-model="blockUser"
            type="checkbox"
            class="size-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span class="text-sm font-semibold text-danger-700">
            Bloquear inmediatamente al usuario denunciado ({{
              selectedReport?.reported_user?.name
            }})
          </span>
        </label>

        <BaseAlert v-if="resolveError" tone="danger">
          {{ resolveError }}
        </BaseAlert>

        <div class="mt-6 flex justify-end gap-3">
          <BaseButton variant="secondary" :disabled="isResolving" @click="resolveModalOpen = false">
            Cancelar
          </BaseButton>

          <BaseButton variant="primary" :loading="isResolving" @click="handleResolve">
            Confirmar resolución
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
