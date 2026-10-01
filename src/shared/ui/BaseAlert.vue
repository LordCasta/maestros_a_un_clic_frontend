<script setup lang="ts">
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from '@lucide/vue'

/**
 * Mensaje en línea (error de un formulario, aviso de verificación pendiente…).
 * Para confirmar una acción ya hecha, usa un toast (useToastStore).
 */
withDefaults(
  defineProps<{
    tone?: 'info' | 'success' | 'warning' | 'danger'
    title?: string
    dismissible?: boolean
  }>(),
  { tone: 'info' },
)
defineEmits<{ dismiss: [] }>()

const TONES = {
  info: { classes: 'border-info-200 bg-info-50 text-info-700', icon: Info },
  success: { classes: 'border-success-200 bg-success-50 text-success-700', icon: CircleCheck },
  warning: { classes: 'border-warning-200 bg-warning-50 text-warning-700', icon: TriangleAlert },
  danger: { classes: 'border-danger-200 bg-danger-50 text-danger-700', icon: CircleAlert },
}
</script>

<template>
  <div
    :role="tone === 'danger' ? 'alert' : 'status'"
    :class="['flex items-start gap-3 rounded-2xl border p-4 text-sm', TONES[tone].classes]"
  >
    <component :is="TONES[tone].icon" class="mt-0.5 size-5 shrink-0" />
    <div class="flex-1 space-y-0.5">
      <p v-if="title" class="font-semibold">{{ title }}</p>
      <div class="text-neutral-700"><slot /></div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="shrink-0 opacity-70 hover:opacity-100"
      aria-label="Cerrar aviso"
      @click="$emit('dismiss')"
    >
      <X class="size-4" />
    </button>
  </div>
</template>
