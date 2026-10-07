<script setup lang="ts">
import { Wrench } from '@lucide/vue'

/**
 * Logo: ícono de llave inglesa sobre cuadro primary-600 + nombre en font-black.
 */
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    tone?: 'dark' | 'light'
    showText?: boolean
    subtitle?: string | null
  }>(),
  { size: 'md', tone: 'dark', showText: true, subtitle: 'Marketplace de servicios' },
)

const SIZES = {
  sm: { box: 'size-9 rounded-xl', icon: 'size-4.5', title: 'text-base', subtitle: 'text-xs' },
  md: { box: 'size-11 rounded-2xl', icon: 'size-5.5', title: 'text-lg', subtitle: 'text-xs' },
  lg: { box: 'size-14 rounded-2xl', icon: 'size-7', title: 'text-2xl', subtitle: 'text-sm' },
}
</script>

<template>
  <span class="inline-flex items-center gap-3">
    <span
      :class="[
        'flex shrink-0 items-center justify-center bg-primary-600 shadow-lg',
        SIZES[size].box,
      ]"
    >
      <Wrench :class="['text-white', SIZES[size].icon]" aria-hidden="true" />
    </span>
    <span v-if="showText" class="flex flex-col">
      <span
        :class="[
          'leading-none font-black',
          SIZES[size].title,
          tone === 'dark' ? 'text-neutral-900' : 'text-white',
        ]"
      >
        Maestros a un clic
      </span>
      <span
        v-if="subtitle"
        :class="[
          'mt-1',
          SIZES[size].subtitle,
          tone === 'dark' ? 'text-neutral-500' : 'text-white/70',
        ]"
      >
        {{ subtitle }}
      </span>
    </span>
  </span>
</template>
