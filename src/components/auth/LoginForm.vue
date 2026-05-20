<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div
        class="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-5"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Acceso seguro
      </div>
      <h2 class="text-3xl font-bold text-gray-900 mb-3">Bienvenido de nuevo</h2>
      <p class="text-gray-500 leading-relaxed">
        Inicia sesión para gestionar tus servicios, reservas y profesionales.
      </p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
        <div
          :class="[
            'flex items-center h-14 rounded-2xl border bg-gray-50 px-4 transition-all',
            errors.email ? 'border-red-400' : 'border-gray-200 focus-within:border-blue-600',
          ]"
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
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <router-link to="#" class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >¿Olvidaste tu contraseña?</router-link
          >
        </div>
        <div
          :class="[
            'flex items-center h-14 rounded-2xl border bg-gray-50 px-4 transition-all',
            errors.password ? 'border-red-400' : 'border-gray-200 focus-within:border-blue-600',
          ]"
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
            placeholder="••••••••"
            class="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
          />
          <button
            @click.prevent="showPassword = !showPassword"
            type="button"
            class="text-gray-400 hover:text-gray-600"
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

      <!-- Remember Me -->
      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center gap-2 text-gray-600 cursor-pointer">
          <input
            v-model="form.remember"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          />
          Recordarme
        </label>
        <span class="text-gray-400">Acceso rápido y seguro</span>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all duration-300 mt-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        <span>Iniciar sesión</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </button>
    </form>

    <!-- Divider -->
    <div class="relative my-8">
      <div class="border-t border-gray-200"></div>
      <div class="absolute inset-0 flex justify-center">
        <span class="bg-white px-4 text-sm text-gray-400">o continuar como</span>
      </div>
    </div>

    <!-- Register Buttons -->
    <div class="space-y-4">
      <router-link
        to="/register/client"
        class="w-full h-14 border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all rounded-2xl flex items-center justify-center gap-3 text-gray-700 font-medium"
      >
        <User class="w-5 h-5 text-blue-600" />
        Cliente
      </router-link>

      <router-link
        to="/register/professional"
        class="w-full h-14 border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all rounded-2xl flex items-center justify-center gap-3 text-gray-700 font-medium"
      >
        <Briefcase class="w-5 h-5 text-blue-600" />
        Profesional
      </router-link>
    </div>

    <!-- Footer -->
    <p class="text-center text-sm text-gray-500 mt-8 leading-relaxed">
      Al continuar aceptas nuestros
      <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Términos y Condiciones</a>
      y
      <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Política de Privacidad</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, Briefcase } from '@lucide/vue'

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const errors = ref({
  email: '',
  password: '',
})

const showPassword = ref(false)

const validateEmail = (email: string) => {
  return /^\S+@\S+\.\S+$/.test(email)
}

const clearError = (field: string) => {
  errors.value[field as keyof typeof errors.value] = ''
}

const handleSubmit = () => {
  const newErrors = {
    email: '',
    password: '',
  }

  if (!form.value.email) {
    newErrors.email = 'Ingresa tu correo electrónico'
  } else if (!validateEmail(form.value.email)) {
    newErrors.email = 'Correo electrónico inválido'
  }

  if (!form.value.password) {
    newErrors.password = 'Ingresa tu contraseña'
  } else if (form.value.password.length < 6) {
    newErrors.password = 'La contraseña debe tener mínimo 6 caracteres'
  }

  errors.value = newErrors

  if (!newErrors.email && !newErrors.password) {
    console.log('Login exitoso:', form.value)
    // TODO: Llamar a API
  }
}
</script>

<style scoped></style>
