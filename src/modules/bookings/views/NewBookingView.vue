<script setup lang="ts">
import { ArrowLeft, CalendarDays, Clock3, MapPin, ShieldAlert, UserX } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth'
import { useCommunes } from '@/modules/catalog'
import { useProfessional } from '@/modules/professionals'
import { SlotPicker } from '@/modules/schedule'
import { applyServerErrors } from '@/shared/forms'
import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import {
  BaseAlert,
  BaseAvatar,
  BaseButton,
  BaseCard,
  BaseEmptyState,
  BaseInput,
  BaseRating,
  BaseSelect,
  BaseSkeleton,
  BaseTextarea,
} from '@/shared/ui'
import { formatDateTime, formatDuration, formatMoney, formatTime } from '@/shared/utils/format'

import { useCreateBooking } from '../queries'
import { bookingSchema } from '../schemas'

/**
 * HU004: el cliente elige servicio, día y hora libres (HU025) y envía la solicitud.
 * Llega desde el perfil del profesional: /client/bookings/new?professional=5&service=9
 */
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const professionalId = computed(() => Number(route.query.professional))
const { data: professional, isPending, error } = useProfessional(professionalId)
const { options: communeOptions } = useCommunes()
const { mutateAsync } = useCreateBooking()

const notFound = computed(() => error.value instanceof ApiError && error.value.status === 404)
const preselected = Number(route.query.service) || null

const { defineField, errors, handleSubmit, isSubmitting, setErrors, values } = useForm({
  validationSchema: toTypedSchema(bookingSchema),
  initialValues: {
    professional_service_id: preselected ?? undefined,
    address: auth.user?.address ?? '',
    commune_id: auth.user?.commune?.id ?? null,
  },
})
const [serviceId, serviceIdAttrs] = defineField('professional_service_id')
const [address, addressAttrs] = defineField('address')
const [communeId, communeIdAttrs] = defineField('commune_id')
const [description, descriptionAttrs] = defineField('description')
const { value: startsAt, errorMessage: startsAtError } = useField<string | null>('starts_at')

const serviceOptions = computed(() =>
  (professional.value?.services ?? []).map((service) => ({
    value: service.id,
    label: `${service.title} · ${formatMoney(service.price)}`,
  })),
)
const selectedService = computed(() =>
  professional.value?.services?.find((service) => service.id === values.professional_service_id),
)

const endsAt = computed(() =>
  startsAt.value && selectedService.value
    ? new Date(
        new Date(startsAt.value).getTime() +
          selectedService.value.estimated_duration_minutes * 60_000,
      ).toISOString()
    : null,
)

const formError = ref('')

const onSubmit = handleSubmit(async (form) => {
  formError.value = ''
  try {
    const response = await mutateAsync({
      ...form,
      description: form.description || undefined,
    })
    toast.success(response.message ?? 'Solicitud de reserva enviada.')
    await router.push({ name: 'client-booking-detail', params: { id: response.data.id } })
  } catch (failure) {
    formError.value = applyServerErrors(failure, setErrors)
    // 409: alguien tomó la hora; las horas libres ya se refrescaron.
    if (failure instanceof ApiError && failure.status === 409) startsAt.value = null
  }
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <BaseButton
      variant="ghost"
      size="sm"
      :to="
        professional
          ? { name: 'professional-detail', params: { id: professional.id } }
          : { name: 'search' }
      "
      class="mb-6"
    >
      <ArrowLeft class="size-4" /> Volver al perfil
    </BaseButton>

    <div v-if="isPending" class="grid gap-8 lg:grid-cols-[1fr_340px]">
      <BaseSkeleton class="h-96" />
      <BaseSkeleton class="h-64" />
    </div>

    <BaseEmptyState
      v-else-if="notFound || !professionalId"
      :icon="UserX"
      title="Este profesional no está disponible"
      description="Puede que ya no esté verificado o que su cuenta no esté activa."
    >
      <BaseButton :to="{ name: 'search' }">Buscar profesionales</BaseButton>
    </BaseEmptyState>

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar el profesional">{{
      error.message
    }}</BaseAlert>

    <form
      v-else-if="professional"
      class="grid gap-8 lg:grid-cols-[1fr_340px]"
      novalidate
      @submit="onSubmit"
    >
      <div class="space-y-6">
        <header>
          <h1 class="text-3xl font-black text-neutral-900">Solicitar reserva</h1>
          <p class="mt-1 text-neutral-500">
            Elige el servicio y una hora libre. {{ professional.name }} confirmará si puede
            atenderte.
          </p>
        </header>

        <BaseAlert
          v-if="!auth.isVerified"
          tone="warning"
          title="Tu identidad aún no está verificada"
        >
          <span class="inline-flex items-start gap-2">
            <ShieldAlert class="mt-0.5 size-4 shrink-0" />
            Puedes revisar la agenda, pero para enviar la solicitud el equipo debe aprobar tus
            documentos de identidad.
          </span>
        </BaseAlert>

        <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>

        <BaseCard as="section" class="space-y-6">
          <BaseSelect
            v-model="serviceId"
            v-bind="serviceIdAttrs"
            label="Servicio"
            placeholder="Elige un servicio"
            :options="serviceOptions"
            :error="errors.professional_service_id"
          />

          <SlotPicker
            v-model="startsAt"
            :professional-id="professional.id"
            :service-id="values.professional_service_id ?? null"
            :error="startsAtError"
          />
        </BaseCard>

        <BaseCard as="section" class="space-y-5">
          <h2 class="text-lg font-black text-neutral-900">¿Dónde y qué necesitas?</h2>
          <BaseInput
            v-model="address"
            v-bind="addressAttrs"
            label="Dirección"
            autocomplete="street-address"
            placeholder="Calle 10 # 43-20, apto 301"
            :error="errors.address"
          >
            <template #icon><MapPin /></template>
          </BaseInput>
          <BaseSelect
            v-model="communeId"
            v-bind="communeIdAttrs"
            label="Comuna o corregimiento"
            placeholder="Elige tu comuna"
            :options="communeOptions"
            :error="errors.commune_id"
          />
          <BaseTextarea
            v-model="description"
            v-bind="descriptionAttrs"
            label="Describe el trabajo (opcional)"
            :rows="4"
            :max-length="2000"
            placeholder="Cuéntale al profesional qué pasa, para que llegue preparado."
            :error="errors.description"
          />
        </BaseCard>
      </div>

      <aside>
        <BaseCard as="section" class="sticky top-24 space-y-5">
          <div class="flex items-center gap-3">
            <BaseAvatar :name="professional.name" :src="professional.avatar_url" />
            <div>
              <p class="font-bold text-neutral-900">{{ professional.name }}</p>
              <BaseRating :rating="professional.rating" />
            </div>
          </div>

          <dl class="space-y-3 border-t border-neutral-100 pt-5 text-sm">
            <div class="flex justify-between gap-4">
              <dt class="text-neutral-500">Servicio</dt>
              <dd class="text-right font-semibold text-neutral-900">
                {{ selectedService?.title ?? '—' }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="inline-flex items-center gap-1 text-neutral-500">
                <CalendarDays class="size-4" /> Fecha
              </dt>
              <dd class="text-right font-semibold text-neutral-900">
                <template v-if="startsAt && endsAt">
                  {{ formatDateTime(startsAt) }}
                  <span class="block text-xs font-medium text-neutral-500">
                    hasta las {{ formatTime(endsAt) }}
                  </span>
                </template>
                <template v-else>—</template>
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="inline-flex items-center gap-1 text-neutral-500">
                <Clock3 class="size-4" /> Duración
              </dt>
              <dd class="font-semibold text-neutral-900">
                {{
                  selectedService ? formatDuration(selectedService.estimated_duration_minutes) : '—'
                }}
              </dd>
            </div>
            <div class="flex justify-between gap-4 border-t border-neutral-100 pt-3">
              <dt class="text-neutral-500">Precio</dt>
              <dd class="text-lg font-black text-primary-700">
                {{ selectedService ? formatMoney(selectedService.price) : '—' }}
                <span
                  v-if="selectedService?.price_type === 'hourly'"
                  class="block text-right text-xs font-medium text-neutral-500"
                  >por hora</span
                >
              </dd>
            </div>
          </dl>

          <BaseButton
            type="submit"
            block
            size="lg"
            :loading="isSubmitting"
            :disabled="!auth.isVerified"
          >
            Enviar solicitud
          </BaseButton>
          <p class="text-xs text-neutral-500">
            No se cobra nada ahora. La reserva queda pendiente hasta que el profesional la acepte;
            te avisaremos al instante.
          </p>
        </BaseCard>
      </aside>
    </form>
  </div>
</template>
