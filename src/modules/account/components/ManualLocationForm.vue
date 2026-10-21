<script setup lang="ts">
import { Compass, Locate, MapPin, Navigation, Sparkles } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'

import { useAuthStore } from '@/modules/auth'
import { useCommunes } from '@/modules/catalog'
import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import { BaseAlert, BaseButton, BaseInput, BaseSelect, GoogleMapsEmbed } from '@/shared/ui'

import { useUpdateLocation } from '../queries'
import { updateLocationSchema } from '../schemas'

const auth = useAuthStore()
const toast = useToastStore()
const { options: communeOptions } = useCommunes()
const { mutateAsync: updateLocation } = useUpdateLocation()

const formError = ref('')
const geoMessage = ref('')
const isDetectingGeo = ref(false)

const { defineField, errors, handleSubmit, isSubmitting, setErrors, setFieldValue } = useForm({
  validationSchema: toTypedSchema(updateLocationSchema),
  initialValues: {
    address: auth.user?.address ?? '',
    commune_id: auth.user?.commune?.id ?? null,
    latitude: auth.user?.latitude ?? null,
    longitude: auth.user?.longitude ?? null,
  },
})

const [address, addressAttrs] = defineField('address')
const [communeId, communeIdAttrs] = defineField('commune_id')
const [latitude] = defineField('latitude')
const [longitude] = defineField('longitude')

const selectedCommuneName = computed(() => {
  if (!communeId.value) return null
  const found = communeOptions.value.find((opt) => opt.value === communeId.value)
  return found?.label ?? null
})

const mapQuery = computed(() => {
  if (address.value && selectedCommuneName.value) {
    return `${address.value}, ${selectedCommuneName.value}, Medellín`
  }
  if (address.value) {
    return `${address.value}, Medellín`
  }
  if (selectedCommuneName.value) {
    return `${selectedCommuneName.value}, Medellín`
  }
  return null
})

function detectCoordinates() {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    geoMessage.value = 'Tu navegador no soporta geolocalización automática.'
    return
  }

  isDetectingGeo.value = true
  geoMessage.value = ''

  navigator.geolocation.getCurrentPosition(
    (position) => {
      isDetectingGeo.value = false
      const lat = Math.round(position.coords.latitude * 100000) / 100000
      const lng = Math.round(position.coords.longitude * 100000) / 100000
      setFieldValue('latitude', lat)
      setFieldValue('longitude', lng)
      geoMessage.value = 'Coordenadas GPS obtenidas correctamente.'
    },
    (err) => {
      isDetectingGeo.value = false
      if (err.code === err.PERMISSION_DENIED) {
        geoMessage.value = 'Permiso denegado. Puedes ingresar tu dirección y comuna manualmente.'
      } else {
        geoMessage.value = 'No se pudo obtener la posición. Ingresa tu ubicación manualmente.'
      }
    },
    { enableHighAccuracy: true, timeout: 10000 },
  )
}

function clearCoordinates() {
  setFieldValue('latitude', null)
  setFieldValue('longitude', null)
  geoMessage.value = ''
}

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    const payload = {
      address: values.address?.trim() || null,
      commune_id: values.commune_id ? Number(values.commune_id) : null,
      latitude: values.latitude ?? null,
      longitude: values.longitude ?? null,
    }

    const response = await updateLocation(payload)
    if (response.data) {
      await auth.refreshUser()
    }
    toast.success(response.message || 'Ubicación actualizada correctamente.')
  } catch (error) {
    formError.value = applyServerErrors(error, setErrors)
  }
})
</script>

<template>
  <form class="space-y-6" novalidate @submit="onSubmit">
    <BaseAlert v-if="formError" tone="danger">
      {{ formError }}
    </BaseAlert>

    <div class="rounded-3xl border border-neutral-200 bg-surface p-6 shadow-card space-y-6">
      <div class="flex items-center gap-3">
        <div
          class="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"
        >
          <MapPin class="size-5" />
        </div>
        <div>
          <h2 class="text-xl font-black text-neutral-900">Ubicación manual</h2>
          <p class="text-sm text-neutral-500">
            Ingresa tu comuna o dirección para buscar profesionales cercanos sin depender del GPS.
          </p>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <BaseSelect
          v-model="communeId"
          v-bind="communeIdAttrs"
          label="Comuna o corregimiento"
          :options="communeOptions"
          placeholder="Selecciona tu comuna"
          :error="errors.commune_id"
        />

        <BaseInput
          v-model="address"
          v-bind="addressAttrs"
          label="Dirección o punto de referencia"
          placeholder="Ej: Calle 10 # 43E-12, El Poblado"
          :error="errors.address"
        >
          <template #icon>
            <Navigation class="size-4.5 text-neutral-400" />
          </template>
        </BaseInput>
      </div>

      <!-- Coordenadas opcionales -->
      <div class="rounded-2xl border border-neutral-100 bg-surface-muted p-4 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <Compass class="size-4 text-primary-600" />
            <span class="text-sm font-semibold text-neutral-800"
              >Coordenadas geográficas (opcional)</span
            >
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              :disabled="isDetectingGeo"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-800 disabled:opacity-50"
              @click="detectCoordinates"
            >
              <Locate class="size-3.5" :class="{ 'animate-spin': isDetectingGeo }" />
              {{ isDetectingGeo ? 'Detectando...' : 'Obtener del GPS' }}
            </button>
            <button
              v-if="latitude !== null || longitude !== null"
              type="button"
              class="text-xs text-neutral-400 hover:text-neutral-600 ml-2"
              @click="clearCoordinates"
            >
              Limpiar
            </button>
          </div>
        </div>

        <p v-if="geoMessage" class="text-xs text-neutral-600">
          {{ geoMessage }}
        </p>

        <div
          v-if="latitude !== null && longitude !== null"
          class="flex flex-wrap items-center gap-4 text-xs text-neutral-600"
        >
          <span class="rounded-lg bg-surface px-2.5 py-1 border border-neutral-200 font-mono">
            Lat: {{ latitude }}
          </span>
          <span class="rounded-lg bg-surface px-2.5 py-1 border border-neutral-200 font-mono">
            Lng: {{ longitude }}
          </span>
        </div>
      </div>

      <!-- Mapa interactivo de referencia -->
      <div class="space-y-2">
        <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Vista previa del mapa
        </span>
        <GoogleMapsEmbed
          title="Ubicación de referencia"
          :query="mapQuery"
          :lat="latitude"
          :lng="longitude"
          height="h-56"
          description="Referencia geográfica guardada para calcular distancias con los profesionales."
        />
      </div>

      <div class="flex items-center justify-end pt-2">
        <BaseButton type="submit" tone="primary" size="lg" :is-loading="isSubmitting">
          <Sparkles class="size-4" />
          Guardar ubicación
        </BaseButton>
      </div>
    </div>
  </form>
</template>
