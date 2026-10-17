<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'

import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import type { VerificationDocument } from '@/shared/types/models'
import { BaseAlert, BaseButton, BaseFileInput, BaseInput, BaseModal } from '@/shared/ui'

import { useReplaceVerificationDocument } from '../queries'
import { replaceDocumentSchema, type ReplaceDocumentFormValues } from '../schemas'

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{
  document: VerificationDocument | null
}>()

const emit = defineEmits<{
  (e: 'replaced'): void
}>()

const toast = useToastStore()
const { mutateAsync } = useReplaceVerificationDocument()

const { defineField, errors, handleSubmit, isSubmitting, setErrors, resetForm, setFieldValue } =
  useForm<ReplaceDocumentFormValues>({
    validationSchema: toTypedSchema(replaceDocumentSchema),
    initialValues: {
      file: null as unknown as File,
      title: '',
    },
  })

const [file] = defineField('file')
const [title, titleAttrs] = defineField('title')
const formError = ref('')

watch(
  () => props.document,
  (doc) => {
    if (doc) {
      setFieldValue('title', doc.title ?? '')
    }
  },
  { immediate: true },
)

const onSubmit = handleSubmit(async (values) => {
  if (!props.document) {
    return
  }
  formError.value = ''

  const formData = new FormData()
  formData.append('file', values.file)
  if (values.title) {
    formData.append('title', values.title)
  }

  try {
    const response = await mutateAsync({
      documentId: props.document.id,
      formData,
    })
    toast.success(response.message ?? 'Documento reemplazado.')
    open.value = false
    resetForm()
    emit('replaced')
  } catch (error) {
    formError.value = applyServerErrors(error, setErrors)
  }
})
</script>

<template>
  <BaseModal
    v-model:open="open"
    title="Reemplazar documento rechazado"
    description="Sube una nueva versión clara y legible de este documento para reenviar tu solicitud."
  >
    <form id="replace-document-form" class="space-y-4" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>

      <BaseAlert
        v-if="document?.rejection_reason"
        tone="warning"
        title="Motivo del rechazo anterior"
      >
        {{ document.rejection_reason }}
      </BaseAlert>

      <BaseInput
        v-model="title"
        v-bind="titleAttrs"
        label="Título o descripción del documento (opcional)"
        placeholder="Ej. Cédula de ciudadanía legible"
        :error="errors.title"
      />

      <BaseFileInput
        v-model="file"
        label="Nuevo archivo"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        hint="Formatos permitidos: JPG, PNG, WEBP o PDF (máx. 10 MB)"
        :error="errors.file"
      />
    </form>

    <template #footer>
      <BaseButton variant="outline" @click="open = false">Cancelar</BaseButton>
      <BaseButton
        variant="primary"
        type="submit"
        form="replace-document-form"
        :loading="isSubmitting"
      >
        Subir y reenviar
      </BaseButton>
    </template>
  </BaseModal>
</template>
