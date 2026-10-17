<script setup lang="ts">
import { CalendarCheck, ChevronRight, CircleDollarSign, TrendingUp, Wallet } from '@lucide/vue'
import { computed, ref } from 'vue'

import {
  BaseAlert,
  BaseAvatar,
  BaseCard,
  BaseEmptyState,
  BaseInput,
  BaseSkeleton,
} from '@/shared/ui'
import { formatDate, formatMoney } from '@/shared/utils/format'

import { useEarnings } from '../queries'
import { presetRange, RANGE_PRESETS, type DateRange, type RangePreset } from '../ranges'

/** HU037: cuánto ha ganado el profesional por sus servicios finalizados, por fechas. */
const preset = ref<RangePreset | 'custom'>('this-month')
const range = ref<DateRange>(presetRange('this-month'))

function choose(key: RangePreset) {
  preset.value = key
  range.value = presetRange(key)
}
function setFrom(value: string | number | null | undefined) {
  if (!value) return
  preset.value = 'custom'
  range.value = {
    from: String(value),
    to: range.value.to < String(value) ? String(value) : range.value.to,
  }
}
function setTo(value: string | number | null | undefined) {
  if (!value) return
  preset.value = 'custom'
  range.value = {
    from: range.value.from > String(value) ? String(value) : range.value.from,
    to: String(value),
  }
}

const { data: earnings, isPending, error } = useEarnings(range)

const cards = computed(() =>
  earnings.value
    ? [
        { label: 'Ingresos', value: formatMoney(earnings.value.total), icon: Wallet },
        {
          label: 'Servicios finalizados',
          value: String(earnings.value.count),
          icon: CalendarCheck,
        },
        {
          label: 'Promedio por servicio',
          value: formatMoney(earnings.value.average),
          icon: TrendingUp,
        },
      ]
    : [],
)
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <header>
      <h1 class="text-3xl font-black text-neutral-900">Ingresos</h1>
      <p class="mt-1 text-neutral-500">
        Lo que has ganado por los servicios que finalizaste, según el precio acordado.
      </p>
    </header>

    <BaseCard as="section" padding="sm" class="space-y-4">
      <div class="flex flex-wrap gap-2" role="group" aria-label="Rango de fechas">
        <button
          v-for="item in RANGE_PRESETS"
          :key="item.key"
          type="button"
          :aria-pressed="preset === item.key"
          :class="[
            'rounded-full border px-4 py-1.5 text-sm font-semibold transition',
            preset === item.key
              ? 'border-primary-600 bg-primary-600 text-white'
              : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-300',
          ]"
          @click="choose(item.key)"
        >
          {{ item.label }}
        </button>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <BaseInput
          :model-value="range.from"
          type="date"
          label="Desde"
          :max="range.to"
          @update:model-value="setFrom"
        />
        <BaseInput
          :model-value="range.to"
          type="date"
          label="Hasta"
          :min="range.from"
          @update:model-value="setTo"
        />
      </div>
    </BaseCard>

    <div v-if="isPending" class="grid gap-4 sm:grid-cols-3">
      <BaseSkeleton v-for="n in 3" :key="n" class="h-24" />
    </div>

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar tus ingresos">
      {{ error.message }}
    </BaseAlert>

    <template v-else-if="earnings">
      <div class="grid gap-4 sm:grid-cols-3">
        <BaseCard
          v-for="card in cards"
          :key="card.label"
          padding="sm"
          class="flex items-center gap-4"
        >
          <component :is="card.icon" class="size-8 shrink-0 text-primary-600" />
          <div>
            <p class="text-sm text-neutral-500">{{ card.label }}</p>
            <p class="text-2xl font-black text-neutral-900">{{ card.value }}</p>
          </div>
        </BaseCard>
      </div>

      <BaseEmptyState
        v-if="earnings.count === 0"
        :icon="CircleDollarSign"
        title="Sin ingresos en estas fechas"
        description="Los servicios aparecen aquí cuando los marcas como finalizados."
      />

      <BaseCard v-else as="section" padding="none">
        <h2 class="border-b border-neutral-100 px-5 py-4 font-bold text-neutral-900">
          Servicios del {{ formatDate(earnings.from) }} al {{ formatDate(earnings.to) }}
        </h2>
        <ul class="divide-y divide-neutral-100">
          <li v-for="booking in earnings.bookings" :key="booking.id">
            <RouterLink
              :to="{ name: 'professional-booking-detail', params: { id: booking.id } }"
              class="flex items-center gap-4 px-5 py-3 transition hover:bg-surface-muted"
            >
              <BaseAvatar :name="booking.client.name" :src="booking.client.avatar_url" size="sm" />
              <div class="min-w-0 flex-1">
                <p class="truncate font-semibold text-neutral-900">{{ booking.service.title }}</p>
                <p class="truncate text-sm text-neutral-500">
                  {{ booking.client.name }}
                  <template v-if="booking.completed_at">
                    · {{ formatDate(booking.completed_at) }}
                  </template>
                </p>
              </div>
              <span class="font-black text-primary-700">{{
                formatMoney(booking.agreed_price)
              }}</span>
              <ChevronRight class="size-5 shrink-0 text-neutral-400" />
            </RouterLink>
          </li>
        </ul>
      </BaseCard>
    </template>
  </div>
</template>
