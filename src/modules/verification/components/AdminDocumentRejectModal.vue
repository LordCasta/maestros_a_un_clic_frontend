<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'

import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import type { VerificationDocument } from '@/shared/types/models'
import { BaseAlert, BaseButton, BaseModal, BaseTextarea } from '@/shared/ui'

import { useUpdateVerificationDocument } from '../queries'
import { rejectDocumentSchema, type RejectDocumentFormValues } from '../schemas'

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{
  document: VerificationDocument | null
}>()

const emit = defineEmits<{
  (e: 'rejected'): void
}>()

const toast = useToastStore()
const { mutateAsync } = useUpdateVerificationDocument()

const { defineField, errors, handleSubmit, isSubmitting, setErrors, resetForm } =
  useForm<RejectDocumentFormValues>({
    validationSchema: toTypedSchema(rejectDocumentSchema),
    initialValues: {
      rejection_reason: '',
    },
  })

const [rejection_reason, reasonAttrs] = defineField('rejection_reason')
const formError = ref('')

const onSubmit = handleSubmit(async (values) => {
  if (!props.document) {
    return
  }
  formError.value = ''

  try {
    const response = await mutateAsync({
      documentId: props.document.id,
      status: 'rejected',
      rejectionReason: values.rejection_reason,
    })
    toast.success(response.message ?? 'Documento rechazado.')
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
    title="Rechazar documento"
    description="Indica la razón por la que este documento no es aceptable (ejemplo: borroso, vencido, cortado)."
  >
    <form id="reject-document-form" class="space-y-4" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>

      <BaseTextarea
        v-model="rejection_reason"
        v-bind="reasonAttrs"
        label="Motivo del rechazo"
        placeholder="Ej. La imagen está borrosa o los números de identificación no son legibles..."
        :error="errors.rejection_reason"
        :rows="3"
        required
      />
    </form>

    <template #footer>
      <BaseButton variant="outline" @click="open = false">Cancelar</BaseButton>
      <BaseButton
        variant="danger"
        type="submit"
        form="reject-document-form"
        :loading="isSubmitting"
      >
        Rechazar documento
      </BaseButton>
    </template>
  </BaseModal>
</template>
