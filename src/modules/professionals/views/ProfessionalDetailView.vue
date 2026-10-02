<script setup lang="ts">
import { ArrowLeft, BadgeCheck, Briefcase, CalendarDays, Clock3, MapPin, UserX } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { FavoriteButton } from '@/modules/favorites'
import { ApiError } from '@/shared/http/client'
import {
  BaseAlert,
  BaseAvatar,
  BaseBadge,
  BaseButton,
  BaseCard,
  BaseEmptyState,
  BaseRating,
  BaseSkeleton,
  ImageWithFallback,
} from '@/shared/ui'
import { formatDuration, formatMoney } from '@/shared/utils/format'

import { useProfessional } from '../queries'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const { data: professional, isPending, error } = useProfessional(id)

const notFound = computed(() => error.value instanceof ApiError && error.value.status === 404)
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <BaseButton variant="ghost" size="sm" :to="{ name: 'search' }" class="mb-6">
      <ArrowLeft class="size-4" /> Volver a la búsqueda
    </BaseButton>

    <div v-if="isPending" class="space-y-6">
      <BaseSkeleton class="h-48" />
      <BaseSkeleton class="h-64" />
    </div>

    <BaseEmptyState
      v-else-if="notFound"
      :icon="UserX"
      title="Este perfil no está disponible"
      description="Puede que el profesional aún no esté verificado o que su cuenta ya no esté activa."
    >
      <BaseButton :to="{ name: 'search' }">Buscar otros profesionales</BaseButton>
    </BaseEmptyState>

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar el perfil">{{
      error.message
    }}</BaseAlert>

    <div v-else-if="professional" class="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div class="space-y-6">
        <BaseCard as="header" padding="lg">
          <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
            <BaseAvatar :name="professional.name" :src="professional.avatar_url" size="xl" />
            <div class="flex-1 space-y-3">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h1 class="flex items-center gap-2 text-3xl font-black text-neutral-900">
                    {{ professional.name }}
                    <BadgeCheck
                      v-if="professional.is_verified"
                      class="size-6 text-primary-600"
                      aria-label="Verificado"
                    />
                  </h1>
                  <div
                    class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500"
                  >
                    <BaseRating :rating="professional.rating" />
                    <span v-if="professional.commune" class="inline-flex items-center gap-1">
                      <MapPin class="size-4" /> {{ professional.commune.name }}
                    </span>
                    <span
                      v-if="professional.experience_years !== null"
                      class="inline-flex items-center gap-1"
                    >
                      <Briefcase class="size-4" /> {{ professional.experience_years }} años de
                      experiencia
                    </span>
                  </div>
                </div>
                <FavoriteButton :professional-id="professional.id" />
              </div>
              <div v-if="professional.categories?.length" class="flex flex-wrap gap-1.5">
                <BaseBadge
                  v-for="category in professional.categories"
                  :key="category.id"
                  tone="primary"
                >
                  {{ category.name }}
                </BaseBadge>
              </div>
            </div>
          </div>
          <p
            v-if="professional.description"
            class="mt-6 leading-7 whitespace-pre-line text-neutral-700"
          >
            {{ professional.description }}
          </p>
        </BaseCard>

        <BaseCard as="section">
          <h2 class="mb-4 text-xl font-black text-neutral-900">Servicios</h2>
          <p v-if="!professional.services?.length" class="text-sm text-neutral-500">
            Este profesional todavía no ha publicado servicios.
          </p>
          <ul v-else class="space-y-3">
            <li
              v-for="service in professional.services"
              :key="service.id"
              class="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p class="font-semibold text-neutral-900">{{ service.title }}</p>
                <p v-if="service.description" class="mt-1 text-sm text-neutral-600">
                  {{ service.description }}
                </p>
                <p class="mt-2 inline-flex items-center gap-1 text-xs text-neutral-500">
                  <Clock3 class="size-3.5" /> Duración estimada:
                  {{ formatDuration(service.estimated_duration_minutes) }}
                </p>
              </div>
              <p class="shrink-0 text-right">
                <span class="text-lg font-black text-primary-700">{{
                  formatMoney(service.price)
                }}</span>
                <span class="block text-xs text-neutral-500">
                  {{ service.price_type === 'hourly' ? 'por hora' : 'precio fijo' }}
                </span>
              </p>
            </li>
          </ul>
        </BaseCard>

        <BaseCard v-if="professional.portfolio?.length" as="section">
          <h2 class="mb-4 text-xl font-black text-neutral-900">Trabajos realizados</h2>
          <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
            <ImageWithFallback
              v-for="item in professional.portfolio"
              :key="item.id"
              :src="item.image_url"
              :alt="item.description ?? `Trabajo de ${professional.name}`"
              class="aspect-square w-full rounded-2xl"
            />
          </div>
        </BaseCard>
      </div>

      <aside>
        <BaseCard as="section" class="sticky top-24 space-y-4">
          <p>
            <span class="text-3xl font-black text-primary-700">{{
              formatMoney(professional.hourly_rate)
            }}</span>
            <span v-if="professional.hourly_rate" class="text-neutral-500"> / hora</span>
          </p>
          <p class="text-sm text-neutral-500">
            Tarifa de referencia. Cada servicio tiene su propio precio.
          </p>
          <BaseButton block size="lg" disabled>
            <CalendarDays class="size-4" /> Reservar
          </BaseButton>
          <p class="text-xs text-neutral-500">
            La reserva en línea con la agenda del profesional estará disponible muy pronto.
          </p>
        </BaseCard>
      </aside>
    </div>
  </div>
</template>
