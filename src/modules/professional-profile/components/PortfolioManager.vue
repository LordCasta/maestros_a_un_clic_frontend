<script setup lang="ts">
import { ImagePlus, Trash2 } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'

import { applyServerErrors } from '@/shared/forms'
import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import type { PortfolioItem } from '@/shared/types/models'
import {
  BaseAlert,
  BaseButton,
  BaseCard,
  BaseFileInput,
  BaseInput,
  BaseSkeleton,
  ImageWithFallback,
} from '@/shared/ui'

import { useAddPortfolioItem, useMyPortfolio, useRemovePortfolioItem } from '../queries'
import { portfolioSchema } from '../schemas'

/** HU009: galería de trabajos realizados (se ve en el perfil público). Máximo 12 fotos. */
const LIMIT = 12

const toast = useToastStore()
const { data: items, isPending, error } = useMyPortfolio()
const { mutateAsync: add } = useAddPortfolioItem()
const { mutateAsync: remove } = useRemovePortfolioItem()

const { defineField, errors, handleSubmit, isSubmitting, setErrors, resetForm } = useForm({
  validationSchema: toTypedSchema(portfolioSchema),
  initialValues: { image: undefined, description: '' },
})
const { value: image } = useField<File | null>('image')
const [description, descriptionAttrs] = defineField('description')
const formError = ref('')

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    const response = await add({
      image: values.image,
      description: values.description || undefined,
    })
    toast.success(response.message ?? 'Foto agregada.')
    resetForm()
  } catch (failure) {
    formError.value = applyServerErrors(failure, setErrors)
  }
})

const removing = ref<number | null>(null)
async function onRemove(item: PortfolioItem) {
  removing.value = item.id
  try {
    const response = await remove(item.id)
    toast.success(response.message ?? 'Foto eliminada.')
  } catch (failure) {
    toast.error(failure instanceof ApiError ? failure.message : 'No pudimos borrar la foto.')
  } finally {
    removing.value = null
  }
}
</script>

<template>
  <BaseCard as="section" class="space-y-5">
    <div>
      <h2 class="text-xl font-black text-neutral-900">Portafolio</h2>
      <p class="mt-1 text-sm text-neutral-500">
        Fotos de trabajos que hiciste. Aparecen en la galería de tu perfil.
      </p>
    </div>

    <div v-if="isPending" class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <BaseSkeleton v-for="n in 4" :key="n" class="aspect-square" />
    </div>

    <BaseAlert v-else-if="error" tone="danger">No pudimos cargar tu portafolio.</BaseAlert>

    <template v-else>
      <ul v-if="items?.length" class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <li v-for="item in items" :key="item.id" class="group relative">
          <ImageWithFallback
            :src="item.image_url"
            :alt="item.description ?? 'Trabajo realizado'"
            class="aspect-square w-full rounded-2xl"
          />
          <p v-if="item.description" class="mt-1 truncate text-xs text-neutral-500">
            {{ item.description }}
          </p>
          <BaseButton
            variant="secondary"
            size="sm"
            class="absolute top-2 right-2"
            :loading="removing === item.id"
            :aria-label="`Borrar la foto ${item.description ?? ''}`"
            @click="onRemove(item)"
          >
            <Trash2 class="size-4" />
          </BaseButton>
        </li>
      </ul>
      <p v-else class="rounded-2xl bg-surface-muted p-4 text-sm text-neutral-500">
        Todavía no tienes fotos. Los perfiles con trabajos a la vista reciben más solicitudes.
      </p>

      <form
        v-if="(items?.length ?? 0) < LIMIT"
        class="space-y-4 border-t border-neutral-100 pt-5"
        novalidate
        @submit="onSubmit"
      >
        <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseFileInput
            v-model="image"
            label="Foto"
            accept="image/jpeg,image/png,image/webp"
            hint="JPG, PNG o WEBP, hasta 5 MB."
            :error="errors.image"
          />
          <BaseInput
            v-model="description"
            v-bind="descriptionAttrs"
            label="Descripción (opcional)"
            placeholder="Baño remodelado en Laureles"
            :error="errors.description"
          />
        </div>
        <div class="flex justify-end">
          <BaseButton type="submit" variant="outline" :loading="isSubmitting">
            <ImagePlus class="size-4" /> Agregar foto
          </BaseButton>
        </div>
      </form>
      <p v-else class="text-sm text-neutral-500">
        Llegaste al máximo de {{ LIMIT }} fotos. Borra alguna para subir otra.
      </p>
    </template>
  </BaseCard>
</template>
