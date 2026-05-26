<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBooking, cancelBooking } from '@/api/booking'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const booking = ref(null)
const loading = ref(false)
const error = ref('')

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getBooking(id)
    booking.value = (res && res.data) || null
  } catch (err) {
    error.value = err?.message || 'Error cargando la reserva'
  } finally {
    loading.value = false
  }
}

const handleCancel = async () => {
  if (!confirm('¿Cancelar esta reserva?')) return
  try {
    await cancelBooking(id)
    alert('Reserva cancelada')
    router.push({ name: 'MyBookings' })
  } catch (err) {
    alert(err?.message || 'No se pudo cancelar la reserva')
  }
}

onMounted(() => {
  load()
})
</script>

<template>
  <div class="min-h-screen bg-[#F4F7FB]">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-black">Detalle de reserva</h1>
        </div>

        <div v-if="loading" class="rounded-4xl border border-gray-100 bg-white p-6 text-center">
          Cargando...
        </div>

        <div v-if="error" class="rounded-4xl border border-red-100 bg-red-50 p-4 text-red-700">
          {{ error }}
        </div>

        <div v-if="booking" class="bg-white rounded-4xl border border-gray-100 p-6 shadow-sm">
          <div class="mb-4">
            <h2 class="text-2xl font-bold text-gray-900">{{ booking.service_description }}</h2>
            <p class="text-sm text-gray-500 mt-1">
              Profesional:
              <router-link
                :to="`/professional/${booking.professional?.id}`"
                class="text-blue-600"
                >{{ booking.professional?.name }}</router-link
              >
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-sm text-gray-500">Fecha programada</p>
              <p class="font-medium text-gray-900">
                {{ new Date(booking.scheduled_date).toLocaleString() }}
              </p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Estado</p>
              <p class="font-medium text-gray-900">{{ booking.status || 'Pendiente' }}</p>
            </div>
          </div>

          <div class="mb-6">
            <p class="text-sm text-gray-500">Total</p>
            <p class="font-bold text-2xl text-gray-900">{{ booking.total }}</p>
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="handleCancel"
              class="px-4 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-100"
            >
              Cancelar reserva
            </button>
            <router-link
              :to="{ name: 'MyBookings' }"
              class="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200"
              >Volver</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
