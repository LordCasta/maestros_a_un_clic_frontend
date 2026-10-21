<script setup lang="ts">
import { ArrowLeft, Check, Eye, EyeOff, KeyRound, Lock, ShieldAlert } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import { BaseAlert, BaseButton, BaseInput, BrandMark } from '@/shared/ui'

import { authApi } from '../api'
import { resetPasswordSchema } from '../schemas'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const tokenParam = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const emailParam = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))

const isMissingParams = computed(() => !tokenParam.value || !emailParam.value)

const { defineField, errors, handleSubmit, isSubmitting, setErrors } = useForm({
  validationSchema: toTypedSchema(resetPasswordSchema),
  initialValues: {
    token: tokenParam.value,
    email: emailParam.value,
    password: '',
    password_confirmation: '',
  },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirmation, passwordConfirmationAttrs] = defineField('password_confirmation')

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const formError = ref('')

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    const response = await authApi.resetPassword(values)
    toast.success(response.message ?? 'Tu contraseña fue restablecida.')
    await router.replace({ name: 'login' })
  } catch (error) {
    formError.value = applyServerErrors(error, setErrors)
  }
})
</script>

<template>
  <div>
    <BrandMark size="sm" subtitle="Crea tu nueva contraseña" class="mb-8" />

    <div class="mb-8">
      <h1 class="mb-3 text-3xl font-bold text-neutral-900">Restablecer contraseña</h1>
      <p class="leading-relaxed text-neutral-500">
        Ingresa tu nueva contraseña para volver a acceder a tu cuenta.
      </p>
    </div>

    <BaseAlert v-if="isMissingParams" tone="danger" class="mb-6">
      <template #icon>
        <ShieldAlert class="size-5" />
      </template>
      <div>
        <p class="font-semibold">Enlace inválido o incompleto</p>
        <p class="mt-1 text-sm">
          Este enlace de recuperación no contiene todos los datos requeridos. Por favor solicita uno
          nuevo.
        </p>
        <div class="mt-4">
          <BaseButton size="sm" variant="outline" :to="{ name: 'forgot-password' }">
            Solicitar nuevo enlace
          </BaseButton>
        </div>
      </div>
    </BaseAlert>

    <form v-else class="space-y-5" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>

      <BaseInput
        v-model="email"
        v-bind="emailAttrs"
        label="Correo electrónico"
        type="email"
        readonly
        disabled
        :error="errors.email"
      />

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
          <Lock class="size-4.5 text-neutral-400" />
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
        label="Confirmar contraseña"
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

      <BaseButton type="submit" size="lg" block :loading="isSubmitting">
        <Check class="size-4.5" />
        Restablecer contraseña
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
