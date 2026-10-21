<script setup lang="ts">
import { computed } from 'vue'
import { MapPin } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    lat?: number | null
    lng?: number | null
    query?: string | null
    zoom?: number
  }>(),
  {
    title: 'Google Maps',
    description: 'Ubicación de referencia para gestionar servicios y desplazamientos.',
    lat: null,
    lng: null,
    query: null,
    zoom: 13,
  },
)

const mapSrc = computed(() => {
  if (props.lat != null && props.lng != null) {
    return `https://maps.google.com/maps?q=${props.lat},${props.lng}&z=${props.zoom}&output=embed`
  }
  if (props.query) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(props.query + ', Medellín, Colombia')}&z=${props.zoom}&output=embed`
  }
  return 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d253839.15978854144!2d-75.5826688!3d6.2324736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sco!4v1779919351904!5m2!1ses-419!2sco'
})
</script>

<template>
  <section class="rounded-4xl border border-neutral-100 bg-white p-6 shadow-sm">
    <div class="mb-5 flex items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-black text-neutral-900">{{ title }}</h2>
        <p class="mt-1 text-sm text-neutral-500">{{ description }}</p>
      </div>
      <div
        class="hidden size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 sm:flex"
      >
        <MapPin class="size-6" />
      </div>
    </div>

    <div class="overflow-hidden rounded-4xl border border-neutral-100 bg-neutral-50 shadow-inner">
      <iframe
        :src="mapSrc"
        :title="title"
        width="600"
        height="450"
        style="border: 0"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        class="h-80 w-full"
      />
    </div>
  </section>
</template>

<style scoped></style>
