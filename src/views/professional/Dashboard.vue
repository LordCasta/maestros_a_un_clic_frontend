<script setup lang="ts">
defineOptions({
  name: 'ProfessionalDashboard',
})

import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  Bell,
} from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const professionalName = computed(() => authStore.user?.name ?? 'Profesional')
const professionalInitials = computed(() =>
  professionalName.value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join(''),
)

const todayLabel = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())

const stats = [
  {
    label: 'Citas hoy',
    value: '8',
    detail: '+2 vs. ayer',
    accent: 'from-[#2563EB] to-[#60A5FA]',
  },
  {
    label: 'Ingresos del mes',
    value: '$4.850.000',
    detail: '74% del objetivo',
    accent: 'from-[#0F172A] to-[#334155]',
  },
  {
    label: 'Respuestas pendientes',
    value: '3',
    detail: 'Tiempo medio: 12 min',
    accent: 'from-[#0EA5E9] to-[#38BDF8]',
  },
  {
    label: 'Valoración',
    value: '4.9/5',
    detail: '127 opiniones',
    accent: 'from-[#F59E0B] to-[#FBBF24]',
  },
]

const quickActions = [
  {
    title: 'Abrir agenda',
    description: 'Revisa los huecos de hoy, bloquea horas y reordena turnos.',
    to: '/professional/availability',
    cta: 'Ir a disponibilidad',
  },
  {
    title: 'Gestionar servicios',
    description: 'Actualiza precios, paquetes y servicios destacados.',
    to: '/professional/services',
    cta: 'Editar servicios',
  },
  {
    title: 'Crear bloque',
    description: 'Añade un turno especial, una pausa o una reserva interna.',
    to: '/professional/availability',
    cta: 'Añadir bloque',
  },
]

const todayAgenda = [
  {
    time: '08:00',
    client: 'Laura Gómez',
    service: 'Mantenimiento de grifería',
    location: 'Cedritos, Bogotá',
    status: 'Confirmada',
    tone: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    time: '10:30',
    client: 'Jorge Ruiz',
    service: 'Instalación de punto eléctrico',
    location: 'Teusaquillo, Bogotá',
    status: 'En camino',
    tone: 'bg-sky-50 text-sky-700 border-sky-100',
  },
  {
    time: '14:00',
    client: 'Mariana Torres',
    service: 'Visita técnica y presupuesto',
    location: 'Chapinero, Bogotá',
    status: 'Pendiente de pago',
    tone: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  {
    time: '17:30',
    client: 'Andrés Pérez',
    service: 'Reparación urgente de fuga',
    location: 'Suba, Bogotá',
    status: 'Prioritaria',
    tone: 'bg-slate-100 text-slate-700 border-slate-200',
  },
]

const recentRequests = [
  {
    client: 'Camila López',
    service: 'Diagnóstico de panel eléctrico',
    when: 'Hace 14 min',
    budget: '$180.000',
  },
  {
    client: 'Felipe Castro',
    service: 'Revisión de fuga en cocina',
    when: 'Hace 32 min',
    budget: '$120.000',
  },
  {
    client: 'Sandra Molina',
    service: 'Instalación de luminarias',
    when: 'Hace 1 h',
    budget: '$240.000',
  },
]

const performance = [
  { label: 'Citas completadas', value: 86, detail: 'Este mes' },
  { label: 'Ocupación de agenda', value: 72, detail: 'Semana actual' },
  { label: 'Clientes recurrentes', value: 64, detail: 'Sobre el total' },
]

const services = [
  {
    name: 'Plomería residencial',
    bookings: '24 reservas',
    fill: 86,
  },
  {
    name: 'Urgencias 24/7',
    bookings: '11 reservas',
    fill: 68,
  },
  {
    name: 'Mantenimiento preventivo',
    bookings: '18 reservas',
    fill: 58,
  },
]
</script>

<template>
  <div class="min-h-screen bg-[#F4F7FB]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <section
        class="relative overflow-hidden rounded-4xl bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB] p-8 lg:p-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.24)]"
      >
        <div class="absolute -top-10 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div class="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />

        <div class="relative z-10 grid gap-8 xl:grid-cols-[1.4fr_0.9fr] xl:items-end">
          <div class="space-y-6">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur-md"
            >
              <Sparkles class="h-4 w-4" />
              Agenda activa y rendimiento en tiempo real
            </div>

            <div class="space-y-3">
              <p class="text-sm uppercase tracking-[0.28em] text-blue-100/80">
                Dashboard profesional
              </p>
              <h1 class="text-4xl font-black leading-tight md:text-5xl xl:text-6xl">
                Hola, {{ professionalName }}.
                <span class="block text-blue-100"
                  >Tienes {{ stats[0].value }} citas listas para hoy.</span
                >
              </h1>
              <p class="max-w-2xl text-base leading-7 text-blue-50/90 md:text-lg">
                {{ todayLabel }}, concentra tu jornada en los servicios que generan más valor,
                responde rápido a nuevas solicitudes y mantén tu agenda siempre ordenada.
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <RouterLink
                to="/professional/availability"
                class="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0F172A] transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <CalendarDays class="h-4 w-4" />
                Abrir agenda
              </RouterLink>
              <RouterLink
                to="/professional/services"
                class="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Plus class="h-4 w-4" />
                Gestionar servicios
              </RouterLink>
            </div>
          </div>

          <div
            class="grid gap-4 rounded-4xl border border-white/10 bg-white/10 p-5 backdrop-blur-md"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-100/80">Profesional verificado</p>
                <p class="text-lg font-bold">Perfil activo</p>
              </div>
              <div
                class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0F172A] font-black shadow-lg"
              >
                {{ professionalInitials || 'P' }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="rounded-2xl bg-white/10 p-4">
                <p class="text-blue-100/80">Cobertura</p>
                <p class="mt-2 text-xl font-bold">Zona norte</p>
              </div>
              <div class="rounded-2xl bg-white/10 p-4">
                <p class="text-blue-100/80">Tiempo respuesta</p>
                <p class="mt-2 text-xl font-bold">12 min</p>
              </div>
            </div>

            <div class="rounded-2xl bg-white/10 p-4">
              <div class="flex items-center justify-between text-sm text-blue-100/80">
                <span>Meta de ingresos</span>
                <span>74%</span>
              </div>
              <div class="mt-3 h-2 rounded-full bg-white/15">
                <div class="h-2 w-[74%] rounded-full bg-white" />
              </div>
              <p class="mt-3 text-sm text-blue-50/90">
                Vas por buen ritmo: faltan $1.650.000 para alcanzar el objetivo mensual.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="stat in stats"
          :key="stat.label"
          class="overflow-hidden rounded-4xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div :class="['rounded-2xl bg-linear-to-br p-4 text-white shadow-lg', stat.accent]">
            <p class="text-sm text-white/80">{{ stat.label }}</p>
            <p class="mt-2 text-3xl font-black tracking-tight">{{ stat.value }}</p>
          </div>
          <p class="mt-4 text-sm text-gray-500">{{ stat.detail }}</p>
        </article>
      </section>

      <div class="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="space-y-8">
          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Agenda</p>
                <h2 class="mt-1 text-2xl font-black text-gray-900">Citas de hoy</h2>
              </div>
              <RouterLink
                to="/professional/availability"
                class="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Ver agenda completa
                <ChevronRight class="h-4 w-4" />
              </RouterLink>
            </div>

            <div class="mt-6 space-y-4">
              <article
                v-for="booking in todayAgenda"
                :key="booking.time + booking.client"
                class="grid gap-4 rounded-3xl border border-gray-100 bg-[#F8FAFF] p-5 lg:grid-cols-[100px_1fr_auto] lg:items-center"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sm font-black text-[#0F172A] shadow-sm ring-1 ring-gray-100"
                  >
                    {{ booking.time }}
                  </div>
                  <div class="lg:hidden">
                    <p class="text-sm font-semibold text-gray-500">Hora</p>
                    <p class="font-black text-gray-900">{{ booking.time }}</p>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-lg font-bold text-gray-900">{{ booking.client }}</h3>
                    <span
                      :class="['rounded-full border px-3 py-1 text-xs font-semibold', booking.tone]"
                      >{{ booking.status }}</span
                    >
                  </div>
                  <p class="text-sm text-gray-600">{{ booking.service }}</p>
                  <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span class="inline-flex items-center gap-1.5"
                      ><MapPin class="h-4 w-4" />{{ booking.location }}</span
                    >
                    <span class="inline-flex items-center gap-1.5"
                      ><Clock3 class="h-4 w-4" />{{ booking.time }}</span
                    >
                  </div>
                </div>

                <div class="flex items-center gap-2 lg:flex-col lg:items-end">
                  <button
                    class="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:text-blue-600"
                  >
                    Revisar
                  </button>
                  <button
                    class="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Abrir
                  </button>
                </div>
              </article>
            </div>
          </section>

          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Solicitudes
                </p>
                <h2 class="mt-1 text-2xl font-black text-gray-900">Pedidos recientes</h2>
              </div>
              <button
                class="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Revisar todas
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>

            <div class="mt-6 grid gap-4 md:grid-cols-3">
              <article
                v-for="request in recentRequests"
                :key="request.client"
                class="rounded-3xl border border-gray-100 bg-[#F8FAFF] p-5"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-bold text-gray-900">{{ request.client }}</p>
                    <p class="mt-1 text-sm text-gray-600">{{ request.service }}</p>
                  </div>
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#2563EB] shadow-sm ring-1 ring-gray-100"
                  >
                    <Bell class="h-5 w-5" />
                  </div>
                </div>

                <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>{{ request.when }}</span>
                  <span class="font-semibold text-gray-900">{{ request.budget }}</span>
                </div>

                <div class="mt-5 flex gap-2">
                  <button
                    class="flex-1 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:text-blue-600"
                  >
                    Descartar
                  </button>
                  <button
                    class="flex-1 rounded-2xl bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
                  >
                    Responder
                  </button>
                </div>
              </article>
            </div>
          </section>
        </div>

        <aside class="space-y-8">
          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Accesos rápidos
                </p>
                <h2 class="mt-1 text-2xl font-black text-gray-900">Operación diaria</h2>
              </div>
              <div
                class="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"
              >
                <ShieldCheck class="h-5 w-5" />
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <RouterLink
                v-for="action in quickActions"
                :key="action.title"
                :to="action.to"
                class="group block rounded-3xl border border-gray-100 bg-[#F8FAFF] p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-bold text-gray-900">{{ action.title }}</p>
                    <p class="mt-1 text-sm leading-6 text-gray-600">{{ action.description }}</p>
                  </div>
                  <ChevronRight
                    class="h-5 w-5 text-blue-600 transition group-hover:translate-x-1"
                  />
                </div>
                <p class="mt-4 text-sm font-semibold text-blue-600">{{ action.cta }}</p>
              </RouterLink>
            </div>
          </section>

          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Rendimiento
              </p>
              <h2 class="mt-1 text-2xl font-black text-gray-900">Estado de la semana</h2>
            </div>

            <div class="mt-6 space-y-5">
              <div v-for="item in performance" :key="item.label" class="space-y-2">
                <div class="flex items-center justify-between gap-4 text-sm">
                  <span class="font-semibold text-gray-800">{{ item.label }}</span>
                  <span class="text-gray-500">{{ item.value }}%</span>
                </div>
                <div class="h-2 rounded-full bg-gray-100">
                  <div
                    class="h-2 rounded-full bg-linear-to-r from-[#2563EB] to-[#38BDF8]"
                    :style="{ width: `${item.value}%` }"
                  />
                </div>
                <p class="text-sm text-gray-500">{{ item.detail }}</p>
              </div>
            </div>
          </section>

          <section class="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Servicios activos
              </p>
              <h2 class="mt-1 text-2xl font-black text-gray-900">Lo que más reservas recibe</h2>
            </div>

            <div class="mt-6 space-y-4">
              <article
                v-for="service in services"
                :key="service.name"
                class="rounded-3xl border border-gray-100 bg-[#F8FAFF] p-4"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-bold text-gray-900">{{ service.name }}</p>
                    <p class="mt-1 text-sm text-gray-500">{{ service.bookings }}</p>
                  </div>
                  <span class="text-sm font-semibold text-blue-600">{{ service.fill }}%</span>
                </div>
                <div class="mt-3 h-2 rounded-full bg-white shadow-inner ring-1 ring-gray-100">
                  <div
                    class="h-2 rounded-full bg-linear-to-r from-[#0EA5E9] to-[#2563EB]"
                    :style="{ width: `${service.fill}%` }"
                  />
                </div>
              </article>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
