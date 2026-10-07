<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'

import type { PaginationMeta } from '../types/api'

/**
 * Paginación de listas que vienen con `meta` de la API.
 *
 *   <BasePagination v-model:page="page" :meta="data.meta" />
 */
const page = defineModel<number>('page', { required: true })
defineProps<{ meta: PaginationMeta }>()
</script>

<template>
  <nav
    v-if="meta.last_page > 1"
    class="flex items-center justify-between gap-4 text-sm"
    aria-label="Paginación"
  >
    <button
      type="button"
      class="inline-flex items-center gap-1 rounded-xl px-3 py-2 font-semibold text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
      :disabled="page <= 1"
      @click="page--"
    >
      <ChevronLeft class="size-4" /> Anterior
    </button>
    <span class="text-neutral-500">Página {{ meta.current_page }} de {{ meta.last_page }}</span>
    <button
      type="button"
      class="inline-flex items-center gap-1 rounded-xl px-3 py-2 font-semibold text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
      :disabled="page >= meta.last_page"
      @click="page++"
    >
      Siguiente <ChevronRight class="size-4" />
    </button>
  </nav>
</template>
