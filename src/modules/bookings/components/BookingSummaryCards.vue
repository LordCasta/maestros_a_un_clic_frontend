<script setup lang="ts">
import { CalendarCheck, CalendarClock, CalendarX2 } from '@lucide/vue'
import { computed } from 'vue'

import { BaseCard, BaseSkeleton } from '@/shared/ui'

import { useBookingSummary } from '../queries'

/** HU017: totales del historial del profesional (realizados, próximos y cancelados). */
const { data: summary, isPending, error } = useBookingSummary()

const cards = computed(() => {
  const by = summary.value?.by_status
  if (!by) return []
  return [
    { label: 'Servicios realizados', value: by.completed, icon: CalendarCheck },
    {
      label: 'Próximos y en curso',
      value: by.pending + by.accepted + by.confirmed + by.in_progress,
      icon: CalendarClock,
    },
    { label: 'Cancelados o rechazados', value: by.cancelled + by.rejected, icon: CalendarX2 },
  ]
})
</script>

<template>
  <div v-if="isPending" class="grid gap-4 sm:grid-cols-3">
    <BaseSkeleton v-for="n in 3" :key="n" class="h-24" />
  </div>
  <!-- Si el resumen falla, el listado sigue funcionando: no se muestra un error aparte. -->
  <div v-else-if="!error && cards.length" class="grid gap-4 sm:grid-cols-3">
    <BaseCard v-for="card in cards" :key="card.label" padding="sm" class="flex items-center gap-4">
      <component :is="card.icon" class="size-8 shrink-0 text-primary-600" />
      <div>
        <p class="text-sm text-neutral-500">{{ card.label }}</p>
        <p class="text-2xl font-black text-neutral-900">{{ card.value }}</p>
      </div>
    </BaseCard>
  </div>
</template>
