<script setup lang="ts">
import { ref, watch } from 'vue'

import { SlotPicker } from '@/modules/schedule'
import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import type { Booking } from '@/shared/types/models'
import { BaseAlert, BaseButton, BaseModal } from '@/shared/ui'
import { formatDateTime } from '@/shared/utils/format'

import { useRescheduleBooking } from '../queries'

/**
 * HU012: elegir otra hora libre del profesional. La reserva vuelve a "pendiente" hasta que
 * el profesional acepte el nuevo horario, y la fecha anterior queda en el historial.
 */
const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ booking: Booking }>()

const toast = useToastStore()
const { mutateAsync, isLoading } = useRescheduleBooking()
const startsAt = ref<string | null>(null)
const formError = ref('')

watch(open, (isOpen) => {
  if (isOpen) {
    startsAt.value = null
    formError.value = ''
  }
})

async function submit() {
  if (!startsAt.value) return
  formError.value = ''
  try {
    const response = await mutateAsync({ id: props.booking.id, startsAt: startsAt.value })
    toast.success(response.message ?? 'Reserva reprogramada.')
    open.value = false
  } catch (error) {
    formError.value = error instanceof ApiError ? error.message : 'No pudimos reprogramar.'
    // 409: alguien tomó esa hora; las horas libres ya se refrescaron.
    if (error instanceof ApiError && error.status === 409) startsAt.value = null
  }
}
</script>

<template>
  <BaseModal
    v-model:open="open"
    size="lg"
    title="Reprogramar reserva"
    :description="`Hoy está para el ${formatDateTime(booking.starts_at)}. El profesional deberá aceptar el nuevo horario.`"
  >
    <div class="space-y-4">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>
      <SlotPicker
        v-model="startsAt"
        :professional-id="booking.professional.id"
        :service-id="booking.service.id"
      />
    </div>
    <template #footer>
      <BaseButton variant="outline" @click="open = false">Volver</BaseButton>
      <BaseButton :loading="isLoading" :disabled="!startsAt" @click="submit">
        Reprogramar
      </BaseButton>
    </template>
  </BaseModal>
</template>
