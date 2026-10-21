<script setup lang="ts">
import { Check, ExternalLink, FileText, Image, X } from '@lucide/vue'
import { computed, ref } from 'vue'

import { useToastStore } from '@/shared/stores/toast'
import type { VerificationDocument, VerificationRequest } from '@/shared/types/models'
import { BaseAlert, BaseBadge, BaseButton, BaseCard, BaseModal } from '@/shared/ui'
import { formatDate } from '@/shared/utils/format'

import { useApproveVerification, useUpdateVerificationDocument } from '../queries'
import AdminDocumentRejectModal from './AdminDocumentRejectModal.vue'
import AdminVerificationRejectModal from './AdminVerificationRejectModal.vue'

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{
  request: VerificationRequest | null
}>()

const emit = defineEmits<{
  (e: 'updated'): void
}>()

const toast = useToastStore()
const { mutateAsync: approveRequest, isLoading: isApproving } = useApproveVerification()
const { mutateAsync: updateDocStatus } = useUpdateVerificationDocument()

const showRejectRequestModal = ref(false)
const showRejectDocModal = ref(false)
const selectedDoc = ref<VerificationDocument | null>(null)
const actionError = ref('')

const typeLabels: Record<string, string> = {
  id_document: 'Documento de identidad (cédula)',
  selfie: 'Selfie de verificación',
  certificate: 'Certificado profesional / técnico',
  work_evidence: 'Evidencia de trabajo realizado',
}

const hasIdDocument = computed(
  () => props.request?.documents?.some((d) => d.type === 'id_document') ?? false,
)
const hasSelfie = computed(
  () => props.request?.documents?.some((d) => d.type === 'selfie') ?? false,
)
const hasRejectedDocs = computed(
  () => props.request?.documents?.some((d) => d.status === 'rejected') ?? false,
)

const canApprove = computed(() => {
  if (!props.request) return false
  if (props.request.status === 'approved') return false
  return hasIdDocument.value && hasSelfie.value && !hasRejectedDocs.value
})

const onApproveRequest = async () => {
  if (!props.request) return
  actionError.value = ''

  try {
    const response = await approveRequest(props.request.id)
    toast.success(response.message ?? 'Solicitud de verificación aprobada.')
    open.value = false
    emit('updated')
  } catch (error) {
    actionError.value = error instanceof Error ? error.message : 'Error al aprobar la verificación.'
  }
}

const onApproveDoc = async (doc: VerificationDocument) => {
  actionError.value = ''
  try {
    const response = await updateDocStatus({
      documentId: doc.id,
      status: 'approved',
    })
    toast.success(response.message ?? 'Documento aprobado.')
    doc.status = 'approved'
    doc.rejection_reason = null
    emit('updated')
  } catch (error) {
    actionError.value = error instanceof Error ? error.message : 'Error al actualizar el documento.'
  }
}

const openRejectDoc = (doc: VerificationDocument) => {
  selectedDoc.value = doc
  showRejectDocModal.value = true
}

const onDocRejected = () => {
  emit('updated')
}

const onRequestRejected = () => {
  open.value = false
  emit('updated')
}
</script>

<template>
  <BaseModal
    v-model:open="open"
    :title="`Verificación de ${request?.user?.name ?? 'usuario'}`"
    size="lg"
  >
    <div v-if="request" class="space-y-6">
      <BaseAlert v-if="actionError" tone="danger">{{ actionError }}</BaseAlert>

      <!-- Resumen del Usuario -->
      <BaseCard tone="muted" class="p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-neutral-500 block">Nombre completo</span>
            <span class="font-bold text-neutral-900">{{ request.user?.name }}</span>
          </div>
          <div>
            <span class="text-neutral-500 block">Correo electrónico</span>
            <span class="font-bold text-neutral-900">{{ request.user?.email }}</span>
          </div>
          <div>
            <span class="text-neutral-500 block">Rol / Cuenta</span>
            <span class="font-bold text-neutral-900">
              <BaseBadge :tone="request.user?.role === 'professional' ? 'primary' : 'neutral'">
                {{ request.user?.role === 'professional' ? 'Profesional' : 'Cliente' }}
              </BaseBadge>
            </span>
          </div>
          <div>
            <span class="text-neutral-500 block">Fecha de envío</span>
            <span class="font-bold text-neutral-900">{{ formatDate(request.submitted_at) }}</span>
          </div>
        </div>
      </BaseCard>

      <!-- Estado actual de la solicitud -->
      <div
        class="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200"
      >
        <span class="text-sm font-bold text-neutral-700">Estado de la solicitud:</span>
        <BaseBadge
          :tone="
            request.status === 'approved'
              ? 'success'
              : request.status === 'rejected'
                ? 'danger'
                : 'warning'
          "
        >
          {{
            request.status === 'approved'
              ? 'Aprobada'
              : request.status === 'rejected'
                ? 'Rechazada'
                : 'Pendiente de revisión'
          }}
        </BaseBadge>
      </div>

      <BaseAlert
        v-if="request.status === 'rejected' && request.rejection_reason"
        tone="danger"
        title="Motivo de rechazo de la solicitud"
      >
        {{ request.rejection_reason }}
      </BaseAlert>

      <!-- Documentos Adjuntos -->
      <div>
        <h4 class="text-lg font-black text-neutral-900 mb-3">Documentos KYC adjuntos</h4>

        <div class="space-y-3">
          <div
            v-for="doc in request.documents"
            :key="doc.id"
            class="p-4 rounded-2xl border border-neutral-200 bg-white shadow-card space-y-3"
          >
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div class="flex items-center gap-2">
                <component
                  :is="doc.type === 'selfie' ? Image : FileText"
                  class="h-5 w-5 text-primary-600"
                />
                <div>
                  <h5 class="font-bold text-neutral-900">
                    {{ typeLabels[doc.type] ?? doc.type }}
                  </h5>
                  <p v-if="doc.title" class="text-xs text-neutral-500">{{ doc.title }}</p>
                </div>
              </div>

              <BaseBadge
                :tone="
                  doc.status === 'approved'
                    ? 'success'
                    : doc.status === 'rejected'
                      ? 'danger'
                      : 'warning'
                "
              >
                {{
                  doc.status === 'approved'
                    ? 'Aprobado'
                    : doc.status === 'rejected'
                      ? 'Rechazado'
                      : 'Pendiente'
                }}
              </BaseBadge>
            </div>

            <!-- Motivo de rechazo si aplica -->
            <p
              v-if="doc.status === 'rejected' && doc.rejection_reason"
              class="text-xs text-danger-700 bg-danger-50 p-2 rounded-lg"
            >
              <strong>Motivo de rechazo:</strong> {{ doc.rejection_reason }}
            </p>

            <!-- Acciones por documento -->
            <div
              class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100"
            >
              <a
                v-if="doc.file_url"
                :href="doc.file_url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700"
              >
                <ExternalLink class="h-4 w-4" />
                Ver archivo seguro
              </a>
              <span v-else class="text-xs text-neutral-400">Archivo no disponible</span>

              <div class="flex items-center gap-2">
                <BaseButton
                  v-if="doc.status !== 'approved'"
                  variant="outline"
                  size="sm"
                  class="text-xs"
                  @click="onApproveDoc(doc)"
                >
                  <Check class="h-3.5 w-3.5 mr-1" />
                  Aprobar
                </BaseButton>

                <BaseButton
                  v-if="doc.status !== 'rejected'"
                  variant="outline"
                  size="sm"
                  class="text-xs text-danger-600 hover:bg-danger-50"
                  @click="openRejectDoc(doc)"
                >
                  <X class="h-3.5 w-3.5 mr-1" />
                  Rechazar
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Advertencia si no se puede aprobar -->
      <BaseAlert
        v-if="!canApprove && request.status !== 'approved'"
        tone="warning"
        title="Requisitos para aprobación"
      >
        <span v-if="!hasIdDocument || !hasSelfie">
          Se requiere al menos la cédula de ciudadanía y la selfie para poder aprobar la
          verificación.
        </span>
        <span v-else-if="hasRejectedDocs">
          No es posible aprobar la solicitud mientras existan documentos individuales rechazados.
        </span>
      </BaseAlert>
    </div>

    <template #footer>
      <div class="flex flex-wrap items-center justify-between gap-3 w-full">
        <BaseButton variant="outline" @click="open = false">Cerrar</BaseButton>

        <div class="flex items-center gap-2">
          <BaseButton
            v-if="request?.status !== 'rejected'"
            variant="danger"
            @click="showRejectRequestModal = true"
          >
            Rechazar verificación
          </BaseButton>

          <BaseButton
            v-if="request?.status !== 'approved'"
            variant="primary"
            :disabled="!canApprove"
            :loading="isApproving"
            @click="onApproveRequest"
          >
            Aprobar verificación
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>

  <!-- Modales auxiliares de rechazo -->
  <AdminDocumentRejectModal
    v-model:open="showRejectDocModal"
    :document="selectedDoc"
    @rejected="onDocRejected"
  />

  <AdminVerificationRejectModal
    v-model:open="showRejectRequestModal"
    :request="request"
    @rejected="onRequestRejected"
  />
</template>
