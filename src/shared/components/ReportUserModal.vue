<script setup lang="ts">
import { AlertTriangle, Flag } from '@lucide/vue'
import { ref } from 'vue'

import { http } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import type { ApiSuccess } from '@/shared/types/api'
import type { Report } from '@/shared/types/models'
import { BaseAlert, BaseButton, BaseModal, BaseSelect, BaseTextarea } from '@/shared/ui'

const props = defineProps<{
  open: boolean
  reportedUserId: number
  reportedUserName: string
  bookingId?: number | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const toast = useToastStore()

const REASON_OPTIONS = [
  { value: 'Incumplimiento de horario', label: 'Incumplimiento de horario' },
  { value: 'Cobro indebido o por fuera', label: 'Cobro indebido o por fuera de la plataforma' },
  { value: 'Conducta inapropiada', label: 'Conducta inapropiada o falta de respeto' },
  { value: 'Trabajo no completado o daño', label: 'Trabajo no completado o daño' },
  { value: 'Sospecha de fraude', label: 'Sospecha de fraude o perfil falso' },
  { value: 'Otro motivo', label: 'Otro motivo' },
]

const reason = ref('')
const description = ref('')
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

function close() {
  reason.value = ''
  description.value = ''
  errorMessage.value = null
  emit('update:open', false)
}

async function handleSubmit() {
  if (!reason.value) {
    errorMessage.value = 'Por favor selecciona un motivo.'
    return
  }

  if (!description.value || description.value.trim().length < 10) {
    errorMessage.value = 'La descripción debe tener al menos 10 caracteres explicando lo sucedido.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  try {
    await http.post<ApiSuccess<Report>>('/reports', {
      reported_user_id: props.reportedUserId,
      booking_id: props.bookingId || null,
      reason: reason.value,
      description: description.value.trim(),
    })

    toast.success('Reporte enviado. Nuestro equipo de moderación revisará el caso.')
    close()
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Error al enviar el reporte.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <BaseModal
    :open="open"
    :title="`Reportar a ${reportedUserName}`"
    @update:open="emit('update:open', $event)"
  >
    <div class="space-y-4">
      <BaseAlert tone="warning">
        <template #icon>
          <AlertTriangle class="size-5" />
        </template>
        Los reportes son revisados por el equipo administrativo. Si hubo alguna falta grave, se
        tomarán medidas sobre la cuenta.
      </BaseAlert>

      <BaseSelect
        v-model="reason"
        label="Motivo del reporte"
        placeholder="Selecciona el motivo"
        :options="REASON_OPTIONS"
        required
      />

      <BaseTextarea
        v-model="description"
        label="Detalles de lo sucedido"
        placeholder="Describe detalladamente qué ocurrió (mínimo 10 caracteres)..."
        :rows="4"
        required
      />

      <BaseAlert v-if="errorMessage" tone="danger">
        {{ errorMessage }}
      </BaseAlert>

      <div class="mt-6 flex justify-end gap-3">
        <BaseButton variant="secondary" :disabled="isSubmitting" @click="close">
          Cancelar
        </BaseButton>

        <BaseButton variant="danger" :loading="isSubmitting" @click="handleSubmit">
          <Flag class="size-4" />
          Enviar reporte
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
