<script setup lang="ts">
import { ArrowLeft, Briefcase, Lock, Mail, Phone, User } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useCategories, useCommunes } from '@/modules/catalog'
import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import {
  BaseAlert,
  BaseButton,
  BaseChoiceGroup,
  BaseFileInput,
  BaseInput,
  BaseSelect,
  BaseStepper,
  BaseTextarea,
  BrandMark,
} from '@/shared/ui'

import { authApi } from '../api'
import { homeRouteFor } from '../navigation'
import { registerProfessionalSteps, type RegisterProfessionalForm } from '../schemas'
import { useAuthStore } from '../store'

const auth = useAuthStore()
const router = useRouter()
const toast = useToastStore()
const { options: communeOptions } = useCommunes()
const { rootOptions: categoryOptions } = useCategories()

const STEPS = ['Tu cuenta', 'Tu perfil profesional']
const step = ref(1)

// Un esquema por paso: cada "Continuar" valida solo los campos visibles.
const schema = computed(() => toTypedSchema(registerProfessionalSteps[step.value - 1]!))

const { defineField, errors, handleSubmit, isSubmitting, setErrors } =
  useForm<RegisterProfessionalForm>({
    validationSchema: schema,
    keepValuesOnUnmount: true,
    initialValues: { category_ids: [], avatar: null },
  })
const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [phone, phoneAttrs] = defineField('phone')
const [communeId, communeIdAttrs] = defineField('commune_id')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirmation, passwordConfirmationAttrs] = defineField('password_confirmation')
// Archivos con useField: defineField vuelve "parcial" el tipo File.
const { value: avatar } = useField<File | null>('avatar')
const [categoryIds] = defineField('category_ids')
const [experienceYears, experienceYearsAttrs] = defineField('experience_years')
const [hourlyRate, hourlyRateAttrs] = defineField('hourly_rate')
const [description, descriptionAttrs] = defineField('description')

const formError = ref('')
const ACCOUNT_FIELDS = [
  'name',
  'email',
  'phone',
  'commune_id',
  'password',
  'password_confirmation',
  'avatar',
]

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''

  if (step.value < STEPS.length) {
    step.value++
    return
  }

  try {
    const { data } = await authApi.registerProfessional(values)
    auth.start(data)
    toast.success('¡Bienvenido! Tu perfil profesional quedó creado.')
    await router.push(homeRouteFor(data.user.role))
  } catch (error) {
    formError.value = applyServerErrors(error, setErrors)
    // Si el error es de un campo del primer paso, vuelve a ese paso para que se vea.
    if (Object.keys(errors.value).some((field) => ACCOUNT_FIELDS.includes(field))) step.value = 1
  }
})
</script>

<template>
  <div>
    <BrandMark size="sm" subtitle="Registro profesional" class="mb-8" />

    <div class="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 class="mb-2 text-3xl font-bold text-neutral-900">Crea tu perfil profesional</h1>
        <p class="text-neutral-500">Completa tu información y empieza a recibir clientes.</p>
      </div>
      <span
        class="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 sm:flex"
      >
        <Briefcase class="size-7" />
      </span>
    </div>

    <BaseStepper :steps="STEPS" :current="step" class="mb-8" />

    <form class="space-y-5" novalidate @submit="onSubmit">
      <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>

      <template v-if="step === 1">
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
            label="Comuna donde trabajas"
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
          hint="Una foto clara de tu rostro genera más confianza. Máximo 5 MB."
          :error="errors.avatar"
        />
        <BaseButton type="submit" size="lg" block>Continuar</BaseButton>
      </template>

      <template v-else>
        <BaseChoiceGroup
          v-model="categoryIds"
          label="Especialidades"
          hint="Puedes elegir varias. Los servicios con precio los agregas después en tu panel."
          :options="categoryOptions"
          :error="errors.category_ids"
        />
        <div class="grid gap-5 sm:grid-cols-2">
          <BaseInput
            v-model="experienceYears"
            v-bind="experienceYearsAttrs"
            label="Años de experiencia"
            type="number"
            min="0"
            inputmode="numeric"
            :error="errors.experience_years"
          />
          <BaseInput
            v-model="hourlyRate"
            v-bind="hourlyRateAttrs"
            label="Tarifa por hora (COP)"
            type="number"
            min="0"
            step="1000"
            inputmode="numeric"
            placeholder="45000"
            :error="errors.hourly_rate"
          />
        </div>
        <BaseTextarea
          v-model="description"
          v-bind="descriptionAttrs"
          label="Sobre ti"
          :rows="5"
          :max-length="2000"
          placeholder="Tu experiencia, el tipo de trabajos que haces, herramientas y fortalezas…"
          :error="errors.description"
        />
        <BaseAlert tone="info" title="Siguiente paso: verificación">
          Para aparecer en las búsquedas debes verificar tu identidad y tus certificados desde tu
          panel.
        </BaseAlert>
        <div class="flex gap-3">
          <BaseButton variant="outline" size="lg" @click="step = 1">
            <ArrowLeft class="size-4" /> Atrás
          </BaseButton>
          <BaseButton type="submit" size="lg" block :loading="isSubmitting"
            >Crear perfil</BaseButton
          >
        </div>
      </template>
    </form>

    <p class="mt-6 text-center text-sm text-neutral-500">
      ¿Ya tienes cuenta?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary-700 hover:underline">
        Inicia sesión
      </RouterLink>
    </p>
  </div>
</template>
