<script setup lang="ts">
import { CalendarCheck } from '@lucide/vue'

import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import { BaseButton } from '@/shared/ui'

import { useConfirmBooking } from '../queries'

/** HU036: el cliente confirma la reserva que el profesional aceptó. */
const props = defineProps<{ bookingId: number }>()

const toast = useToastStore()
const { mutateAsync: confirm, isLoading } = useConfirmBooking()

async function onConfirm() {
  try {
    const response = await confirm(props.bookingId)
    toast.success(response.message ?? 'Reserva confirmada.')
  } catch (error) {
    toast.error(error instanceof ApiError ? error.message : 'No pudimos confirmar la reserva.')
  }
}
</script>

<template>
  <BaseButton :loading="isLoading" @click="onConfirm">
    <CalendarCheck class="size-4" /> Confirmar reserva
  </BaseButton>
</template>
