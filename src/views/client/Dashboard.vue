<script setup>
import { ref } from "vue";
import {
  Search,
  MapPin,
  Star,
  Clock3,
  Heart,
  Bell,
  Wrench,
  Zap,
  Hammer,
  PaintBucket,
  Filter,
  ChevronRight,
  ShieldCheck,
  CalendarDays,
  Menu,
  X,
  SlidersHorizontal,
  Sparkles,
} from "lucide-vue-next";

const mobileMenu = ref(false);
const search = ref("");

const categories = [
  {
    id: 1,
    name: "Plomería",
    icon: Wrench,
    jobs: "120+ profesionales",
  },
  {
    id: 2,
    name: "Electricidad",
    icon: Zap,
    jobs: "95+ profesionales",
  },
  {
    id: 3,
    name: "Carpintería",
    icon: Hammer,
    jobs: "80+ profesionales",
  },
  {
    id: 4,
    name: "Pintura",
    icon: PaintBucket,
    jobs: "110+ profesionales",
  },
];

const professionals = [
  {
    id: 1,
    name: "Carlos Méndez",
    specialty: "Plomero certificado",
    rating: 4.9,
    reviews: 127,
    distance: "1.2 km",
    price: "$45.000/h",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    online: true,
  },
  {
    id: 2,
    name: "Ana Rodríguez",
    specialty: "Electricista profesional",
    rating: 5.0,
    reviews: 89,
    distance: "2.5 km",
    price: "$55.000/h",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
    online: true,
  },
  {
    id: 3,
    name: "Miguel Torres",
    specialty: "Carpintero experto",
    rating: 4.8,
    reviews: 156,
    distance: "3 km",
    price: "$50.000/h",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    online: false,
  },
];

const activeBookings = [
  {
    id: 1,
    professional: "Carlos Méndez",
    service: "Reparación de tubería",
    date: "Hoy · 3:00 PM",
    status: "En camino",
  },
  {
    id: 2,
    professional: "Ana Rodríguez",
    service: "Instalación eléctrica",
    date: "Mañana · 10:00 AM",
    status: "Confirmado",
  },
];
</script>

<template>
  <div class="min-h-screen bg-[#F4F7FB]">
    <!-- NAVBAR -->
    

    <!-- CONTENT -->
    <div
      class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <!-- HERO -->
      <section
        class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB] p-8 lg:p-12 text-white mb-8"
      >
        <div
          class="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-400/20 blur-3xl"
        />

        <div class="relative z-10 max-w-3xl">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-sm mb-6"
          >
            <Sparkles class="w-4 h-4" />
            Profesionales verificados cerca de ti
          </div>

          <h2
            class="text-4xl md:text-6xl font-black leading-tight mb-5"
          >
            Encuentra el profesional ideal en minutos
          </h2>

          <p
            class="text-blue-100 text-lg md:text-xl mb-8 leading-relaxed"
          >
            Reserva servicios para tu hogar de forma
            rápida, segura y confiable.
          </p>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="item in [
                'Urgente',
                'Más cercanos',
                'Mejor calificados',
                'Disponibles hoy',
              ]"
              :key="item"
              class="px-5 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20 transition"
            >
              {{ item }}
            </button>
          </div>
        </div>
      </section>

      <!-- GRID -->
      <div
        class="grid grid-cols-1 xl:grid-cols-[1.1fr_420px] gap-8"
      >
        <!-- LEFT -->
        <div class="space-y-8">
          <!-- CATEGORIES -->
          <section>
            <div
              class="flex items-center justify-between mb-6"
            >
              <div>
                <h2
                  class="text-3xl font-black text-gray-900"
                >
                  Categorías
                </h2>

                <p class="text-gray-500 mt-1">
                  Explora servicios populares
                </p>
              </div>

              <button
                class="flex items-center gap-2 text-[#2563EB] font-semibold"
              >
                Ver todas
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>

            <div
              class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              <div
                v-for="category in categories"
                :key="category.id"
                class="group bg-white rounded-[2rem] border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div
                  class="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-5 group-hover:bg-[#2563EB] group-hover:text-white transition"
                >
                  <component
                    :is="category.icon"
                    class="w-8 h-8"
                  />
                </div>

                <h3
                  class="text-xl font-bold text-gray-900 mb-2"
                >
                  {{ category.name }}
                </h3>

                <p class="text-gray-500 text-sm">
                  {{ category.jobs }}
                </p>
              </div>
            </div>
          </section>

          <!-- PROFESSIONALS -->
          <section>
            <div
              class="flex items-center justify-between mb-6"
            >
              <div>
                <h2
                  class="text-3xl font-black text-gray-900"
                >
                  Profesionales cerca de ti
                </h2>

                <p class="text-gray-500 mt-1">
                  Recomendados según tu ubicación
                </p>
              </div>
            </div>

            <div class="space-y-5">
              <div
                v-for="pro in professionals"
                :key="pro.id"
                class="bg-white rounded-[2rem] border border-gray-100 p-5 hover:shadow-2xl transition"
              >
                <div
                  class="flex flex-col lg:flex-row gap-5"
                >
                  <div class="relative">
                    <img
                      :src="pro.image"
                      class="w-full lg:w-[180px] h-[180px] rounded-[1.5rem] object-cover"
                    />

                    <div
                      v-if="pro.online"
                      class="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold"
                    >
                      Disponible
                    </div>
                  </div>

                  <div class="flex-1">
                    <div
                      class="flex flex-col lg:flex-row lg:items-start justify-between gap-4"
                    >
                      <div>
                        <div
                          class="flex items-center gap-2 mb-2"
                        >
                          <h3
                            class="text-2xl font-black text-gray-900"
                          >
                            {{ pro.name }}
                          </h3>

                          <ShieldCheck
                            class="w-5 h-5 text-[#2563EB]"
                          />
                        </div>

                        <p
                          class="text-gray-600 mb-4"
                        >
                          {{ pro.specialty }}
                        </p>

                        <div
                          class="flex flex-wrap gap-4 text-sm text-gray-500"
                        >
                          <div
                            class="flex items-center gap-1"
                          >
                            <Star
                              class="w-4 h-4 text-yellow-500 fill-yellow-500"
                            />

                            <span>
                              {{ pro.rating }} ({{
                                pro.reviews
                              }}
                              reseñas)
                            </span>
                          </div>

                          <div
                            class="flex items-center gap-1"
                          >
                            <MapPin class="w-4 h-4" />

                            <span>
                              {{ pro.distance }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        class="flex flex-col items-start lg:items-end"
                      >
                        <span
                          class="text-3xl font-black text-[#2563EB]"
                        >
                          {{ pro.price }}
                        </span>

                        <span
                          class="text-sm text-gray-500"
                        >
                          Tarifa promedio
                        </span>
                      </div>
                    </div>

                    <div
                      class="flex flex-wrap gap-3 mt-6"
                    >
                      <button
                        class="flex-1 min-w-[180px] h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 transition text-white font-bold"
                      >
                        Reservar servicio
                      </button>

                      <button
                        class="h-14 px-6 rounded-2xl border border-gray-200 hover:bg-gray-50 transition font-semibold"
                      >
                        Ver perfil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- SIDEBAR -->
        <div class="space-y-8">
          <!-- BOOKINGS -->
          <section
            class="bg-white rounded-[2rem] border border-gray-100 p-6"
          >
            <div
              class="flex items-center justify-between mb-6"
            >
              <div>
                <h2
                  class="text-2xl font-black text-gray-900"
                >
                  Reservas activas
                </h2>

                <p class="text-gray-500 mt-1">
                  Servicios programados
                </p>
              </div>

              <CalendarDays
                class="w-6 h-6 text-[#2563EB]"
              />
            </div>

            <div class="space-y-5">
              <div
                v-for="booking in activeBookings"
                :key="booking.id"
                class="rounded-[1.5rem] bg-[#F4F7FB] p-5 border border-gray-100"
              >
                <div
                  class="flex items-start justify-between gap-4 mb-4"
                >
                  <div>
                    <h3
                      class="font-bold text-gray-900"
                    >
                      {{ booking.service }}
                    </h3>

                    <p
                      class="text-sm text-gray-500 mt-1"
                    >
                      {{ booking.professional }}
                    </p>
                  </div>

                  <div
                    class="px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-semibold"
                  >
                    {{ booking.status }}
                  </div>
                </div>

                <div
                  class="flex items-center gap-2 text-sm text-gray-500"
                >
                  <Clock3 class="w-4 h-4" />
                  {{ booking.date }}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
