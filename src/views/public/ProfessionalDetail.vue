<script setup>
import { onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-vue-next'

defineOptions({
  name: 'ProfessionalDetail',
})

const route = useRoute()

const professional = {
  name: 'Andrea García',
  specialty: 'Decoración de interiores',
  rating: 4.9,
  reviews: 127,
  commune: 'Chapinero, Bogotá',
  online: true,
  hourly_rate: 45000,
  experience_years: 8,
  description:
    'Soy una persona muy proactiva que le gusta realizar trabajos sobre decoración de interiores. Me enfoco en dar soluciones cuidadas, ordenadas y con buena atención al detalle para cada proyecto.',
  email: 'andrea.garcia@ejemplo.com',
  phone: '+57 300 000 0000',
  image:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
  services: [
    {
      name: 'Diseño de salas y espacios sociales',
      description: 'Propuestas funcionales con acabados modernos y cálidos.',
      price: 45000,
    },
    {
      name: 'Asesoría de color y mobiliario',
      description: 'Selección de paleta, distribución y estilo según el espacio.',
      price: 38000,
    },
    {
      name: 'Decoración de habitaciones',
      description: 'Ambientación acogedora para dormitorios y zonas privadas.',
      price: 42000,
    },
  ],
  portfolio_images: [
    {
      url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    },
  ],
}

const studies = [
  'Diseño de interiores · Instituto de Artes Aplicadas',
  'Decoración y ambientación · Certificación técnica',
  'Iluminación interior · Curso especializado',
]

const testimonials = [
  {
    name: 'Laura Gómez',
    text: 'Muy detallista, puntual y con una propuesta de color impecable.',
  },
  {
    name: 'Jorge Ruiz',
    text: 'Nos ayudó a darle identidad al espacio sin salirnos del presupuesto.',
  },
  {
    name: 'Mariana Torres',
    text: 'La experiencia fue ágil y el resultado quedó exactamente como queríamos.',
  },
]

const formatPrice = (value) => `$${new Intl.NumberFormat('es-CO').format(value)}`

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

        <div class="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
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
                {{ professional.specialty }}
              </p>
            </div>

            <div class="flex flex-wrap gap-4 text-sm text-blue-100/90">
              <span class="inline-flex items-center gap-1.5">
                <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {{ professional.rating }} ({{ professional.reviews }} reseñas)
              </span>
              <span class="inline-flex items-center gap-1.5">
                <MapPin class="h-4 w-4" />
                {{ professional.commune }}
              </span>
              <span v-if="professional.online" class="inline-flex items-center gap-1.5">
                <Clock3 class="h-4 w-4" />
                Disponible ahora
              </span>
            </div>

            <div class="flex flex-wrap gap-3">
              <RouterLink
                to="/search"
                class="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0F172A] transition hover:bg-blue-50"
              >
                Ver más perfiles
              </RouterLink>

              <RouterLink
                :to="'#booking'"
                class="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Reservar ahora
                <CalendarDays class="h-4 w-4" />
              </RouterLink>
            </div>
          </div>

          <div
            class="rounded-4xl border border-white/10 bg-white/10 p-5 backdrop-blur-md space-y-4"
          >
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-sm text-blue-100/80">Tarifa base</p>
                <p class="text-3xl font-black">{{ formatPrice(professional.hourly_rate) }}</p>
              </div>
              <div
                class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white overflow-hidden"
              >
                <img :src="professional.image" alt="Perfil" class="h-full w-full object-cover" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="rounded-2xl bg-white/10 p-4">
                <p class="text-blue-100/80">Experiencia</p>
                <p class="mt-2 text-xl font-bold">{{ professional.experience_years }} años</p>
              </div>
              <div class="rounded-2xl bg-white/10 p-4">
                <p class="text-blue-100/80">Respuesta</p>
                <p class="mt-2 text-xl font-bold">12 min</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-8">
          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Sobre el profesional</h2>
                <p class="text-gray-500 mt-1">Información general y capacidades principales.</p>
              </div>
              <ShieldCheck class="h-6 w-6 text-[#2563EB]" />
            </div>

            <p class="text-gray-600 leading-7">{{ professional.description }}</p>

            <div class="mt-6 grid gap-4 md:grid-cols-2">
              <div class="rounded-3xl bg-[#F8FAFF] p-5 border border-gray-100">
                <p class="text-sm font-semibold text-gray-500">Contacto</p>
                <p class="mt-2 font-bold text-gray-900">{{ professional.email }}</p>
                <p class="mt-1 text-sm text-gray-500">{{ professional.phone }}</p>
              </div>

              <div class="rounded-3xl bg-[#F8FAFF] p-5 border border-gray-100">
                <p class="text-sm font-semibold text-gray-500">Ubicación</p>
                <p class="mt-2 font-bold text-gray-900">{{ professional.commune }}</p>
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
                v-for="service in professional.services"
                :key="service.name"
                class="rounded-3xl border border-gray-100 bg-[#F8FAFF] p-4"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-semibold text-gray-900">{{ service.name }}</p>
                    <p class="text-sm text-gray-500">{{ service.description }}</p>
                  </div>
                  <span
                    class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm"
                  >
                    {{ formatPrice(service.price) }}
                  </span>
                </div>
              </article>
            </div>
          </section>

          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Estudio y formación</h2>
                <p class="text-gray-500 mt-1">Base académica y especializaciones.</p>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="item in studies"
                :key="item"
                class="rounded-2xl border border-gray-200 bg-[#FAFAF7] px-5 py-4"
              >
                <p class="font-semibold text-gray-900">{{ item }}</p>
              </div>
            </div>
          </section>
        </div>

        <aside class="space-y-8">
          <section id="booking" class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Solicitar reserva</h2>
                <p class="text-gray-500 mt-1">
                  Pantalla estática, lista para conectar la API luego.
                </p>
              </div>
              <CalendarDays class="h-6 w-6 text-[#2563EB]" />
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700">Descripción del servicio</label>
                <div
                  class="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 min-h-28"
                >
                  Describe la necesidad o problema a resolver
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700">Fecha y hora</label>
                <div
                  class="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
                >
                  Por confirmar
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700">Total estimado</label>
                <div
                  class="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
                >
                  A convenir
                </div>
              </div>

              <button
                type="button"
                class="w-full rounded-2xl bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Solicitar reserva
              </button>
            </div>
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
                v-for="item in professional.portfolio_images"
                :key="item.url"
                :src="item.url"
                alt="Portfolio"
                class="h-28 w-full rounded-3xl object-cover"
              />
            </div>

            <div class="mt-6 space-y-3 text-sm text-gray-600">
              <p>
                Certificaciones, portafolio y reseñas pueden conectarse más adelante con la API.
              </p>
              <p>Esta pantalla se mantiene estática para todos los accesos desde “Ver perfil”.</p>
            </div>
          </section>

          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900">Reseñas</h2>
                <p class="text-gray-500 mt-1">Comentarios de clientes recientes.</p>
              </div>
            </div>

            <div class="space-y-4">
              <article
                v-for="item in testimonials"
                :key="item.name"
                class="rounded-3xl border border-gray-100 bg-[#F8FAFF] p-4"
              >
                <p class="font-semibold text-gray-900">{{ item.name }}</p>
                <p class="mt-2 text-sm leading-6 text-gray-600">{{ item.text }}</p>
              </article>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>
