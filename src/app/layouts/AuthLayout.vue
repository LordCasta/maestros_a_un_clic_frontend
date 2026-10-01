<script setup lang="ts">
import { CircleCheck } from '@lucide/vue'

import { BrandMark } from '@/shared/ui'

const BENEFITS = [
  'Profesionales con identidad verificada',
  'Reservas con agenda, sin cruces de horario',
  'Calificaciones reales de otros clientes',
]
</script>

<template>
  <div class="flex min-h-screen bg-canvas">
    <div
      class="relative hidden w-1/2 items-center justify-center overflow-hidden bg-linear-to-br from-primary-600 to-primary-800 lg:flex"
    >
      <div class="absolute -top-24 -right-24 size-72 rounded-full bg-white/10" />
      <div class="absolute -bottom-36 -left-36 size-112 rounded-full bg-white/10" />

      <div class="relative z-10 max-w-sm space-y-10 px-8 text-white">
        <RouterLink :to="{ name: 'home' }" class="block w-fit">
          <BrandMark size="lg" tone="light" subtitle="Profesionales del hogar en Medellín" />
        </RouterLink>
        <ul class="space-y-4">
          <li
            v-for="benefit in BENEFITS"
            :key="benefit"
            class="flex items-center gap-3 text-primary-50"
          >
            <CircleCheck class="size-5 shrink-0" /> {{ benefit }}
          </li>
        </ul>
      </div>
    </div>

    <main class="flex w-full items-center justify-center px-4 py-10 sm:px-8 lg:w-1/2 lg:bg-surface">
      <div class="w-full max-w-lg">
        <RouterView />
      </div>
    </main>
  </div>
</template>
