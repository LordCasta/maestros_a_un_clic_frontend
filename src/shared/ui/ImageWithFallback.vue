<script setup lang="ts">
import { ImageOff } from '@lucide/vue'
import { ref, watch } from 'vue'

/**
 * Imagen que muestra un marcador neutro si la URL falla. Las clases de tamaño se pasan con `class`.
 */
const props = defineProps<{ src?: string | null; alt: string }>()

const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)
</script>

<template>
  <img v-if="src && !failed" :src="src" :alt="alt" class="object-cover" @error="failed = true" />
  <span
    v-else
    role="img"
    :aria-label="alt"
    class="flex items-center justify-center bg-neutral-100 text-neutral-400"
  >
    <ImageOff class="size-8" />
  </span>
</template>
