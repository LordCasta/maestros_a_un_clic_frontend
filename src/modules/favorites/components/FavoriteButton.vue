<script setup lang="ts">
import { Heart } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth'

import { useIsFavorite, useToggleFavorite } from '../queries'

/**
 * Corazón para guardar un profesional (HU034).
 * - Sin sesión: lleva al login y vuelve a esta página.
 * - Profesionales y admins no lo ven: favoritos es solo para clientes.
 */
const props = defineProps<{ professionalId: number }>()

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const isFavorite = useIsFavorite(() => props.professionalId)
const { mutate, isLoading } = useToggleFavorite()

function toggle() {
  if (!auth.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  mutate({ professionalId: props.professionalId, isFavorite: isFavorite.value })
}
</script>

<template>
  <button
    v-if="!auth.isAuthenticated || auth.role === 'client'"
    type="button"
    :disabled="isLoading"
    :aria-pressed="isFavorite"
    :aria-label="isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'"
    :class="[
      'flex size-10 shrink-0 items-center justify-center rounded-full border transition disabled:opacity-60',
      isFavorite
        ? 'border-danger-200 bg-danger-50 text-danger-600'
        : 'border-neutral-200 bg-white text-neutral-400 hover:border-danger-200 hover:text-danger-500',
    ]"
    @click="toggle"
  >
    <Heart :class="['size-5', isFavorite && 'fill-current']" />
  </button>
</template>
