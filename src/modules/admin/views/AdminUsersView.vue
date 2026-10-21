<script setup lang="ts">
import { AlertTriangle, Ban, CheckCircle, Users } from '@lucide/vue'
import { reactive, ref } from 'vue'

import { useToastStore } from '@/shared/stores/toast'
import type { AdminUser } from '@/shared/types/models'
import {
  BaseAlert,
  BaseAvatar,
  BaseBadge,
  BaseButton,
  BaseCard,
  BaseEmptyState,
  BaseInput,
  BaseModal,
  BasePagination,
  BaseSelect,
  BaseSkeleton,
  BaseTextarea,
  type SelectOption,
} from '@/shared/ui'
import { formatDate } from '@/shared/utils/format'

import { useAdminUsers, useBlockUser, useUnblockUser } from '../queries'

const toast = useToastStore()

const ROLE_OPTIONS: SelectOption[] = [
  { value: '', label: 'Todos los roles' },
  { value: 'client', label: 'Clientes' },
  { value: 'professional', label: 'Profesionales' },
  { value: 'admin', label: 'Administradores' },
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'active', label: 'Activos' },
  { value: 'blocked', label: 'Bloqueados' },
]

const filters = reactive({
  page: 1,
  role: undefined as string | undefined,
  status: undefined as string | undefined,
  q: undefined as string | undefined,
})

const { data: usersData, isPending, error, refetch } = useAdminUsers(filters)
const { mutateAsync: blockUserMutation, isLoading: isBlocking } = useBlockUser()
const { mutateAsync: unblockUserMutation, isLoading: isUnblocking } = useUnblockUser()

// Block modal state
const selectedUser = ref<AdminUser | null>(null)
const blockModalOpen = ref(false)
const blockReason = ref('')
const blockError = ref<string | null>(null)

function openBlockModal(user: AdminUser) {
  selectedUser.value = user
  blockReason.value = ''
  blockError.value = null
  blockModalOpen.value = true
}

async function confirmBlock() {
  if (!selectedUser.value) return
  if (!blockReason.value || blockReason.value.trim().length < 5) {
    blockError.value = 'El motivo de bloqueo debe tener al menos 5 caracteres.'
    return
  }

  try {
    await blockUserMutation({
      id: selectedUser.value.id,
      reason: blockReason.value.trim(),
    })
    blockModalOpen.value = false
    toast.success(`Usuario ${selectedUser.value.name} bloqueado correctamente.`)
  } catch (err: unknown) {
    blockError.value = err instanceof Error ? err.message : 'Error al bloquear al usuario.'
  }
}

async function handleUnblock(user: AdminUser) {
  try {
    await unblockUserMutation(user.id)
    toast.success(`Usuario ${user.name} desbloqueado correctamente.`)
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Error al desbloquear al usuario.')
  }
}

function roleLabel(role: string): string {
  switch (role) {
    case 'client':
      return 'Cliente'
    case 'professional':
      return 'Profesional'
    case 'admin':
      return 'Administrador'
    default:
      return role
  }
}

function roleTone(role: string): 'primary' | 'info' | 'neutral' {
  switch (role) {
    case 'client':
      return 'info'
    case 'professional':
      return 'primary'
    default:
      return 'neutral'
  }
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <div
        class="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700"
      >
        <Users class="size-4" />
        Gestión de usuarios
      </div>
      <h1 class="text-3xl font-black text-neutral-900">Usuarios y moderación</h1>
      <p class="mt-2 text-sm text-neutral-500">
        Consulta, filtra y gestiona el estado de acceso de clientes, profesionales y
        administradores.
      </p>
    </div>

    <!-- Filtros -->
    <BaseCard class="mb-6 p-4">
      <div class="grid gap-4 sm:grid-cols-3">
        <BaseInput
          v-model="filters.q"
          placeholder="Buscar por nombre, email o teléfono..."
          label="Búsqueda rápida"
        />

        <BaseSelect v-model="filters.role" label="Filtrar por rol" :options="ROLE_OPTIONS" />

        <BaseSelect v-model="filters.status" label="Estado de cuenta" :options="STATUS_OPTIONS" />
      </div>
    </BaseCard>

    <!-- Estados -->
    <div v-if="isPending" class="space-y-4">
      <BaseSkeleton v-for="n in 5" :key="n" class="h-20 rounded-2xl" />
    </div>

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar los usuarios">
      {{ error.message }}
      <BaseButton variant="ghost" size="sm" class="mt-2" @click="refetch()">
        Reintentar
      </BaseButton>
    </BaseAlert>

    <BaseEmptyState
      v-else-if="!usersData?.data?.length"
      :icon="Users"
      title="No se encontraron usuarios"
      description="Intenta cambiar los filtros de búsqueda o el rol seleccionado."
    />

    <!-- Lista de usuarios -->
    <div v-else class="space-y-4">
      <div class="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-card">
        <ul class="divide-y divide-neutral-100">
          <li
            v-for="user in usersData.data"
            :key="user.id"
            class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-center gap-4">
              <BaseAvatar :name="user.name" :src="user.avatar_url" size="md" />
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-neutral-900">{{ user.name }}</span>
                  <BaseBadge :tone="roleTone(user.role)" size="sm">
                    {{ roleLabel(user.role) }}
                  </BaseBadge>
                  <BaseBadge v-if="user.is_blocked" tone="danger" size="sm"> Bloqueado </BaseBadge>
                  <BaseBadge v-else tone="success" size="sm"> Activo </BaseBadge>
                </div>
                <div class="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-neutral-500">
                  <span>{{ user.email }}</span>
                  <span v-if="user.phone">· {{ user.phone }}</span>
                  <span v-if="user.commune">· {{ user.commune.name }}</span>
                  <span>· Registrado: {{ formatDate(user.created_at) }}</span>
                </div>
                <p
                  v-if="user.is_blocked && user.blocked_reason"
                  class="mt-2 text-xs font-semibold text-danger-600"
                >
                  Motivo de bloqueo: {{ user.blocked_reason }}
                </p>
              </div>
            </div>

            <div class="flex shrink-0 items-center gap-2">
              <BaseButton
                v-if="user.is_blocked"
                variant="outline"
                size="sm"
                :loading="isUnblocking"
                @click="handleUnblock(user)"
              >
                <CheckCircle class="size-4 text-success-600" />
                Desbloquear
              </BaseButton>

              <BaseButton
                v-else-if="user.role !== 'admin'"
                variant="ghost"
                size="sm"
                class="text-danger-600 hover:bg-danger-50"
                @click="openBlockModal(user)"
              >
                <Ban class="size-4" />
                Bloquear
              </BaseButton>
            </div>
          </li>
        </ul>
      </div>

      <!-- Paginación -->
      <div v-if="usersData.meta && usersData.meta.last_page > 1" class="flex justify-center pt-4">
        <BasePagination v-model:page="filters.page" :meta="usersData.meta" />
      </div>
    </div>

    <!-- Modal para bloquear usuario -->
    <BaseModal
      v-model:open="blockModalOpen"
      :title="`Bloquear a ${selectedUser?.name ?? 'usuario'}`"
    >
      <div class="space-y-4">
        <BaseAlert tone="danger">
          <template #icon>
            <AlertTriangle class="size-5" />
          </template>
          El bloqueo impedirá que el usuario inicie sesión, cree solicitudes o responda a servicios
          en la plataforma.
        </BaseAlert>

        <BaseTextarea
          v-model="blockReason"
          label="Motivo del bloqueo"
          placeholder="Describe la infracción o motivo por el cual se bloquea la cuenta..."
          :rows="3"
          required
        />

        <BaseAlert v-if="blockError" tone="danger">
          {{ blockError }}
        </BaseAlert>

        <div class="mt-6 flex justify-end gap-3">
          <BaseButton variant="secondary" :disabled="isBlocking" @click="blockModalOpen = false">
            Cancelar
          </BaseButton>

          <BaseButton variant="danger" :loading="isBlocking" @click="confirmBlock">
            <Ban class="size-4" />
            Confirmar bloqueo
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
