<script setup lang="ts">
import { LocateFixed, MapPin } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'

import { useCommunes } from '@/modules/catalog'
import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import type { MyProfessionalProfile } from '@/shared/types/models'
import { BaseAlert, BaseButton, BaseCard, BaseInput, BaseSelect, BaseTextarea } from '@/shared/ui'

import { useUpdateProfile } from '../queries'
import { profileSchema } from '../schemas'

/**
 * HU009: descripción, experiencia, tarifa y ubicación. La ubicación define en qué zona aparece
 * el profesional en las búsquedas (HU002).
 */
const props = defineProps<{ profile: MyProfessionalProfile }>()

const toast = useToastStore()
const { options: communeOptions } = useCommunes()
const { mutateAsync } = useUpdateProfile()

const { defineField, errors, handleSubmit, isSubmitting, setErrors, meta } = useForm({
  validationSchema: toTypedSchema(profileSchema),
  initialValues: {
    description: props.profile.description ?? '',
    experience_years: props.profile.experience_years,
    hourly_rate: props.profile.hourly_rate ?? undefined,
    service_radius_km: props.profile.service_radius_km ?? 10,
    commune_id: props.profile.commune?.id ?? null,
    address: props.profile.address ?? '',
  },
})
const [description, descriptionAttrs] = defineField('description')
const [experience, experienceAttrs] = defineField('experience_years')
const [hourlyRate, hourlyRateAttrs] = defineField('hourly_rate')
const [radius, radiusAttrs] = defineField('service_radius_km')
const [communeId, communeIdAttrs] = defineField('commune_id')
const [address, addressAttrs] = defineField('address')

const coordinates = ref(
  props.profile.latitude !== null && props.profile.longitude !== null
    ? { latitude: props.profile.latitude, longitude: props.profile.longitude }
    : null,
)
const coordinatesChanged = ref(false)
const locating = ref(false)
const formError = ref('')

function useCurrentLocation() {
  if (!('geolocation' in navigator)) {
    toast.error('Tu navegador no permite obtener la ubicación.')
    return
  }
  locating.value = true
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      coordinates.value = {
        latitude: Number(coords.latitude.toFixed(6)),
        longitude: Number(coords.longitude.toFixed(6)),
      }
      coordinatesChanged.value = true
      locating.value = false
    },
    () => {
      toast.error('No pudimos obtener tu ubicación. Revisa los permisos del navegador.')
      locating.value = false
    },
  )
}

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    const response = await mutateAsync({
      ...values,
      description: values.description || null,
      address: values.address || null,
      ...(coordinatesChanged.value && coordinates.value ? coordinates.value : {}),
    })
    coordinatesChanged.value = false
    toast.success(response.message ?? 'Perfil actualizado.')
  } catch (error) {
    formError.value = applyServerErrors(error, setErrors)
  }
})
</script>

<template>
  <BaseCard as="section">
    <form class="space-y-5" novalidate @submit="onSubmit">
      <div>
        <h2 class="text-xl font-black text-neutral-900">Sobre ti</h2>
        <p class="mt-1 text-sm text-neutral-500">
          Esto lo ven los clientes en tu perfil. Solo se guardan los cambios que hagas.
        </p>
      </div>

      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>

      <BaseTextarea
        v-model="description"
        v-bind="descriptionAttrs"
        label="Descripción"
        :rows="5"
        :max-length="2000"
        placeholder="Cuéntales a los clientes tu experiencia, cómo trabajas y qué te diferencia."
        :error="errors.description"
      />

      <div class="grid gap-4 sm:grid-cols-3">
        <BaseInput
          v-model="experience"
          v-bind="experienceAttrs"
          type="number"
          min="0"
          max="70"
          label="Años de experiencia"
          :error="errors.experience_years"
        />
        <BaseInput
          v-model="hourlyRate"
          v-bind="hourlyRateAttrs"
          type="number"
          min="1"
          step="1000"
          label="Tarifa por hora (COP)"
          :error="errors.hourly_rate"
        />
        <BaseInput
          v-model="radius"
          v-bind="radiusAttrs"
          type="number"
          min="1"
          max="100"
          label="Radio de servicio (km)"
          :error="errors.service_radius_km"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <BaseSelect
          v-model="communeId"
          v-bind="communeIdAttrs"
          label="Comuna o corregimiento"
          placeholder="Elige tu zona"
          :options="communeOptions"
          :error="errors.commune_id"
        />
        <BaseInput
          v-model="address"
          v-bind="addressAttrs"
          label="Dirección (no es pública)"
          autocomplete="street-address"
          :error="errors.address"
        >
          <template #icon><MapPin /></template>
        </BaseInput>
      </div>

      <div
        class="flex flex-col gap-3 rounded-2xl bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-sm text-neutral-600">
          <template v-if="coordinates">
            Ubicación para búsquedas por cercanía: {{ coordinates.latitude }},
            {{ coordinates.longitude }}<span v-if="coordinatesChanged"> (sin guardar)</span>
          </template>
          <template v-else>
            Agrega tu ubicación para aparecer en las búsquedas por cercanía.
          </template>
        </p>
        <BaseButton variant="outline" size="sm" :loading="locating" @click="useCurrentLocation">
          <LocateFixed class="size-4" /> Usar mi ubicación actual
        </BaseButton>
      </div>

      <div class="flex justify-end">
        <BaseButton
          type="submit"
          :loading="isSubmitting"
          :disabled="!meta.dirty && !coordinatesChanged"
        >
          Guardar perfil
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>
