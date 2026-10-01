<script setup lang="ts">
import { CircleCheck, ShieldCheck } from '@lucide/vue'

import { useCategories } from '@/modules/catalog'
import { BrandMark } from '@/shared/ui'

const { data: categories } = useCategories()
</script>

<template>
  <footer class="bg-neutral-950 text-neutral-400">
    <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="grid gap-10 md:grid-cols-3">
        <div class="space-y-4">
          <BrandMark size="sm" tone="light" :subtitle="null" />
          <p class="text-sm leading-relaxed">
            Conectamos a clientes con maestros y profesionales del hogar verificados en Medellín.
          </p>
        </div>

        <div>
          <h3 class="mb-4 font-semibold text-white">Servicios</h3>
          <ul class="space-y-2.5 text-sm">
            <li v-for="category in (categories ?? []).slice(0, 5)" :key="category.id">
              <RouterLink
                :to="{ name: 'search', query: { category_id: category.id } }"
                class="transition hover:text-white"
              >
                {{ category.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 font-semibold text-white">Confianza</h3>
          <div class="space-y-3 text-sm">
            <p class="flex items-start gap-3">
              <ShieldCheck class="mt-0.5 size-5 shrink-0 text-success-500" />
              Identidad y certificados revisados por nuestro equipo.
            </p>
            <p class="flex items-start gap-3">
              <CircleCheck class="mt-0.5 size-5 shrink-0 text-success-500" />
              Calificaciones de clientes que contrataron el servicio.
            </p>
          </div>
        </div>
      </div>

      <p class="mt-12 border-t border-neutral-800 pt-8 text-center text-sm">
        © {{ new Date().getFullYear() }} Maestros a un clic.
      </p>
    </div>
  </footer>
</template>
