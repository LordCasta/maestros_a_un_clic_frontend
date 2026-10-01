<script setup lang="ts">
export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

withDefaults(defineProps<{ tone?: BadgeTone }>(), { tone: 'neutral' })

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-700 ring-neutral-200',
  primary: 'bg-primary-50 text-primary-700 ring-primary-200',
  success: 'bg-success-50 text-success-700 ring-success-200',
  warning: 'bg-warning-50 text-warning-700 ring-warning-200',
  danger: 'bg-danger-50 text-danger-700 ring-danger-200',
  info: 'bg-info-50 text-info-700 ring-info-200',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset [&_svg]:size-3.5',
      TONES[tone],
    ]"
  >
    <slot />
  </span>
</template>
