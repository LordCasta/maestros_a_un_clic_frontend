<script setup lang="ts">
import {
  AlertCircle,
  Award,
  Briefcase,
  Camera,
  CheckCircle2,
  Clock,
  FileText,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from '@lucide/vue'
import { computed, ref } from 'vue'

import { useToastStore } from '@/shared/stores/toast'
import type { DocumentType, VerificationDocument } from '@/shared/types/models'
import {
  BaseAlert,
  BaseBadge,
  BaseButton,
  BaseCard,
  BaseFileInput,
  BaseSkeleton,
} from '@/shared/ui'

import ReplaceDocumentModal from '../components/ReplaceDocumentModal.vue'
import { useSubmitVerification, useVerificationStatus } from '../queries'

const toast = useToastStore()
const { data: verificationState, isPending, error, refetch } = useVerificationStatus()
const { mutateAsync: submitVerification, isLoading: isSubmitting } = useSubmitVerification()

// Estado para modal de reemplazo
const replaceModalOpen = ref(false)
const selectedDocForReplace = ref<VerificationDocument | null>(null)

// Campos del formulario inicial
const idDocument = ref<File | null>(null)
const selfie = ref<File | null>(null)
const certificates = ref<File[] | File | null>(null)
const workEvidences = ref<File[] | File | null>(null)
const submissionError = ref('')

const certificatesList = computed<File[]>(() => {
  if (!certificates.value) return []
  return Array.isArray(certificates.value) ? certificates.value : [certificates.value]
})

const workEvidencesList = computed<File[]>(() => {
  if (!workEvidences.value) return []
  return Array.isArray(workEvidences.value) ? workEvidences.value : [workEvidences.value]
})

function openReplaceModal(doc: VerificationDocument) {
  selectedDocForReplace.value = doc
  replaceModalOpen.value = true
}

function documentTypeLabel(type: DocumentType): string {
  switch (type) {
    case 'id_document':
      return 'Documento de identidad'
    case 'selfie':
      return 'Selfie de verificación'
    case 'certificate':
      return 'Certificado o diploma'
    case 'work_evidence':
      return 'Evidencia de trabajo'
    default:
      return type
  }
}

async function handleInitialSubmit() {
  submissionError.value = ''

  if (!idDocument.value) {
    submissionError.value = 'Debes adjuntar tu documento de identidad.'
    return
  }

  if (!selfie.value) {
    submissionError.value = 'Debes tomarte o adjuntar una selfie para verificar tu identidad.'
    return
  }

  if (certificatesList.value.length === 0 && workEvidencesList.value.length === 0) {
    submissionError.value = 'Debes adjuntar al menos un certificado o una evidencia de trabajo.'
    return
  }

  const formData = new FormData()
  let index = 0

  // Documento de identidad
  formData.append(`documents[${index}][type]`, 'id_document')
  formData.append(`documents[${index}][file]`, idDocument.value)
  formData.append(`documents[${index}][title]`, 'Documento de identidad')
  index++

  // Selfie
  formData.append(`documents[${index}][type]`, 'selfie')
  formData.append(`documents[${index}][file]`, selfie.value)
  formData.append(`documents[${index}][title]`, 'Selfie de verificación')
  index++

  // Certificados
  for (const cert of certificatesList.value) {
    formData.append(`documents[${index}][type]`, 'certificate')
    formData.append(`documents[${index}][file]`, cert)
    formData.append(`documents[${index}][title]`, cert.name)
    index++
  }

  // Evidencias de trabajo
  for (const work of workEvidencesList.value) {
    formData.append(`documents[${index}][type]`, 'work_evidence')
    formData.append(`documents[${index}][file]`, work)
    formData.append(`documents[${index}][title]`, work.name)
    index++
  }

  try {
    const response = await submitVerification(formData)
    toast.success(response.message ?? 'Documentos enviados para verificación.')
    idDocument.value = null
    selfie.value = null
    certificates.value = null
    workEvidences.value = null
  } catch (err: unknown) {
    submissionError.value =
      err instanceof Error ? err.message : 'Ocurrió un error al enviar los documentos.'
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
    <header class="space-y-2">
      <div class="inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
        <ShieldCheck class="size-5" />
        <span>Seguridad y confianza</span>
      </div>
      <h1 class="text-3xl font-black text-neutral-900">Verificación de perfil</h1>
      <p class="text-neutral-500">
        Valida tu identidad y competencias para obtener el sello de profesional verificado y
        comenzar a recibir solicitudes de clientes.
      </p>
    </header>

    <!-- Estado 1: Cargando -->
    <div v-if="isPending" class="space-y-6">
      <BaseSkeleton class="h-32 rounded-3xl" />
      <BaseSkeleton class="h-64 rounded-3xl" />
    </div>

    <!-- Estado 2: Error -->
    <div v-else-if="error" class="space-y-4">
      <BaseAlert tone="danger" title="No pudimos cargar tu estado de verificación">
        {{ error.message }}
      </BaseAlert>
      <BaseButton variant="outline" @click="() => refetch()">
        <RotateCcw class="mr-2 size-4" />
        Reintentar
      </BaseButton>
    </div>

    <!-- Estado 3: Contenido -->
    <div v-else-if="verificationState" class="space-y-8">
      <!-- Banner según el estado de verificación -->
      <section>
        <!-- Aprobado -->
        <div
          v-if="verificationState.verification_status === 'approved'"
          class="flex items-start gap-4 rounded-3xl border border-success-200 bg-success-50 p-6 text-success-900 shadow-card"
        >
          <CheckCircle2 class="size-8 shrink-0 text-success-600" />
          <div class="space-y-1">
            <h2 class="text-xl font-black text-success-950">¡Tu perfil está verificado!</h2>
            <p class="text-sm text-success-800">
              Tus documentos han sido aprobados exitosamente. Tu perfil aparece con el sello
              distintivo en las búsquedas y puedes ofrecer todos tus servicios.
            </p>
          </div>
        </div>

        <!-- En revisión (Pendiente) -->
        <div
          v-else-if="verificationState.verification_status === 'pending'"
          class="flex items-start gap-4 rounded-3xl border border-warning-200 bg-warning-50 p-6 text-warning-900 shadow-card"
        >
          <Clock class="size-8 shrink-0 text-warning-600" />
          <div class="space-y-1">
            <h2 class="text-xl font-black text-warning-950">Documentos en revisión</h2>
            <p class="text-sm text-warning-800">
              Tu solicitud está siendo revisada por nuestro equipo administrativo. Mientras esté en
              proceso, tu perfil no estará visible en las búsquedas públicas ni podrás aceptar
              servicios. Te notificaremos cuando termine la revisión.
            </p>
          </div>
        </div>

        <!-- Rechazado -->
        <div
          v-else-if="verificationState.verification_status === 'rejected'"
          class="flex items-start gap-4 rounded-3xl border border-danger-200 bg-danger-50 p-6 text-danger-900 shadow-card"
        >
          <ShieldAlert class="size-8 shrink-0 text-danger-600" />
          <div class="space-y-2">
            <h2 class="text-xl font-black text-danger-950">Solicitud rechazada</h2>
            <p class="text-sm text-danger-800">
              Revisa los motivos indicados a continuación. Puedes reemplazar los documentos marcados
              como rechazados para reenviar automáticamente tu solicitud a revisión.
            </p>
            <div
              v-if="verificationState.latest_request?.rejection_reason"
              class="rounded-xl border border-danger-200 bg-white p-3 text-sm text-danger-900"
            >
              <strong class="font-bold">Motivo general: </strong>
              <span>{{ verificationState.latest_request.rejection_reason }}</span>
            </div>
          </div>
        </div>

        <!-- Sin verificar (Unverified) -->
        <div
          v-else
          class="flex items-start gap-4 rounded-3xl border border-info-200 bg-info-50 p-6 text-info-900 shadow-card"
        >
          <AlertCircle class="size-8 shrink-0 text-info-600" />
          <div class="space-y-1">
            <h2 class="text-xl font-black text-info-950">Perfil no verificado</h2>
            <p class="text-sm text-info-800">
              Para garantizar la seguridad de nuestra comunidad, solicitamos tus documentos de
              identidad y certificaciones antes de habilitar tu perfil para recibir clientes.
            </p>
          </div>
        </div>
      </section>

      <!-- Listado de documentos de la solicitud actual si existe -->
      <section v-if="verificationState.latest_request?.documents?.length" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-black text-neutral-900">Documentos enviados</h2>
          <BaseBadge
            :tone="
              verificationState.latest_request.status === 'approved'
                ? 'success'
                : verificationState.latest_request.status === 'rejected'
                  ? 'danger'
                  : 'warning'
            "
          >
            {{
              verificationState.latest_request.status === 'approved'
                ? 'Aprobada'
                : verificationState.latest_request.status === 'rejected'
                  ? 'Rechazada'
                  : 'En revisión'
            }}
          </BaseBadge>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <BaseCard
            v-for="doc in verificationState.latest_request.documents"
            :key="doc.id"
            class="space-y-3 p-5"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="space-y-0.5">
                <span class="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  {{ documentTypeLabel(doc.type) }}
                </span>
                <p class="font-bold text-neutral-900">
                  {{ doc.title || 'Documento adjunto' }}
                </p>
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

            <!-- Motivo de rechazo individual -->
            <div
              v-if="doc.rejection_reason"
              class="rounded-xl border border-danger-200 bg-danger-50 p-2.5 text-xs text-danger-800"
            >
              <strong class="font-bold">Motivo: </strong>{{ doc.rejection_reason }}
            </div>

            <div class="flex items-center justify-between pt-2">
              <a
                v-if="doc.file_url"
                :href="doc.file_url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700"
              >
                <FileText class="size-3.5" />
                <span>Ver documento</span>
              </a>
              <span v-else class="text-xs text-neutral-500">Archivo privado</span>

              <BaseButton
                v-if="doc.status === 'rejected'"
                variant="outline"
                size="sm"
                @click="openReplaceModal(doc)"
              >
                <Upload class="mr-1.5 size-3.5" />
                Reemplazar
              </BaseButton>
            </div>
          </BaseCard>
        </div>
      </section>

      <!-- Formulario de cargue inicial (solo si está unverified o sin solicitud) -->
      <section
        v-if="
          verificationState.verification_status === 'unverified' ||
          !verificationState.latest_request
        "
        class="space-y-6"
      >
        <div class="space-y-1">
          <h2 class="text-xl font-black text-neutral-900">Formulario de cargue de documentos</h2>
          <p class="text-sm text-neutral-500">
            Adjunta los documentos requeridos. Puedes subir archivos en formato PDF, JPG, PNG o WEBP
            de hasta 10 MB cada uno.
          </p>
        </div>

        <BaseAlert v-if="submissionError" tone="danger">
          {{ submissionError }}
        </BaseAlert>

        <form class="space-y-6" novalidate @submit.prevent="handleInitialSubmit">
          <!-- 1. Documento de identidad -->
          <BaseCard class="space-y-4 p-6">
            <div class="flex items-start gap-3">
              <div class="rounded-xl bg-primary-50 p-2.5 text-primary-600">
                <FileText class="size-6" />
              </div>
              <div class="space-y-0.5">
                <h3 class="font-bold text-neutral-900">1. Documento de identidad (Obligatorio)</h3>
                <p class="text-xs text-neutral-500">
                  Cédula de ciudadanía o extranjería por ambas caras. Debe ser nítida y legible.
                </p>
              </div>
            </div>

            <BaseFileInput
              v-model="idDocument"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              hint="Formatos: JPG, PNG, WEBP o PDF (máx. 10 MB)"
            />
          </BaseCard>

          <!-- 2. Selfie de validación -->
          <BaseCard class="space-y-4 p-6">
            <div class="flex items-start gap-3">
              <div class="rounded-xl bg-primary-50 p-2.5 text-primary-600">
                <Camera class="size-6" />
              </div>
              <div class="space-y-0.5">
                <h3 class="font-bold text-neutral-900">2. Selfie de verificación (Obligatoria)</h3>
                <p class="text-xs text-neutral-500">
                  Foto actual de tu rostro con buena iluminación y sin accesorios que cubran tu cara
                  (gafas de sol, gorras).
                </p>
              </div>
            </div>

            <BaseFileInput
              v-model="selfie"
              accept="image/jpeg,image/png,image/webp"
              hint="Formatos: JPG, PNG o WEBP (máx. 10 MB)"
            />
          </BaseCard>

          <!-- 3. Certificados o diplomas -->
          <BaseCard class="space-y-4 p-6">
            <div class="flex items-start gap-3">
              <div class="rounded-xl bg-primary-50 p-2.5 text-primary-600">
                <Award class="size-6" />
              </div>
              <div class="space-y-0.5">
                <h3 class="font-bold text-neutral-900">3. Certificados y diplomas</h3>
                <p class="text-xs text-neutral-500">
                  Títulos técnicos, certificaciones del SENA, diplomas de cursos o carnets
                  profesionales (puedes subir varios).
                </p>
              </div>
            </div>

            <BaseFileInput
              v-model="certificates"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              hint="Formatos: JPG, PNG, WEBP o PDF (máx. 10 MB por archivo)"
            />
          </BaseCard>

          <!-- 4. Evidencias de trabajo -->
          <BaseCard class="space-y-4 p-6">
            <div class="flex items-start gap-3">
              <div class="rounded-xl bg-primary-50 p-2.5 text-primary-600">
                <Briefcase class="size-6" />
              </div>
              <div class="space-y-0.5">
                <h3 class="font-bold text-neutral-900">4. Evidencias de trabajo previo</h3>
                <p class="text-xs text-neutral-500">
                  Cartas de recomendación, contratos anteriores o fotos de trabajos realizados
                  (puedes subir varios).
                </p>
              </div>
            </div>

            <BaseFileInput
              v-model="workEvidences"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              hint="Formatos: JPG, PNG, WEBP o PDF (máx. 10 MB por archivo)"
            />
          </BaseCard>

          <div class="flex justify-end pt-4">
            <BaseButton variant="primary" type="submit" size="lg" :loading="isSubmitting">
              <Upload class="mr-2 size-5" />
              Enviar documentos a revisión
            </BaseButton>
          </div>
        </form>
      </section>
    </div>

    <!-- Modal de reemplazo de documento rechazado -->
    <ReplaceDocumentModal
      v-model:open="replaceModalOpen"
      :document="selectedDocForReplace"
      @replaced="() => refetch()"
    />
  </div>
</template>
