<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

import BaseSpinner from './BaseSpinner.vue'

/**
 * Botón de la app. Con `to` se renderiza como enlace de Vue Router.
 *
 *   <BaseButton :loading="isPending" type="submit">Guardar</BaseButton>
 *   <BaseButton variant="outline" :to="{ name: 'login' }">Iniciar sesión</BaseButton>
 */
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit'
    loading?: boolean
    disabled?: boolean
    block?: boolean
    to?: RouteLocationRaw
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)

const VARIANTS = {
  primary: 'bg-primary-600 text-white shadow-sm hover:bg-primary-700',
  secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
  outline:
    'border border-neutral-300 bg-white text-neutral-800 hover:border-primary-300 hover:text-primary-700',
  ghost: 'text-primary-700 hover:bg-primary-50',
  danger: 'bg-danger-600 text-white shadow-sm hover:bg-danger-700',
}

const SIZES = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

const classes = computed(() => [
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-colors',
  'disabled:cursor-not-allowed disabled:opacity-60',
  VARIANTS[props.variant],
  SIZES[props.size],
  props.block && 'w-full',
])
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes">
    <slot />
  </RouterLink>
  <button v-else :type="type" :disabled="disabled || loading" :aria-busy="loading" :class="classes">
    <BaseSpinner v-if="loading" size="xs" />
    <slot />
  </button>
</template>
