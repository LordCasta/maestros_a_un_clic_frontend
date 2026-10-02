<script setup lang="ts">
import { CalendarDays, ChevronRight, MapPin } from '@lucide/vue'
import { computed } from 'vue'

import type { Booking, Role } from '@/shared/types/models'
import { BaseAvatar, BaseCard } from '@/shared/ui'
import { formatDateTime, formatMoney, formatTime } from '@/shared/utils/format'

import BookingStatusBadge from './BookingStatusBadge.vue'

/** Una reserva en un listado. Muestra la contraparte según quién la mira. */
const props = defineProps<{ booking: Booking; viewer: Role }>()

const counterpart = computed(() =>
  props.viewer === 'professional' ? props.booking.client : props.booking.professional,
)
const detailRoute = computed(() => ({
  name: props.viewer === 'professional' ? 'professional-booking-detail' : 'client-booking-detail',
  params: { id: props.booking.id },
}))
</script>

<template>
  <RouterLink :to="detailRoute" class="block rounded-3xl">
    <BaseCard as="article" padding="sm" interactive>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <BaseAvatar :name="counterpart.name" :src="counterpart.avatar_url" />
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="truncate font-bold text-neutral-900">{{ booking.service.title }}</p>
            <BookingStatusBadge :status="booking.status" />
          </div>
          <p class="text-sm text-neutral-500">
            {{ viewer === 'professional' ? 'Cliente' : 'Profesional' }}: {{ counterpart.name }}
          </p>
          <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
            <span class="inline-flex items-center gap-1">
              <CalendarDays class="size-4" />
              {{ formatDateTime(booking.starts_at) }} – {{ formatTime(booking.ends_at) }}
            </span>
            <span class="inline-flex items-center gap-1"
              ><MapPin class="size-4" /> {{ booking.address }}</span
            >
          </div>
        </div>
        <div class="flex items-center gap-3 sm:flex-col sm:items-end">
          <span class="font-black text-primary-700">{{ formatMoney(booking.agreed_price) }}</span>
          <ChevronRight class="size-5 text-neutral-400" />
        </div>
      </div>
    </BaseCard>
  </RouterLink>
</template>
