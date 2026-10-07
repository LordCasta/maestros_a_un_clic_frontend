<script setup lang="ts">
import { computed, ref, watch } from 'vue'

/**
 * Foto de perfil con iniciales de respaldo si no hay imagen o no carga.
 */
const props = withDefaults(
  defineProps<{ name: string; src?: string | null; size?: 'sm' | 'md' | 'lg' | 'xl' }>(),
  { size: 'md' },
)

const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)

const initials = computed(() =>
  props.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join(''),
)

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-11 text-sm',
  lg: 'size-16 text-lg',
  xl: 'size-24 text-2xl',
}
</script>

<template>
  <img
    v-if="src && !failed"
    :src="src"
    :alt="name"
    :class="['shrink-0 rounded-full object-cover', SIZES[size]]"
    @error="failed = true"
  />
  <span
    v-else
    role="img"
    :aria-label="name"
    :class="[
      'inline-flex shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700',
      SIZES[size],
    ]"
  >
    {{ initials }}
  </span>
</template>
