<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'

import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import { BaseAlert, BaseButton, BaseModal, BaseTextarea } from '@/shared/ui'

import { useRejectBooking } from '../queries'
import { rejectSchema } from '../schemas'

/** HU004: rechazar una solicitud. El motivo es opcional y el cliente lo ve en el aviso. */
const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ bookingId: number }>()

const toast = useToastStore()
const { mutateAsync } = useRejectBooking()

const { defineField, errors, handleSubmit, isSubmitting, setErrors, resetForm } = useForm({
  validationSchema: toTypedSchema(rejectSchema),
})
const [reason, reasonAttrs] = defineField('reason')
const formError = ref('')

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    const response = await mutateAsync({ id: props.bookingId, reason: values.reason || undefined })
    toast.success(response.message ?? 'Solicitud rechazada.')
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
    title="Rechazar solicitud"
    description="La hora vuelve a quedar libre en tu agenda y el cliente recibe un aviso."
  >
    <form id="reject-booking" class="space-y-4" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>
      <BaseTextarea
        v-model="reason"
        v-bind="reasonAttrs"
        label="Motivo (opcional)"
        :rows="3"
        :max-length="1000"
        placeholder="Por ejemplo: ese día no tengo los repuestos."
        :error="errors.reason"
      />
    </form>
    <template #footer>
      <BaseButton variant="outline" @click="open = false">Volver</BaseButton>
      <BaseButton variant="danger" type="submit" form="reject-booking" :loading="isSubmitting">
        Rechazar
      </BaseButton>
    </template>
  </BaseModal>
</template>
