<script setup>
import { ref, onMounted } from 'vue'

const bookings = ref([
  {
    id: 1,
    client: 'Laura Gómez',
    time: '08:00',
    service: 'Mantenimiento de grifería',
    status: 'Pending',
  },
  {
    id: 2,
    client: 'Jorge Ruiz',
    time: '10:30',
    service: 'Instalación eléctrica',
    status: 'Confirmed',
  },
])

onMounted(() => {})
</script>

<template>
  <div class="min-h-screen bg-[#F4F7FB] py-8 px-4">
    <div class="mx-auto max-w-6xl space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black">Reservas asignadas</h1>
          <p class="mt-1 text-gray-600">Vista sólo lectura para profesionales (mock local).</p>
        </div>
      </div>

      <div class="grid gap-4">
        <article v-for="b in bookings" :key="b.id" class="rounded-3xl bg-white p-5 border">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-bold text-gray-900">{{ b.client }}</p>
              <p class="text-sm text-gray-500">{{ b.service }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold">{{ b.time }}</p>
              <p class="text-sm text-gray-500">{{ b.status }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
