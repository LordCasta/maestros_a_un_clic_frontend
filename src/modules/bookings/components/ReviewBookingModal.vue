<script setup lang="ts">
import { Star } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'

import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import { BaseAlert, BaseButton, BaseModal, BaseTextarea } from '@/shared/ui'

import { useReviewBooking } from '../queries'
import { reviewSchema } from '../schemas'

/** HU005: calificación recíproca tras finalizar el servicio. */
const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{
  bookingId: number
  counterpartName: string
}>()

const emit = defineEmits<{
  (e: 'reviewed'): void
}>()

const toast = useToastStore()
const { mutateAsync } = useReviewBooking()

const { defineField, errors, handleSubmit, isSubmitting, setErrors, resetForm } =
  useForm({
    validationSchema: toTypedSchema(reviewSchema),
    initialValues: {
      rating: 5,
      comment: '',
    },
  })

const [rating, ratingAttrs] = defineField('rating')
const [comment, commentAttrs] = defineField('comment')
const formError = ref('')
const hoverRating = ref<number | null>(null)

const activeRating = computed(() => hoverRating.value ?? rating.value ?? 0)

const RATING_LABELS: Record<number, string> = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente',
}

const currentLabel = computed(
  () => RATING_LABELS[activeRating.value] ?? 'Selecciona una calificación',
)

function selectRating(value: number) {
  rating.value = value
}

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    const response = await mutateAsync({
      id: props.bookingId,
      rating: values.rating,
      comment: values.comment?.trim() ? values.comment.trim() : null,
    })
    toast.success(response.message ?? '¡Calificación enviada correctamente!')
    open.value = false
    resetForm()
    emit('reviewed')
  } catch (error) {
    formError.value = applyServerErrors(error, setErrors)
  }
})
</script>

<template>
  <BaseModal
    v-model:open="open"
    title="Calificar servicio"
    :description="`Cuéntanos tu experiencia con ${counterpartName}. Tu calificación ayuda a mantener la calidad y confianza en la comunidad.`"
  >
    <form id="review-booking" class="space-y-5" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>
      <input v-model.number="rating" type="hidden" v-bind="ratingAttrs" />

      <div>
        <label class="block text-sm font-semibold text-neutral-800">
          Calificación general <span class="text-danger-600">*</span>
        </label>
        <div class="mt-2 flex items-center gap-2">
          <div class="flex items-center gap-1" @mouseleave="hoverRating = null">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="rounded-lg p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
              :aria-label="`${star} estrellas`"
              @mouseenter="hoverRating = star"
              @click="selectRating(star)"
            >
              <Star
                class="size-8 transition-colors"
                :class="
                  star <= activeRating
                    ? 'fill-warning-400 text-warning-400'
                    : 'fill-transparent text-neutral-300'
                "
              />
            </button>
          </div>
          <span class="text-sm font-bold text-neutral-700">
            {{ currentLabel }}
          </span>
        </div>
        <p v-if="errors.rating" class="mt-1 text-sm text-danger-600">
          {{ errors.rating }}
        </p>
      </div>

      <BaseTextarea
        v-model="comment"
        v-bind="commentAttrs"
        label="Comentario (opcional)"
        :rows="3"
        :max-length="1000"
        placeholder="Escribe un comentario sobre la atención, puntualidad o calidad del trabajo..."
        :error="errors.comment"
      />
    </form>

    <template #footer>
      <BaseButton variant="outline" @click="open = false">Cancelar</BaseButton>
      <BaseButton type="submit" form="review-booking" :loading="isSubmitting">
        Enviar calificación
      </BaseButton>
    </template>
  </BaseModal>
</template>
