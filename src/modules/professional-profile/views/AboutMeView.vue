<template>
  <div class="min-h-screen bg-[#F7F7F2] text-gray-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
      <section class="space-y-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[#2563EB]">
              Perfil profesional
            </p>
            <h1 class="mt-3 text-4xl lg:text-5xl font-black tracking-tight">Sobre mí</h1>
          </div>

          <router-link
            to="/professional/dashboard"
            class="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:text-[#2563EB]"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al dashboard
          </router-link>
        </div>

        <div class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div class="overflow-hidden rounded-4xl border border-gray-200 bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80"
              alt="Profesional sonriendo"
              class="h-95 w-full object-cover object-center"
            />
          </div>

          <div class="flex items-center">
            <div class="space-y-5 lg:max-w-md">
              <p class="text-2xl font-black text-gray-900">¿Quien soy?</p>
              <p class="text-sm leading-7 text-gray-600">
                Soy una persona muy proactiva que le gusta realizar trabajos sobre decoración de
                interiores. Me enfoco en dar soluciones cuidadas, ordenadas y con buena atención al
                detalle para cada proyecto.
              </p>

              <div class="flex flex-wrap gap-3">
                <span
                  class="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2563EB]"
                >
                  Decoración
                </span>
                <span
                  class="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
                >
                  Interiores
                </span>
                <span
                  class="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
                >
                  Detalle
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-4xl border border-gray-200 bg-white p-6 lg:p-8 shadow-sm">
        <h2 class="text-2xl font-black text-gray-900">Información Personal</h2>

        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <div v-for="field in personalFields" :key="field.label" class="space-y-2">
            <label class="text-sm text-gray-600">{{ field.label }}</label>
            <div
              class="h-12 rounded-lg border border-gray-200 bg-white px-4 flex items-center text-sm text-gray-500"
            >
              {{ field.value }}
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <article class="rounded-[1.75rem] border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-2xl font-black text-gray-900">Portafolio</h2>
            <span class="text-sm text-gray-500">Galería de trabajos recientes</span>
          </div>
          <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="item in portfolioItems"
              :key="item.title"
              class="overflow-hidden rounded-3xl border border-gray-200 bg-[#FAFAF7]"
            >
              <img :src="item.image" :alt="item.title" class="h-48 w-full object-cover" />
              <div class="p-4">
                <p class="font-semibold text-gray-900">{{ item.title }}</p>
                <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-[1.75rem] border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-2xl font-black text-gray-900">Estudio</h2>
            <span class="text-sm text-gray-500">Formación y certificaciones</span>
          </div>
          <div class="mt-5 space-y-4">
            <div
              v-for="item in studies"
              :key="item.title"
              class="rounded-2xl border border-gray-200 bg-[#FAFAF7] px-5 py-4"
            >
              <p class="font-semibold text-gray-900">{{ item.title }}</p>
              <p class="mt-1 text-sm text-gray-500">{{ item.detail }}</p>
            </div>
          </div>
        </article>

        <article class="rounded-[1.75rem] border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-2xl font-black text-gray-900">Experiencia Laboral</h2>
            <span class="text-sm text-gray-500">Trayectoria profesional</span>
          </div>
          <div class="mt-5 space-y-4">
            <div
              v-for="item in experiences"
              :key="item.company"
              class="rounded-2xl border border-gray-200 bg-[#FAFAF7] px-5 py-4"
            >
              <div class="flex flex-wrap items-center justify-between gap-3">
                <p class="font-semibold text-gray-900">{{ item.company }}</p>
                <p class="text-sm text-gray-500">{{ item.period }}</p>
              </div>
              <p class="mt-1 text-sm text-gray-600">{{ item.role }}</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ProfessionalAboutMe',
})

const personalFields = [
  { label: 'Nombres', value: 'Andrea' },
  { label: 'Apellidos', value: 'García' },
  { label: 'Correo', value: 'andrea.garcia@ejemplo.com' },
  { label: 'Número de contacto', value: '+57 300 000 0000' },
  { label: 'Dirección', value: 'Calle 123 #45-67' },
  { label: 'Barrio', value: 'Chapinero' },
]

const portfolioItems = [
  {
    title: 'Sala minimalista',
    description: 'Diseño en tonos claros y acabados cálidos.',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Dormitorio acogedor',
    description: 'Composición suave con iluminación natural.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Espacio de trabajo',
    description: 'Ambiente funcional para home office.',
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  },
]

const studies = [
  {
    title: 'Diseño de interiores',
    detail: 'Instituto de Artes Aplicadas · 2019 - 2021',
  },
  {
    title: 'Decoración y ambientación',
    detail: 'Certificación técnica · 2022',
  },
  {
    title: 'Iluminación interior',
    detail: 'Curso especializado · 2024',
  },
]

const experiences = [
  {
    company: 'Studio Casa Viva',
    role: 'Asesora de ambientación y selección de materiales',
    period: '2023 - Actualidad',
  },
  {
    company: 'Atelier Interior',
    role: 'Diseño de espacios residenciales y comerciales',
    period: '2021 - 2023',
  },
  {
    company: 'Freelance',
    role: 'Proyectos de renovación y decoración por encargo',
    period: '2019 - 2021',
  },
]
</script>

<style scoped></style>
