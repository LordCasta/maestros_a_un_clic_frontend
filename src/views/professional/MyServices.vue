<script setup>
import { computed, ref } from 'vue'

const services = ref([
  {
    id: 1,
    name: 'Instalación eléctrica básica',
    description: 'Tomas, interruptores y pequeñas adecuaciones para viviendas.',
    price: 45000,
    status: 'Activo',
  },
  {
    id: 2,
    name: 'Reparación de grifería',
    description: 'Cambio de piezas, fugas y mantenimiento preventivo.',
    price: 35000,
    status: 'Más solicitado',
  },
  {
    id: 3,
    name: 'Diagnóstico técnico',
    description: 'Visita y evaluación inicial para estimar trabajo y materiales.',
    price: null,
    status: 'A convenir',
  },
])

const showForm = ref(false)
const editMode = ref(false)
const currentId = ref(null)

const form = ref({ name: '', description: '', price: '' })

const sortedServices = computed(() => [...services.value])

const openCreate = () => {
  editMode.value = false
  currentId.value = null
  form.value = { name: '', description: '', price: '' }
  showForm.value = true
}

const editService = (service) => {
  editMode.value = true
  currentId.value = service.id
  form.value = {
    name: service.name,
    description: service.description ?? '',
    price: service.price ?? '',
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

const submitForm = () => {
  const payload = {
    id: currentId.value ?? Date.now(),
    name: form.value.name,
    description: form.value.description,
    price: form.value.price ? Number(form.value.price) : null,
    status: form.value.price ? 'Activo' : 'A convenir',
  }

  if (editMode.value && currentId.value) {
    services.value = services.value.map((service) =>
      service.id === currentId.value ? payload : service,
    )
  } else {
    services.value = [payload, ...services.value]
  }

  closeForm()
}

const removeService = (id) => {
  if (!confirm('Eliminar servicio?')) return
  services.value = services.value.filter((service) => service.id !== id)
}

const formatPrice = (value) => {
  if (value === undefined || value === null || value === '') return 'A convenir'
  const numericValue = Number(value)
  if (Number.isNaN(numericValue)) return String(value)
  return `$${new Intl.NumberFormat('es-CO').format(numericValue)}`
}
</script>

<template>
  <div class="min-h-screen bg-[#F4F7FB] py-8 px-4">
    <div class="mx-auto max-w-6xl space-y-6">
      <section class="rounded-4xl bg-white p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-3xl font-black text-gray-900">Mis Servicios</h1>
            <p class="mt-1 text-gray-600">
              Vista para organizar tu catálogo.
            </p>
          </div>
          <button
            class="rounded-2xl bg-[#2563EB] px-4 py-3 font-semibold text-white"
            @click="openCreate"
          >
            Nuevo servicio
          </button>
        </div>
      </section>

      <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="service in sortedServices"
          :key="service.id"
          class="rounded-4xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p
                class="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                {{ service.status }}
              </p>
              <h3 class="mt-3 text-xl font-black text-gray-900">{{ service.name }}</h3>
            </div>
            <div class="text-right">
              <div class="text-2xl font-black text-[#2563EB]">{{ formatPrice(service.price) }}</div>
              <div class="text-xs text-gray-500">Tarifa estimada</div>
            </div>
          </div>

          <p class="mt-4 text-sm leading-6 text-gray-600">{{ service.description }}</p>

          <div class="mt-5 flex flex-wrap gap-3">
            <button
              class="rounded-2xl border border-gray-200 px-4 py-2 font-semibold text-gray-700"
              @click="editService(service)"
            >
              Editar
            </button>
            <button
              class="rounded-2xl border border-red-100 bg-red-50 px-4 py-2 font-semibold text-red-700"
              @click="removeService(service.id)"
            >
              Eliminar
            </button>
          </div>
        </article>
      </section>


      <section class="rounded-4xl border border-dashed border-gray-300 bg-white p-6 text-center">
        <p class="font-semibold text-gray-800">Esta pantalla todavía no conecta con backend.</p>
      </section>
    </div>

    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div class="w-full max-w-lg rounded-4xl bg-white p-6 shadow-2xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-2xl font-black text-gray-900">
              {{ editMode ? 'Editar servicio' : 'Nuevo servicio' }}
            </h2>
            <p class="mt-1 text-sm text-gray-500">Formulario visual sin persistencia.</p>
          </div>
          <button
            class="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700"
            @click="closeForm"
          >
            Cerrar
          </button>
        </div>

        <div class="mt-6 space-y-4">
          <label class="block space-y-2">
            <span class="text-sm font-semibold text-gray-700">Nombre</span>
            <input
              v-model="form.name"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-600"
              placeholder="Ej. Instalación de luminarias"
            />
          </label>

          <label class="block space-y-2">
            <span class="text-sm font-semibold text-gray-700">Descripción</span>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-600"
              placeholder="Describe el servicio"
            ></textarea>
          </label>

          <label class="block space-y-2">
            <span class="text-sm font-semibold text-gray-700">Precio estimado</span>
            <input
              v-model="form.price"
              type="number"
              class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-600"
              placeholder="45000"
            />
          </label>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            class="rounded-2xl border border-gray-200 px-4 py-3 font-semibold text-gray-700"
            @click="closeForm"
          >
            Cancelar
          </button>
          <button
            class="rounded-2xl bg-[#2563EB] px-4 py-3 font-semibold text-white"
            @click="submitForm"
          >
            {{ editMode ? 'Guardar cambios' : 'Crear servicio' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
