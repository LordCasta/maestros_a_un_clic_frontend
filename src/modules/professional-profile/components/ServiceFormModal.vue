<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'

import { useCategories } from '@/modules/catalog'
import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import type { ProfessionalService } from '@/shared/types/models'
import { BaseAlert, BaseButton, BaseInput, BaseModal, BaseSelect, BaseTextarea } from '@/shared/ui'
import { formatDuration } from '@/shared/utils/format'

import { useSaveService } from '../queries'
import { DURATION_OPTIONS, serviceSchema } from '../schemas'

/**
 * HU009, HU047: crear o editar un servicio. La duración estimada define cuánto ocupa la reserva
 * en la agenda y la ve el cliente antes de reservar.
 */
const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ service: ProfessionalService | null; specialtyIds: number[] }>()

const toast = useToastStore()
const { data: categories } = useCategories()
const { mutateAsync } = useSaveService()

// Solo subcategorías de sus especialidades (el backend también lo exige).
const categoryOptions = computed(() =>
  (categories.value ?? [])
    .filter((root) => props.specialtyIds.includes(root.id))
    .flatMap((root) =>
      (root.children ?? []).map((child) => ({
        value: child.id,
        label: `${root.name} · ${child.name}`,
      })),
    ),
)
const durationOptions = computed(() => {
  const current = props.service?.estimated_duration_minutes
  const values =
    current && !DURATION_OPTIONS.includes(current)
      ? [...DURATION_OPTIONS, current]
      : DURATION_OPTIONS
  return [...values]
    .sort((a, b) => a - b)
    .map((minutes) => ({ value: minutes, label: formatDuration(minutes) }))
})
const PRICE_TYPES = [
  { value: 'fixed', label: 'Precio fijo' },
  { value: 'hourly', label: 'Por hora' },
]

const { defineField, errors, handleSubmit, isSubmitting, setErrors, resetForm } = useForm({
  validationSchema: toTypedSchema(serviceSchema),
})
const [categoryId, categoryIdAttrs] = defineField('category_id')
const [title, titleAttrs] = defineField('title')
const [description, descriptionAttrs] = defineField('description')
const [priceType, priceTypeAttrs] = defineField('price_type')
const [price, priceAttrs] = defineField('price')
const [duration, durationAttrs] = defineField('estimated_duration_minutes')
const formError = ref('')

watch(open, (isOpen) => {
  if (!isOpen) return
  formError.value = ''
  const service = props.service
  resetForm({
    values: service
      ? {
          category_id: service.category?.id,
          title: service.title,
          description: service.description ?? '',
          price_type: service.price_type,
          price: service.price,
          estimated_duration_minutes: service.estimated_duration_minutes,
        }
      : { price_type: 'fixed', estimated_duration_minutes: 60, description: '' },
  })
})

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    const response = await mutateAsync({
      id: props.service?.id,
      payload: { ...values, description: values.description || null },
    })
    toast.success(response.message ?? 'Servicio guardado.')
    open.value = false
  } catch (failure) {
    formError.value = applyServerErrors(failure, setErrors)
  }
})
</script>

<template>
  <BaseModal
    v-model:open="open"
    size="lg"
    :title="service ? 'Editar servicio' : 'Nuevo servicio'"
    description="Lo que el cliente ve al elegir qué reservar."
  >
    <form id="service-form" class="space-y-4" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>
      <BaseAlert v-if="categoryOptions.length === 0" tone="warning">
        Primero agrega una especialidad en Mi perfil.
      </BaseAlert>
      <BaseSelect
        v-model="categoryId"
        v-bind="categoryIdAttrs"
        label="Categoría"
        placeholder="Elige la categoría"
        :options="categoryOptions"
        :error="errors.category_id"
      />
      <BaseInput
        v-model="title"
        v-bind="titleAttrs"
        label="Nombre del servicio"
        placeholder="Reparación de fugas"
        :error="errors.title"
      />
      <BaseTextarea
        v-model="description"
        v-bind="descriptionAttrs"
        label="Descripción (opcional)"
        :rows="3"
        :max-length="1000"
        placeholder="Qué incluye, materiales, condiciones…"
        :error="errors.description"
      />
      <div class="grid gap-4 sm:grid-cols-3">
        <BaseSelect
          v-model="priceType"
          v-bind="priceTypeAttrs"
          label="Tipo de precio"
          :options="PRICE_TYPES"
          :error="errors.price_type"
        />
        <BaseInput
          v-model="price"
          v-bind="priceAttrs"
          type="number"
          min="1"
          step="1000"
          label="Precio (COP)"
          :error="errors.price"
        />
        <BaseSelect
          v-model="duration"
          v-bind="durationAttrs"
          label="Duración estimada"
          :options="durationOptions"
          :error="errors.estimated_duration_minutes"
        />
      </div>
    </form>
    <template #footer>
      <BaseButton variant="outline" @click="open = false">Cancelar</BaseButton>
      <BaseButton type="submit" form="service-form" :loading="isSubmitting">
        {{ service ? 'Guardar cambios' : 'Crear servicio' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
