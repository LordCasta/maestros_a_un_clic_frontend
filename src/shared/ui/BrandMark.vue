<template>
  <div class="flex items-center gap-3">
    <div :class="containerClasses">
      <Wrench :class="iconClasses" />
    </div>

    <div v-if="showText">
      <component :is="headingTag" :class="titleClasses">
        {{ title }}
      </component>
      <p v-if="showSubtitle" :class="subtitleClasses">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Wrench } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    default: 'Maestros a un clic',
  },
  subtitle: {
    type: String,
    default: 'Marketplace de servicios',
  },
  size: {
    type: String,
    default: 'md',
  },
  tone: {
    type: String,
    default: 'dark',
  },
  showText: {
    type: Boolean,
    default: true,
  },
  showSubtitle: {
    type: Boolean,
    default: true,
  },
  headingTag: {
    type: String,
    default: 'h1',
  },
})

const sizeMap = {
  sm: {
    container: 'w-10 h-10 rounded-xl',
    icon: 'w-5 h-5',
    title: 'text-base',
    subtitle: 'text-xs',
  },
  md: {
    container: 'w-12 h-12 rounded-2xl',
    icon: 'w-6 h-6',
    title: 'text-lg',
    subtitle: 'text-xs',
  },
  lg: {
    container: 'w-14 h-14 rounded-2xl',
    icon: 'w-7 h-7',
    title: 'text-2xl',
    subtitle: 'text-sm',
  },
}

const toneClasses = {
  dark: {
    title: 'text-gray-900',
    subtitle: 'text-gray-500',
  },
  light: {
    title: 'text-white',
    subtitle: 'text-white/70',
  },
}

const containerClasses = computed(() => [
  'flex items-center justify-center bg-blue-600 shadow-lg flex-shrink-0',
  sizeMap[props.size].container,
])

const iconClasses = computed(() => ['text-white', sizeMap[props.size].icon])
const titleClasses = computed(() => [
  'font-black leading-none',
  sizeMap[props.size].title,
  toneClasses[props.tone].title,
])
const subtitleClasses = computed(() => [
  'mt-1',
  sizeMap[props.size].subtitle,
  toneClasses[props.tone].subtitle,
])
</script>

<style scoped></style>
