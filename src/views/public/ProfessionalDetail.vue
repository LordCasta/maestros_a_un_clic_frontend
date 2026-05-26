<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-vue-next'

import { ApiError } from '@/api/auth'
import { createBooking } from '@/api/booking'
import { addFavorite, removeFavorite } from '@/api/favorite'
import {
  getProfessional,
  type ProfessionalDetail as ProfessionalDetailType,
} from '@/api/professional'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const favoriteLoading = ref(false)
const bookingLoading = ref(false)
const bookingSuccess = ref('')
const bookingError = ref('')
const isFavorite = ref(false)
const professional = ref<ProfessionalDetailType | null>(null)

const bookingForm = reactive({
  serviceDescription: '',
  scheduledDate: '',
  total: '',
})

const professionalId = computed(() => Number(route.params.id))

const formatPrice = (value?: string | number) => {
  if (value === undefined || value === null || value === '') {
    return 'A convenir'
  }

  const numericValue = typeof value === 'string' ? Number(value) : value

  if (Number.isNaN(numericValue)) {
    return String(value)
  }

  return `$${new Intl.NumberFormat('es-CO').format(numericValue)}`
}

const formatDateTime = (value?: string) => {
  if (!value) return 'Por confirmar'

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const loadProfessional = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getProfessional(professionalId.value)
    professional.value = response.data
    bookingForm.total = String(response.data.hourly_rate ?? response.data.price ?? '')
    bookingForm.serviceDescription = response.data.description ?? ''
  } catch (loadError) {
    error.value =
      loadError instanceof Error
        ? loadError.message
        : 'No pudimos cargar el detalle del profesional.'
  } finally {
    loading.value = false
  }
}

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    await router.push({ name: 'Login' })
    return
  }

  if (!professional.value) return

  favoriteLoading.value = true

  try {
    if (isFavorite.value) {
      await removeFavorite(professional.value.id)
      isFavorite.value = false
    } else {
      await addFavorite(professional.value.id)
      isFavorite.value = true
    }
  } catch (favoriteError) {
    error.value =
      favoriteError instanceof ApiError ? favoriteError.message : 'No pudimos actualizar favoritos.'
  } finally {
    favoriteLoading.value = false
  }
}

const goToLogin = async () => {
  await router.push({ name: 'Login' })
}

const toApiDateTime = (value: string) => {
  if (!value) return ''
  return `${value.replace('T', ' ')}:00`
}

const submitBooking = async () => {
  bookingError.value = ''
  bookingSuccess.value = ''

  if (!authStore.isAuthenticated || authStore.user?.role !== 'client') {
    await router.push({ name: 'Login' })
    return
  }

  if (!professional.value) {
    bookingError.value = 'No pudimos identificar al profesional.'
    return
  }

  if (!bookingForm.serviceDescription || !bookingForm.scheduledDate || !bookingForm.total) {
    bookingError.value = 'Completa descripción, fecha y total para reservar.'
    return
  }

  bookingLoading.value = true

  try {
    const response = await createBooking({
      professional_id: professional.value.id,
      service_description: bookingForm.serviceDescription,
      scheduled_date: toApiDateTime(bookingForm.scheduledDate),
      total: Number(bookingForm.total),
    })

    bookingSuccess.value = response.message ?? 'Reserva creada correctamente.'
    bookingForm.serviceDescription = ''
    bookingForm.scheduledDate = ''
    bookingForm.total = String(professional.value.hourly_rate ?? professional.value.price ?? '')
  } catch (submitErrorValue) {
    bookingError.value =
      submitErrorValue instanceof ApiError
        ? submitErrorValue.message
        : 'No pudimos crear la reserva en este momento.'
  } finally {
    bookingLoading.value = false
  }
}

watch(
  () => route.params.id,
  () => {
    loadProfessional()
  },
  { immediate: true },
)

onMounted(() => {
  if (route.hash === '#booking') {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#F4F7FB]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <RouterLink
        to="/search"
        class="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
      >
        <ArrowLeft class="h-4 w-4" />
        Volver a resultados
      </RouterLink>

      <section
        class="relative overflow-hidden rounded-4xl bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB] p-8 lg:p-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.24)]"
      >
        <div class="absolute -top-8 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div v-if="loading" class="relative z-10">
          <p class="text-blue-100">Cargando detalle...</p>
        </div>

        <div
          v-else-if="professional"
          class="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"
        >
          <div class="space-y-5">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur-md"
            >
              <Sparkles class="h-4 w-4" />
              Profesional verificado
            </div>

            <div class="space-y-3">
              <h1 class="text-4xl md:text-6xl font-black leading-tight">{{ professional.name }}</h1>
              <p class="max-w-3xl text-blue-100 text-lg md:text-xl leading-relaxed">
                {{
                  professional.specialty ??
                  professional.specialties?.[0]?.name ??
                  'Profesional confiable y disponible para tu próxima reserva.'
                }}
              </p>
            </div>

            <div class="flex flex-wrap gap-4 text-sm text-blue-100/90">
              <span class="inline-flex items-center gap-1.5">
                <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {{ professional.rating ?? 0 }} ({{ professional.reviews ?? 0 }} reseñas)
              </span>
              <span class="inline-flex items-center gap-1.5">
                <MapPin class="h-4 w-4" />
                {{ professional.commune ?? 'Zona no definida' }}
              </span>
              <span class="inline-flex items-center gap-1.5" v-if="professional.online">
                <Clock3 class="h-4 w-4" />
                Disponible ahora
              </span>
            </div>

            <div class="flex flex-wrap gap-3">
              <button
                class="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0F172A] transition hover:bg-blue-50"
                :disabled="favoriteLoading"
                @click="toggleFavorite"
              >
                <Heart
                  class="h-4 w-4"
                  :class="isFavorite ? 'fill-[#2563EB] text-[#2563EB]' : 'text-[#2563EB]'"
                />
                {{ isFavorite ? 'Guardado' : 'Guardar favorito' }}
              </button>

              <button
                class="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                @click="goToLogin"
              >
                Reservar como cliente
                <CalendarDays class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            class="rounded-4xl border border-white/10 bg-white/10 p-5 backdrop-blur-md space-y-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-100/80">Tarifa base</p>
                <p class="text-3xl font-black">
                  {{ formatPrice(professional.hourly_rate ?? professional.price) }}
                </p>
              </div>
              <div
                class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0F172A] font-black"
              >
                {{ professional.name.slice(0, 1) }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="rounded-2xl bg-white/10 p-4">
                <p class="text-blue-100/80">Experiencia</p>
                <p class="mt-2 text-xl font-bold">
                  {{ professional.experience_years ?? professional.years_experience ?? 'N/D' }} años
                </p>
              </div>
              <div class="rounded-2xl bg-white/10 p-4">
                <p class="text-blue-100/80">Respuesta</p>
                <p class="mt-2 text-xl font-bold">12 min</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="error" class="relative z-10">
          <p class="text-red-100 font-semibold">{{ error }}</p>
        </div>
      </section>

      <div v-if="professional" class="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-8">
          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Sobre el profesional</h2>
                <p class="text-gray-500 mt-1">Información general y capacidades principales.</p>
              </div>
              <ShieldCheck class="h-6 w-6 text-[#2563EB]" />
            </div>

            <p class="text-gray-600 leading-7">
              {{
                professional.description ??
                'Este profesional cuenta con perfil completo, reseñas visibles y disponibilidad para gestionar nuevas solicitudes.'
              }}
            </p>

            <div class="mt-6 grid gap-4 md:grid-cols-2">
              <div class="rounded-3xl bg-[#F8FAFF] p-5 border border-gray-100">
                <p class="text-sm font-semibold text-gray-500">Contacto</p>
                <p class="mt-2 font-bold text-gray-900">
                  {{ professional.email ?? 'Disponible desde el perfil' }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ professional.phone ?? 'Teléfono no publicado' }}
                </p>
              </div>

              <div class="rounded-3xl bg-[#F8FAFF] p-5 border border-gray-100">
                <p class="text-sm font-semibold text-gray-500">Ubicación</p>
                <p class="mt-2 font-bold text-gray-900">
                  {{ professional.commune ?? 'No definida' }}
                </p>
                <p class="mt-1 text-sm text-gray-500">Atención en terreno y servicio programado</p>
              </div>
            </div>
          </section>

          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Servicios y experiencia</h2>
                <p class="text-gray-500 mt-1">Lo que puedes solicitarle directamente.</p>
              </div>
            </div>

            <div class="space-y-3">
              <article
                v-for="service in professional.services?.length
                  ? professional.services
                  : (professional.specialties?.map((item) => ({ name: item.name })) ?? [])"
                :key="service.id ?? service.name"
                class="rounded-3xl border border-gray-100 bg-[#F8FAFF] p-4"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-semibold text-gray-900">{{ service.name }}</p>
                    <p class="text-sm text-gray-500">
                      {{ service.description ?? 'Servicio disponible para agendar o consultar' }}
                    </p>
                  </div>
                  <span
                    class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm"
                  >
                    {{
                      formatPrice(service.price ?? professional.hourly_rate ?? professional.price)
                    }}
                  </span>
                </div>
              </article>
            </div>
          </section>
        </div>

        <aside class="space-y-8">
          <section id="booking" class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Solicitar reserva</h2>
                <p class="text-gray-500 mt-1">Envía una solicitud concreta al profesional.</p>
              </div>
              <CalendarDays class="h-6 w-6 text-[#2563EB]" />
            </div>

            <div
              v-if="!authStore.isAuthenticated || authStore.user?.role !== 'client'"
              class="space-y-4"
            >
              <p class="text-gray-600 leading-7">
                Debes iniciar sesión como cliente para crear una reserva.
              </p>
              <button
                class="w-full rounded-2xl bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                @click="goToLogin"
              >
                Ir al login
              </button>
            </div>

            <form v-else class="space-y-4" @submit.prevent="submitBooking">
              <label class="space-y-2 block">
                <span class="text-sm font-semibold text-gray-700">Descripción del servicio</span>
                <textarea
                  v-model="bookingForm.serviceDescription"
                  rows="4"
                  class="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-600"
                  placeholder="Describe la necesidad o problema a resolver"
                />
              </label>

              <label class="space-y-2 block">
                <span class="text-sm font-semibold text-gray-700">Fecha y hora</span>
                <input
                  v-model="bookingForm.scheduledDate"
                  type="datetime-local"
                  class="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-600"
                />
              </label>

              <label class="space-y-2 block">
                <span class="text-sm font-semibold text-gray-700">Total estimado</span>
                <input
                  v-model="bookingForm.total"
                  type="number"
                  min="0"
                  class="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-600"
                  placeholder="45000"
                />
              </label>

              <button
                type="submit"
                :disabled="bookingLoading"
                class="w-full rounded-2xl bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400"
              >
                {{ bookingLoading ? 'Creando reserva...' : 'Solicitar reserva' }}
              </button>

              <p
                v-if="bookingError"
                class="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {{ bookingError }}
              </p>

              <p
                v-if="bookingSuccess"
                class="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                {{ bookingSuccess }}
              </p>
            </form>
          </section>

          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Galería y referencias</h2>
                <p class="text-gray-500 mt-1">
                  Material disponible para revisar antes de contratar.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <img
                v-for="item in professional.portfolio_images?.length
                  ? professional.portfolio_images
                  : [
                      {
                        url:
                          professional.image ??
                          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
                      },
                    ]"
                :key="item.id ?? item.url"
                :src="item.url"
                alt="Portfolio"
                class="h-28 w-full rounded-3xl object-cover"
              />
            </div>

            <div class="mt-6 space-y-3 text-sm text-gray-600">
              <p>
                Certificaciones y trabajos previos pueden integrarse más adelante con el módulo de
                perfil profesional.
              </p>
              <p>
                La reserva ya queda lista para conectarse con el listado y detalle de bookings del
                cliente.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>
