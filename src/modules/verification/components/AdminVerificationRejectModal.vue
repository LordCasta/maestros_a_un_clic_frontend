<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'

import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import type { VerificationRequest } from '@/shared/types/models'
import { BaseAlert, BaseButton, BaseModal, BaseTextarea } from '@/shared/ui'

import { useRejectVerification } from '../queries'
import { rejectVerificationSchema, type RejectVerificationFormValues } from '../schemas'

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{
  request: VerificationRequest | null
}>()

const emit = defineEmits<{
  (e: 'rejected'): void
}>()

const toast = useToastStore()
const { mutateAsync } = useRejectVerification()

const { defineField, errors, handleSubmit, isSubmitting, setErrors, resetForm } =
  useForm<RejectVerificationFormValues>({
    validationSchema: toTypedSchema(rejectVerificationSchema),
    initialValues: {
      reason: '',
    },
  })

const [reason, reasonAttrs] = defineField('reason')
const formError = ref('')

const onSubmit = handleSubmit(async (values) => {
  if (!props.request) {
    return
  }
  formError.value = ''

  try {
    const response = await mutateAsync({
      id: props.request.id,
      reason: values.reason,
    })
    toast.success(response.message ?? 'Solicitud rechazada.')
    open.value = false
    resetForm()
    emit('rejected')
  } catch (error) {
    formError.value = applyServerErrors(error, setErrors)
  }
})
</script>

<template>
  <BaseModal
    v-model:open="open"
    title="Rechazar solicitud de verificación"
    description="Indica el motivo obligatorio por el cual se rechaza la verificación. El usuario recibirá este motivo para poder corregir su documentación."
  >
    <form id="reject-verification-form" class="space-y-4" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>

      <BaseTextarea
        v-model="reason"
        v-bind="reasonAttrs"
        label="Motivo del rechazo"
        placeholder="Explica qué documentos no coinciden o qué información hace falta..."
        :error="errors.reason"
        :rows="4"
        required
      />
    </form>

    <template #footer>
      <BaseButton variant="outline" @click="open = false">Cancelar</BaseButton>
      <BaseButton
        variant="danger"
        type="submit"
        form="reject-verification-form"
        :loading="isSubmitting"
      >
        Confirmar rechazo
      </BaseButton>
    </template>
  </BaseModal>
</template>
