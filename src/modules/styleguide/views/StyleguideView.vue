<script setup lang="ts">
import { Inbox, Mail } from '@lucide/vue'
import { ref } from 'vue'

import { useToastStore } from '@/shared/stores/toast'
import {
  BaseAlert,
  BaseAvatar,
  BaseBadge,
  BaseButton,
  BaseCard,
  BaseChoiceGroup,
  BaseEmptyState,
  BaseFileInput,
  BaseInput,
  BaseModal,
  BasePagination,
  BaseRating,
  BaseSelect,
  BaseSkeleton,
  BaseSpinner,
  BaseStepper,
  BaseTextarea,
  BrandMark,
} from '@/shared/ui'

/**
 * Catálogo vivo del sistema de diseño (/_ui, solo en desarrollo).
 * Si agregas un componente base o un token, muéstralo aquí.
 */
const toast = useToastStore()

const PALETTE = [
  { name: 'primary', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'neutral', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'success', shades: [50, 100, 500, 600, 700] },
  { name: 'danger', shades: [50, 100, 500, 600, 700] },
  { name: 'warning', shades: [50, 100, 400, 500, 700] },
  { name: 'info', shades: [50, 100, 400, 500, 700] },
]
const SURFACES = ['canvas', 'surface', 'surface-muted']

const text = ref('')
const textError = ref('')
const select = ref<number | null>(null)
const choices = ref<number[]>([1])
const file = ref<File | File[] | null>(null)
const longText = ref('')
const modalOpen = ref(false)
const page = ref(2)
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
    <header class="space-y-2">
      <BrandMark />
      <h1 class="pt-4 text-3xl font-black text-neutral-900">Sistema de diseño</h1>
      <p class="text-neutral-500">
        Tokens en <code>src/app/main.css</code> · Componentes en <code>src/shared/ui</code> · Reglas
        en
        <code>docs/sistema-de-diseno.md</code>
      </p>
    </header>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-neutral-900">Colores</h2>
      <div v-for="color in PALETTE" :key="color.name" class="flex flex-wrap items-center gap-2">
        <span class="w-20 text-sm font-semibold text-neutral-700">{{ color.name }}</span>
        <div
          v-for="shade in color.shades"
          :key="shade"
          class="flex size-14 items-end rounded-xl p-1.5 text-[10px] font-semibold ring-1 ring-black/5 ring-inset"
          :style="{
            background: `var(--color-${color.name}-${shade})`,
            color: shade >= 500 ? 'white' : 'var(--color-neutral-900)',
          }"
        >
          {{ shade }}
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span class="w-20 text-sm font-semibold text-neutral-700">superficies</span>
        <div
          v-for="surface in SURFACES"
          :key="surface"
          class="flex h-14 w-32 items-end rounded-xl p-1.5 text-xs font-semibold text-neutral-700 ring-1 ring-neutral-200 ring-inset"
          :style="{ background: `var(--color-${surface})` }"
        >
          {{ surface }}
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-bold text-neutral-900">Tipografía · Plus Jakarta Sans</h2>
      <p class="text-4xl font-black text-neutral-900">Título de página · text-3xl/4xl font-black</p>
      <p class="text-xl font-bold text-neutral-900">Título de sección · text-xl font-bold</p>
      <p class="font-semibold text-neutral-900">Énfasis y etiquetas · font-semibold</p>
      <p class="text-neutral-700">Texto de lectura · text-neutral-700 (o 600 en bloques largos).</p>
      <p class="text-sm text-neutral-500">Texto secundario · text-sm text-neutral-500</p>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-neutral-900">Botones</h2>
      <div class="flex flex-wrap items-center gap-3">
        <BaseButton>Primario</BaseButton>
        <BaseButton variant="secondary">Secundario</BaseButton>
        <BaseButton variant="outline">Contorno</BaseButton>
        <BaseButton variant="ghost">Fantasma</BaseButton>
        <BaseButton variant="danger">Peligro</BaseButton>
        <BaseButton loading>Guardando</BaseButton>
        <BaseButton disabled>Deshabilitado</BaseButton>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <BaseButton size="sm">Pequeño</BaseButton>
        <BaseButton size="md">Mediano</BaseButton>
        <BaseButton size="lg">Grande</BaseButton>
      </div>
    </section>

    <section class="grid gap-6 md:grid-cols-2">
      <h2 class="text-xl font-bold text-neutral-900 md:col-span-2">Formularios</h2>
      <BaseInput
        v-model="text"
        label="Correo"
        placeholder="correo@ejemplo.com"
        hint="Texto de ayuda."
      >
        <template #icon><Mail /></template>
      </BaseInput>
      <BaseInput
        v-model="textError"
        label="Con error"
        error="Ingresa un correo electrónico válido."
      />
      <BaseSelect
        v-model="select"
        label="Selección"
        placeholder="Selecciona"
        :options="[
          { value: 1, label: 'Opción uno' },
          { value: 2, label: 'Opción dos' },
        ]"
      />
      <BaseTextarea v-model="longText" label="Texto largo" :max-length="200" :rows="3" />
      <BaseChoiceGroup
        v-model="choices"
        label="Selección múltiple"
        :options="[
          { value: 1, label: 'Plomería' },
          { value: 2, label: 'Electricidad' },
          { value: 3, label: 'Pintura' },
        ]"
      />
      <BaseFileInput v-model="file" label="Archivo" hint="JPG o PNG, máximo 5 MB." />
      <BaseStepper
        class="md:col-span-2"
        :steps="['Cuenta', 'Perfil', 'Verificación']"
        :current="2"
      />
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-neutral-900">Insignias, calificación y avatares</h2>
      <div class="flex flex-wrap gap-2">
        <BaseBadge>Neutral</BaseBadge>
        <BaseBadge tone="primary">Primary</BaseBadge>
        <BaseBadge tone="success">Completada</BaseBadge>
        <BaseBadge tone="warning">Pendiente</BaseBadge>
        <BaseBadge tone="danger">Rechazada</BaseBadge>
        <BaseBadge tone="info">En proceso</BaseBadge>
      </div>
      <div class="flex flex-wrap items-center gap-6">
        <BaseRating :rating="{ average: 4.86, count: 128 }" />
        <BaseRating :rating="{ average: 0, count: 0 }" />
        <BaseAvatar name="Juan Castaño" size="sm" />
        <BaseAvatar name="Juan Castaño" />
        <BaseAvatar name="Camila Restrepo" size="lg" />
        <BaseSpinner class="text-primary-600" />
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2">
      <h2 class="text-xl font-bold text-neutral-900 md:col-span-2">Avisos</h2>
      <BaseAlert tone="info" title="Información">Mensaje informativo en línea.</BaseAlert>
      <BaseAlert tone="success" title="Listo">La acción se completó.</BaseAlert>
      <BaseAlert tone="warning" title="Atención"
        >Debes verificar tu identidad para reservar.</BaseAlert
      >
      <BaseAlert tone="danger" title="Error">No pudimos guardar los cambios.</BaseAlert>
      <div class="flex flex-wrap gap-3 md:col-span-2">
        <BaseButton variant="outline" @click="toast.success('Reserva cancelada.')"
          >Toast éxito</BaseButton
        >
        <BaseButton variant="outline" @click="toast.error('No pudimos cancelar la reserva.')"
          >Toast error</BaseButton
        >
        <BaseButton variant="outline" @click="modalOpen = true">Abrir modal</BaseButton>
      </div>
    </section>

    <section class="grid gap-6 md:grid-cols-2">
      <h2 class="text-xl font-bold text-neutral-900 md:col-span-2">Contenedores y estados</h2>
      <BaseCard>
        <p class="font-semibold">BaseCard</p>
        <p class="text-sm text-neutral-500">Fondo surface, borde suave, radio 3xl.</p>
        <BaseCard variant="muted" padding="sm" class="mt-4">
          <p class="text-sm">BaseCard variant="muted" para bloques internos.</p>
        </BaseCard>
      </BaseCard>
      <div class="space-y-3">
        <BaseSkeleton class="h-6 w-1/2" />
        <BaseSkeleton class="h-24" />
      </div>
      <BaseEmptyState :icon="Inbox" title="Sin resultados" description="Así se ve una lista vacía.">
        <BaseButton size="sm">Acción principal</BaseButton>
      </BaseEmptyState>
      <BaseCard>
        <BasePagination
          v-model:page="page"
          :meta="{ current_page: page, last_page: 5, per_page: 10, total: 48 }"
        />
      </BaseCard>
    </section>

    <BaseModal
      v-model:open="modalOpen"
      title="Cancelar reserva"
      description="Esta acción no se puede deshacer."
    >
      <p class="text-sm text-neutral-600">Contenido del modal.</p>
      <template #footer>
        <BaseButton variant="outline" @click="modalOpen = false">Volver</BaseButton>
        <BaseButton variant="danger" @click="modalOpen = false">Confirmar</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
