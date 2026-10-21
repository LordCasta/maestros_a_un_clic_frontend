<script setup lang="ts">
import { ArrowLeft, CheckCircle2, Mail, Send } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import { applyServerErrors } from '@/shared/forms'
import { BaseAlert, BaseButton, BaseInput, BrandMark } from '@/shared/ui'

import { authApi } from '../api'
import { forgotPasswordSchema } from '../schemas'

const { defineField, errors, handleSubmit, isSubmitting, setErrors } = useForm({
  validationSchema: toTypedSchema(forgotPasswordSchema),
  initialValues: { email: '' },
})

const [email, emailAttrs] = defineField('email')
const formError = ref('')
const successMessage = ref('')

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  successMessage.value = ''
  try {
    const response = await authApi.forgotPassword(values)
    successMessage.value =
      response.message ?? 'Te enviamos por correo el enlace para restablecer tu contraseña.'
  } catch (error) {
    formError.value = applyServerErrors(error, setErrors)
  }
})
</script>

<template>
  <div>
    <BrandMark size="sm" subtitle="Recupera el acceso a tu cuenta" class="mb-8" />

    <div class="mb-8">
      <h1 class="mb-3 text-3xl font-bold text-neutral-900">¿Olvidaste tu contraseña?</h1>
      <p class="leading-relaxed text-neutral-500">
        Ingresa tu correo electrónico registrado y te enviaremos un enlace seguro para crear una
        nueva.
      </p>
    </div>

    <BaseAlert v-if="successMessage" tone="success" class="mb-6">
      <template #icon>
        <CheckCircle2 class="size-5 text-success-600" />
      </template>
      <div>
        <p class="font-semibold text-success-800">Correo enviado</p>
        <p class="mt-1 text-sm text-success-700">{{ successMessage }}</p>
      </div>
    </BaseAlert>

    <form v-else class="space-y-5" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>

      <BaseInput
        v-model="email"
        v-bind="emailAttrs"
        label="Correo electrónico"
        type="email"
        autocomplete="email"
        placeholder="ejemplo@correo.com"
        :error="errors.email"
      >
        <template #icon>
          <Mail class="size-4.5 text-neutral-400" />
        </template>
      </BaseInput>

      <BaseButton type="submit" size="lg" block :loading="isSubmitting">
        <Send class="size-4.5" />
        Enviar enlace de recuperación
      </BaseButton>
    </form>

    <div class="mt-8 text-center">
      <RouterLink
        :to="{ name: 'login' }"
        class="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:text-primary-700"
      >
        <ArrowLeft class="size-4" />
        Volver a iniciar sesión
      </RouterLink>
    </div>
  </div>
</template>
