<script setup lang="ts">
import { useRoute } from 'vue-router'

import BookingList from '../components/BookingList.vue'
import BookingSummaryCards from '../components/BookingSummaryCards.vue'

/** HU017: historial de servicios del profesional, con totales y filtros por estado. */
const route = useRoute()
const initialFilter = typeof route.query.filtro === 'string' ? route.query.filtro : undefined
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
    <header>
      <h1 class="text-3xl font-black text-neutral-900">Reservas recibidas</h1>
      <p class="mt-1 text-neutral-500">Solicitudes de tus clientes y servicios realizados.</p>
    </header>
    <BookingSummaryCards />
    <BookingList viewer="professional" :initial-filter="initialFilter" />
  </div>
</template>
