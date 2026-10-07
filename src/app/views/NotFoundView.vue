<script setup lang="ts">
import { MapPinOff } from '@lucide/vue'

import { BaseButton, BaseEmptyState } from '@/shared/ui'
</script>

<template>
  <div class="mx-auto max-w-xl px-4 py-20">
    <BaseEmptyState
      :icon="MapPinOff"
      title="No encontramos esta página"
      description="Puede que el enlace esté mal escrito o que la página ya no exista."
    >
      <BaseButton :to="{ name: 'home' }">Ir al inicio</BaseButton>
    </BaseEmptyState>
  </div>
</template>
