<script setup lang="ts">
import { useRoute } from 'vue-router'

import BookingList from '../components/BookingList.vue'

/** HU016: reservas del cliente, con filtros por estado. */
const route = useRoute()
const initialFilter = typeof route.query.filtro === 'string' ? route.query.filtro : undefined
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <header class="mb-8">
      <h1 class="text-3xl font-black text-neutral-900">Mis reservas</h1>
      <p class="mt-1 text-neutral-500">Servicios que solicitaste, pendientes y realizados.</p>
    </header>
    <BookingList viewer="client" :initial-filter="initialFilter" />
  </div>
</template>
