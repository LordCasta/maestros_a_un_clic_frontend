<script setup lang="ts">
import { ArrowLeft, CalendarDays, Clock3, FileText, MapPin } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useAuthStore } from '@/modules/auth'
import { BookingChat } from '@/modules/chat'
import type { Booking, BookingStatus } from '@/shared/types/models'
import { BaseAlert, BaseAvatar, BaseButton, BaseCard, BaseRating, BaseSkeleton } from '@/shared/ui'
import { formatDateTime, formatDuration, formatMoney, formatTime } from '@/shared/utils/format'

import BookingHistory from '../components/BookingHistory.vue'
import BookingResponseActions from '../components/BookingResponseActions.vue'
import BookingStatusBadge from '../components/BookingStatusBadge.vue'
import CancelBookingModal from '../components/CancelBookingModal.vue'
import ConfirmBookingButton from '../components/ConfirmBookingButton.vue'
import RescheduleBookingModal from '../components/RescheduleBookingModal.vue'
import ServiceProgressCard from '../components/ServiceProgressCard.vue'
import { useBooking } from '../queries'
import { useBookingUpdates } from '../realtime'
import { CANCELLABLE, RESCHEDULABLE } from '../status'

/**
 * HU026: detalle, estado en tiempo real e historial. HU012: cancelar y reprogramar. HU004: el profesional acepta o rechaza una solicitud pendiente.
 * HU036: el cliente confirma la reserva aceptada. HU027, HU028: el profesional inicia y
 * finaliza el servicio.
 */
const route = useRoute()
const auth = useAuthStore()
const id = computed(() => Number(route.params.id))
const { data: booking, isPending, error } = useBooking(id)
// HU026: el estado cambia en pantalla apenas la otra persona actúa.
useBookingUpdates(id)

const isProfessional = computed(() => auth.role === 'professional')
const isAdmin = computed(() => auth.role === 'admin')
const counterpart = computed(() =>
  booking.value ? (isProfessional.value ? booking.value.client : booking.value.professional) : null,
)
// HU012: cancelar y reprogramar solo antes de la hora programada.
const beforeStart = computed(
  () => booking.value !== undefined && Date.now() < new Date(booking.value.starts_at).getTime(),
)
const canCancel = computed(() => beforeStart.value && CANCELLABLE.includes(booking.value!.status))
const canReschedule = computed(
  () => beforeStart.value && RESCHEDULABLE.includes(booking.value!.status),
)
const cancelOpen = ref(false)
const rescheduleOpen = ref(false)

type Notice = { tone: 'info' | 'success' | 'warning'; text: string }

const finished = (b: Booking): Notice => ({
  tone: 'success',
  text: `Servicio finalizado${b.completed_at ? ` el ${formatDateTime(b.completed_at)}` : ''}.`,
})

/**
 * Qué ve cada uno según el estado (HU004, HU036, HU027, HU028). Los estados con acción propia
 * tienen su tarjeta aparte: pendiente, confirmada y en proceso para el profesional; aceptada
 * para el cliente.
 */
const NOTICES: Record<
  'client' | 'professional',
  Partial<Record<BookingStatus, (booking: Booking) => Notice>>
> = {
  client: {
    pending: () => ({
      tone: 'info',
      text: 'Tu solicitud está esperando la respuesta del profesional. Te avisaremos apenas responda.',
    }),
    confirmed: () => ({
      tone: 'success',
      text: 'Reserva confirmada. El profesional ya la tiene en su agenda.',
    }),
    in_progress: (b) => ({
      tone: 'info',
      text: `${b.professional.name} inició el servicio${b.started_at ? ` a las ${formatTime(b.started_at)}` : ''}.`,
    }),
    // HU005 (calificaciones) agrega aquí el botón para calificar.
    completed: finished,
    rejected: () => ({
      tone: 'warning',
      text: 'El profesional no puede atender esta solicitud. Puedes elegir otra hora o buscar otro profesional.',
    }),
  },
  professional: {
    accepted: () => ({
      tone: 'info',
      text: 'Aceptaste la solicitud. Falta que el cliente la confirme; te avisaremos cuando lo haga.',
    }),
    completed: finished,
  },
}
const notice = computed(() => {
  if (!booking.value) return undefined
  return NOTICES[isProfessional.value ? 'professional' : 'client'][booking.value.status]?.(
    booking.value,
  )
})
const showProgress = computed(
  () =>
    isProfessional.value &&
    booking.value !== undefined &&
    ['confirmed', 'in_progress'].includes(booking.value.status),
)
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
      <section
        v-if="isProfessional && booking.status === 'pending'"
        class="flex flex-col gap-4 rounded-3xl border border-warning-200 bg-warning-50 p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p class="font-bold text-neutral-900">Nueva solicitud</p>
          <p class="text-sm text-neutral-600">
            {{ booking.client.name }} espera tu respuesta. Si aceptas, la reserva queda a la espera
            de su confirmación.
          </p>
        </div>
        <BookingResponseActions :booking-id="booking.id" />
      </section>

      <section
        v-if="!isProfessional && booking.status === 'accepted'"
        class="flex flex-col gap-4 rounded-3xl border border-success-200 bg-success-50 p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p class="font-bold text-neutral-900">
            {{ booking.professional.name }} aceptó tu solicitud
          </p>
          <p class="text-sm text-neutral-600">
            Confírmala para dejar la reserva asegurada en su agenda.
          </p>
        </div>
        <ConfirmBookingButton :booking-id="booking.id" />
      </section>

      <ServiceProgressCard v-if="showProgress" :booking="booking" />

      <BaseAlert v-if="notice" :tone="notice.tone">
        {{ notice.text }}
        <BaseButton
          v-if="booking.status === 'rejected'"
          variant="ghost"
          size="sm"
          :to="{ name: 'professional-detail', params: { id: booking.professional.id } }"
          class="mt-2"
        >
          Ver otras horas de {{ booking.professional.name }}
        </BaseButton>
      </BaseAlert>

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

      <div v-if="canCancel || canReschedule" class="flex flex-wrap justify-end gap-2">
        <BaseButton v-if="canReschedule" variant="outline" @click="rescheduleOpen = true">
          Reprogramar
        </BaseButton>
        <BaseButton
          v-if="canCancel"
          variant="outline"
          class="text-danger-700"
          @click="cancelOpen = true"
        >
          Cancelar reserva
        </BaseButton>
      </div>

      <!-- HU011: chat con la otra parte (solo cliente y profesional). -->
      <BookingChat v-if="!isAdmin" :booking="booking" />

      <BookingHistory :booking-id="booking.id" />

      <CancelBookingModal v-model:open="cancelOpen" :booking-id="booking.id" />
      <RescheduleBookingModal v-model:open="rescheduleOpen" :booking="booking" />
    </div>
  </div>
</template>
