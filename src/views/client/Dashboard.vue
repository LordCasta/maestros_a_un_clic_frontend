<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  Heart,
  Hammer,
  MapPin,
  PaintBucket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from 'lucide-vue-next'

const search = ref('')

const categories = [
  { id: 1, name: 'Plomería', icon: Wrench, jobs: '120+ profesionales', to: '/search' },
  { id: 2, name: 'Electricidad', icon: Zap, jobs: '95+ profesionales', to: '/search' },
  { id: 3, name: 'Carpintería', icon: Hammer, jobs: '80+ profesionales', to: '/search' },
  { id: 4, name: 'Pintura', icon: PaintBucket, jobs: '110+ profesionales', to: '/search' },
]

const professionals = [
  {
    id: 1,
    name: 'Carlos Méndez',
    specialty: 'Plomero certificado',
    rating: 4.9,
    reviews: 127,
    distance: '1.2 km',
    price: '$45.000/h',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    online: true,
  },
  {
    id: 2,
    name: 'Ana Rodríguez',
    specialty: 'Electricista profesional',
    rating: 5.0,
    reviews: 89,
    distance: '2.5 km',
    price: '$55.000/h',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    online: true,
  },
  {
    id: 3,
    name: 'Miguel Torres',
    specialty: 'Carpintero experto',
    rating: 4.8,
    reviews: 156,
    distance: '3 km',
    price: '$50.000/h',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    online: false,
  },
]

const activeBookings = [
  {
    id: 1,
    professional: 'Carlos Méndez',
    service: 'Reparación de tubería',
    date: 'Hoy · 3:00 PM',
    status: 'En camino',
    to: '/client/bookings/1',
  },
  {
    id: 2,
    professional: 'Ana Rodríguez',
    service: 'Instalación eléctrica',
    date: 'Mañana · 10:00 AM',
    status: 'Confirmado',
    to: '/client/bookings/2',
  },
]

const shortcuts = [
  {
    title: 'Ver mis reservas',
    description: 'Consulta citas activas, reprograma o revisa el estado de cada servicio.',
    to: '/client/bookings',
    icon: CalendarDays,
  },
  {
    title: 'Favoritos guardados',
    description: 'Accede rápido a los profesionales que ya marcaste como preferidos.',
    to: '/client/favorites',
    icon: Heart,
  },
  {
    title: 'Seguir buscando',
    description: 'Explora más profesionales por categoría, ubicación y disponibilidad.',
    to: '/search',
    icon: Search,
  },
]

const quickActions = ['Urgente', 'Más cercanos', 'Mejor calificados', 'Disponibles hoy']

const filteredProfessionals = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) {
    return professionals
  }

  return professionals.filter((pro) => {
    return [pro.name, pro.specialty, pro.distance, pro.price].some((field) =>
      field.toLowerCase().includes(query),
    )
  })
})
</script>

<template>
  <div class="min-h-screen bg-[#F4F7FB]">
    <div class="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section
        class="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB] p-8 lg:p-12 text-white mb-8"
      >
        <div class="absolute top-0 right-0 w-75 h-75 rounded-full bg-blue-400/20 blur-3xl" />
        <div class="absolute -bottom-20 left-1/3 w-60 h-60 rounded-full bg-sky-300/20 blur-3xl" />

        <div class="relative z-10 max-w-4xl space-y-6">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-sm"
          >
            <Sparkles class="w-4 h-4" />
            Tu centro de control para reservar y seguir servicios
          </div>

          <div>
            <h2 class="text-4xl md:text-6xl font-black leading-tight mb-5">
              Encuentra ayuda confiable en minutos
            </h2>
            <p class="text-blue-100 text-lg md:text-xl leading-relaxed max-w-3xl">
              Administra tus reservas activas, guarda profesionales favoritos y navega rápido hacia
              las páginas pendientes de desarrollo desde un solo lugar.
            </p>
          </div>

          <div class="grid gap-3 md:grid-cols-[1fr_auto] max-w-3xl">
            <div
              class="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md px-4 h-14"
            >
              <Search class="w-5 h-5 text-blue-100" />
              <input
                v-model="search"
                type="text"
                placeholder="Busca por profesional, especialidad, distancia o tarifa"
                class="w-full bg-transparent outline-none placeholder:text-blue-100/70 text-white"
              />
            </div>

            <RouterLink
              to="/search"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 h-14 font-semibold text-[#0F172A] transition hover:bg-blue-50"
            >
              Buscar ahora
              <ChevronRight class="w-4 h-4" />
            </RouterLink>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="item in quickActions"
              :key="item"
              class="px-5 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20 transition"
            >
              {{ item }}
            </button>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 xl:grid-cols-[1.1fr_420px] gap-8">
        <div class="space-y-8">
          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-3xl font-black text-gray-900">Atajos rápidos</h2>
                <p class="text-gray-500 mt-1">Entra directo a las páginas que ya puedes usar.</p>
              </div>
              <Bell class="w-6 h-6 text-[#2563EB]" />
            </div>

            <div class="grid md:grid-cols-3 gap-5">
              <RouterLink
                v-for="shortcut in shortcuts"
                :key="shortcut.title"
                :to="shortcut.to"
                class="group rounded-[1.75rem] border border-gray-100 bg-[#F8FAFF] p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div class="flex items-center justify-between gap-4 mb-4">
                  <div
                    class="w-12 h-12 rounded-2xl bg-white text-[#2563EB] flex items-center justify-center shadow-sm ring-1 ring-gray-100"
                  >
                    <component :is="shortcut.icon" class="w-5 h-5" />
                  </div>
                  <ChevronRight
                    class="w-5 h-5 text-blue-600 transition group-hover:translate-x-1"
                  />
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">{{ shortcut.title }}</h3>
                <p class="text-sm text-gray-600 leading-6">{{ shortcut.description }}</p>
              </RouterLink>
            </div>
          </section>

          <section>
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-3xl font-black text-gray-900">Categorías</h2>
                <p class="text-gray-500 mt-1">
                  Explora servicios populares y entra al buscador filtrado.
                </p>
              </div>

              <RouterLink to="/search" class="flex items-center gap-2 text-[#2563EB] font-semibold">
                Ver todas
                <ChevronRight class="w-4 h-4" />
              </RouterLink>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <RouterLink
                v-for="category in categories"
                :key="category.id"
                :to="category.to"
                class="group bg-white rounded-4xl border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <div
                  class="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-5 group-hover:bg-[#2563EB] group-hover:text-white transition"
                >
                  <component :is="category.icon" class="w-8 h-8" />
                </div>

                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ category.name }}</h3>
                <p class="text-gray-500 text-sm">{{ category.jobs }}</p>
              </RouterLink>
            </div>
          </section>

          <section>
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-3xl font-black text-gray-900">Profesionales cerca de ti</h2>
                <p class="text-gray-500 mt-1">Navega al perfil o filtra desde el buscador.</p>
              </div>
            </div>

            <div class="space-y-5">
              <div
                v-for="pro in filteredProfessionals"
                :key="pro.id"
                class="bg-white rounded-4xl border border-gray-100 p-5 hover:shadow-2xl transition"
              >
                <div class="flex flex-col lg:flex-row gap-5">
                  <div class="relative">
                    <img
                      :src="pro.image"
                      :alt="pro.name"
                      class="w-full lg:w-45 h-45 rounded-3xl object-cover"
                    />

                    <div
                      v-if="pro.online"
                      class="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold"
                    >
                      Disponible
                    </div>
                  </div>

                  <div class="flex-1">
                    <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div>
                        <div class="flex items-center gap-2 mb-2">
                          <h3 class="text-2xl font-black text-gray-900">
                            {{ pro.name }}
                          </h3>
                          <ShieldCheck class="w-5 h-5 text-[#2563EB]" />
                        </div>

                        <p class="text-gray-600 mb-4">{{ pro.specialty }}</p>

                        <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div class="flex items-center gap-1">
                            <Star class="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{{ pro.rating }} ({{ pro.reviews }} reseñas)</span>
                          </div>

                          <div class="flex items-center gap-1">
                            <MapPin class="w-4 h-4" />
                            <span>{{ pro.distance }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="flex flex-col items-start lg:items-end">
                        <span class="text-3xl font-black text-[#2563EB]">{{ pro.price }}</span>
                        <span class="text-sm text-gray-500">Tarifa promedio</span>
                      </div>
                    </div>

                    <div class="flex flex-wrap gap-3 mt-6">
                      <RouterLink
                        :to="`/professional/${pro.id}`"
                        class="flex-1 min-w-45 h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 transition text-white font-bold flex items-center justify-center"
                      >
                        Ver perfil
                      </RouterLink>

                      <RouterLink
                        to="/search"
                        class="h-14 px-6 rounded-2xl border border-gray-200 hover:bg-gray-50 transition font-semibold flex items-center justify-center"
                      >
                        Reservar servicio
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="!filteredProfessionals.length"
                class="rounded-4xl border border-dashed border-gray-300 bg-white p-8 text-center"
              >
                <p class="text-gray-700 font-semibold">No encontramos resultados con ese filtro.</p>
                <p class="text-gray-500 mt-2">
                  Prueba buscando por especialidad, distancia o tarifa.
                </p>
                <RouterLink
                  to="/search"
                  class="inline-flex items-center gap-2 mt-5 text-[#2563EB] font-semibold"
                >
                  Abrir buscador completo
                  <ChevronRight class="w-4 h-4" />
                </RouterLink>
              </div>
            </div>
          </section>
        </div>

        <div class="space-y-8">
          <section class="bg-white rounded-4xl border border-gray-100 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Reservas activas</h2>
                <p class="text-gray-500 mt-1">Servicios programados y accesos directos.</p>
              </div>
              <CalendarDays class="w-6 h-6 text-[#2563EB]" />
            </div>

            <div class="space-y-5">
              <RouterLink
                v-for="booking in activeBookings"
                :key="booking.id"
                :to="booking.to"
                class="block rounded-3xl bg-[#F4F7FB] p-5 border border-gray-100 transition hover:border-blue-200 hover:shadow-md"
              >
                <div class="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 class="font-bold text-gray-900">{{ booking.service }}</h3>
                    <p class="text-sm text-gray-500 mt-1">{{ booking.professional }}</p>
                  </div>

                  <div class="px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-semibold">
                    {{ booking.status }}
                  </div>
                </div>

                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <Clock3 class="w-4 h-4" />
                  {{ booking.date }}
                </div>
              </RouterLink>
            </div>
          </section>

          <section class="bg-white rounded-4xl border border-gray-100 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Accesos útiles</h2>
                <p class="text-gray-500 mt-1">
                  Ir rápido a las secciones que ya están en desarrollo.
                </p>
              </div>
              <Bell class="w-6 h-6 text-[#2563EB]" />
            </div>

            <div class="space-y-3">
              <RouterLink
                to="/client/bookings"
                class="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#F8FAFF] px-4 py-4 hover:border-blue-200 hover:shadow-sm transition"
              >
                <div>
                  <p class="font-semibold text-gray-900">Todas mis reservas</p>
                  <p class="text-sm text-gray-500">Consultar historial y detalles.</p>
                </div>
                <ChevronRight class="w-5 h-5 text-blue-600" />
              </RouterLink>

              <RouterLink
                to="/client/favorites"
                class="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#F8FAFF] px-4 py-4 hover:border-blue-200 hover:shadow-sm transition"
              >
                <div>
                  <p class="font-semibold text-gray-900">Mis favoritos</p>
                  <p class="text-sm text-gray-500">Volver a profesionales guardados.</p>
                </div>
                <Heart class="w-5 h-5 text-blue-600" />
              </RouterLink>

              <RouterLink
                to="/search"
                class="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#F8FAFF] px-4 py-4 hover:border-blue-200 hover:shadow-sm transition"
              >
                <div>
                  <p class="font-semibold text-gray-900">Explorar más servicios</p>
                  <p class="text-sm text-gray-500">Buscar por categoría o ubicación.</p>
                </div>
                <Search class="w-5 h-5 text-blue-600" />
              </RouterLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
