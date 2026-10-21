<script setup lang="ts">
import { Camera, Check, Sparkles, User as UserIcon } from '@lucide/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'

import { useAuthStore } from '@/modules/auth'
import { useCommunes } from '@/modules/catalog'
import { applyServerErrors } from '@/shared/forms'
import { useToastStore } from '@/shared/stores/toast'
import { BaseAlert, BaseAvatar, BaseButton, BaseInput, BaseSelect } from '@/shared/ui'

import { accountApi } from '../api'
import { updateProfileSchema } from '../schemas'

const auth = useAuthStore()
const toast = useToastStore()
const { options: communeOptions } = useCommunes()

// Avatar upload state
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const isUploadingAvatar = ref(false)
const avatarError = ref<string | null>(null)

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    avatarError.value = 'El archivo debe ser una imagen (JPG, PNG o WebP).'
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    avatarError.value = 'La imagen no debe superar los 5 MB.'
    return
  }

  avatarError.value = null
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

async function uploadAvatar() {
  if (!avatarFile.value) return

  isUploadingAvatar.value = true
  avatarError.value = null

  try {
    const formData = new FormData()
    formData.append('avatar', avatarFile.value)

    const response = await accountApi.uploadAvatar(formData)
    auth.updateUser(response.data)
    avatarFile.value = null
    avatarPreview.value = null

    toast.success('Foto de perfil actualizada correctamente.')
  } catch (err: unknown) {
    avatarError.value = err instanceof Error ? err.message : 'Error al subir la foto de perfil.'
  } finally {
    isUploadingAvatar.value = false
  }
}

// Profile edit form
const formError = ref<string | null>(null)

const { defineField, errors, handleSubmit, isSubmitting, setErrors } = useForm({
  validationSchema: toTypedSchema(updateProfileSchema),
  initialValues: {
    name: auth.user?.name ?? '',
    phone: auth.user?.phone ?? '',
    commune_id: auth.user?.commune?.id ?? null,
    address: auth.user?.address ?? '',
  },
})

const [name, nameAttrs] = defineField('name')
const [phone, phoneAttrs] = defineField('phone')
const [communeId, communeIdAttrs] = defineField('commune_id')
const [address, addressAttrs] = defineField('address')

const onSubmit = handleSubmit(async (values) => {
  formError.value = null
  try {
    const response = await accountApi.updateProfile({
      name: values.name,
      phone: values.phone || null,
      commune_id: values.commune_id || null,
      address: values.address || null,
    })

    auth.updateUser(response.data)

    toast.success('Perfil actualizado correctamente.')
  } catch (error: unknown) {
    formError.value = applyServerErrors(error, setErrors)
  }
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <div
        class="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700"
      >
        <UserIcon class="size-4" />
        Cuenta personal
      </div>
      <h1 class="text-3xl font-black text-neutral-900">Mi perfil</h1>
      <p class="mt-2 text-sm text-neutral-500">
        Actualiza tu foto, información personal y datos de contacto.
      </p>
    </div>

    <div class="space-y-8">
      <!-- HU032: Foto de perfil -->
      <section class="rounded-3xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
        <h2 class="text-lg font-bold text-neutral-900">Foto de perfil</h2>
        <p class="mt-1 text-xs text-neutral-500">
          Tu foto ayuda a otros usuarios a reconocerte. Formatos JPG, PNG o WebP, máx. 5 MB.
        </p>

        <div class="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div class="relative size-24 shrink-0">
            <BaseAvatar
              :name="auth.user?.name ?? 'Usuario'"
              :src="avatarPreview || auth.user?.avatar_url"
              size="lg"
              class="size-24 rounded-full border-2 border-primary-200"
            />
          </div>

          <div class="space-y-3">
            <label
              class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50"
            >
              <Camera class="size-4 text-neutral-500" />
              <span>Seleccionar nueva imagen</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
                @change="onFileSelected"
              />
            </label>

            <BaseButton
              v-if="avatarFile"
              variant="primary"
              size="sm"
              :loading="isUploadingAvatar"
              @click="uploadAvatar"
            >
              <Check class="size-4" />
              Guardar foto
            </BaseButton>

            <BaseAlert v-if="avatarError" tone="danger">
              {{ avatarError }}
            </BaseAlert>
          </div>
        </div>
      </section>

      <!-- HU031: Datos personales -->
      <section class="rounded-3xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
        <h2 class="text-lg font-bold text-neutral-900">Datos personales</h2>
        <p class="mt-1 text-xs text-neutral-500">Información básica asociada a tu cuenta.</p>

        <form class="mt-6 space-y-5" @submit.prevent="onSubmit">
          <BaseAlert v-if="formError" tone="danger">
            {{ formError }}
          </BaseAlert>

          <BaseInput
            v-model="name"
            v-bind="nameAttrs"
            label="Nombre completo"
            placeholder="Ej. Juan Pérez"
            :error="errors.name"
            required
          />

          <BaseInput
            v-model="phone"
            v-bind="phoneAttrs"
            label="Teléfono de contacto"
            placeholder="Ej. 3001234567"
            :error="errors.phone"
          />

          <BaseSelect
            v-model="communeId"
            v-bind="communeIdAttrs"
            label="Comuna o corregimiento"
            placeholder="Selecciona tu comuna"
            :options="communeOptions"
            :error="errors.commune_id"
          />

          <BaseInput
            v-model="address"
            v-bind="addressAttrs"
            label="Dirección de referencia"
            placeholder="Ej. Calle 10 # 43-20"
            :error="errors.address"
          />

          <div class="flex justify-end pt-2">
            <BaseButton type="submit" variant="primary" :loading="isSubmitting">
              <Sparkles class="size-4" />
              Guardar cambios
            </BaseButton>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>
