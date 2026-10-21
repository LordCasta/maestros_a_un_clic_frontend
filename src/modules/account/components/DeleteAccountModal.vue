<script setup lang="ts">
import { AlertTriangle, Trash2 } from '@lucide/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth'
import { useToastStore } from '@/shared/stores/toast'
import { BaseAlert, BaseButton, BaseInput, BaseModal } from '@/shared/ui'

import { accountApi } from '../api'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

function close() {
  password.value = ''
  errorMessage.value = null
  emit('update:open', false)
}

async function handleDelete() {
  if (!password.value) {
    errorMessage.value = 'Debes ingresar tu contraseña actual.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  try {
    await accountApi.deleteAccount({ current_password: password.value })
    close()
    toast.info('Tu cuenta ha sido eliminada correctamente.')
    auth.clear()
    router.push({ name: 'home' })
  } catch (err: unknown) {
    errorMessage.value =
      err instanceof Error ? err.message : 'No se pudo eliminar la cuenta. Verifica tu contraseña.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <BaseModal :open="open" title="Eliminar cuenta" @update:open="emit('update:open', $event)">
    <div class="space-y-4">
      <BaseAlert tone="danger">
        <template #icon>
          <AlertTriangle class="size-5" />
        </template>
        Esta acción es irreversible. Se eliminará tu cuenta y se revocarán todos tus accesos. No
        puedes eliminar tu cuenta si tienes servicios pendientes o activos.
      </BaseAlert>

      <p class="text-sm text-neutral-600">
        Para confirmar que eres tú y autorizar la eliminación permanente de tu cuenta, ingresa tu
        contraseña actual:
      </p>

      <BaseInput
        v-model="password"
        type="password"
        label="Contraseña actual"
        placeholder="••••••••"
        autocomplete="current-password"
      />

      <BaseAlert v-if="errorMessage" tone="danger">
        {{ errorMessage }}
      </BaseAlert>

      <div class="mt-6 flex justify-end gap-3">
        <BaseButton variant="secondary" :disabled="isSubmitting" @click="close">
          Cancelar
        </BaseButton>

        <BaseButton variant="danger" :loading="isSubmitting" @click="handleDelete">
          <Trash2 class="size-4" />
          Confirmar eliminación
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
