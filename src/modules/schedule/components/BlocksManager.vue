<script setup lang="ts">
import { CalendarOff, Trash2 } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'

import { applyServerErrors } from '@/shared/forms'
import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import type { AvailabilityBlock } from '@/shared/types/models'
import { BaseAlert, BaseButton, BaseCard, BaseInput } from '@/shared/ui'
import { formatDateTime, formatTime } from '@/shared/utils/format'

import { dateKey, toColombiaIso } from '../dates'
import { useAddBlock, useRemoveBlock } from '../queries'
import { blockSchema } from '../schemas'

/** HU003: horas marcadas como ocupadas (citas personales, vacaciones…). */
defineProps<{ blocks: AvailabilityBlock[] }>()

const toast = useToastStore()
const { mutateAsync: addBlock } = useAddBlock()
const { mutateAsync: removeBlock } = useRemoveBlock()
const today = dateKey(new Date())

const { defineField, errors, handleSubmit, isSubmitting, setErrors, resetForm } = useForm({
  validationSchema: toTypedSchema(blockSchema),
  initialValues: { date: today, start_time: '', end_time: '', reason: '' },
})
const [date, dateAttrs] = defineField('date')
const [startTime, startTimeAttrs] = defineField('start_time')
const [endTime, endTimeAttrs] = defineField('end_time')
const [reason, reasonAttrs] = defineField('reason')
const formError = ref('')

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    const response = await addBlock({
      starts_at: toColombiaIso(values.date, values.start_time),
      ends_at: toColombiaIso(values.date, values.end_time),
      reason: values.reason || undefined,
    })
    toast.success(response.message ?? 'Horas bloqueadas.')
    resetForm({ values: { date: values.date, start_time: '', end_time: '', reason: '' } })
  } catch (error) {
    // La API valida starts_at/ends_at; en el formulario son la hora de inicio y de fin.
    formError.value = applyServerErrors(error, (fields) =>
      setErrors({
        start_time: fields.starts_at ?? '',
        end_time: fields.ends_at ?? '',
        reason: fields.reason ?? '',
      }),
    )
  }
})

const removing = ref<number | null>(null)
async function onRemove(block: AvailabilityBlock) {
  removing.value = block.id
  try {
    const response = await removeBlock(block.id)
    toast.success(response.message ?? 'Bloqueo eliminado.')
  } catch (error) {
    toast.error(error instanceof ApiError ? error.message : 'No pudimos quitar el bloqueo.')
  } finally {
    removing.value = null
  }
}
</script>

<template>
  <BaseCard as="section" class="space-y-6">
    <div>
      <h2 class="text-xl font-black text-neutral-900">Horas ocupadas</h2>
      <p class="mt-1 text-sm text-neutral-500">
        Bloquea un rato dentro de tu horario para que nadie pueda reservarlo.
      </p>
    </div>

    <form class="space-y-4" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>
      <div class="grid gap-4 sm:grid-cols-[1.2fr_1fr_1fr]">
        <BaseInput
          v-model="date"
          v-bind="dateAttrs"
          type="date"
          label="Día"
          :min="today"
          :error="errors.date"
        />
        <BaseInput
          v-model="startTime"
          v-bind="startTimeAttrs"
          type="time"
          label="Desde"
          :error="errors.start_time"
        />
        <BaseInput
          v-model="endTime"
          v-bind="endTimeAttrs"
          type="time"
          label="Hasta"
          :error="errors.end_time"
        />
      </div>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
        <BaseInput
          v-model="reason"
          v-bind="reasonAttrs"
          label="Motivo (opcional, solo lo ves tú)"
          placeholder="Cita médica, vacaciones…"
          :error="errors.reason"
          class="flex-1"
        />
        <BaseButton type="submit" variant="outline" :loading="isSubmitting">
          <CalendarOff class="size-4" /> Bloquear
        </BaseButton>
      </div>
    </form>

    <p v-if="blocks.length === 0" class="rounded-2xl bg-surface-muted p-4 text-sm text-neutral-500">
      No tienes horas bloqueadas.
    </p>

    <ul v-else class="divide-y divide-neutral-100 rounded-2xl border border-neutral-100">
      <li v-for="block in blocks" :key="block.id" class="flex items-center gap-4 px-4 py-3">
        <CalendarOff class="size-5 shrink-0 text-neutral-400" />
        <div class="min-w-0 flex-1">
          <p class="font-semibold text-neutral-900">
            {{ formatDateTime(block.starts_at) }} – {{ formatTime(block.ends_at) }}
          </p>
          <p v-if="block.reason" class="truncate text-sm text-neutral-500">{{ block.reason }}</p>
        </div>
        <BaseButton
          variant="ghost"
          size="sm"
          :loading="removing === block.id"
          :aria-label="`Quitar bloqueo del ${formatDateTime(block.starts_at)}`"
          @click="onRemove(block)"
        >
          <Trash2 class="size-4" />
        </BaseButton>
      </li>
    </ul>
  </BaseCard>
</template>
