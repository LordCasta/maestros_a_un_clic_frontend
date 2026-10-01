<script setup lang="ts">
withDefaults(defineProps<{ size?: 'xs' | 'sm' | 'md' | 'lg'; label?: string }>(), {
  size: 'md',
  label: 'Cargando…',
})

const SIZES = { xs: 'size-4', sm: 'size-6', md: 'size-10', lg: 'size-14' }
</script>

<template>
  <span
    role="status"
    :class="[
      'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
      SIZES[size],
    ]"
  >
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
