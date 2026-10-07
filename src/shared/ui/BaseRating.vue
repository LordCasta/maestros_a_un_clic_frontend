<script setup lang="ts">
import { Star } from '@lucide/vue'

import type { Rating } from '../types/models'
import { formatRating } from '../utils/format'

/**
 * Calificación compacta: ★ 4,8 (12). Sin reseñas muestra "Nuevo".
 */
defineProps<{ rating: Rating }>()
</script>

<template>
  <span class="inline-flex items-center gap-1 text-sm">
    <Star class="size-4 fill-warning-400 text-warning-400" aria-hidden="true" />
    <template v-if="rating.count > 0">
      <span class="font-semibold text-neutral-900">{{ formatRating(rating.average) }}</span>
      <span class="text-neutral-500">({{ rating.count }})</span>
      <span class="sr-only">de 5, {{ rating.count }} reseñas</span>
    </template>
    <span v-else class="font-medium text-neutral-500">Nuevo</span>
  </span>
</template>
