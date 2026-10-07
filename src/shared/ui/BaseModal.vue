<script setup lang="ts">
import { X } from '@lucide/vue'
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

/**
 * Diálogo modal accesible: cierra con Esc o clic afuera, bloquea el scroll del fondo
 * y lleva el foco al diálogo. Úsalo también para confirmaciones (en lugar de confirm()).
 *
 *   <BaseModal v-model:open="isOpen" title="Cancelar reserva">
 *     …
 *     <template #footer>…botones…</template>
 *   </BaseModal>
 */
const open = defineModel<boolean>('open', { required: true })
withDefaults(defineProps<{ title: string; description?: string; size?: 'sm' | 'md' | 'lg' }>(), {
  size: 'md',
})

const titleId = useId()
const dialog = ref<HTMLElement | null>(null)

const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

function close() {
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(open, async (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) {
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    dialog.value?.focus()
  } else {
    document.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" @click="close" />
        <div
          ref="dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          :class="[
            'relative w-full rounded-3xl bg-surface p-6 shadow-raised focus:outline-none',
            SIZES[size],
          ]"
        >
          <button
            type="button"
            class="absolute top-4 right-4 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Cerrar"
            @click="close"
          >
            <X class="size-5" />
          </button>
          <h2 :id="titleId" class="pr-8 text-xl font-bold text-neutral-900">{{ title }}</h2>
          <p v-if="description" class="mt-1 text-sm text-neutral-500">{{ description }}</p>
          <div class="mt-5">
            <slot />
          </div>
          <div
            v-if="$slots.footer"
            class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
