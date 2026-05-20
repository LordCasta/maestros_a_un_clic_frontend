<template>
  <div
    :class="[
      'rounded-2xl p-6 transition-all duration-300',
      bordered ? 'border border-gray-200' : '',
      shadow ? 'shadow-lg' : 'shadow-md',
      hover ? 'hover:shadow-xl hover:border-blue-200' : '',
      customClass,
    ]"
    :style="{ backgroundColor: bgColor }"
  >
    <h3 v-if="title" class="text-lg font-semibold text-gray-900 mb-3">
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  bordered?: boolean
  shadow?: boolean
  hover?: boolean
  bgColor?: string
  class?: string
}

withDefaults(defineProps<Props>(), {
  bordered: true,
  shadow: true,
  hover: false,
  bgColor: '#ffffff',
  class: '',
})
</script>

<style scoped></style>
