<script setup lang="ts">
import type { BookingStatusChange } from '@/shared/types/models'
import { BaseAlert, BaseCard, BaseSkeleton } from '@/shared/ui'
import { formatDateTime } from '@/shared/utils/format'

import { useBookingHistory } from '../queries'
import { BOOKING_STATUS } from '../status'

/** HU026: línea de tiempo con cada cambio de estado de la reserva. */
const props = defineProps<{ bookingId: number }>()

const { data: changes, isPending, error } = useBookingHistory(() => props.bookingId)

function title(change: BookingStatusChange): string {
  if (change.from_status === null) return 'Solicitud enviada'
  if (change.previous_starts_at) return 'Reprogramada'
  return BOOKING_STATUS[change.to_status].label
}

const DOT = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  info: 'bg-info-500',
  neutral: 'bg-neutral-400',
} as const
</script>

<template>
  <BaseCard as="section">
    <h2 class="mb-5 text-sm font-semibold text-neutral-500 uppercase">Historial</h2>

    <div v-if="isPending" class="space-y-3">
      <BaseSkeleton v-for="n in 3" :key="n" class="h-10" />
    </div>

    <BaseAlert v-else-if="error" tone="danger">No pudimos cargar el historial.</BaseAlert>

    <ol v-else-if="changes?.length" class="relative space-y-5 border-l border-neutral-200 pl-6">
      <li v-for="change in changes" :key="change.id" class="relative">
        <span
          :class="[
            'absolute top-1.5 -left-7.5 size-3 rounded-full ring-4 ring-surface',
            DOT[BOOKING_STATUS[change.to_status].tone],
          ]"
          aria-hidden="true"
        />
        <p class="font-semibold text-neutral-900">{{ title(change) }}</p>
        <p class="text-sm text-neutral-500">
          {{ formatDateTime(change.created_at) }}
          <template v-if="change.changed_by"> · {{ change.changed_by.name }}</template>
        </p>
        <p v-if="change.previous_starts_at" class="mt-1 text-sm text-neutral-600">
          Antes era el {{ formatDateTime(change.previous_starts_at) }}.
        </p>
        <p v-if="change.reason" class="mt-1 text-sm text-neutral-700">“{{ change.reason }}”</p>
      </li>
    </ol>

    <p v-else class="text-sm text-neutral-500">Todavía no hay cambios.</p>
  </BaseCard>
</template>
