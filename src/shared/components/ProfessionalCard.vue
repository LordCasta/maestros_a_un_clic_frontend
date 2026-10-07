<script setup lang="ts">
import { BadgeCheck, ChevronRight, MapPin } from '@lucide/vue'

import type { Professional } from '../types/models'
import { BaseBadge, BaseButton, BaseCard, BaseRating, ImageWithFallback } from '../ui'
import { formatMoney } from '../utils/format'

/**
 * Tarjeta de un profesional en listados (búsqueda, favoritos, dashboard).
 * Solo presenta datos: las acciones (favorito, reservar…) entran por el slot `actions`.
 */
defineProps<{ professional: Professional }>()
</script>

<template>
  <BaseCard as="article" padding="sm" interactive class="relative">
    <div class="flex flex-col gap-5 sm:flex-row">
      <ImageWithFallback
        :src="professional.avatar_url"
        :alt="professional.name"
        class="h-44 w-full shrink-0 rounded-2xl sm:size-36"
      />

      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="flex items-center gap-1.5 text-lg font-bold text-neutral-900">
              <span class="truncate">{{ professional.name }}</span>
              <BadgeCheck
                v-if="professional.is_verified"
                class="size-5 shrink-0 text-primary-600"
                aria-label="Verificado"
              />
            </h3>
            <div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
              <BaseRating :rating="professional.rating" />
              <span v-if="professional.commune" class="inline-flex items-center gap-1">
                <MapPin class="size-4" /> {{ professional.commune.name }}
              </span>
            </div>
          </div>
          <slot name="actions" />
        </div>

        <div v-if="professional.categories?.length" class="flex flex-wrap gap-1.5">
          <BaseBadge
            v-for="category in professional.categories.slice(0, 3)"
            :key="category.id"
            tone="primary"
          >
            {{ category.name }}
          </BaseBadge>
        </div>

        <p v-if="professional.description" class="line-clamp-2 text-sm leading-6 text-neutral-600">
          {{ professional.description }}
        </p>

        <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
          <p>
            <span class="text-xl font-black text-primary-700">{{
              formatMoney(professional.hourly_rate)
            }}</span>
            <span v-if="professional.hourly_rate" class="text-sm text-neutral-500"> / hora</span>
          </p>
          <BaseButton
            size="sm"
            :to="{ name: 'professional-detail', params: { id: professional.id } }"
          >
            Ver perfil <ChevronRight class="size-4" />
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
