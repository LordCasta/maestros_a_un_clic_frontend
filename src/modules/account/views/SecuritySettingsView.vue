<script setup lang="ts">
import { Info, Lock, ShieldCheck } from '@lucide/vue'

import { BaseAlert } from '@/shared/ui'

import ChangePasswordForm from '../components/ChangePasswordForm.vue'
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
    </div>
  </div>
</template>
