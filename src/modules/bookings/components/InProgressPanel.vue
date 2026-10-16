<script setup lang="ts">
import { ChevronRight, Hammer } from '@lucide/vue'
import { computed } from 'vue'

import { useAuthStore } from '@/modules/auth'
import { BaseAlert, BaseAvatar, BaseButton, BaseCard, BaseSkeleton } from '@/shared/ui'
import { formatTime } from '@/shared/utils/format'

import { useBookings } from '../queries'
import BookingStatusBadge from './BookingStatusBadge.vue'

/**
 * HU049: servicios en curso del usuario (cliente o profesional), con acceso al detalle.
 * Se refresca solo: los avisos de inicio y fin (useBookingAlerts) y cada acción propia
 * invalidan las reservas.
 */
const auth = useAuthStore()
const isProfessional = computed(() => auth.role === 'professional')

const { data: result, isPending, error } = useBookings(1, ['in_progress'])

const listRoute = computed(() => ({
  name: isProfessional.value ? 'professional-bookings' : 'client-bookings',
  query: { filtro: 'in-progress' },
}))
const detailName = computed(() =>
  isProfessional.value ? 'professional-booking-detail' : 'client-booking-detail',
)
</script>

<template>
  <BaseCard as="section">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-sm font-semibold tracking-wide text-primary-600 uppercase">Ahora</p>
        <h2 class="mt-1 text-2xl font-black text-neutral-900">En proceso</h2>
      </div>
      <BaseButton variant="ghost" size="sm" :to="listRoute">
        Ver todos <ChevronRight class="size-4" />
      </BaseButton>
    </div>

    <BaseSkeleton v-if="isPending" class="mt-6 h-20" />

    <BaseAlert v-else-if="error" tone="danger" class="mt-6" title="No pudimos cargar los servicios">
      {{ error.message }}
    </BaseAlert>

    <div
      v-else-if="!result?.data.length"
      class="mt-6 flex items-center gap-3 rounded-2xl bg-surface-muted p-5 text-sm text-neutral-600"
    >
      <Hammer class="size-5 shrink-0 text-neutral-400" />
      No tienes servicios en curso en este momento.
    </div>

    <ul v-else class="mt-6 space-y-3">
      <li v-for="booking in result.data" :key="booking.id">
        <RouterLink
          :to="{ name: detailName, params: { id: booking.id } }"
          class="flex items-center gap-3 rounded-3xl border border-neutral-100 bg-surface-muted p-4 transition hover:border-primary-200"
        >
          <BaseAvatar
            :name="isProfessional ? booking.client.name : booking.professional.name"
            :src="isProfessional ? booking.client.avatar_url : booking.professional.avatar_url"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate font-bold text-neutral-900">{{ booking.service.title }}</p>
            <p class="truncate text-sm text-neutral-600">
              {{ isProfessional ? booking.client.name : booking.professional.name }}
              <template v-if="booking.started_at">
                · desde las {{ formatTime(booking.started_at) }}
              </template>
            </p>
          </div>
          <BookingStatusBadge :status="booking.status" />
          <ChevronRight class="size-5 shrink-0 text-neutral-400" />
        </RouterLink>
      </li>
    </ul>
  </BaseCard>
</template>
