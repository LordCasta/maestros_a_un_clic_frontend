<template>
  <div>
    <!-- Logo Header -->
    <div class="flex items-center gap-3 mb-8">
      <div class="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V8.5"
          />
        </svg>
      </div>
      <div>
        <h3 class="font-bold text-lg text-gray-900">Maestros a un clic</h3>
        <p class="text-xs text-gray-500">Registro para cliente</p>
      </div>
    </div>

    <!-- Progress Indicator -->
    <div class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <div class="flex flex-col items-center flex-1">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all',
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            ]"
          >
            1
          </div>
          <p class="text-xs mt-2 font-medium text-gray-500">Cuenta</p>
        </div>

        <div
          :class="[
            'h-1 flex-1 rounded-full mx-2 transition-all',
            step >= 2 ? 'bg-blue-600' : 'bg-gray-200'
          ]"
        />

        <div class="flex flex-col items-center flex-1">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all',
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            ]"
          >
            2
          </div>
          <p class="text-xs mt-2 font-medium text-gray-500">Verificación</p>
        </div>
      </div>
    </div>

    <!-- Card Container -->
    <div class="bg-white border border-gray-100 shadow-2xl rounded-[2rem] p-6 sm:p-8">
      <!-- Step 1: Basic Info -->
      <div v-if="step === 1" class="space-y-5">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Datos básicos</h2>

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
          <div
            class="flex items-center h-14 rounded-2xl border bg-gray-50 px-4 transition-all"
            :class="errors.name ? 'border-red-400' : 'border-gray-200 focus-within:border-blue-600'"
          >
            <svg
              class="w-5 h-5 text-gray-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <input
              v-model="form.name"
              @input="clearError('name')"
              type="text"
              placeholder="Tu nombre completo"
              class="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
            />
          </div>
          <p v-if="errors.name" class="text-red-500 text-sm mt-2">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
          <div
            class="flex items-center h-14 rounded-2xl border bg-gray-50 px-4 transition-all"
            :class="
              errors.email ? 'border-red-400' : 'border-gray-200 focus-within:border-blue-600'
            "
          >
            <svg
              class="w-5 h-5 text-gray-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <input
              v-model="form.email"
              @input="clearError('email')"
              type="email"
              placeholder="correo@ejemplo.com"
              class="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
            />
          </div>
          <p v-if="errors.email" class="text-red-500 text-sm mt-2">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <div
            class="flex items-center h-14 rounded-2xl border bg-gray-50 px-4 transition-all"
            :class="
              errors.password ? 'border-red-400' : 'border-gray-200 focus-within:border-blue-600'
            "
          >
            <svg
              class="w-5 h-5 text-gray-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <input
              v-model="form.password"
              @input="clearError('password')"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mínimo 6 caracteres"
              class="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
            />
            <button
              @click.prevent="showPassword = !showPassword"
              type="button"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <svg
                v-if="!showPassword"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.391m5.288-5.288a9.97 9.97 0 0115.702 2.391c-1.274 4.057-5.064 7-9.542 7-1.564 0-3.078-.333-4.47-.957m0 0a3 3 0 105.667 3m-9.967-8.667a6 6 0 0110.788 2.078M3 3l18 18"
                />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-sm mt-2">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
          <div
            class="flex items-center h-14 rounded-2xl border bg-gray-50 px-4 transition-all"
            :class="
              errors.confirmPassword
                ? 'border-red-400'
                : 'border-gray-200 focus-within:border-blue-600'
            "
          >
            <svg
              class="w-5 h-5 text-gray-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <input
              v-model="form.confirmPassword"
              @input="clearError('confirmPassword')"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirma tu contraseña"
              class="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
            />
            <button
              @click.prevent="showConfirmPassword = !showConfirmPassword"
              type="button"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <svg
                v-if="!showConfirmPassword"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.391m5.288-5.288a9.97 9.97 0 0115.702 2.391c-1.274 4.057-5.064 7-9.542 7-1.564 0-3.078-.333-4.47-.957m0 0a3 3 0 105.667 3m-9.967-8.667a6 6 0 0110.788 2.078M3 3l18 18"
                />
              </svg>
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-2">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Next Button -->
        <button
          @click="nextStep"
          type="button"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-2xl transition-all duration-300 mt-6 flex items-center justify-center gap-2"
        >
          <span>Continuar</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>

      <!-- Step 2: Documents -->
      <div v-if="step === 2" class="space-y-5">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Verifica tu identidad</h2>

        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ubicación (Comuna)</label>
          <div
            class="flex items-center h-14 rounded-2xl border bg-gray-50 px-4 transition-all"
            :class="
              errors.location ? 'border-red-400' : 'border-gray-200 focus-within:border-blue-600'
            "
          >
            <svg
              class="w-5 h-5 text-gray-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <input
              v-model="form.location"
              @input="clearError('location')"
              type="text"
              placeholder="Tu comuna"
              class="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
            />
          </div>
          <p v-if="errors.location" class="text-red-500 text-sm mt-2">{{ errors.location }}</p>
        </div>

        <!-- Selfie Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Foto de perfil (Selfie)</label
          >
          <label
            class="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 transition"
          >
            <div class="text-center">
              <svg
                class="w-8 h-8 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p class="text-sm font-medium text-gray-700">Sube tu selfie</p>
              <p class="text-xs text-gray-500 mt-1">JPG, PNG (máx. 5MB)</p>
            </div>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload('selfie', $event)"
              class="hidden"
            />
          </label>
          <p v-if="errors.selfie" class="text-red-500 text-sm mt-2">{{ errors.selfie }}</p>
          <p v-if="form.selfie" class="text-green-600 text-sm mt-2">
            ✓ Archivo seleccionado: {{ (form.selfie as any).name }}
          </p>
        </div>

        <!-- Document Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Documento de identidad</label>
          <label
            class="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 transition"
          >
            <div class="text-center">
              <svg
                class="w-8 h-8 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p class="text-sm font-medium text-gray-700">Sube tu documento</p>
              <p class="text-xs text-gray-500 mt-1">JPG, PNG (máx. 5MB)</p>
            </div>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload('document', $event)"
              class="hidden"
            />
          </label>
          <p v-if="errors.document" class="text-red-500 text-sm mt-2">{{ errors.document }}</p>
          <p v-if="form.document" class="text-green-600 text-sm mt-2">
            ✓ Archivo seleccionado: {{ (form.document as any).name }}
          </p>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex gap-3 mt-6">
          <button
            @click="step = 1"
            type="button"
            class="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-2xl transition-all duration-300 hover:bg-gray-50"
          >
            Volver
          </button>
          <button
            @click="handleSubmit"
            type="button"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Registrarse</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-6 text-center">
      <p class="text-gray-600 text-sm">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-semibold"
          >Inicia sesión</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const step = ref(1)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  location: '',
  selfie: null,
  document: null,
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  location: '',
  selfie: '',
  document: '',
})

const validateEmail = (email: string) => {
  return /^\S+@\S+\.\S+$/.test(email)
}

const clearError = (field: string) => {
  errors.value[field as keyof typeof errors.value] = ''
}

const validateStep1 = () => {
  const newErrors = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    selfie: '',
    document: '',
  }

  if (!form.value.name) {
    newErrors.name = 'Ingresa tu nombre'
  }

  if (!form.value.email) {
    newErrors.email = 'Ingresa tu correo'
  } else if (!validateEmail(form.value.email)) {
    newErrors.email = 'Correo inválido'
  }

  if (!form.value.password) {
    newErrors.password = 'Ingresa una contraseña'
  } else if (form.value.password.length < 6) {
    newErrors.password = 'La contraseña debe tener mínimo 6 caracteres'
  }

  if (!form.value.confirmPassword) {
    newErrors.confirmPassword = 'Confirma tu contraseña'
  } else if (form.value.password !== form.value.confirmPassword) {
    newErrors.confirmPassword = 'Las contraseñas no coinciden'
  }

  errors.value = newErrors
  return Object.keys(newErrors).filter((k) => newErrors[k as keyof typeof newErrors]).length === 0
}

const validateStep2 = () => {
  const newErrors = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    selfie: '',
    document: '',
  }

  if (!form.value.location) {
    newErrors.location = 'Ingresa tu ubicación'
  }

  if (!form.value.selfie) {
    newErrors.selfie = 'Sube una selfie'
  }

  if (!form.value.document) {
    newErrors.document = 'Sube una foto del documento'
  }

  errors.value = newErrors
  return Object.keys(newErrors).filter((k) => newErrors[k as keyof typeof newErrors]).length === 0
}

const nextStep = () => {
  if (validateStep1()) {
    step.value = 2
  }
}

const handleFileUpload = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    form.value[field as keyof typeof form.value] = file as any
    clearError(field)
  }
}

const handleSubmit = () => {
  if (validateStep2()) {
    console.log('Registro completado:', form.value)
    // TODO: Llamar a API
  }
}
</script>

<style scoped></style>
