<script setup lang="ts">
import { Upload, X } from '@lucide/vue'
import { computed, useId } from 'vue'

/**
 * Selector de archivos. Valor: un File (o un arreglo con `multiple`).
 * La validación de tipo y tamaño la hace el esquema Zod del formulario y, siempre, el backend.
 */
const model = defineModel<File | File[] | null>({ default: null })
const props = defineProps<{
  label?: string
  accept?: string
  multiple?: boolean
  error?: string
  hint?: string
}>()

const inputId = useId()

const files = computed<File[]>(() =>
  model.value === null ? [] : Array.isArray(model.value) ? model.value : [model.value],
)

function onChange(event: Event) {
  const selected = Array.from((event.target as HTMLInputElement).files ?? [])
  model.value = props.multiple ? selected : (selected[0] ?? null)
}

function remove(file: File) {
  const rest = files.value.filter((item) => item !== file)
  model.value = props.multiple ? rest : null
}
</script>

<template>
  <div class="space-y-1.5">
    <span v-if="label" class="block text-sm font-semibold text-neutral-800">{{ label }}</span>
    <label
      :for="inputId"
      :class="[
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition',
        error
          ? 'border-danger-300 bg-danger-50'
          : 'border-neutral-200 bg-surface-muted hover:border-primary-300',
      ]"
    >
      <Upload class="size-6 text-primary-600" />
      <span class="text-sm font-semibold text-neutral-800">
        {{ multiple ? 'Selecciona archivos' : 'Selecciona un archivo' }}
      </span>
      <span v-if="hint" class="text-xs text-neutral-500">{{ hint }}</span>
      <input
        :id="inputId"
        type="file"
        class="sr-only"
        :accept="accept"
        :multiple="multiple"
        @change="onChange"
      />
    </label>
    <ul v-if="files.length" class="space-y-1.5">
      <li
        v-for="file in files"
        :key="file.name"
        class="flex items-center justify-between gap-2 rounded-xl bg-neutral-50 px-3 py-2 text-sm"
      >
        <span class="truncate text-neutral-700">{{ file.name }}</span>
        <button
          type="button"
          class="text-neutral-400 hover:text-danger-600"
          :aria-label="`Quitar ${file.name}`"
          @click="remove(file)"
        >
          <X class="size-4" />
        </button>
      </li>
    </ul>
    <p v-if="error" class="text-xs font-medium text-danger-600">{{ error }}</p>
  </div>
</template>
