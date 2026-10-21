<script setup lang="ts">
import {
  CalendarDays,
  ChevronRight,
  Filter,
  Heart,
  Locate,
  Search,
  SearchX,
  ShieldCheck,
  Sparkles,
} from '@lucide/vue'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'

import { useAuthStore } from '@/modules/auth'
import { useCategories, useCommunes } from '@/modules/catalog'
import { FavoriteButton } from '@/modules/favorites'
import ProfessionalCard from '@/shared/components/ProfessionalCard.vue'
import {
  BaseAlert,
  BaseButton,
  BaseCard,
  BaseEmptyState,
  BaseInput,
  BasePagination,
  BaseSelect,
  BaseSkeleton,
  GoogleMapsEmbed,
  type SelectOption,
} from '@/shared/ui'

import type { ProfessionalFilters } from '../api'
import { useProfessionalSearch } from '../queries'

/**
 * HU002, HU010, HU033, HU039, HU046. Los filtros viven en la URL (?q=&category_id=…):
 * se pueden compartir, y atrás/adelante del navegador funcionan.
 */
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { options: communeOptions } = useCommunes()
const { data: categories } = useCategories()

const isLocating = ref(false)
const geoError = ref<string | null>(null)
const priceError = ref<string | null>(null)

const SORT_OPTIONS: SelectOption[] = [
  { value: 'rating', label: 'Mejor calificados' },
  { value: 'distance', label: 'Más cercanos' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
]

// Categorías principales
const categoryOptions = computed<SelectOption[]>(() =>
  (categories.value ?? []).map((category) => ({
    value: category.id,
    label: category.name,
  })),
)

// Subcategorías según la categoría seleccionada
const selectedCategory = computed(() => categories.value?.find((c) => c.id === form.category_id))

const subcategoryOptions = computed<SelectOption[]>(() =>
  (selectedCategory.value?.children ?? []).map((child) => ({
    value: child.id,
    label: child.name,
  })),
)

function onCategoryChange() {
  form.subcategory_id = undefined
}

function numberParam(value: unknown): number | undefined {
  const number = Number(value)
  return value !== undefined && value !== '' && Number.isFinite(number) ? number : undefined
}

function filtersFrom(query: LocationQuery): ProfessionalFilters {
  return {
    q: typeof query.q === 'string' && query.q ? query.q : undefined,
    commune_id: numberParam(query.commune_id),
    category_id: numberParam(query.category_id),
    subcategory_id: numberParam(query.subcategory_id),
    min_price: numberParam(query.min_price),
    max_price: numberParam(query.max_price),
    sort: SORT_OPTIONS.some((option) => option.value === query.sort)
      ? (query.sort as ProfessionalFilters['sort'])
      : undefined,
    lat: numberParam(query.lat),
    lng: numberParam(query.lng),
    page: numberParam(query.page) ?? 1,
    per_page: 10,
  }
}

const activeFilters = computed(() => filtersFrom(route.query))
const { data: result, isPending, error, refetch } = useProfessionalSearch(activeFilters)

// Formulario local: se aplica a la URL al presionar "Buscar" / "Aplicar".
const form = reactive<ProfessionalFilters>({})
watch(activeFilters, (filters) => Object.assign(form, filters), { immediate: true })

function apply(changes: Partial<ProfessionalFilters> = {}) {
  priceError.value = null
  const min = changes.min_price !== undefined ? changes.min_price : form.min_price
  const max = changes.max_price !== undefined ? changes.max_price : form.max_price

  if (min !== undefined && max !== undefined && min !== null && max !== null && max < min) {
    priceError.value = 'La tarifa máxima debe ser mayor o igual a la tarifa mínima.'
    return
  }

  const next = { ...form, ...changes, page: changes.page ?? 1, per_page: undefined }
  const query = Object.fromEntries(
    Object.entries(next).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  router.push({ name: 'search', query })
}

function clearFilters() {
  priceError.value = null
  router.push({ name: 'search' })
}

function onSortChange(sort: string | number | null | undefined) {
  if (sort === 'distance' && !form.lat && !activeFilters.value.lat) {
    useMyLocation()
  }
}

function useMyLocation() {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    geoError.value = 'Tu navegador no admite geolocalización. Selecciona tu comuna manualmente.'
    return
  }

  isLocating.value = true
  geoError.value = null

  navigator.geolocation.getCurrentPosition(
    (position) => {
      isLocating.value = false
      const lat = Math.round(position.coords.latitude * 100000) / 100000
      const lng = Math.round(position.coords.longitude * 100000) / 100000
      apply({ lat, lng, sort: 'distance', page: 1 })
    },
    (err) => {
      isLocating.value = false
      if (err.code === err.PERMISSION_DENIED) {
        geoError.value =
          'Permiso de ubicación denegado. Puedes seleccionar tu comuna en los filtros.'
      } else {
        geoError.value = 'No pudimos obtener tu ubicación actual. Intenta seleccionando tu comuna.'
      }
    },
    { enableHighAccuracy: true, timeout: 10000 },
  )
}

function clearLocation() {
  apply({ lat: undefined, lng: undefined, sort: form.sort === 'distance' ? 'rating' : form.sort })
}

const page = computed({
  get: () => activeFilters.value.page ?? 1,
  set: (value: number) => apply({ ...activeFilters.value, page: value }),
})

const mapCenter = computed(() => {
  if (activeFilters.value.lat && activeFilters.value.lng) {
    return {
      lat: activeFilters.value.lat,
      lng: activeFilters.value.lng,
      query: null,
      title: 'Tu ubicación y alrededores',
    }
  }
  if (activeFilters.value.commune_id) {
    const commune = (communeOptions.value ?? []).find(
      (c) => c.value === activeFilters.value.commune_id,
    )
    return {
      lat: null,
      lng: null,
      query: commune?.label ?? null,
      title: commune?.label ? `Zona: ${commune.label}` : 'Mapa de la zona',
    }
  }
  return {
    lat: null,
    lng: null,
    query: null,
    title: 'Medellín y área metropolitana',
  }
})
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
    <section
      class="relative overflow-hidden rounded-4xl bg-linear-to-br from-neutral-900 via-neutral-800 to-primary-600 p-8 text-white shadow-raised lg:p-12"
    >
      <div class="absolute -top-8 right-0 size-64 rounded-full bg-white/10 blur-3xl" />
      <div class="absolute -bottom-16 left-1/3 size-56 rounded-full bg-info-400/20 blur-3xl" />

      <div class="relative z-10 max-w-4xl space-y-6">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur-md"
        >
          <Sparkles class="size-4" /> Profesionales verificados en Medellín
        </span>
        <div>
          <h1 class="mb-4 text-4xl leading-tight font-black md:text-5xl">Encuentra a tu maestro</h1>
          <p class="max-w-3xl text-lg leading-relaxed text-primary-100">
            Filtra por comuna, especialidad y tarifa para encontrar a quien mejor encaja con tu
            necesidad.
          </p>
        </div>
        <form class="flex max-w-3xl flex-col gap-3 sm:flex-row" @submit.prevent="apply()">
          <label
            class="flex h-14 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 backdrop-blur-md"
          >
            <Search class="size-5 text-primary-100" />
            <span class="sr-only">Buscar por nombre</span>
            <input
              v-model="form.q"
              type="search"
              placeholder="Busca por nombre del profesional"
              class="w-full bg-transparent text-white outline-none placeholder:text-primary-100/70"
            />
          </label>
          <button
            type="button"
            :disabled="isLocating"
            class="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 font-semibold text-white backdrop-blur-md transition hover:bg-white/20 disabled:opacity-50"
            @click="activeFilters.lat ? clearLocation() : useMyLocation()"
          >
            <Locate class="size-4" :class="{ 'animate-spin': isLocating }" />
            {{ activeFilters.lat ? 'Cerca de mí ✓' : 'Cerca de mí' }}
          </button>
          <button
            type="submit"
            class="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 font-semibold text-neutral-900 transition hover:bg-primary-50"
          >
            Buscar <ChevronRight class="size-4" />
          </button>
        </form>
        <BaseAlert v-if="geoError" tone="warning" class="max-w-3xl">
          {{ geoError }}
        </BaseAlert>
      </div>
    </section>

    <div class="grid gap-8 xl:grid-cols-[1fr_380px]">
      <div class="space-y-6">
        <BaseCard as="section">
          <div class="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-black text-neutral-900">Filtros</h2>
              <p class="text-sm text-neutral-500">
                Refina los resultados sin salir de la pantalla.
              </p>
            </div>
            <Filter class="size-6 text-primary-600" />
          </div>
          <form class="space-y-5" @submit.prevent="apply()">
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <BaseSelect
                v-model="form.commune_id"
                label="Comuna"
                placeholder="Todas"
                :options="communeOptions"
              />
              <BaseSelect
                v-model="form.category_id"
                label="Categoría de servicio"
                placeholder="Todas"
                :options="categoryOptions"
                @update:model-value="onCategoryChange"
              />
              <BaseSelect
                v-model="form.subcategory_id"
                label="Subcategoría"
                :placeholder="
                  form.category_id ? 'Todas las subcategorías' : 'Elige una categoría primero'
                "
                :options="subcategoryOptions"
                :disabled="!form.category_id || !subcategoryOptions.length"
              />
              <BaseSelect
                v-model="form.sort"
                label="Ordenar por"
                :options="SORT_OPTIONS"
                @update:model-value="onSortChange"
              />
              <BaseInput
                v-model.number="form.min_price"
                label="Tarifa mínima"
                type="number"
                min="0"
                step="5000"
                placeholder="$ 0"
              />
              <BaseInput
                v-model.number="form.max_price"
                label="Tarifa máxima"
                type="number"
                min="0"
                step="5000"
                placeholder="Sin límite"
              />
            </div>
            <BaseAlert v-if="priceError" tone="warning">
              {{ priceError }}
            </BaseAlert>
            <div class="flex flex-wrap items-center gap-3">
              <BaseButton type="submit">Aplicar filtros</BaseButton>
              <BaseButton variant="outline" @click="clearFilters">Limpiar</BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                :loading="isLocating"
                @click="activeFilters.lat ? clearLocation() : useMyLocation()"
              >
                <Locate class="size-4" />
                {{ activeFilters.lat ? 'Quitar geolocalización' : 'Cerca de mí' }}
              </BaseButton>
              <span v-if="result" class="text-sm text-neutral-500">
                {{ result.meta.total }} {{ result.meta.total === 1 ? 'resultado' : 'resultados' }}
              </span>
            </div>
          </form>
        </BaseCard>

        <section class="space-y-4" aria-live="polite">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-black text-neutral-900">Profesionales encontrados</h2>
            <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600">
              <ShieldCheck class="size-4 text-primary-600" /> Todos verificados
            </span>
          </div>

          <BaseAlert
            v-if="result?.data.some((p) => p.is_suggested)"
            tone="info"
            title="Sin profesionales directos en esta comuna"
          >
            No encontramos profesionales disponibles en la comuna seleccionada. Te mostramos los más
            cercanos en comunas aledañas.
          </BaseAlert>

          <template v-if="isPending">
            <BaseSkeleton v-for="n in 3" :key="n" class="h-44" />
          </template>

          <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar los resultados">
            {{ error.message }}
            <BaseButton variant="ghost" size="sm" class="mt-2" @click="refetch()"
              >Reintentar</BaseButton
            >
          </BaseAlert>

          <BaseEmptyState
            v-else-if="!result?.data.length"
            :icon="SearchX"
            title="No encontramos profesionales con esos filtros"
            description="Prueba quitar filtros o buscar otra especialidad."
          >
            <BaseButton variant="outline" @click="clearFilters">Ver todos</BaseButton>
          </BaseEmptyState>

          <template v-else>
            <ProfessionalCard
              v-for="professional in result.data"
              :key="professional.id"
              :professional="professional"
            >
              <template #actions>
                <FavoriteButton :professional-id="professional.id" />
              </template>
            </ProfessionalCard>
            <BasePagination v-model:page="page" :meta="result.meta" />
          </template>
        </section>
      </div>

      <aside class="space-y-6">
        <GoogleMapsEmbed
          :title="mapCenter.title"
          description="Visualiza la cobertura geográfica de profesionales."
          :lat="mapCenter.lat"
          :lng="mapCenter.lng"
          :query="mapCenter.query"
        />

        <BaseCard v-if="auth.role === 'client'" as="section">
          <h2 class="mb-4 text-lg font-black text-neutral-900">Atajos</h2>
          <div class="space-y-3">
            <RouterLink
              :to="{ name: 'client-favorites' }"
              class="flex items-center justify-between rounded-2xl border border-neutral-100 bg-surface-muted px-4 py-4 transition hover:border-primary-200"
            >
              <span>
                <span class="block font-semibold text-neutral-900">Mis favoritos</span>
                <span class="text-sm text-neutral-500">Profesionales guardados</span>
              </span>
              <Heart class="size-5 text-primary-600" />
            </RouterLink>
            <RouterLink
              :to="{ name: 'client-bookings' }"
              class="flex items-center justify-between rounded-2xl border border-neutral-100 bg-surface-muted px-4 py-4 transition hover:border-primary-200"
            >
              <span>
                <span class="block font-semibold text-neutral-900">Mis reservas</span>
                <span class="text-sm text-neutral-500">Estado y detalle</span>
              </span>
              <CalendarDays class="size-5 text-primary-600" />
            </RouterLink>
          </div>
        </BaseCard>
      </aside>
    </div>
  </div>
</template>
