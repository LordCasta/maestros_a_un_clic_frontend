<script setup lang="ts">
import { computed, ref } from 'vue'

// MAQUETA: datos de muestra en memoria. Al implementar el módulo se reemplaza por
// /professional/services (ver backend/docs/api/endpoints.md) y por ProfessionalService.
interface MockService {
  id: number
  name: string
  description: string
  price: number | null
  status: string
}

const services = ref<MockService[]>([
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
const currentId = ref<number | null>(null)

const form = ref<{ name: string; description: string; price: number | string }>({
  name: '',
  description: '',
  price: '',
})

const sortedServices = computed(() => [...services.value])

const openCreate = () => {
  editMode.value = false
  currentId.value = null
  form.value = { name: '', description: '', price: '' }
  showForm.value = true
}

const editService = (service: MockService) => {
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
  const payload: MockService = {
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

const removeService = (id: number) => {
  if (!confirm('Eliminar servicio?')) return
  services.value = services.value.filter((service) => service.id !== id)
}

const formatPrice = (value: number | string | null | undefined) => {
  if (value === undefined || value === null || value === '') return 'A convenir'
  const numericValue = Number(value)
  if (Number.isNaN(numericValue)) return String(value)
  return `$${new Intl.NumberFormat('es-CO').format(numericValue)}`
}
</script>

<template>
  <div class="min-h-screen bg-canvas py-8 px-4">
    <div class="mx-auto max-w-6xl space-y-6">
      <section class="rounded-4xl bg-white p-6 shadow-sm border border-neutral-100">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-3xl font-black text-neutral-900">Mis Servicios</h1>
            <p class="mt-1 text-neutral-600">Vista para organizar tu catálogo.</p>
          </div>
          <button
            class="rounded-2xl bg-primary-600 px-4 py-3 font-semibold text-white"
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
          class="rounded-4xl border border-neutral-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p
                class="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700"
              >
                {{ service.status }}
              </p>
              <h3 class="mt-3 text-xl font-black text-neutral-900">{{ service.name }}</h3>
            </div>
            <div class="text-right">
              <div class="text-2xl font-black text-primary-600">
                {{ formatPrice(service.price) }}
              </div>
              <div class="text-xs text-neutral-500">Tarifa estimada</div>
            </div>
          </div>

          <p class="mt-4 text-sm leading-6 text-neutral-600">{{ service.description }}</p>

          <div class="mt-5 flex flex-wrap gap-3">
            <button
              class="rounded-2xl border border-neutral-200 px-4 py-2 font-semibold text-neutral-700"
              @click="editService(service)"
            >
              Editar
            </button>
            <button
              class="rounded-2xl border border-danger-100 bg-danger-50 px-4 py-2 font-semibold text-danger-700"
              @click="removeService(service.id)"
            >
              Eliminar
            </button>
          </div>
        </article>
      </section>

      <section class="rounded-4xl border border-dashed border-neutral-300 bg-white p-6 text-center">
        <p class="font-semibold text-neutral-800">Esta pantalla todavía no conecta con backend.</p>
      </section>
    </div>

    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div class="w-full max-w-lg rounded-4xl bg-white p-6 shadow-2xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-2xl font-black text-neutral-900">
              {{ editMode ? 'Editar servicio' : 'Nuevo servicio' }}
            </h2>
            <p class="mt-1 text-sm text-neutral-500">Formulario visual sin persistencia.</p>
          </div>
          <button
            class="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700"
            @click="closeForm"
          >
            Cerrar
          </button>
        </div>

        <div class="mt-6 space-y-4">
          <label class="block space-y-2">
            <span class="text-sm font-semibold text-neutral-700">Nombre</span>
            <input
              v-model="form.name"
              class="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none focus:border-primary-600"
              placeholder="Ej. Instalación de luminarias"
            />
          </label>

          <label class="block space-y-2">
            <span class="text-sm font-semibold text-neutral-700">Descripción</span>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none focus:border-primary-600"
              placeholder="Describe el servicio"
            ></textarea>
          </label>

          <label class="block space-y-2">
            <span class="text-sm font-semibold text-neutral-700">Precio estimado</span>
            <input
              v-model="form.price"
              type="number"
              class="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none focus:border-primary-600"
              placeholder="45000"
            />
          </label>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            class="rounded-2xl border border-neutral-200 px-4 py-3 font-semibold text-neutral-700"
            @click="closeForm"
          >
            Cancelar
          </button>
          <button
            class="rounded-2xl bg-primary-600 px-4 py-3 font-semibold text-white"
            @click="submitForm"
          >
            {{ editMode ? 'Guardar cambios' : 'Crear servicio' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
