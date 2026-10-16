<script setup lang="ts">
import { CalendarX2 } from '@lucide/vue'
import { ref, watch } from 'vue'

import { BaseAlert, BaseSkeleton } from '@/shared/ui'
import { formatTime } from '@/shared/utils/format'

import { upcomingDays } from '../dates'
import { useProfessionalSlots } from '../queries'

/**
 * HU025: elegir día y hora libres de un profesional para un servicio.
 * El valor es el `starts_at` (ISO) de la hora elegida, tal como lo espera POST /bookings.
 */
const model = defineModel<string | null>({ default: null })
const props = defineProps<{ professionalId: number; serviceId: number | null; error?: string }>()

const DAYS_SHOWN = 14
const days = upcomingDays(DAYS_SHOWN)
const date = ref(days[0]!.key)

const {
  data,
  isPending,
  error: loadError,
} = useProfessionalSlots(
  () => props.professionalId,
  date,
  () => props.serviceId,
)

// Otro día u otro servicio: la hora elegida ya no aplica.
watch([date, () => props.serviceId], () => {
  model.value = null
})

const chip = (selected: boolean) => [
  'rounded-2xl border text-sm font-semibold transition',
  selected
    ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
    : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:text-primary-700',
]
</script>

<template>
  <fieldset class="space-y-4" :aria-invalid="error ? true : undefined">
    <legend class="mb-2 text-sm font-semibold text-neutral-800">Día y hora</legend>

    <div class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Día">
      <button
        v-for="day in days"
        :key="day.key"
        type="button"
        :aria-pressed="day.key === date"
        :class="[chip(day.key === date), 'flex w-16 shrink-0 flex-col items-center py-2']"
        @click="date = day.key"
      >
        <span class="text-xs font-medium capitalize opacity-80">{{ day.weekday }}</span>
        <span class="text-lg leading-tight font-black">{{ day.day }}</span>
        <span class="text-xs font-medium capitalize opacity-80">{{ day.month }}</span>
      </button>
    </div>

    <p v-if="serviceId === null" class="text-sm text-neutral-500">
      Elige un servicio para ver las horas disponibles.
    </p>

    <div v-else-if="isPending" class="grid grid-cols-3 gap-2 sm:grid-cols-4">
      <BaseSkeleton v-for="n in 8" :key="n" class="h-11" />
    </div>

    <BaseAlert v-else-if="loadError" tone="danger" title="No pudimos cargar la agenda">
      {{ loadError.message }}
    </BaseAlert>

    <div
      v-else-if="data && data.slots.length === 0"
      class="flex items-center gap-3 rounded-2xl bg-surface-muted p-4 text-sm text-neutral-600"
    >
      <CalendarX2 class="size-5 shrink-0 text-neutral-400" />
      No hay horas libres este día. Prueba con otro.
    </div>

    <div
      v-else-if="data"
      class="grid grid-cols-3 gap-2 sm:grid-cols-4"
      role="group"
      aria-label="Hora"
    >
      <button
        v-for="slot in data.slots"
        :key="slot.starts_at"
        type="button"
        :aria-pressed="slot.starts_at === model"
        :class="[chip(slot.starts_at === model), 'h-11']"
        @click="model = slot.starts_at"
      >
        {{ formatTime(slot.starts_at) }}
      </button>
    </div>

    <p v-if="error" class="text-xs font-medium text-danger-600">{{ error }}</p>
  </fieldset>
</template>
