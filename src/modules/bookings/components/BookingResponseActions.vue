<script setup lang="ts">
import { Check, X } from '@lucide/vue'
import { ref } from 'vue'

import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import { BaseButton } from '@/shared/ui'

import { useAcceptBooking } from '../queries'
import RejectBookingModal from './RejectBookingModal.vue'

/** HU004: botones del profesional para aceptar o rechazar una solicitud pendiente. */
const props = withDefaults(defineProps<{ bookingId: number; size?: 'sm' | 'md' }>(), {
  size: 'md',
})

const toast = useToastStore()
const { mutateAsync: accept, isLoading: accepting } = useAcceptBooking()
const rejectOpen = ref(false)

async function onAccept() {
  try {
    const response = await accept(props.bookingId)
    toast.success(response.message ?? 'Solicitud aceptada.')
  } catch (error) {
    toast.error(error instanceof ApiError ? error.message : 'No pudimos aceptar la solicitud.')
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <BaseButton variant="outline" :size="size" :disabled="accepting" @click="rejectOpen = true">
      <X class="size-4" /> Rechazar
    </BaseButton>
    <BaseButton :size="size" :loading="accepting" @click="onAccept">
      <Check class="size-4" /> Aceptar
    </BaseButton>
    <RejectBookingModal v-model:open="rejectOpen" :booking-id="bookingId" />
  </div>
</template>
