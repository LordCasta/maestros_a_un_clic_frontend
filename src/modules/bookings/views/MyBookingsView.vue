<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listBookings, cancelBooking } from '@/api/booking'

const bookings = ref([])
const loading = ref(false)
const error = ref('')
const router = useRouter()

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await listBookings()
    bookings.value = (res && res.data) || []
  } catch (err) {
    error.value = err?.message || 'Error cargando reservas'
  } finally {
    loading.value = false
  }
}

const handleCancel = async (id) => {
  if (!confirm('¿Cancelar esta reserva?')) return
  try {
    await cancelBooking(id)
    await load()
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
    <div class="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-black">Mis reservas</h1>
        </div>

        <div v-if="loading" class="rounded-4xl border border-gray-100 bg-white p-6 text-center">
          Cargando reservas...
        </div>

        <div v-if="error" class="rounded-4xl border border-red-100 bg-red-50 p-4 text-red-700">
          {{ error }}
        </div>

        <div
          v-if="!loading && !bookings.length"
          class="rounded-4xl border border-dashed border-gray-300 bg-white p-8 text-center"
        >
          <p class="text-gray-700 font-semibold">No tienes reservas todavía.</p>
          <p class="text-gray-500 mt-2">Busca profesionales y crea tu primera reserva.</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="b in bookings"
            :key="b.id"
            class="bg-white rounded-3xl border border-gray-100 p-5 hover:shadow-md transition"
          >
            <div class="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 class="font-bold text-gray-900">{{ b.service_description }}</h3>
                <p class="text-sm text-gray-500 mt-1">
                  Profesional: {{ b.professional?.name || '—' }}
                </p>
              </div>

              <div class="text-right">
                <div class="px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-semibold">
                  {{ b.status || 'Pendiente' }}
                </div>
                <div class="text-sm text-gray-500 mt-2">Total: {{ b.total }}</div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                class="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-gray-900"
                @click.prevent="router.push({ name: 'BookingDetail', params: { id: b.id } })"
              >
                Ver detalle
              </button>

              <button
                class="px-4 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-100"
                @click.prevent="handleCancel(b.id)"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
