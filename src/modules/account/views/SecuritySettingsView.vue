<script setup lang="ts">
import { AlertTriangle, Info, Lock, ShieldCheck, Trash2 } from '@lucide/vue'
import { ref } from 'vue'

import { BaseAlert, BaseButton } from '@/shared/ui'

import ChangePasswordForm from '../components/ChangePasswordForm.vue'
import DeleteAccountModal from '../components/DeleteAccountModal.vue'

const showDeleteModal = ref(false)
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <div
        class="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700"
      >
        <ShieldCheck class="size-4" />
        Seguridad de la cuenta
      </div>
      <h1 class="text-3xl font-black text-neutral-900">Contraseña y seguridad</h1>
      <p class="mt-2 text-sm text-neutral-500">
        Mantén tu cuenta protegida actualizando periódicamente tu contraseña de acceso.
      </p>
    </div>

    <div class="space-y-6">
      <BaseAlert tone="info">
        <template #icon>
          <Info class="size-5" />
        </template>
        Para mayor seguridad, elige una contraseña única con un mínimo de 8 caracteres que combine
        letras, números y símbolos.
      </BaseAlert>

      <section class="rounded-3xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
        <div class="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-5">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"
          >
            <Lock class="size-5" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-neutral-900">Cambiar contraseña</h2>
            <p class="text-xs text-neutral-500">
              Debes ingresar tu contraseña actual para confirmar tu identidad.
            </p>
          </div>
        </div>

        <ChangePasswordForm />
      </section>

      <!-- HU023: Zona de peligro / Eliminar cuenta -->
      <section class="rounded-3xl border border-danger-200 bg-white p-6 shadow-card sm:p-8">
        <div class="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-5">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger-50 text-danger-600"
          >
            <AlertTriangle class="size-5" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-neutral-900">Eliminar cuenta permanentemente</h2>
            <p class="text-xs text-neutral-500">
              Esta acción es irreversible y eliminará tu acceso a la plataforma.
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-neutral-600">
            Una vez eliminada la cuenta, no podrás volver a acceder a tus reservas ni historial.
            Recuerda que no debes tener reservas activas ni pendientes.
          </p>

          <BaseButton variant="danger" size="md" @click="showDeleteModal = true">
            <Trash2 class="size-4" />
            Eliminar cuenta
          </BaseButton>
        </div>

        <DeleteAccountModal v-model:open="showDeleteModal" />
      </section>
    </div>
  </div>
</template>
