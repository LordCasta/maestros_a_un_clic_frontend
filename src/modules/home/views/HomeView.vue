<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { BrandMark } from '@/shared/ui'
import { ImageWithFallback } from '@/shared/ui'
import {
  Search,
  Wrench,
  Zap,
  Hammer,
  PaintBucket,
  Star,
  CheckCircle,
  MapPin,
  Clock,
  Menu,
  X,
  ShieldCheck,
  ArrowRight,
} from '@lucide/vue'

const searchQuery = ref('')
const location = ref('')
const mobileMenu = ref(false)

const router = useRouter()

const categories = [
  {
    id: 1,
    name: 'Plomería',
    icon: Wrench,
    image:
      'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=1200&q=80',
    count: '120+ profesionales',
  },
  {
    id: 2,
    name: 'Electricidad',
    icon: Zap,
    image:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    count: '95+ profesionales',
  },
  {
    id: 3,
    name: 'Carpintería',
    icon: Hammer,
    image:
      'https://images.unsplash.com/photo-1659930087003-2d64e33181f7?auto=format&fit=crop&w=1200&q=80',
    count: '80+ profesionales',
  },
  {
    id: 4,
    name: 'Pintura',
    icon: PaintBucket,
    image:
      'https://images.unsplash.com/photo-1618832515490-e181c4794a45?auto=format&fit=crop&w=1200&q=80',
    count: '110+ profesionales',
  },
]

const professionals = [
  {
    id: 1,
    name: 'Carlos Méndez',
    specialty: 'Plomero certificado',
    rating: 4.9,
    reviews: 127,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    distance: '1.2 km',
    price: 'Desde $35.000',
    available: 'Disponible hoy',
  },
  {
    id: 2,
    name: 'Ana Rodríguez',
    specialty: 'Electricista profesional',
    rating: 5.0,
    reviews: 89,
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
    distance: '2.5 km',
    price: 'Desde $40.000',
    available: 'Disponible mañana',
  },
  {
    id: 3,
    name: 'Miguel Torres',
    specialty: 'Carpintero experto',
    rating: 4.8,
    reviews: 156,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    distance: '3.0 km',
    price: 'Desde $38.000',
    available: 'Disponible hoy',
  },
]

const howItWorks = [
  {
    id: 1,
    icon: Search,
    title: 'Busca el servicio',
    description: 'Selecciona el tipo de trabajo que necesitas en tu hogar.',
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: 'Compara profesionales',
    description: 'Consulta perfiles verificados, reseñas y experiencia.',
  },
  {
    id: 3,
    icon: Clock,
    title: 'Agenda fácilmente',
    description: 'Habla con el profesional y coordina la visita rápidamente.',
  },
]

const handleSearch = () => {
  router.push({
    name: 'search',
    query: {
      q: searchQuery.value,
      location: location.value,
    },
  })
}

const handleCategoryClick = (categoryName: string) => {
  router.push({
    name: 'search',
    query: {
      q: categoryName,
    },
  })
}

// Destacados de muestra: hasta conectarlos a la API, "Ver perfil" lleva a la búsqueda.
const viewProfile = () => {
  router.push({ name: 'search' })
}
</script>

<template>
  <div class="min-h-screen bg-white text-neutral-900 overflow-x-hidden">
    <!-- NAVBAR -->
    <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-neutral-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="h-16 flex items-center justify-between">
          <!-- LOGO -->
          <div class="flex items-center gap-3">
            <BrandMark size="sm" subtitle="Servicios confiables para tu hogar" />
          </div>

          <!-- DESKTOP MENU -->
          <div class="hidden lg:flex items-center gap-8">
            <a
              href="#servicios"
              class="text-sm font-medium text-neutral-600 hover:text-primary-600 transition"
            >
              Servicios
            </a>

            <a
              href="#profesionales"
              class="text-sm font-medium text-neutral-600 hover:text-primary-600 transition"
            >
              Profesionales
            </a>

            <a
              href="#como-funciona"
              class="text-sm font-medium text-neutral-600 hover:text-primary-600 transition"
            >
              Cómo funciona
            </a>

            <router-link
              to="/login"
              class="text-primary-600 font-medium hover:text-primary-700 transition"
            >
              Iniciar sesión
            </router-link>

            <router-link
              to="/register/client"
              class="bg-primary-600 hover:bg-primary-700 transition text-white px-5 py-2.5 rounded-xl font-medium shadow-md"
            >
              Registrarse
            </router-link>
          </div>

          <!-- MOBILE BUTTON -->
          <button class="lg:hidden" @click="mobileMenu = !mobileMenu">
            <X v-if="mobileMenu" class="w-6 h-6" />
            <Menu v-else class="w-6 h-6" />
          </button>
        </div>

        <!-- MOBILE MENU -->
        <div
          v-if="mobileMenu"
          class="lg:hidden pb-5 flex flex-col gap-4 border-t border-neutral-100 pt-4"
        >
          <a href="#servicios" class="text-neutral-700" @click="mobileMenu = false"> Servicios </a>
          <a href="#profesionales" class="text-neutral-700" @click="mobileMenu = false">
            Profesionales
          </a>
          <a href="#como-funciona" class="text-neutral-700" @click="mobileMenu = false">
            Cómo funciona
          </a>

          <router-link
            to="/login"
            class="text-primary-600 font-medium text-left"
            @click="mobileMenu = false"
          >
            Iniciar sesión
          </router-link>

          <router-link
            to="/register/client"
            class="bg-primary-600 text-white py-3 rounded-xl text-center"
            @click="mobileMenu = false"
          >
            Registrarse
          </router-link>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-linear-to-br from-primary-50 via-white to-neutral-100" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- LEFT -->
          <div>
            <div
              class="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <CheckCircle class="w-4 h-4" />
              Profesionales verificados
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Encuentra expertos para tu hogar en minutos
            </h1>

            <p class="mt-6 text-lg text-neutral-600 leading-relaxed max-w-xl">
              Conecta con plomeros, electricistas, carpinteros y más profesionales confiables cerca
              de ti.
            </p>

            <!-- SEARCH BOX -->
            <div class="mt-10 bg-white rounded-3xl shadow-2xl border border-neutral-100 p-4">
              <form
                class="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4"
                @submit.prevent="handleSearch"
              >
                <div class="flex items-center bg-neutral-50 rounded-2xl px-4 h-14">
                  <Search class="w-5 h-5 text-neutral-400 mr-3 shrink-0" />

                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="¿Qué servicio necesitas?"
                    class="bg-transparent outline-none w-full text-sm text-neutral-800 placeholder:text-neutral-400"
                  />
                </div>

                <div class="flex items-center bg-neutral-50 rounded-2xl px-4 h-14">
                  <MapPin class="w-5 h-5 text-neutral-400 mr-3 shrink-0" />

                  <input
                    v-model="location"
                    type="text"
                    placeholder="Tu ubicación"
                    class="bg-transparent outline-none w-full text-sm text-neutral-800 placeholder:text-neutral-400"
                  />
                </div>

                <button
                  type="submit"
                  class="h-14 px-8 rounded-2xl bg-primary-600 hover:bg-primary-700 transition text-white font-semibold flex items-center justify-center gap-2"
                >
                  Buscar
                  <ArrowRight class="w-4 h-4" />
                </button>
              </form>
            </div>

            <!-- FEATURES -->
            <div class="mt-8 grid sm:grid-cols-3 gap-4">
              <div class="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle class="w-5 h-5 text-success-500" />
                Pago seguro
              </div>

              <div class="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle class="w-5 h-5 text-success-500" />
                Reseñas reales
              </div>

              <div class="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle class="w-5 h-5 text-success-500" />
                Atención rápida
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="relative">
            <div class="rounded-4xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80"
                alt="Profesional trabajando"
                class="w-full h-[500px] object-cover"
              />
            </div>

            <div
              class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 w-64 hidden sm:block"
            >
              <div class="flex items-center gap-3">
                <div class="bg-success-100 p-3 rounded-xl">
                  <Star class="w-6 h-6 text-success-500 fill-current" />
                </div>

                <div>
                  <h3 class="font-bold text-lg">4.9/5</h3>
                  <p class="text-sm text-neutral-500">Más de 2.000 reseñas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section id="servicios" class="py-20 bg-neutral-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p class="text-primary-600 font-semibold mb-2">Servicios populares</p>

            <h2 class="text-3xl md:text-4xl font-bold">Todo lo que necesitas para tu hogar</h2>
          </div>

          <p class="text-neutral-600 max-w-lg">
            Encuentra profesionales confiables para reparaciones, remodelaciones y mantenimiento.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="category in categories"
            :key="category.id"
            class="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-neutral-100 hover:-translate-y-1 cursor-pointer"
            @click="handleCategoryClick(category.name)"
          >
            <div class="relative h-56 overflow-hidden">
              <ImageWithFallback
                :src="category.image"
                :alt="category.name"
                class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              <div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

              <div class="absolute bottom-5 left-5 text-white">
                <div
                  class="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                >
                  <component :is="category.icon" class="w-6 h-6" />
                </div>

                <h3 class="text-2xl font-bold">{{ '\u00A0' }}{{ category.name }}</h3>

                <p class="text-sm text-white/80">{{ '\u00A0' }}{{ category.count }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PROFESSIONALS -->
    <section id="profesionales" class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-primary-600 font-semibold mb-3">Profesionales destacados</p>

          <h2 class="text-3xl md:text-4xl font-bold mb-4">Expertos cerca de ti</h2>

          <p class="text-neutral-600 max-w-2xl mx-auto">
            Contrata profesionales verificados con experiencia y excelentes valoraciones.
          </p>
        </div>

        <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div
            v-for="professional in professionals"
            :key="professional.id"
            class="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
          >
            <div class="relative">
              <ImageWithFallback
                :src="professional.image"
                :alt="professional.name"
                class="w-full h-72 object-cover"
              />

              <div
                class="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow"
              >
                {{ professional.available }}
              </div>
            </div>

            <div class="p-6">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-xl font-bold">
                    {{ professional.name }}
                  </h3>

                  <p class="text-neutral-500 mt-1">
                    {{ professional.specialty }}
                  </p>
                </div>

                <div
                  class="flex items-center bg-success-50 text-success-600 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  <Star class="w-4 h-4 fill-current mr-1 text-success-500" />
                  {{ professional.rating }}
                </div>
              </div>

              <div class="mt-5 flex items-center justify-between text-sm text-neutral-500">
                <div class="flex items-center">
                  <MapPin class="w-4 h-4 mr-1 text-neutral-400" />
                  {{ professional.distance }}
                </div>

                <span>{{ professional.reviews }} reseñas</span>
              </div>

              <div class="mt-6 flex items-center justify-between">
                <div>
                  <p class="text-sm text-neutral-500">Precio inicial</p>

                  <p class="text-xl font-bold text-primary-600">
                    {{ professional.price }}
                  </p>
                </div>

                <button
                  class="bg-primary-600 hover:bg-primary-700 transition text-white px-5 py-3 rounded-xl font-medium"
                  @click="viewProfile()"
                >
                  Ver perfil
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-14">
          <button
            class="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition px-8 py-4 rounded-2xl font-semibold"
            @click="handleSearch"
          >
            Ver todos los profesionales
          </button>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section id="como-funciona" class="py-20 bg-neutral-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <p class="text-primary-600 font-semibold mb-3">Proceso sencillo</p>

          <h2 class="text-3xl md:text-4xl font-bold mb-4">¿Cómo funciona?</h2>

          <p class="text-neutral-600 max-w-2xl mx-auto">
            Solicita servicios para tu hogar en pocos minutos.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="step in howItWorks"
            :key="step.id"
            class="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 hover:shadow-xl transition"
          >
            <div class="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6">
              <component :is="step.icon" class="w-8 h-8 text-primary-600" />
            </div>

            <div class="flex items-center gap-3 mb-4">
              <span
                class="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold"
              >
                {{ step.id }}
              </span>

              <h3 class="text-xl font-bold">
                {{ step.title }}
              </h3>
            </div>

            <p class="text-neutral-600 leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-primary-600 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute -top-10 -left-10 w-72 h-72 bg-white rounded-full" />
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full" />
      </div>

      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-white leading-tight">
          ¿Eres maestro o profesional independiente?
        </h2>

        <p class="mt-6 text-lg text-primary-100 max-w-2xl mx-auto">
          Regístrate en Maestros a un clic y conecta con cientos de clientes que buscan tus
          servicios todos los días.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <router-link
            to="/register/professional"
            class="bg-white text-primary-600 hover:bg-neutral-100 transition px-8 py-4 rounded-2xl font-semibold shadow-lg text-center"
          >
            Registrarme como profesional
          </router-link>

          <a
            href="#como-funciona"
            class="border-2 border-white text-white hover:bg-white/10 transition px-8 py-4 rounded-2xl font-semibold text-center flex items-center justify-center"
          >
            Conocer más
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
