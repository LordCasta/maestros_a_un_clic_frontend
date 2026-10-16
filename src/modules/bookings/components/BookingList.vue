<script setup lang="ts">
import { CalendarX } from '@lucide/vue'
import { computed, ref, watch } from 'vue'

import type { Role } from '@/shared/types/models'
import { BaseAlert, BaseButton, BaseEmptyState, BasePagination, BaseSkeleton } from '@/shared/ui'

import { useBookings } from '../queries'
import { BOOKING_FILTERS } from '../status'
import BookingCard from './BookingCard.vue'

/** Lista paginada de reservas para cliente o profesional, con filtros por estado (HU016, HU017). */
const props = withDefaults(defineProps<{ viewer: Role; initialFilter?: string }>(), {
  initialFilter: 'all',
})

const filterKey = ref(props.initialFilter)
const filter = computed(
  () => BOOKING_FILTERS.find((item) => item.key === filterKey.value) ?? BOOKING_FILTERS[0]!,
)
const page = ref(1)
watch(filterKey, () => (page.value = 1))

const { data: result, isPending, error, refetch } = useBookings(page, () => filter.value.status)
</script>

<template>
  <div class="space-y-6">
    <div
      class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
      role="tablist"
      aria-label="Filtrar reservas"
    >
      <button
        v-for="item in BOOKING_FILTERS"
        :key="item.key"
        type="button"
        role="tab"
        :aria-selected="item.key === filterKey"
        :class="[
          'shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition',
          item.key === filterKey
            ? 'border-primary-600 bg-primary-600 text-white'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-300',
        ]"
        @click="filterKey = item.key"
      >
        {{ item.label }}
      </button>
    </div>

    <div v-if="isPending" class="space-y-4">
      <BaseSkeleton v-for="n in 3" :key="n" class="h-28" />
    </div>

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar las reservas">
      {{ error.message }}
      <BaseButton variant="ghost" size="sm" class="mt-2" @click="refetch()">Reintentar</BaseButton>
    </BaseAlert>

    <BaseEmptyState
      v-else-if="!result?.data.length && filterKey !== 'all'"
      :icon="CalendarX"
      :title="`No tienes reservas en «${filter.label}»`"
      description="Prueba con otro filtro."
    >
      <BaseButton variant="outline" @click="filterKey = 'all'">Ver todas</BaseButton>
    </BaseEmptyState>

    <BaseEmptyState
      v-else-if="!result?.data.length"
      :icon="CalendarX"
      title="No tienes reservas todavía"
      :description="
        viewer === 'professional'
          ? 'Cuando un cliente te solicite un servicio aparecerá aquí.'
          : 'Busca un profesional y solicita tu primer servicio.'
      "
    >
      <BaseButton v-if="viewer === 'client'" :to="{ name: 'search' }"
        >Buscar profesionales</BaseButton
      >
    </BaseEmptyState>

    <div v-else class="space-y-4">
      <BookingCard
        v-for="booking in result.data"
        :key="booking.id"
        :booking="booking"
        :viewer="viewer"
      />
      <BasePagination v-model:page="page" :meta="result.meta" />
    </div>
  </div>
</template>
