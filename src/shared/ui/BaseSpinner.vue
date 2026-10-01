<template>
  <div class="flex items-center justify-center">
    <div
      :class="[
        'rounded-full border-4 animate-spin',
        sizeClasses,
        'border-gray-200 border-t-blue-600',
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }
  return sizes[props.size]
})
</script>

<style scoped></style>
