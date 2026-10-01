<script setup lang="ts">
/**
 * Contenedor estándar: fondo surface, borde suave, radio 3xl y sombra card.
 * Para bloques dentro de una tarjeta usa `variant="muted"`.
 */
withDefaults(
  defineProps<{
    as?: string
    padding?: 'none' | 'sm' | 'md' | 'lg'
    variant?: 'default' | 'muted'
    interactive?: boolean
  }>(),
  { as: 'div', padding: 'md', variant: 'default' },
)

const PADDING = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
</script>

<template>
  <component
    :is="as"
    :class="[
      'rounded-3xl border',
      variant === 'default'
        ? 'border-neutral-100 bg-surface shadow-card'
        : 'border-neutral-100 bg-surface-muted',
      interactive &&
        'transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-raised',
      PADDING[padding],
    ]"
  >
    <slot />
  </component>
</template>
