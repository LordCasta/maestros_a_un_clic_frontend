<script setup lang="ts">
import { computed, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const model = defineModel<string | null>()
const props = withDefaults(
  defineProps<{
    label?: string
    error?: string
    hint?: string
    id?: string
    rows?: number
    /** Muestra el contador "n / max". */
    maxLength?: number
  }>(),
  { rows: 4 },
)

const textareaId = props.id ?? useId()
const length = computed(() => model.value?.length ?? 0)
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="textareaId" class="block text-sm font-semibold text-neutral-800">
      {{ label }}
    </label>
    <textarea
      :id="textareaId"
      v-model="model"
      v-bind="$attrs"
      :rows="rows"
      :maxlength="maxLength"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${textareaId}-error` : undefined"
      :class="[
        'w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-neutral-900 transition placeholder:text-neutral-400',
        'focus:ring-4 focus:outline-none focus-visible:outline-none',
        error
          ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-100'
          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-100',
      ]"
    />
    <div class="flex justify-between gap-4 text-xs">
      <p v-if="error" :id="`${textareaId}-error`" class="font-medium text-danger-600">
        {{ error }}
      </p>
      <p v-else-if="hint" class="text-neutral-500">{{ hint }}</p>
      <span v-else />
      <span v-if="maxLength" class="shrink-0 text-neutral-400">{{ length }} / {{ maxLength }}</span>
    </div>
  </div>
</template>
