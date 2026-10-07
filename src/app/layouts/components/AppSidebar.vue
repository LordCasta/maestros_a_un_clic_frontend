<script setup lang="ts">
import { computed } from 'vue'

import { useAuthStore } from '@/modules/auth'

import { NAV_ITEMS } from '../navigation'

/** Navegación lateral (pantallas grandes). Disponible para layouts que la necesiten. */
const auth = useAuthStore()
const items = computed(() => NAV_ITEMS[auth.role ?? 'guest'])
</script>

<template>
  <aside class="hidden w-64 shrink-0 border-r border-neutral-200 bg-white lg:block">
    <nav class="space-y-1 p-4" aria-label="Secciones">
      <RouterLink
        v-for="item in items"
        :key="item.label"
        :to="item.to"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
        active-class="bg-primary-50 text-primary-700"
      >
        <component :is="item.icon" class="size-4.5" /> {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
