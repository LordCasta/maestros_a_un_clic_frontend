<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { z } from 'zod'

import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import { BaseAlert, BaseButton, BaseModal, BaseTextarea } from '@/shared/ui'

import { useCancelBooking } from '../queries'

/** HU012: confirmar la cancelación pidiendo el motivo (obligatorio en el backend). */
const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ bookingId: number }>()

const toast = useToastStore()
const { mutateAsync } = useCancelBooking()

const { defineField, errors, handleSubmit, isSubmitting, setErrors, resetForm } = useForm({
  validationSchema: toTypedSchema(z.object({ reason: z.string().trim().min(5).max(1000) })),
})
const [reason, reasonAttrs] = defineField('reason')
const formError = ref('')

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    const response = await mutateAsync({ id: props.bookingId, reason: values.reason })
    toast.success(response.message ?? 'Reserva cancelada.')
    open.value = false
    resetForm()
  } catch (error) {
    formError.value = applyServerErrors(error, setErrors)
  }
})
</script>

<template>
  <BaseModal
    v-model:open="open"
    title="Cancelar reserva"
    description="La otra persona verá el motivo. Esta acción no se puede deshacer."
  >
    <form id="cancel-booking" class="space-y-4" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>
      <BaseTextarea
        v-model="reason"
        v-bind="reasonAttrs"
        label="Motivo"
        :rows="3"
        :max-length="1000"
        placeholder="Cuéntale a la otra persona por qué cancelas."
        :error="errors.reason"
      />
    </form>
    <template #footer>
      <BaseButton variant="outline" @click="open = false">Volver</BaseButton>
      <BaseButton variant="danger" type="submit" form="cancel-booking" :loading="isSubmitting">
        Cancelar reserva
      </BaseButton>
    </template>
  </BaseModal>
</template>
