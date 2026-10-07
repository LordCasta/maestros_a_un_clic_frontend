<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import { useId } from 'vue'

export interface SelectOption {
  value: string | number
  label: string
}

defineOptions({ inheritAttrs: false })

const model = defineModel<string | number | null>()
const props = defineProps<{
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  id?: string
}>()

const selectId = props.id ?? useId()
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="selectId" class="block text-sm font-semibold text-neutral-800">
      {{ label }}
    </label>
    <div class="relative">
      <select
        :id="selectId"
        v-model="model"
        v-bind="$attrs"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${selectId}-error` : undefined"
        :class="[
          'h-11 w-full appearance-none rounded-xl border bg-white pr-10 pl-3.5 text-sm text-neutral-900 transition',
          'focus:ring-4 focus:outline-none focus-visible:outline-none',
          error
            ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-100'
            : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-100',
        ]"
      >
        <option v-if="placeholder" :value="null" disabled>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <ChevronDown
        class="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-neutral-400"
      />
    </div>
    <p v-if="error" :id="`${selectId}-error`" class="text-xs font-medium text-danger-600">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-xs text-neutral-500">{{ hint }}</p>
  </div>
</template>
