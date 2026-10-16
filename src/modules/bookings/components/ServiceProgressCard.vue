<script setup lang="ts">
import { CircleCheckBig, Play } from '@lucide/vue'
import { computed, onBeforeUnmount, ref } from 'vue'

import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import type { Booking } from '@/shared/types/models'
import { BaseButton, BaseModal } from '@/shared/ui'
import { formatDateTime, formatTime } from '@/shared/utils/format'

import { useCompleteBooking, useStartBooking } from '../queries'

/**
 * HU027, HU028: el profesional inicia el servicio (desde la hora pactada) y lo finaliza.
 * Se muestra en el detalle de una reserva confirmada o en proceso.
 */
const props = defineProps<{ booking: Booking }>()

const toast = useToastStore()
const { mutateAsync: start, isLoading: starting } = useStartBooking()
const { mutateAsync: complete, isLoading: completing } = useCompleteBooking()
const completeOpen = ref(false)

// El botón de iniciar se habilita solo al llegar la hora, sin recargar la página.
const now = ref(Date.now())
const timer = setInterval(() => (now.value = Date.now()), 30_000)
onBeforeUnmount(() => clearInterval(timer))
const canStart = computed(() => now.value >= new Date(props.booking.starts_at).getTime())

async function run(action: () => Promise<{ message: string | null }>, fallback: string) {
  try {
    const response = await action()
    toast.success(response.message ?? fallback)
    return true
  } catch (error) {
    toast.error(error instanceof ApiError ? error.message : 'No pudimos actualizar la reserva.')
    return false
  }
}

const onStart = () => run(() => start(props.booking.id), 'Servicio iniciado.')

async function onComplete() {
  if (await run(() => complete(props.booking.id), 'Servicio finalizado.'))
    completeOpen.value = false
}
</script>

<template>
  <section
    class="flex flex-col gap-4 rounded-3xl border border-primary-200 bg-primary-50 p-6 sm:flex-row sm:items-center sm:justify-between"
  >
    <div v-if="booking.status === 'confirmed'">
      <p class="font-bold text-neutral-900">Reserva confirmada</p>
      <p class="text-sm text-neutral-600">
        <template v-if="canStart">Cuando llegues donde el cliente, marca el inicio.</template>
        <template v-else>
          Podrás iniciar el servicio desde el {{ formatDateTime(booking.starts_at) }}.
        </template>
      </p>
    </div>
    <div v-else>
      <p class="font-bold text-neutral-900">Servicio en proceso</p>
      <p class="text-sm text-neutral-600">
        Iniciado a las {{ booking.started_at ? formatTime(booking.started_at) : '—' }}. Márcalo como
        finalizado al terminar el trabajo.
      </p>
    </div>

    <BaseButton
      v-if="booking.status === 'confirmed'"
      :loading="starting"
      :disabled="!canStart"
      @click="onStart"
    >
      <Play class="size-4" /> Iniciar servicio
    </BaseButton>
    <BaseButton v-else @click="completeOpen = true">
      <CircleCheckBig class="size-4" /> Finalizar servicio
    </BaseButton>

    <BaseModal
      v-model:open="completeOpen"
      title="¿Terminaste el trabajo?"
      description="El cliente recibirá un aviso y podrá calificar el servicio. Esta acción no se puede deshacer."
    >
      <template #footer>
        <BaseButton variant="outline" @click="completeOpen = false">Todavía no</BaseButton>
        <BaseButton :loading="completing" @click="onComplete">Sí, finalizar</BaseButton>
      </template>
    </BaseModal>
  </section>
</template>
