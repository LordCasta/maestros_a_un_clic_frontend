<script setup lang="ts">
import { Check } from '@lucide/vue'

/**
 * Indicador de pasos para formularios largos. `current` empieza en 1.
 *
 *   <BaseStepper :steps="['Cuenta', 'Perfil']" :current="step" />
 */
defineProps<{ steps: string[]; current: number }>()
</script>

<template>
  <ol class="flex items-center gap-2" aria-label="Progreso">
    <li v-for="(label, index) in steps" :key="label" class="flex flex-1 items-center gap-2">
      <span
        :class="[
          'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition',
          index + 1 < current && 'bg-primary-600 text-white',
          index + 1 === current && 'bg-primary-600 text-white ring-4 ring-primary-100',
          index + 1 > current && 'bg-neutral-200 text-neutral-500',
        ]"
        :aria-current="index + 1 === current ? 'step' : undefined"
      >
        <Check v-if="index + 1 < current" class="size-4" />
        <template v-else>{{ index + 1 }}</template>
      </span>
      <span
        :class="[
          'text-sm font-semibold',
          index + 1 <= current ? 'text-neutral-900' : 'text-neutral-400',
        ]"
      >
        {{ label }}
      </span>
      <span
        v-if="index < steps.length - 1"
        :class="[
          'h-0.5 flex-1 rounded-full',
          index + 1 < current ? 'bg-primary-600' : 'bg-neutral-200',
        ]"
      />
    </li>
  </ol>
</template>
