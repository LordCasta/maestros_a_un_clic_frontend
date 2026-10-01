<script setup lang="ts">
import type { Component } from 'vue'

/**
 * Lo que se muestra cuando una lista no tiene elementos. Siempre con una acción si la hay.
 */
defineProps<{ icon?: Component; title: string; description?: string }>()
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-neutral-200 px-6 py-12 text-center"
  >
    <span
      v-if="icon"
      class="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"
    >
      <component :is="icon" class="size-6" />
    </span>
    <h3 class="text-base font-bold text-neutral-900">{{ title }}</h3>
    <p v-if="description" class="max-w-sm text-sm text-neutral-500">{{ description }}</p>
    <div v-if="$slots.default" class="mt-2">
      <slot />
    </div>
  </div>
</template>
