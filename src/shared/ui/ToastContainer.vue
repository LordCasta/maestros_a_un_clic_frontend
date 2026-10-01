<script setup lang="ts">
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from '@lucide/vue'

import { useToastStore } from '../stores/toast'

const toast = useToastStore()

const TONES = {
  success: { icon: CircleCheck, classes: 'text-success-600' },
  danger: { icon: CircleAlert, classes: 'text-danger-600' },
  info: { icon: Info, classes: 'text-info-600' },
  warning: { icon: TriangleAlert, classes: 'text-warning-600' },
}
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
    aria-live="polite"
  >
    <TransitionGroup
      enter-active-class="transition duration-200"
      enter-from-class="translate-y-2 opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div
        v-for="item in toast.toasts"
        :key="item.id"
        class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-neutral-100 bg-surface p-4 text-sm shadow-raised"
      >
        <component
          :is="TONES[item.tone].icon"
          :class="['mt-0.5 size-5 shrink-0', TONES[item.tone].classes]"
        />
        <p class="flex-1 font-medium text-neutral-800">{{ item.message }}</p>
        <button
          type="button"
          class="text-neutral-400 hover:text-neutral-700"
          aria-label="Cerrar"
          @click="toast.dismiss(item.id)"
        >
          <X class="size-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
