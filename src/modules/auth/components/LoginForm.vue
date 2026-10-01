<script setup lang="ts">
import { Briefcase, Eye, EyeOff, Lock, Mail, ShieldCheck, User } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { applyServerErrors } from '@/shared/forms'
import { BaseAlert, BaseButton, BaseInput, BrandMark } from '@/shared/ui'

import { authApi } from '../api'
import { homeRouteFor } from '../navigation'
import { loginSchema } from '../schemas'
import { useAuthStore } from '../store'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const { defineField, errors, handleSubmit, isSubmitting, setErrors } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { email: '', password: '' },
})
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const showPassword = ref(false)
const formError = ref('')

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    const { data } = await authApi.login(values)
    auth.start(data)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    await router.push(redirect ?? homeRouteFor(data.user.role))
  } catch (error) {
    formError.value = applyServerErrors(error, setErrors)
  }
})
</script>

<template>
  <div>
    <BrandMark size="sm" subtitle="Acceso seguro a tu cuenta" class="mb-8" />

    <div class="mb-8">
      <span
        class="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700"
      >
        <ShieldCheck class="size-4" /> Acceso seguro
      </span>
      <h1 class="mb-3 text-3xl font-bold text-neutral-900">Bienvenido de nuevo</h1>
      <p class="leading-relaxed text-neutral-500">
        Inicia sesión para gestionar tus servicios, reservas y profesionales.
      </p>
    </div>

    <form class="space-y-5" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>

      <BaseInput
        v-model="email"
        v-bind="emailAttrs"
        label="Correo electrónico"
        type="email"
        autocomplete="email"
        placeholder="correo@ejemplo.com"
        :error="errors.email"
      >
        <template #icon><Mail /></template>
      </BaseInput>

      <BaseInput
        v-model="password"
        v-bind="passwordAttrs"
        label="Contraseña"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="current-password"
        placeholder="••••••••"
        :error="errors.password"
      >
        <template #icon><Lock /></template>
        <template #trailing>
          <button
            type="button"
            class="rounded-lg p-2 text-neutral-400 hover:text-neutral-700"
            :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" class="size-4.5" />
            <Eye v-else class="size-4.5" />
          </button>
        </template>
      </BaseInput>

      <BaseButton type="submit" size="lg" block :loading="isSubmitting">Iniciar sesión</BaseButton>
    </form>

    <div class="relative my-8 text-center">
      <div class="absolute inset-x-0 top-1/2 border-t border-neutral-200" />
      <span class="relative bg-canvas px-4 text-sm text-neutral-400 lg:bg-surface"
        >¿No tienes cuenta? Regístrate como</span
      >
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      <BaseButton variant="outline" size="lg" :to="{ name: 'register-client' }">
        <User class="size-5 text-primary-600" /> Cliente
      </BaseButton>
      <BaseButton variant="outline" size="lg" :to="{ name: 'register-professional' }">
        <Briefcase class="size-5 text-primary-600" /> Profesional
      </BaseButton>
    </div>

    <p class="mt-8 text-center text-sm leading-relaxed text-neutral-500">
      Al continuar aceptas nuestros Términos y Condiciones y la Política de Privacidad.
    </p>
  </div>
</template>
