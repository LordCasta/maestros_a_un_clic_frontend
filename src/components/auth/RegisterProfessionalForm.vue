<template>
  <div>
    <!-- Logo Header -->
    <div class="flex items-center gap-4 mb-8">
      <div class="w-14 h-14 rounded-2xl bg-blue-600 shadow-xl flex items-center justify-center">
        <Wrench class="w-7 h-7 text-white" />
      </div>

      <div>
        <h2 class="text-2xl font-black text-gray-900 leading-none">Maestros a un clic</h2>
        <p class="text-gray-500 text-sm mt-1">Registro profesional</p>
      </div>
    </div>

    <!-- Card Container -->
    <div class="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
      <!-- HEADER -->
      <div class="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-3xl font-black">Crea tu perfil profesional</h3>

            <p class="text-blue-100 mt-2">Completa tu información y comienza a recibir clientes.</p>
          </div>

          <div class="hidden sm:flex w-20 h-20 rounded-3xl bg-white/10 items-center justify-center">
            <Briefcase class="w-10 h-10" />
          </div>
        </div>

        <!-- STEPPER -->
        <div class="flex items-center gap-3">
          <div
            v-for="item in [1, 2, 3]"
            :key="item"
            :class="[
              'h-2 flex-1 rounded-full transition-all',
              step >= item ? 'bg-white' : 'bg-white/20',
            ]"
          />
        </div>
      </div>

      <!-- BODY -->
      <div class="p-6 sm:p-8">
        <div
          v-if="submitError"
          class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ submitError }}
        </div>

        <div
          v-if="submitSuccess"
          class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {{ submitSuccess }}
        </div>

        <!-- Step 1: Basic Info -->
        <div v-if="step === 1" class="space-y-6">
          <div>
            <h4 class="text-2xl font-bold text-gray-900 mb-2">Información principal</h4>

            <p class="text-gray-500">Construye una primera impresión profesional.</p>
          </div>

          <!-- ACCOUNT -->
          <div class="grid md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>

              <input
                type="email"
                placeholder="correo@ejemplo.com"
                v-model="form.email"
                @input="clearError('email')"
                class="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-blue-600"
                :class="errors.email ? 'border-red-400' : ''"
              />
              <p v-if="errors.email" class="text-red-500 text-sm mt-2">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"> Contraseña </label>

              <input
                :type="showPassword ? 'text' : 'password'"
                placeholder="Mínimo 8 caracteres"
                v-model="form.password"
                @input="clearError('password')"
                class="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-blue-600"
                :class="errors.password ? 'border-red-400' : ''"
              />
              <p v-if="errors.password" class="text-red-500 text-sm mt-2">{{ errors.password }}</p>

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                {{ showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña' }}
              </button>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar contraseña
              </label>

              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Repite tu contraseña"
                v-model="form.confirmPassword"
                @input="clearError('confirmPassword')"
                class="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-blue-600"
                :class="errors.confirmPassword ? 'border-red-400' : ''"
              />
              <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-2">
                {{ errors.confirmPassword }}
              </p>

              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                {{ showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación' }}
              </button>
            </div>
          </div>

          <!-- PROFILE PHOTO -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3"> Foto de perfil </label>

            <label
              class="relative border-2 border-dashed border-gray-300 hover:border-blue-600 transition rounded-4xl p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50 overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-linear-to-br from-blue-50 to-transparent opacity-50"
              />

              <div class="relative z-10 flex flex-col items-center">
                <div
                  class="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-xl mb-5"
                >
                  <Camera class="w-10 h-10" />
                </div>

                <h3 class="font-bold text-lg text-gray-800">Sube tu foto profesional</h3>

                <p class="text-gray-500 text-sm mt-1">Una foto clara genera más confianza</p>

                <div class="mt-5 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
                  Seleccionar imagen
                </div>
              </div>

              <input
                type="file"
                class="hidden"
                accept="image/*"
                @change="handleFileUpload('profilePhoto', $event)"
              />
            </label>

            <p v-if="errors.profilePhoto" class="text-red-500 text-sm mt-2">
              {{ errors.profilePhoto }}
            </p>
            <p v-if="form.profilePhoto" class="text-green-600 text-sm mt-2">
              ✓ Foto seleccionada: {{ form.profilePhoto.name }}
            </p>
          </div>

          <!-- INPUTS -->
          <div class="grid md:grid-cols-2 gap-5">
            <!-- NAME -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Nombre completo
              </label>

              <input
                type="text"
                placeholder="Juan Castaño"
                v-model="form.fullName"
                @input="clearError('fullName')"
                class="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-blue-600"
                :class="errors.fullName ? 'border-red-400' : ''"
              />
              <p v-if="errors.fullName" class="text-red-500 text-sm mt-2">{{ errors.fullName }}</p>
            </div>

            <!-- SPECIALTY -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"> Especialidad </label>

              <select
                v-model="form.specialty"
                @change="clearError('specialty')"
                class="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-blue-600"
                :class="errors.specialty ? 'border-red-400' : ''"
              >
                <option value="">Selecciona</option>

                <option v-for="item in specialties" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
              <p v-if="errors.specialty" class="text-red-500 text-sm mt-2">
                {{ errors.specialty }}
              </p>
            </div>

            <!-- RATE -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Tarifa por hora
              </label>

              <input
                type="number"
                placeholder="$50.000"
                v-model="form.hourlyRate"
                @input="clearError('hourlyRate')"
                class="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-blue-600"
                :class="errors.hourlyRate ? 'border-red-400' : ''"
              />
              <p v-if="errors.hourlyRate" class="text-red-500 text-sm mt-2">
                {{ errors.hourlyRate }}
              </p>
            </div>

            <!-- COMMUNE -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"> Comuna / zona </label>

              <input
                type="text"
                placeholder="Comuna 14"
                v-model="form.commune"
                @input="clearError('commune')"
                class="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-blue-600"
                :class="errors.commune ? 'border-red-400' : ''"
              />
              <p v-if="errors.commune" class="text-red-500 text-sm mt-2">{{ errors.commune }}</p>
            </div>
          </div>

          <!-- NEXT -->
          <button
            @click="nextStep(1)"
            class="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-bold flex items-center justify-center gap-2 shadow-xl"
          >
            Continuar
            <ArrowRight class="w-5 h-5" />
          </button>
        </div>

        <!-- Step 2: Experience -->
        <div v-if="step === 2" class="space-y-6">
          <div>
            <h4 class="text-2xl font-bold text-gray-900 mb-2">Experiencia profesional</h4>

            <p class="text-gray-500">Cuéntale a los clientes por qué deberían contratarte.</p>
          </div>

          <!-- EXPERIENCE -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Años de experiencia
            </label>

            <div class="relative">
              <Clock3 class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="number"
                placeholder="5"
                v-model="form.experience"
                @input="clearError('experience')"
                class="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 pl-14 pr-5 outline-none focus:border-blue-600"
                :class="errors.experience ? 'border-red-400' : ''"
              />
            </div>
            <p v-if="errors.experience" class="text-red-500 text-sm mt-2">
              {{ errors.experience }}
            </p>
          </div>

          <!-- DESCRIPTION -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Descripción profesional
            </label>

            <textarea
              rows="6"
              placeholder="Describe tu experiencia, servicios, herramientas y fortalezas..."
              v-model="form.description"
              @input="clearError('description')"
              class="w-full rounded-3xl border border-gray-200 bg-gray-50 p-5 outline-none focus:border-blue-600 resize-none"
              :class="errors.description ? 'border-red-400' : ''"
            />

            <div class="flex justify-between mt-2 text-sm">
              <span class="text-gray-400"> Mínimo 50 caracteres </span>

              <span :class="form.description.length >= 50 ? 'text-green-600' : 'text-gray-500'">
                {{ form.description.length }} / 300
              </span>
            </div>
            <p v-if="errors.description" class="text-red-500 text-sm mt-2">
              {{ errors.description }}
            </p>
          </div>

          <!-- BUTTONS -->
          <div class="flex gap-4">
            <button
              @click="step = 1"
              class="flex-1 h-14 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <ArrowLeft class="w-5 h-5" />
              Volver
            </button>

            <button
              @click="nextStep(2)"
              class="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-bold flex items-center justify-center gap-2 shadow-xl"
            >
              Continuar
              <ArrowRight class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Step 3: Certificates -->
        <div v-if="step === 3" class="space-y-6">
          <div>
            <h4 class="text-2xl font-bold text-gray-900 mb-2">Certificados y portafolio</h4>

            <p class="text-gray-500">Muestra evidencia de tu trabajo y aumenta tu credibilidad.</p>
          </div>

          <!-- CERTIFICATES -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3"> Certificados </label>

            <label
              class="border-2 border-dashed border-gray-300 hover:border-blue-600 transition rounded-4xl bg-gray-50 p-8 flex flex-col items-center justify-center cursor-pointer"
            >
              <FileBadge class="w-12 h-12 text-blue-600 mb-4" />

              <h3 class="font-bold text-lg text-gray-800">Sube certificados</h3>

              <p class="text-sm text-gray-500 mt-1">PDF, JPG, PNG</p>

              <input
                type="file"
                multiple
                class="hidden"
                @change="handleMultipleFileUpload('certificates', $event)"
              />
            </label>
            <p v-if="errors.certificates" class="text-red-500 text-sm mt-2">
              {{ errors.certificates }}
            </p>
            <div v-if="form.certificates && form.certificates.length > 0" class="mt-3 space-y-2">
              <p class="text-sm font-medium text-green-600">
                ✓ {{ form.certificates.length }} archivo(s) seleccionado(s)
              </p>
            </div>
          </div>

          <!-- PORTFOLIO -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              Portafolio de trabajos
            </label>

            <label
              class="border-2 border-dashed border-gray-300 hover:border-blue-600 transition rounded-4xl bg-gray-50 p-8 flex flex-col items-center justify-center cursor-pointer"
            >
              <ImagePlus class="w-12 h-12 text-blue-600 mb-4" />

              <h3 class="font-bold text-lg text-gray-800">Agrega fotos de trabajos</h3>

              <p class="text-sm text-gray-500 mt-1">
                Los perfiles con portafolio reciben más solicitudes
              </p>

              <input
                type="file"
                multiple
                class="hidden"
                accept="image/*"
                @change="handleMultipleFileUpload('portfolio', $event)"
              />
            </label>
            <p v-if="errors.portfolio" class="text-red-500 text-sm mt-2">{{ errors.portfolio }}</p>
            <div v-if="form.portfolio && form.portfolio.length > 0" class="mt-3 space-y-2">
              <p class="text-sm font-medium text-green-600">
                ✓ {{ form.portfolio.length }} foto(s) seleccionada(s) (mínimo 2)
              </p>
            </div>
          </div>

          <!-- PREVIEW CARD -->
          <div
            class="rounded-4xl border border-gray-200 bg-linear-to-br from-slate-900 to-slate-800 p-6 text-white overflow-hidden relative"
          >
            <div class="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

            <div class="relative z-10">
              <div class="flex items-center gap-4 mb-5">
                <div class="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center">
                  <Eye class="w-9 h-9" />
                </div>

                <div>
                  <h3 class="text-2xl font-bold">Vista previa</h3>

                  <p class="text-blue-100">Así verán los clientes tu perfil</p>
                </div>
              </div>

              <div class="flex items-center gap-2 mb-2">
                <Star class="w-5 h-5 fill-yellow-400 text-yellow-400" />

                <span class="font-semibold"> Perfil destacado </span>
              </div>

              <p class="text-blue-100">
                Los perfiles completos generan hasta 4 veces más solicitudes.
              </p>
            </div>
          </div>

          <!-- BUTTONS -->
          <div class="flex gap-4">
            <button
              type="button"
              @click="step = 2"
              class="flex-1 h-14 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Volver
            </button>

            <button
              @click="handleSubmit"
              :disabled="isSubmitting"
              class="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition text-white font-bold shadow-xl flex items-center justify-center gap-2"
            >
              {{ isSubmitting ? 'Registrando...' : 'Completar registro' }}
              <CheckCircle2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-6 text-center">
      <p class="text-gray-600 text-sm">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-semibold">
          Inicia sesión
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { ApiError, registerProfessional } from '@/api/auth'
import { SPECIALTIES } from '@/constants/specialties'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const step = ref(1)
const isSubmitting = ref(false)
const submitError = ref('')
const submitSuccess = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const specialties = SPECIALTIES

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  specialty: '',
  hourlyRate: '',
  commune: '',
  experience: '',
  description: '',
  profilePhoto: null,
  certificates: [],
  portfolio: [],
})

const errors = ref({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  specialty: '',
  hourlyRate: '',
  commune: '',
  experience: '',
  description: '',
  profilePhoto: '',
  certificates: '',
  portfolio: '',
})

const clearError = (field) => {
  errors.value[field] = ''
}

const resetSubmissionState = () => {
  submitError.value = ''
  submitSuccess.value = ''
}

const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email)

const validateStep1 = () => {
  const nextErrors = {
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    specialty: '',
    hourlyRate: '',
    commune: '',
    experience: '',
    description: '',
    profilePhoto: '',
    certificates: '',
    portfolio: '',
  }

  if (!form.value.email) nextErrors.email = 'Ingresa tu correo electrónico'
  else if (!validateEmail(form.value.email)) nextErrors.email = 'Correo electrónico inválido'
  if (!form.value.password) nextErrors.password = 'Ingresa una contraseña'
  else if (form.value.password.length < 8)
    nextErrors.password = 'La contraseña debe tener mínimo 8 caracteres'
  if (!form.value.confirmPassword) nextErrors.confirmPassword = 'Confirma tu contraseña'
  else if (form.value.password !== form.value.confirmPassword)
    nextErrors.confirmPassword = 'Las contraseñas no coinciden'
  if (!form.value.fullName) nextErrors.fullName = 'Ingresa tu nombre completo'
  if (!form.value.specialty) nextErrors.specialty = 'Selecciona una especialidad'
  if (!form.value.hourlyRate) nextErrors.hourlyRate = 'Ingresa tu tarifa'
  else if (Number(form.value.hourlyRate) < 1000)
    nextErrors.hourlyRate = 'La tarifa debe ser mayor a $1.000'
  if (!form.value.commune) nextErrors.commune = 'Ingresa tu comuna'
  if (!form.value.profilePhoto) nextErrors.profilePhoto = 'Sube una foto de perfil'

  errors.value = nextErrors
  return (
    !nextErrors.email &&
    !nextErrors.password &&
    !nextErrors.confirmPassword &&
    !nextErrors.fullName &&
    !nextErrors.specialty &&
    !nextErrors.hourlyRate &&
    !nextErrors.commune &&
    !nextErrors.profilePhoto
  )
}

const validateStep2 = () => {
  const nextErrors = {
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    specialty: '',
    hourlyRate: '',
    commune: '',
    experience: '',
    description: '',
    profilePhoto: '',
    certificates: '',
    portfolio: '',
  }

  if (!form.value.experience) nextErrors.experience = 'Ingresa tus años de experiencia'
  if (!form.value.description) nextErrors.description = 'Describe tus servicios'
  else if (form.value.description.length < 50)
    nextErrors.description = 'La descripción debe tener al menos 50 caracteres'

  errors.value = nextErrors
  return !nextErrors.experience && !nextErrors.description
}

const validateStep3 = () => {
  const nextErrors = {
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    specialty: '',
    hourlyRate: '',
    commune: '',
    experience: '',
    description: '',
    profilePhoto: '',
    certificates: '',
    portfolio: '',
  }

  if (!form.value.certificates.length) nextErrors.certificates = 'Sube al menos un certificado'
  if (form.value.portfolio.length < 2)
    nextErrors.portfolio = 'Sube al menos 2 fotos de tus trabajos'

  errors.value = nextErrors
  return !nextErrors.certificates && !nextErrors.portfolio
}

const nextStep = (currentStep) => {
  resetSubmissionState()

  if (currentStep === 1 && validateStep1()) {
    step.value = 2
  }

  if (currentStep === 2 && validateStep2()) {
    step.value = 3
  }
}

const handleFileUpload = (field, event) => {
  const target = event.target
  const file = target.files?.[0] ?? null
  if (file) {
    form.value[field] = file
    clearError(field)
  }
}

const handleMultipleFileUpload = (field, event) => {
  const target = event.target
  const files = Array.from(target.files ?? [])
  if (files.length > 0) {
    form.value[field] = files
    clearError(field)
  }
}

const applyValidationErrors = (validationErrors) => {
  const fieldMap = {
    name: 'fullName',
    email: 'email',
    password: 'password',
    password_confirmation: 'confirmPassword',
    description: 'description',
    experience_years: 'experience',
    specialties: 'specialty',
    hourly_rate: 'hourlyRate',
    profile_photo: 'profilePhoto',
    certificates: 'certificates',
    portfolio_images: 'portfolio',
    commune: 'commune',
  }

  Object.entries(validationErrors ?? {}).forEach(([field, messages]) => {
    const targetField = fieldMap[field]
    if (targetField && messages?.length) {
      errors.value[targetField] = messages[0]
    }
  })
}

const handleSubmit = async () => {
  resetSubmissionState()

  const validStep1 = validateStep1()
  const validStep2 = validStep1 && validateStep2()
  const validStep3 = validStep2 && validateStep3()

  if (!validStep3) {
    return
  }

  isSubmitting.value = true

  try {
    const response = await registerProfessional({
      name: form.value.fullName,
      email: form.value.email,

      password: form.value.password,
      passwordConfirmation: form.value.confirmPassword,

      description: form.value.description,

      experienceYears: Number(form.value.experience),

      specialtyIds: [Number(form.value.specialty)],

      hourlyRate: form.value.hourlyRate,

      profilePhoto: form.value.profilePhoto,

      certificates: form.value.certificates,

      portfolioImages: form.value.portfolio,

      commune: form.value.commune,
    })

    authStore.setSession(response.data)
    submitSuccess.value = response.message ?? 'Registro completado correctamente.'
    await router.push('/professional/dashboard')
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 422 &&
      error.data &&
      typeof error.data === 'object'
    ) {
      const payload = error.data
      if (payload.errors) {
        applyValidationErrors(payload.errors)
      }
      submitError.value = payload.message ?? 'Revisa los campos marcados.'
    } else if (error instanceof ApiError) {
      submitError.value = error.message
    } else if (error instanceof Error) {
      submitError.value = error.message
    } else {
      submitError.value = 'No se pudo completar el registro.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
