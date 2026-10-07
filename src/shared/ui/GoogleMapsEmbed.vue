<script setup lang="ts">
import { MapPin } from '@lucide/vue'

withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Google Maps',
    description: 'Ubicación de referencia para gestionar servicios y desplazamientos.',
  },
)
</script>

<template>
  <section class="rounded-4xl border border-neutral-100 bg-white p-6 shadow-sm">
    <div class="flex items-center justify-between gap-4 mb-5">
      <div>
        <h2 class="text-3xl font-black text-neutral-900">{{ title }}</h2>
        <p class="text-neutral-500 mt-1">{{ description }}</p>
      </div>
      <div
        class="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"
      >
        <MapPin class="h-6 w-6" />
      </div>
    </div>

    <div class="overflow-hidden rounded-4xl border border-neutral-100 bg-neutral-50 shadow-inner">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d253839.15978854144!2d-75.5826688!3d6.2324736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sco!4v1779919351904!5m2!1ses-419!2sco"
        width="600"
        height="450"
        style="border: 0"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        class="h-105 w-full"
      />
    </div>
  </section>
</template>

<style scoped></style>
