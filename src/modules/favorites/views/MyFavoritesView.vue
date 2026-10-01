<script setup lang="ts">
import { Heart, Search } from '@lucide/vue'

import ProfessionalCard from '@/shared/components/ProfessionalCard.vue'
import { BaseAlert, BaseButton, BaseEmptyState, BaseSkeleton } from '@/shared/ui'

import FavoriteButton from '../components/FavoriteButton.vue'
import { useFavorites } from '../queries'

/**
 * HU035. Patrón de una vista de lista: cargando (skeleton) → error → vacío → contenido.
 */
const { data: favorites, isPending, error, refetch } = useFavorites()
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <header class="mb-8">
      <h1 class="text-3xl font-black text-neutral-900">Mis favoritos</h1>
      <p class="mt-1 text-neutral-500">Los profesionales que guardaste para contratar después.</p>
    </header>

    <div v-if="isPending" class="space-y-4">
      <BaseSkeleton v-for="n in 3" :key="n" class="h-44" />
    </div>

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar tus favoritos">
      {{ error.message }}
      <BaseButton variant="ghost" size="sm" class="mt-2" @click="refetch()">Reintentar</BaseButton>
    </BaseAlert>

    <BaseEmptyState
      v-else-if="!favorites?.length"
      :icon="Heart"
      title="Aún no tienes favoritos"
      description="Toca el corazón en el perfil de un profesional para guardarlo aquí."
    >
      <BaseButton :to="{ name: 'search' }"
        ><Search class="size-4" /> Buscar profesionales</BaseButton
      >
    </BaseEmptyState>

    <ul v-else class="space-y-4">
      <li v-for="favorite in favorites" :key="favorite.id">
        <ProfessionalCard :professional="favorite.professional">
          <template #actions>
            <FavoriteButton :professional-id="favorite.professional.id" />
          </template>
        </ProfessionalCard>
      </li>
    </ul>
  </div>
</template>
