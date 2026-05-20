<template>
  <Transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="$emit('update:modelValue', false)"
      />
      <!-- Modal Content -->
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 z-10">
        <button
          v-if="closable"
          @click="$emit('update:modelValue', false)"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 v-if="title" class="text-2xl font-bold text-gray-900 mb-4">{{ title }}</h2>
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  closable?: boolean
}

defineProps<Props>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
}

.modal-leave-to {
  opacity: 0;
}
</style>
