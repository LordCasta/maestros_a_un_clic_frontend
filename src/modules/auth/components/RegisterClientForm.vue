<script setup lang="ts">
import { Lock, Mail, Phone, User } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useCommunes } from '@/modules/catalog'
import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import { BaseAlert, BaseButton, BaseFileInput, BaseInput, BaseSelect, BrandMark } from '@/shared/ui'

import { authApi } from '../api'
import { homeRouteFor } from '../navigation'
import { registerClientSchema } from '../schemas'
import { useAuthStore } from '../store'

const auth = useAuthStore()
const router = useRouter()
const toast = useToastStore()
const { options: communeOptions } = useCommunes()

const { defineField, errors, handleSubmit, isSubmitting, setErrors } = useForm({
  validationSchema: toTypedSchema(registerClientSchema),
  initialValues: { commune_id: null, avatar: null },
})
const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [phone, phoneAttrs] = defineField('phone')
const [communeId, communeIdAttrs] = defineField('commune_id')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirmation, passwordConfirmationAttrs] = defineField('password_confirmation')
// Archivos con useField: defineField vuelve "parcial" el tipo File.
const { value: avatar } = useField<File | null>('avatar')

const formError = ref('')

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    const { data } = await authApi.registerClient(values)
    auth.start(data)
    toast.success('¡Bienvenido! Tu cuenta quedó creada.')
    await router.push(homeRouteFor(data.user.role))
  } catch (error) {
    formError.value = applyServerErrors(error, setErrors)
  }
})
</script>

<template>
  <div>
    <BrandMark size="sm" subtitle="Registro de cliente" class="mb-8" />

    <h1 class="mb-2 text-3xl font-bold text-neutral-900">Crea tu cuenta</h1>
    <p class="mb-8 text-neutral-500">Encuentra profesionales verificados cerca de ti.</p>

    <form class="space-y-5" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>

      <BaseInput
        v-model="name"
        v-bind="nameAttrs"
        label="Nombre completo"
        autocomplete="name"
        :error="errors.name"
      >
        <template #icon><User /></template>
      </BaseInput>

      <BaseInput
        v-model="email"
        v-bind="emailAttrs"
        label="Correo electrónico"
        type="email"
        autocomplete="email"
        :error="errors.email"
      >
        <template #icon><Mail /></template>
      </BaseInput>

      <div class="grid gap-5 sm:grid-cols-2">
        <BaseInput
          v-model="phone"
          v-bind="phoneAttrs"
          label="Teléfono (opcional)"
          type="tel"
          autocomplete="tel"
          :error="errors.phone"
        >
          <template #icon><Phone /></template>
        </BaseInput>
        <BaseSelect
          v-model="communeId"
          v-bind="communeIdAttrs"
          label="Comuna (opcional)"
          placeholder="Selecciona"
          :options="communeOptions"
          :error="errors.commune_id"
        />
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <BaseInput
          v-model="password"
          v-bind="passwordAttrs"
          label="Contraseña"
          type="password"
          autocomplete="new-password"
          hint="Mínimo 8 caracteres."
          :error="errors.password"
        >
          <template #icon><Lock /></template>
        </BaseInput>
        <BaseInput
          v-model="passwordConfirmation"
          v-bind="passwordConfirmationAttrs"
          label="Confirmar contraseña"
          type="password"
          autocomplete="new-password"
          :error="errors.password_confirmation"
        >
          <template #icon><Lock /></template>
        </BaseInput>
      </div>

      <BaseFileInput
        v-model="avatar"
        label="Foto de perfil (opcional)"
        accept="image/jpeg,image/png,image/webp"
        hint="JPG, PNG o WEBP. Máximo 5 MB."
        :error="errors.avatar"
      />

      <BaseAlert tone="info" title="Verificación de identidad">
        Puedes explorar desde ya. Para reservar te pediremos tu documento y una selfie: así cuidamos
        a clientes y profesionales.
      </BaseAlert>

      <BaseButton type="submit" size="lg" block :loading="isSubmitting">Crear cuenta</BaseButton>
    </form>

    <p class="mt-6 text-center text-sm text-neutral-500">
      ¿Ya tienes cuenta?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary-700 hover:underline">
        Inicia sesión
      </RouterLink>
    </p>
  </div>
</template>
