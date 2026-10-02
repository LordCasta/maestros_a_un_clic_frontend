<script setup lang="ts">
import { useId } from 'vue'

/**
 * Campo de texto con etiqueta, ayuda y error. Los atributos extra (type, autocomplete,
 * placeholder, eventos de VeeValidate…) van directo al <input>.
 *
 *   const [email, emailAttrs] = defineField('email')
 *   <BaseInput v-model="email" v-bind="emailAttrs" label="Correo" type="email" :error="errors.email" />
 */
defineOptions({ inheritAttrs: false })

const model = defineModel<string | number | null>()
const props = defineProps<{ label?: string; error?: string; hint?: string; id?: string }>()

const inputId = props.id ?? useId()
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="inputId" class="block text-sm font-semibold text-neutral-800">
      {{ label }}
    </label>
    <div class="relative">
      <span
        v-if="$slots.icon"
        class="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-neutral-400 [&_svg]:size-4.5"
      >
        <slot name="icon" />
      </span>
      <input
        :id="inputId"
        v-model="model"
        v-bind="$attrs"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
        :class="[
          'h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-neutral-900 transition placeholder:text-neutral-400',
          'focus:ring-4 focus:outline-none focus-visible:outline-none disabled:bg-neutral-50 disabled:text-neutral-500',
          error
            ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-100'
            : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-100',
          $slots.icon && 'pl-10',
          $slots.trailing && 'pr-11',
        ]"
      />
      <span v-if="$slots.trailing" class="absolute inset-y-0 right-1.5 flex items-center">
        <slot name="trailing" />
      </span>
    </div>
    <p v-if="error" :id="`${inputId}-error`" class="text-xs font-medium text-danger-600">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${inputId}-hint`" class="text-xs text-neutral-500">{{ hint }}</p>
  </div>
</template>
