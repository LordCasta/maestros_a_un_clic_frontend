<script setup lang="ts" generic="T extends string | number">
import { Check } from '@lucide/vue'
import { useId } from 'vue'

/**
 * Selección múltiple en forma de "chips" (p. ej. especialidades). Valor: arreglo de ids.
 */
const model = defineModel<T[]>({ default: () => [] })
defineProps<{
  options: { value: T; label: string }[]
  label?: string
  error?: string
  hint?: string
}>()

const groupId = useId()

function toggle(value: T) {
  model.value = model.value.includes(value)
    ? model.value.filter((item) => item !== value)
    : [...model.value, value]
}
</script>

<template>
  <fieldset class="space-y-2" :aria-describedby="error ? `${groupId}-error` : undefined">
    <legend v-if="label" class="mb-2 text-sm font-semibold text-neutral-800">{{ label }}</legend>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        :aria-pressed="model.includes(option.value)"
        :class="[
          'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
          model.includes(option.value)
            ? 'border-primary-600 bg-primary-50 text-primary-700'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-300',
        ]"
        @click="toggle(option.value)"
      >
        <Check v-if="model.includes(option.value)" class="size-3.5" />
        {{ option.label }}
      </button>
    </div>
    <p v-if="error" :id="`${groupId}-error`" class="text-xs font-medium text-danger-600">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-xs text-neutral-500">{{ hint }}</p>
  </fieldset>
</template>
