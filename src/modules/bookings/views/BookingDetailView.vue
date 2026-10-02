<script setup lang="ts">
import { ArrowLeft, CalendarDays, Clock3, FileText, MapPin } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useAuthStore } from '@/modules/auth'
import { BaseAlert, BaseAvatar, BaseButton, BaseCard, BaseRating, BaseSkeleton } from '@/shared/ui'
import { formatDateTime, formatDuration, formatMoney, formatTime } from '@/shared/utils/format'

import BookingStatusBadge from '../components/BookingStatusBadge.vue'
import CancelBookingModal from '../components/CancelBookingModal.vue'
import { useBooking } from '../queries'
import { CANCELLABLE } from '../status'

/** HU026: detalle y estado. Las acciones de aceptar, iniciar, etc. llegan con su módulo. */
const route = useRoute()
const auth = useAuthStore()
const id = computed(() => Number(route.params.id))
const { data: booking, isPending, error } = useBooking(id)

const isProfessional = computed(() => auth.role === 'professional')
const counterpart = computed(() =>
  booking.value ? (isProfessional.value ? booking.value.client : booking.value.professional) : null,
)
const canCancel = computed(
  () => booking.value !== undefined && CANCELLABLE.includes(booking.value.status),
)
const cancelOpen = ref(false)
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
    <BaseButton
      variant="ghost"
      size="sm"
      :to="{ name: isProfessional ? 'professional-bookings' : 'client-bookings' }"
      class="mb-6"
    >
      <ArrowLeft class="size-4" /> Volver a reservas
    </BaseButton>

    <BaseSkeleton v-if="isPending" class="h-80" />

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar la reserva">{{
      error.message
    }}</BaseAlert>

    <div v-else-if="booking && counterpart" class="space-y-6">
      <BaseCard as="header" padding="lg">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-neutral-500">Reserva #{{ booking.id }}</p>
            <h1 class="mt-1 text-2xl font-black text-neutral-900">{{ booking.service.title }}</h1>
          </div>
          <BookingStatusBadge :status="booking.status" />
        </div>

        <dl class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="flex gap-3">
            <CalendarDays class="mt-0.5 size-5 text-primary-600" />
            <div>
              <dt class="text-xs font-semibold text-neutral-500 uppercase">Fecha</dt>
              <dd class="font-semibold text-neutral-900">
                {{ formatDateTime(booking.starts_at) }} – {{ formatTime(booking.ends_at) }}
              </dd>
            </div>
          </div>
          <div class="flex gap-3">
            <Clock3 class="mt-0.5 size-5 text-primary-600" />
            <div>
              <dt class="text-xs font-semibold text-neutral-500 uppercase">Duración estimada</dt>
              <dd class="font-semibold text-neutral-900">
                {{ formatDuration(booking.service.estimated_duration_minutes) }}
              </dd>
            </div>
          </div>
          <div class="flex gap-3">
            <MapPin class="mt-0.5 size-5 text-primary-600" />
            <div>
              <dt class="text-xs font-semibold text-neutral-500 uppercase">Dirección</dt>
              <dd class="font-semibold text-neutral-900">
                {{ booking.address
                }}<span v-if="booking.commune">, {{ booking.commune.name }}</span>
              </dd>
            </div>
          </div>
          <div class="flex gap-3">
            <span class="mt-0.5 text-lg leading-none font-black text-primary-600">$</span>
            <div>
              <dt class="text-xs font-semibold text-neutral-500 uppercase">Precio acordado</dt>
              <dd class="font-semibold text-neutral-900">
                {{ formatMoney(booking.agreed_price) }}
              </dd>
            </div>
          </div>
        </dl>

        <div v-if="booking.description" class="mt-6 flex gap-3 rounded-2xl bg-surface-muted p-4">
          <FileText class="mt-0.5 size-5 shrink-0 text-neutral-400" />
          <p class="text-sm leading-6 text-neutral-700">{{ booking.description }}</p>
        </div>
      </BaseCard>

      <BaseCard as="section">
        <h2 class="mb-4 text-sm font-semibold text-neutral-500 uppercase">
          {{ isProfessional ? 'Cliente' : 'Profesional' }}
        </h2>
        <div class="flex items-center gap-4">
          <BaseAvatar :name="counterpart.name" :src="counterpart.avatar_url" size="lg" />
          <div>
            <p class="text-lg font-bold text-neutral-900">{{ counterpart.name }}</p>
            <BaseRating :rating="counterpart.rating" />
          </div>
        </div>
      </BaseCard>

      <div v-if="canCancel" class="flex justify-end">
        <BaseButton variant="outline" class="text-danger-700" @click="cancelOpen = true">
          Cancelar reserva
        </BaseButton>
      </div>

      <CancelBookingModal v-model:open="cancelOpen" :booking-id="booking.id" />
    </div>
  </div>
</template>
