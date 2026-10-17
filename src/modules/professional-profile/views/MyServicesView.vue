<script setup lang="ts">
import { Clock3, Pencil, Plus, Trash2, Wrench } from '@lucide/vue'
import { computed, ref } from 'vue'

import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import type { ProfessionalService } from '@/shared/types/models'
import {
  BaseAlert,
  BaseBadge,
  BaseButton,
  BaseCard,
  BaseEmptyState,
  BaseModal,
  BaseSkeleton,
} from '@/shared/ui'
import { formatDuration, formatMoney } from '@/shared/utils/format'

import ServiceFormModal from '../components/ServiceFormModal.vue'
import { useDeleteService, useMyProfile, useMyServices, useToggleService } from '../queries'

/** HU009, HU047: los servicios que ofrece el profesional, con precio y duración estimada. */
const toast = useToastStore()
const { data: services, isPending, error } = useMyServices()
const { data: profile } = useMyProfile()
const { mutateAsync: toggle } = useToggleService()
const { mutateAsync: destroy, isLoading: deleting } = useDeleteService()

const specialtyIds = computed(() => profile.value?.categories.map((category) => category.id) ?? [])

const formOpen = ref(false)
const editing = ref<ProfessionalService | null>(null)
function openForm(service: ProfessionalService | null) {
  editing.value = service
  formOpen.value = true
}

const toDelete = ref<ProfessionalService | null>(null)
const deleteOpen = computed({
  get: () => toDelete.value !== null,
  set: (value) => {
    if (!value) toDelete.value = null
  },
})

async function onToggle(service: ProfessionalService) {
  try {
    await toggle({ id: service.id, isActive: !service.is_active })
    toast.success(service.is_active ? 'Servicio oculto.' : 'Servicio activo.')
  } catch (failure) {
    toast.error(failure instanceof ApiError ? failure.message : 'No pudimos cambiar el servicio.')
  }
}

async function onDelete() {
  if (!toDelete.value) return
  try {
    const response = await destroy(toDelete.value.id)
    toast.success(response.message ?? 'Servicio eliminado.')
  } catch (failure) {
    toast.error(failure instanceof ApiError ? failure.message : 'No pudimos borrar el servicio.')
  } finally {
    toDelete.value = null
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-neutral-900">Mis servicios</h1>
        <p class="mt-1 text-neutral-500">
          Lo que los clientes pueden reservar contigo, con su precio y duración.
        </p>
      </div>
      <BaseButton @click="openForm(null)"><Plus class="size-4" /> Nuevo servicio</BaseButton>
    </header>

    <div v-if="isPending" class="space-y-4">
      <BaseSkeleton v-for="n in 3" :key="n" class="h-28" />
    </div>

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar tus servicios">
      {{ error.message }}
    </BaseAlert>

    <BaseEmptyState
      v-else-if="!services?.length"
      :icon="Wrench"
      title="Aún no ofreces servicios"
      description="Crea tu primer servicio para que los clientes puedan reservarte."
    >
      <BaseButton @click="openForm(null)">Crear servicio</BaseButton>
    </BaseEmptyState>

    <ul v-else class="space-y-4">
      <li v-for="service in services" :key="service.id">
        <BaseCard
          padding="sm"
          :class="[
            'flex flex-col gap-4 sm:flex-row sm:items-center',
            !service.is_active && 'opacity-70',
          ]"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-bold text-neutral-900">{{ service.title }}</p>
              <BaseBadge :tone="service.is_active ? 'success' : 'neutral'">
                {{ service.is_active ? 'Activo' : 'Oculto' }}
              </BaseBadge>
            </div>
            <p v-if="service.category" class="text-sm text-neutral-500">
              {{ service.category.name }}
            </p>
            <p v-if="service.description" class="mt-1 text-sm text-neutral-600">
              {{ service.description }}
            </p>
            <p class="mt-2 inline-flex items-center gap-1 text-xs text-neutral-500">
              <Clock3 class="size-3.5" /> Duración estimada:
              {{ formatDuration(service.estimated_duration_minutes) }}
            </p>
          </div>
          <div class="flex items-center gap-3 sm:flex-col sm:items-end">
            <p class="text-right">
              <span class="text-lg font-black text-primary-700">{{
                formatMoney(service.price)
              }}</span>
              <span class="block text-xs text-neutral-500">
                {{ service.price_type === 'hourly' ? 'por hora' : 'precio fijo' }}
              </span>
            </p>
            <div class="flex gap-1">
              <BaseButton variant="ghost" size="sm" @click="onToggle(service)">
                {{ service.is_active ? 'Ocultar' : 'Activar' }}
              </BaseButton>
              <BaseButton
                variant="ghost"
                size="sm"
                :aria-label="`Editar ${service.title}`"
                @click="openForm(service)"
              >
                <Pencil class="size-4" />
              </BaseButton>
              <BaseButton
                variant="ghost"
                size="sm"
                :aria-label="`Borrar ${service.title}`"
                @click="toDelete = service"
              >
                <Trash2 class="size-4" />
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </li>
    </ul>

    <ServiceFormModal v-model:open="formOpen" :service="editing" :specialty-ids="specialtyIds" />

    <BaseModal
      v-model:open="deleteOpen"
      size="sm"
      title="¿Borrar este servicio?"
      :description="`«${toDelete?.title ?? ''}» dejará de aparecer en tu perfil. Si ya tiene reservas, mejor ocúltalo.`"
    >
      <template #footer>
        <BaseButton variant="outline" @click="toDelete = null">Volver</BaseButton>
        <BaseButton variant="danger" :loading="deleting" @click="onDelete">Borrar</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
