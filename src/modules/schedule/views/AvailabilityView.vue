<script setup>
import { computed, ref } from 'vue'

const days = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
]

const availability = ref(
  days.map((day, index) => ({
    day: day.key,
    hours: index < 5 ? '09:00-13:00,14:00-18:00' : '',
    available: index < 5,
  })),
)

const summary = computed(() => availability.value.filter((slot) => slot.available).length)

const save = () => {
  alert('Vista visual: la disponibilidad no se guarda todavía.')
}
</script>

<template>
  <div class="min-h-screen bg-[#F4F7FB] px-4 py-8">
    <div class="mx-auto max-w-4xl space-y-6">
      <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-black text-gray-900">Mi Disponibilidad</h1>
            <p class="mt-1 text-gray-600">Maqueta visual para revisar bloques horarios por día.</p>
          </div>

          <button class="rounded-2xl bg-[#2563EB] px-4 py-3 font-semibold text-white" @click="save">
            Guardar
          </button>
        </div>

        <div class="mt-6 grid gap-3 sm:grid-cols-3">
          <div class="rounded-3xl bg-[#F8FAFF] p-4">
            <p class="text-sm text-gray-500">Días activos</p>
            <p class="mt-1 text-2xl font-black text-gray-900">{{ summary }}</p>
          </div>
          <div class="rounded-3xl bg-[#F8FAFF] p-4">
            <p class="text-sm text-gray-500">Bloque sugerido</p>
            <p class="mt-1 text-2xl font-black text-gray-900">09:00 - 18:00</p>
          </div>
          <div class="rounded-3xl bg-[#F8FAFF] p-4">
            <p class="text-sm text-gray-500">Estado</p>
            <p class="mt-1 text-2xl font-black text-gray-900">Editable</p>
          </div>
        </div>
      </section>

      <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
        <div class="space-y-4">
          <article
            v-for="(day, idx) in days"
            :key="day.key"
            class="rounded-3xl border border-gray-100 bg-[#F8FAFF] p-4"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div class="min-w-40">
                <p class="text-lg font-bold text-gray-900">{{ day.label }}</p>
                <p class="text-sm text-gray-500">Bloque visual para agenda semanal</p>
              </div>

              <div class="flex-1 lg:max-w-2xl">
                <input
                  v-model="availability[idx].hours"
                  class="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-600"
                  placeholder="Ej: 09:00-12:00,14:00-18:00"
                />
              </div>

              <label
                class="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 border border-gray-200"
              >
                <input v-model="availability[idx].available" type="checkbox" />
                <span class="text-sm font-semibold text-gray-700">Disponible</span>
              </label>
            </div>
          </article>
        </div>
      </section>

      <section class="rounded-4xl border border-dashed border-gray-300 bg-white p-6 text-center">
        <p class="font-semibold text-gray-800">Esta pantalla todavía no conecta con backend.</p>
      </section>
    </div>
  </div>
</template>
