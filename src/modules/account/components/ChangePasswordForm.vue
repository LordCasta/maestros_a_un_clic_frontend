<script setup lang="ts">
import { Eye, EyeOff, KeyRound, Lock, ShieldCheck } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'

import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import { BaseAlert, BaseButton, BaseInput } from '@/shared/ui'

import { useChangePassword } from '../queries'
import { changePasswordSchema } from '../schemas'

const toast = useToastStore()
const { mutateAsync: changePassword } = useChangePassword()

const { defineField, errors, handleSubmit, isSubmitting, resetForm, setErrors } = useForm({
  validationSchema: toTypedSchema(changePasswordSchema),
  initialValues: {
    current_password: '',
    password: '',
    password_confirmation: '',
  },
})

const [currentPassword, currentPasswordAttrs] = defineField('current_password')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirmation, passwordConfirmationAttrs] = defineField('password_confirmation')

const showCurrentPassword = ref(false)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const formError = ref('')

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    const response = await changePassword(values)
    toast.success(response.message ?? 'Contraseña actualizada correctamente.')
    resetForm()
  } catch (error) {
    formError.value = applyServerErrors(error, setErrors)
  }
})
</script>

<template>
  <form class="space-y-6" novalidate @submit="onSubmit">
    <BaseAlert v-if="formError" tone="danger">
      {{ formError }}
    </BaseAlert>

    <div class="space-y-4">
      <BaseInput
        v-model="currentPassword"
        v-bind="currentPasswordAttrs"
        label="Contraseña actual"
        :type="showCurrentPassword ? 'text' : 'password'"
        autocomplete="current-password"
        placeholder="••••••••"
        :error="errors.current_password"
      >
        <template #icon>
          <Lock class="size-4.5 text-neutral-400" />
        </template>
        <template #trailing>
          <button
            type="button"
            class="rounded-lg p-2 text-neutral-400 transition hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            :aria-label="
              showCurrentPassword ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'
            "
            @click="showCurrentPassword = !showCurrentPassword"
          >
            <EyeOff v-if="showCurrentPassword" class="size-4.5" />
            <Eye v-else class="size-4.5" />
          </button>
        </template>
      </BaseInput>

      <BaseInput
        v-model="password"
        v-bind="passwordAttrs"
        label="Nueva contraseña"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="new-password"
        placeholder="••••••••"
        hint="Debe tener al menos 8 caracteres."
        :error="errors.password"
      >
        <template #icon>
          <KeyRound class="size-4.5 text-neutral-400" />
        </template>
        <template #trailing>
          <button
            type="button"
            class="rounded-lg p-2 text-neutral-400 transition hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            :aria-label="showPassword ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" class="size-4.5" />
            <Eye v-else class="size-4.5" />
          </button>
        </template>
      </BaseInput>

      <BaseInput
        v-model="passwordConfirmation"
        v-bind="passwordConfirmationAttrs"
        label="Confirmar nueva contraseña"
        :type="showPasswordConfirmation ? 'text' : 'password'"
        autocomplete="new-password"
        placeholder="••••••••"
        :error="errors.password_confirmation"
      >
        <template #icon>
          <KeyRound class="size-4.5 text-neutral-400" />
        </template>
        <template #trailing>
          <button
            type="button"
            class="rounded-lg p-2 text-neutral-400 transition hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            :aria-label="showPasswordConfirmation ? 'Ocultar confirmación' : 'Mostrar confirmación'"
            @click="showPasswordConfirmation = !showPasswordConfirmation"
          >
            <EyeOff v-if="showPasswordConfirmation" class="size-4.5" />
            <Eye v-else class="size-4.5" />
          </button>
        </template>
      </BaseInput>
    </div>

    <div class="flex items-center justify-end pt-2">
      <BaseButton type="submit" :loading="isSubmitting" size="md">
        <ShieldCheck class="size-4.5" />
        Guardar nueva contraseña
      </BaseButton>
    </div>
  </form>
</template>
