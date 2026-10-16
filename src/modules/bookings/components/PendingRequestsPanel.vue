<script setup lang="ts">
import { BellRing, CalendarDays, ChevronRight, Inbox } from '@lucide/vue'

import { BaseAlert, BaseAvatar, BaseBadge, BaseButton, BaseCard, BaseSkeleton } from '@/shared/ui'
import { formatDateTime, formatMoney } from '@/shared/utils/format'

import { usePendingRequests } from '../queries'
import BookingResponseActions from './BookingResponseActions.vue'

/**
 * HU004: alerta del panel del profesional con las solicitudes por responder.
 * Se refresca sola cuando llega una solicitud nueva por tiempo real (useBookingAlerts).
 */
const { data, isPending, error } = usePendingRequests()
</script>

<template>
  <BaseCard as="section">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-sm font-semibold tracking-wide text-primary-600 uppercase">Solicitudes</p>
        <h2 class="mt-1 flex items-center gap-2 text-2xl font-black text-neutral-900">
          Por responder
          <BaseBadge v-if="data?.meta.total" tone="warning">{{ data.meta.total }}</BaseBadge>
        </h2>
      </div>
      <BaseButton variant="ghost" size="sm" :to="{ name: 'professional-bookings' }">
        Ver todas <ChevronRight class="size-4" />
      </BaseButton>
    </div>

    <div v-if="isPending" class="mt-6 space-y-3">
      <BaseSkeleton v-for="n in 2" :key="n" class="h-24" />
    </div>

    <BaseAlert
      v-else-if="error"
      tone="danger"
      class="mt-6"
      title="No pudimos cargar las solicitudes"
    >
      {{ error.message }}
    </BaseAlert>

    <div
      v-else-if="!data?.data.length"
      class="mt-6 flex items-center gap-3 rounded-2xl bg-surface-muted p-5 text-sm text-neutral-600"
    >
      <Inbox class="size-5 shrink-0 text-neutral-400" />
      No tienes solicitudes pendientes. Te avisaremos cuando llegue una.
    </div>

    <template v-else>
      <BaseAlert tone="warning" class="mt-6">
        <span class="inline-flex items-center gap-2">
          <BellRing class="size-4" />
          {{
            data.meta.total === 1
              ? 'Tienes 1 solicitud esperando tu respuesta.'
              : `Tienes ${data.meta.total} solicitudes esperando tu respuesta.`
          }}
        </span>
      </BaseAlert>

      <ul class="mt-4 space-y-3">
        <li
          v-for="booking in data.data"
          :key="booking.id"
          class="flex flex-col gap-4 rounded-3xl border border-neutral-100 bg-surface-muted p-4 lg:flex-row lg:items-center"
        >
          <RouterLink
            :to="{ name: 'professional-booking-detail', params: { id: booking.id } }"
            class="flex min-w-0 flex-1 items-center gap-3"
          >
            <BaseAvatar :name="booking.client.name" :src="booking.client.avatar_url" />
            <div class="min-w-0">
              <p class="truncate font-bold text-neutral-900">{{ booking.client.name }}</p>
              <p class="truncate text-sm text-neutral-600">{{ booking.service.title }}</p>
              <p class="mt-1 inline-flex items-center gap-1 text-xs text-neutral-500">
                <CalendarDays class="size-3.5" /> {{ formatDateTime(booking.starts_at) }} ·
                {{ formatMoney(booking.agreed_price) }}
              </p>
            </div>
          </RouterLink>
          <BookingResponseActions :booking-id="booking.id" size="sm" />
        </li>
      </ul>
    </template>
  </BaseCard>
</template>
