<script setup lang="ts">
import { RotateCw, Search, ShieldCheck } from '@lucide/vue'
import { computed, ref } from 'vue'

import type { AdminVerificationFilters, VerificationRequest } from '@/shared/types/models'
import {
  BaseAlert,
  BaseAvatar,
  BaseBadge,
  BaseButton,
  BaseCard,
  BaseEmptyState,
  BaseInput,
  BasePagination,
  BaseSelect,
  BaseSkeleton,
  type SelectOption,
} from '@/shared/ui'
import { formatDate } from '@/shared/utils/format'

import AdminVerificationDetailModal from '../components/AdminVerificationDetailModal.vue'
import { useAdminVerifications } from '../queries'

const statusFilter = ref<string>('pending')
const roleFilter = ref<string>('')
const docTypeFilter = ref<string>('')
const searchQuery = ref<string>('')
const page = ref<number>(1)

const filters = computed<AdminVerificationFilters>(() => ({
  status: statusFilter.value || undefined,
  role: roleFilter.value || undefined,
  document_type: docTypeFilter.value || undefined,
  search: searchQuery.value || undefined,
  page: page.value,
  per_page: 10,
}))

const { data, status, error, refetch } = useAdminVerifications(filters)

const statusOptions: SelectOption[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobadas' },
  { value: 'rejected', label: 'Rechazadas' },
]

const roleOptions: SelectOption[] = [
  { value: '', label: 'Todos los roles' },
  { value: 'professional', label: 'Profesionales' },
  { value: 'client', label: 'Clientes' },
]

const docTypeOptions: SelectOption[] = [
  { value: '', label: 'Todos los documentos' },
  { value: 'id_document', label: 'Cédula de ciudadanía' },
  { value: 'selfie', label: 'Selfie de verificación' },
  { value: 'certificate', label: 'Certificado profesional' },
  { value: 'work_evidence', label: 'Evidencia de trabajo' },
]

const selectedRequest = ref<VerificationRequest | null>(null)
const showDetailModal = ref(false)

const openDetail = (request: VerificationRequest) => {
  selectedRequest.value = request
  showDetailModal.value = true
}

const onModalUpdated = () => {
  refetch()
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
    <!-- Encabezado -->
    <div>
      <h1 class="text-3xl font-black text-neutral-900">Bandeja de verificaciones KYC</h1>
      <p class="mt-1 text-sm text-neutral-500">
        Revisa las selfies y documentos cargados por profesionales y clientes para aprobar o
        rechazar su identidad.
      </p>
    </div>

    <!-- Filtros -->
    <BaseCard class="p-4 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <BaseInput
          v-model="searchQuery"
          placeholder="Buscar por nombre o correo..."
          label="Búsqueda"
        >
          <template #prefix>
            <Search class="h-4 w-4 text-neutral-400" />
          </template>
        </BaseInput>

        <BaseSelect v-model="statusFilter" :options="statusOptions" label="Estado de solicitud" />

        <BaseSelect v-model="roleFilter" :options="roleOptions" label="Rol del usuario" />

        <BaseSelect v-model="docTypeFilter" :options="docTypeOptions" label="Tipo de documento" />
      </div>
    </BaseCard>

    <!-- Estados de la vista -->
    <!-- Cargando -->
    <div v-if="status === 'pending'" class="space-y-4">
      <BaseSkeleton v-for="i in 3" :key="i" class="h-28 w-full rounded-2xl" />
    </div>

    <!-- Error -->
    <BaseAlert v-else-if="status === 'error'" tone="danger">
      <div class="flex items-center justify-between w-full">
        <span>{{
          error instanceof Error
            ? error.message
            : 'Error al cargar las solicitudes de verificación.'
        }}</span>
        <BaseButton variant="outline" size="sm" @click="() => refetch()">
          <RotateCw class="h-4 w-4 mr-1.5" />
          Reintentar
        </BaseButton>
      </div>
    </BaseAlert>

    <!-- Vacío -->
    <BaseEmptyState
      v-else-if="!data?.data || data.data.length === 0"
      title="No hay solicitudes de verificación"
      description="No se encontraron solicitudes que coincidan con los filtros seleccionados."
    >
      <template #icon>
        <ShieldCheck class="h-10 w-10 text-neutral-400" />
      </template>
    </BaseEmptyState>

    <!-- Contenido -->
    <div v-else class="space-y-4">
      <div
        v-for="item in data.data"
        :key="item.id"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-neutral-200 bg-white shadow-card transition hover:border-neutral-300"
      >
        <div class="flex items-start gap-4">
          <BaseAvatar :src="item.user?.avatar_url" :name="item.user?.name ?? 'Usuario'" size="lg" />

          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-bold text-neutral-900">{{ item.user?.name }}</h3>
              <BaseBadge :tone="item.user?.role === 'professional' ? 'primary' : 'neutral'">
                {{ item.user?.role === 'professional' ? 'Profesional' : 'Cliente' }}
              </BaseBadge>
              <BaseBadge
                :tone="
                  item.status === 'approved'
                    ? 'success'
                    : item.status === 'rejected'
                      ? 'danger'
                      : 'warning'
                "
              >
                {{
                  item.status === 'approved'
                    ? 'Aprobada'
                    : item.status === 'rejected'
                      ? 'Rechazada'
                      : 'Pendiente'
                }}
              </BaseBadge>
            </div>

            <p class="text-xs text-neutral-500">{{ item.user?.email }}</p>

            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 pt-1">
              <span><strong>Enviado:</strong> {{ formatDate(item.submitted_at) }}</span>
              <span><strong>Documentos:</strong> {{ item.documents?.length ?? 0 }} adjuntos</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <BaseButton variant="outline" size="sm" @click="openDetail(item)">
            Revisar documentos
          </BaseButton>
        </div>
      </div>

      <!-- Paginación -->
      <BasePagination v-model:page="page" :meta="data.meta" />
    </div>

    <!-- Modal de detalle -->
    <AdminVerificationDetailModal
      v-model:open="showDetailModal"
      :request="selectedRequest"
      @updated="onModalUpdated"
    />
  </div>
</template>
