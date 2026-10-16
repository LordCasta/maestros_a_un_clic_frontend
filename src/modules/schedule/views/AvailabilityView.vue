<script setup lang="ts">
import { CalendarClock, Coffee, Info } from '@lucide/vue'
import { computed } from 'vue'

import { BaseAlert, BaseCard, BaseSkeleton } from '@/shared/ui'
import { formatDuration } from '@/shared/utils/format'

import BlocksManager from '../components/BlocksManager.vue'
import WeeklyScheduleEditor from '../components/WeeklyScheduleEditor.vue'
import { useMyAvailability } from '../queries'

/**
 * HU003: el profesional configura cuándo atiende, el descanso entre servicios y las horas
 * ocupadas. Los clientes ven los cambios al instante en las horas libres (HU025).
 */
const { data: availability, isPending, error } = useMyAvailability()

const activeDays = computed(
  () => new Set((availability.value?.rules ?? []).map((rule) => rule.weekday)).size,
)
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <header>
      <h1 class="text-3xl font-black text-neutral-900">Mi disponibilidad</h1>
      <p class="mt-1 text-neutral-500">
        Define cuándo pueden reservarte. Las reservas que ya tienes no cambian.
      </p>
    </header>

    <div v-if="isPending" class="space-y-6">
      <BaseSkeleton class="h-24" />
      <BaseSkeleton class="h-96" />
    </div>

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar tu agenda">
      {{ error.message }}
    </BaseAlert>

    <template v-else-if="availability">
      <div class="grid gap-4 sm:grid-cols-2">
        <BaseCard padding="sm" class="flex items-center gap-4">
          <CalendarClock class="size-8 shrink-0 text-primary-600" />
          <div>
            <p class="text-sm text-neutral-500">Días en que atiendes</p>
            <p class="text-2xl font-black text-neutral-900">{{ activeDays }} de 7</p>
          </div>
        </BaseCard>
        <BaseCard padding="sm" class="flex items-center gap-4">
          <Coffee class="size-8 shrink-0 text-primary-600" />
          <div>
            <p class="text-sm text-neutral-500">Descanso entre servicios</p>
            <p class="text-2xl font-black text-neutral-900">
              {{
                availability.buffer_minutes
                  ? formatDuration(availability.buffer_minutes)
                  : 'Sin descanso'
              }}
            </p>
          </div>
        </BaseCard>
      </div>

      <BaseAlert v-if="activeDays === 0" tone="warning">
        <span class="inline-flex items-start gap-2">
          <Info class="mt-0.5 size-4 shrink-0" />
          Aún no tienes días de atención: los clientes no pueden reservarte hasta que actives al
          menos uno.
        </span>
      </BaseAlert>

      <WeeklyScheduleEditor :availability="availability" />
      <BlocksManager :blocks="availability.blocks" />
    </template>
  </div>
</template>
