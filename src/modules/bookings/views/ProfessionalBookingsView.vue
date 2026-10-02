<script setup lang="ts">
import BookingList from '../components/BookingList.vue'
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <header class="mb-8">
      <h1 class="text-3xl font-black text-neutral-900">Reservas recibidas</h1>
      <p class="mt-1 text-neutral-500">Solicitudes de tus clientes y servicios realizados.</p>
    </header>
    <BookingList viewer="professional" />
  </div>
</template>
