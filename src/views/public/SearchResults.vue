<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  ChevronRight,
  Filter,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-vue-next'

import { listProfessionals } from '@/api/professional'
import { SPECIALTIES } from '@/constants/specialties'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const professionals = ref([])

const search = ref(String(route.query.q ?? ''))
const filters = reactive({
  commune: String(route.query.commune ?? ''),
  specialtyId: String(route.query.specialty_id ?? ''),
  minPrice: String(route.query.min_price ?? ''),
  maxPrice: String(route.query.max_price ?? ''),
})

const specialties = SPECIALTIES

const currentFilters = computed(() => [
  filters.commune,
  filters.specialtyId,
  filters.minPrice,
  filters.maxPrice,
])

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

const normalizeQuery = () => {
  const query: Record<string, string> = {}

  if (search.value.trim()) query.q = search.value.trim()
  if (filters.commune.trim()) query.commune = filters.commune.trim()
  if (filters.specialtyId.trim()) query.specialty_id = filters.specialtyId.trim()
  if (filters.minPrice.trim()) query.min_price = filters.minPrice.trim()
  if (filters.maxPrice.trim()) query.max_price = filters.maxPrice.trim()

  return query
}

const syncFromRoute = () => {
  search.value = String(route.query.q ?? '')
  filters.commune = String(route.query.commune ?? '')
  filters.specialtyId = String(route.query.specialty_id ?? '')
  filters.minPrice = String(route.query.min_price ?? '')
  filters.maxPrice = String(route.query.max_price ?? '')
}

const loadProfessionals = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await listProfessionals({
      commune: filters.commune || undefined,
      specialty_id: filters.specialtyId || undefined,
      min_price: filters.minPrice || undefined,
      max_price: filters.maxPrice || undefined,
      per_page: 24,
    })

    ;(professionals as any).value = response.data ?? []
  } catch (loadError) {
    error.value =
      loadError instanceof Error ? loadError.message : 'No se pudieron cargar los resultados.'
  } finally {
    loading.value = false
  }
}

const visibleProfessionals = computed(() => {
  const query = search.value.trim().toLowerCase()
  const specialtyName = specialties.find((item) => String(item.id) === filters.specialtyId)?.name

  return professionals.value.filter((professional) => {
    const haystack = [
      professional.name,
      professional.specialty ?? professional.specialties?.map((item: any) => item.name).join(' '),
      professional.commune,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    if (query && !haystack.includes(query)) {
      return false
    }

    if (specialtyName) {
      const normalizedSpecialty = (
        professional.specialty ??
        professional.specialties?.[0]?.name ??
        ''
      ).toLowerCase()
      if (!normalizedSpecialty.includes(specialtyName.toLowerCase())) {
        return false
      }
    }

    return true
  })
})

const applySearch = async () => {
  await router.push({ name: 'SearchResults', query: normalizeQuery() })
}

const clearFilters = async () => {
  search.value = ''
  filters.commune = ''
  filters.specialtyId = ''
  filters.minPrice = ''
  filters.maxPrice = ''

  await router.push({ name: 'SearchResults' })
}

watch(
  () => route.query,
  async () => {
    syncFromRoute()
    await loadProfessionals()
  },
  { immediate: true },
)
</script>

<template>
  <div class="min-h-screen bg-[#F4F7FB]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <section
        class="relative overflow-hidden rounded-4xl bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB] p-8 lg:p-12 text-white shadow-[0_30px_80px_rgba(15,23,42,0.24)]"
      >
        <div class="absolute -top-8 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div class="absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />

        <div class="relative z-10 max-w-4xl space-y-6">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur-md"
          >
            <Sparkles class="h-4 w-4" />
            Profesionales verificados cerca de ti
          </div>

          <div>
            <h1 class="text-4xl md:text-6xl font-black leading-tight mb-4">
              Resultados de búsqueda
            </h1>
            <p class="max-w-3xl text-blue-100 text-lg md:text-xl leading-relaxed">
              Filtra por comuna, especialidad y tarifa para encontrar al profesional que mejor
              encaja con tu necesidad.
            </p>
          </div>

          <div class="grid gap-3 lg:grid-cols-[1fr_auto] max-w-4xl">
            <div
              class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 h-14 backdrop-blur-md"
            >
              <Search class="h-5 w-5 text-blue-100" />
              <input
                v-model="search"
                type="text"
                placeholder="Busca por nombre, especialidad o zona"
                class="w-full bg-transparent outline-none text-white placeholder:text-blue-100/70"
                @keydown.enter.prevent="applySearch"
              />
            </div>

            <button
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 h-14 font-semibold text-[#0F172A] transition hover:bg-blue-50"
              @click="applySearch"
            >
              Buscar
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <div class="grid gap-8 xl:grid-cols-[1.1fr_360px]">
        <div class="space-y-8">
          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Filtros rápidos</h2>
                <p class="text-gray-500 mt-1">Refina el resultado sin salir de la pantalla.</p>
              </div>
              <Filter class="h-6 w-6 text-[#2563EB]" />
            </div>

            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label class="space-y-2">
                <span class="text-sm font-semibold text-gray-700">Comuna</span>
                <input
                  v-model="filters.commune"
                  type="text"
                  placeholder="Santiago, Ñuñoa..."
                  class="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-600"
                />
              </label>

              <label class="space-y-2">
                <span class="text-sm font-semibold text-gray-700">Especialidad</span>
                <select
                  v-model="filters.specialtyId"
                  class="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-600"
                >
                  <option value="">Todas</option>
                  <option
                    v-for="specialty in specialties"
                    :key="specialty.id"
                    :value="String(specialty.id)"
                  >
                    {{ specialty.name }}
                  </option>
                </select>
              </label>

              <label class="space-y-2">
                <span class="text-sm font-semibold text-gray-700">Precio mínimo</span>
                <input
                  v-model="filters.minPrice"
                  type="number"
                  min="0"
                  placeholder="10000"
                  class="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-600"
                />
              </label>

              <label class="space-y-2">
                <span class="text-sm font-semibold text-gray-700">Precio máximo</span>
                <input
                  v-model="filters.maxPrice"
                  type="number"
                  min="0"
                  placeholder="80000"
                  class="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-600"
                />
              </label>
            </div>

            <div class="mt-5 flex flex-wrap items-center gap-3">
              <button
                class="rounded-2xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                @click="applySearch"
              >
                Aplicar filtros
              </button>
              <button
                class="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                @click="clearFilters"
              >
                Limpiar
              </button>
              <span class="text-sm text-gray-500">
                {{ visibleProfessionals.length }} resultados visibles
              </span>
            </div>
          </section>

          <section>
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Profesionales encontrados</h2>
                <p class="text-gray-500 mt-1">Selecciona uno para revisar su perfil completo.</p>
              </div>
              <div
                class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100"
              >
                <ShieldCheck class="h-4 w-4 text-[#2563EB]" />
                Verificados
              </div>
            </div>

            <div
              v-if="loading"
              class="rounded-4xl border border-gray-100 bg-white p-8 text-center shadow-sm"
            >
              <p class="text-gray-700 font-semibold">Cargando profesionales...</p>
            </div>

            <div
              v-else-if="error"
              class="rounded-4xl border border-red-100 bg-red-50 p-8 text-center"
            >
              <p class="font-semibold text-red-700">No pudimos cargar los resultados.</p>
              <p class="mt-2 text-sm text-red-600">{{ error }}</p>
            </div>

            <div v-else class="space-y-5">
              <article
                v-for="professional in visibleProfessionals"
                :key="professional.id"
                class="rounded-4xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div class="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <img
                    :src="
                      professional.profile_photo_url ??
                      professional.image ??
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
                    "
                    :alt="professional.name"
                    class="h-48 w-full rounded-3xl object-cover lg:h-44 lg:w-44"
                  />

                  <div class="flex-1 space-y-4">
                    <div class="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div class="flex items-center gap-2">
                          <h3 class="text-2xl font-black text-gray-900">{{ professional.name }}</h3>
                          <ShieldCheck class="h-5 w-5 text-[#2563EB]" />
                        </div>
                        <p class="mt-2 text-gray-600">
                          {{
                            professional.specialty ??
                            professional.specialties?.[0]?.name ??
                            'Profesional verificado'
                          }}
                        </p>
                      </div>

                      <div class="text-left lg:text-right">
                        <p class="text-3xl font-black text-[#2563EB]">
                          {{ formatPrice(professional.hourly_rate ?? professional.price) }}
                        </p>
                        <p class="text-sm text-gray-500">Tarifa estimada</p>
                      </div>
                    </div>

                    <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span class="inline-flex items-center gap-1.5">
                        <Star class="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        {{ professional.rating ?? 0 }} ({{ professional.reviews ?? 0 }} reseñas)
                      </span>
                      <span class="inline-flex items-center gap-1.5">
                        <MapPin class="h-4 w-4" />
                        {{ professional.commune ?? professional.distance ?? 'Zona no definida' }}
                      </span>
                      <span class="inline-flex items-center gap-1.5" v-if="professional.online">
                        <Clock3 class="h-4 w-4" />
                        Disponible ahora
                      </span>
                    </div>

                    <p class="max-w-3xl text-gray-600 leading-7">
                      {{
                        professional.description ??
                        'Profesional listo para atender servicios con rapidez, buena valoración y atención confiable.'
                      }}
                    </p>

                    <div class="flex flex-wrap gap-3">
                      <RouterLink
                        :to="{ name: 'ProfessionalDetail', params: { id: professional.id } }"
                        class="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Ver perfil
                        <ChevronRight class="h-4 w-4" />
                      </RouterLink>

                      <RouterLink
                        :to="{
                          name: 'ProfessionalDetail',
                          params: { id: professional.id },
                          hash: '#booking',
                        }"
                        class="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Reservar
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </article>

              <div
                v-if="!visibleProfessionals.length"
                class="rounded-4xl border border-dashed border-gray-300 bg-white p-8 text-center"
              >
                <p class="font-semibold text-gray-800">
                  No encontramos profesionales con esos filtros.
                </p>
                <p class="mt-2 text-sm text-gray-500">
                  Prueba quitar filtros o buscar otra especialidad.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside class="space-y-8">
          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Atajos</h2>
                <p class="text-gray-500 mt-1">Accesos rápidos para seguir explorando.</p>
              </div>
              <Heart class="h-6 w-6 text-[#2563EB]" />
            </div>

            <div class="space-y-3">
              <RouterLink
                to="/client/favorites"
                class="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#F8FAFF] px-4 py-4 transition hover:border-blue-200"
              >
                <div>
                  <p class="font-semibold text-gray-900">Ver favoritos</p>
                  <p class="text-sm text-gray-500">Ir a profesionales guardados.</p>
                </div>
                <ChevronRight class="h-5 w-5 text-blue-600" />
              </RouterLink>

              <RouterLink
                to="/client/bookings"
                class="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#F8FAFF] px-4 py-4 transition hover:border-blue-200"
              >
                <div>
                  <p class="font-semibold text-gray-900">Mis reservas</p>
                  <p class="text-sm text-gray-500">Consultar estado y detalle.</p>
                </div>
                <CalendarDays class="h-5 w-5 text-blue-600" />
              </RouterLink>
            </div>
          </section>

          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Consejo rápido</h2>
                <p class="text-gray-500 mt-1">Mejora el resultado de tu búsqueda.</p>
              </div>
              <Sparkles class="h-6 w-6 text-[#2563EB]" />
            </div>

            <div class="space-y-4 text-sm text-gray-600 leading-6">
              <p>
                Filtra por comuna si necesitas atención cercana y por tarifa si ya tienes
                presupuesto definido.
              </p>
              <p>
                Abre el perfil antes de reservar: allí podrás revisar experiencia, calificaciones y
                empezar el flujo de contacto.
              </p>
            </div>
          </section>

          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Filtros activos</h2>
                <p class="text-gray-500 mt-1">Lo que está condicionando tus resultados.</p>
              </div>
              <SlidersHorizontal class="h-6 w-6 text-[#2563EB]" />
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                v-if="search"
                class="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                >{{ search }}</span
              >
              <span
                v-if="filters.commune"
                class="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                >{{ filters.commune }}</span
              >
              <span
                v-if="filters.specialtyId"
                class="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
              >
                {{ specialties.find((item) => String(item.id) === filters.specialtyId)?.name }}
              </span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>
