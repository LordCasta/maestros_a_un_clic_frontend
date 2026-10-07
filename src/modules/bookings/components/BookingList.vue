<script setup lang="ts">
import { CalendarX } from '@lucide/vue'
import { ref } from 'vue'

import type { Role } from '@/shared/types/models'
import { BaseAlert, BaseButton, BaseEmptyState, BasePagination, BaseSkeleton } from '@/shared/ui'

import { useBookings } from '../queries'
import BookingCard from './BookingCard.vue'

/** Lista paginada de reservas para cliente o profesional (HU016, HU017). */
defineProps<{ viewer: Role }>()

const page = ref(1)
const { data: result, isPending, error, refetch } = useBookings(page)
</script>

<template>
  <div v-if="isPending" class="space-y-4">
    <BaseSkeleton v-for="n in 3" :key="n" class="h-28" />
  </div>

  <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar las reservas">
    {{ error.message }}
    <BaseButton variant="ghost" size="sm" class="mt-2" @click="refetch()">Reintentar</BaseButton>
  </BaseAlert>

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
</template>
