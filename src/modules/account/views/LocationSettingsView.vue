<script setup lang="ts">
import { Info, MapPin } from '@lucide/vue'

import { BaseAlert } from '@/shared/ui'

import ManualLocationForm from '../components/ManualLocationForm.vue'
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <div
        class="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700"
      >
        <MapPin class="size-4" />
        Preferencia de ubicación
      </div>
      <h1 class="text-3xl font-black text-neutral-900">Mi ubicación</h1>
      <p class="mt-2 text-sm text-neutral-500">
        Configura tu dirección y comuna para encontrar servicios y calcular distancias sin necesidad
        de activar el GPS.
      </p>
    </div>

    <div class="space-y-6">
      <BaseAlert tone="info">
        <template #icon>
          <Info class="size-5" />
        </template>
        Esta ubicación se utilizará automáticamente en el buscador para mostrarte profesionales
        cercanos en tu comuna y zonas aledañas.
      </BaseAlert>

      <ManualLocationForm />
    </div>
  </div>
</template>
