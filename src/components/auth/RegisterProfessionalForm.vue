<template>
  <div>
    <!-- Logo Header -->
    <div class="flex items-center gap-4 mb-8">
      <div class="w-14 h-14 rounded-2xl bg-blue-600 shadow-xl flex items-center justify-center">
        <Wrench class="w-7 h-7 text-white" />
      </div>

      <div>
        <h2 class="text-2xl font-black text-gray-900 leading-none">
          Maestros a un clic
        </h2>
        <p class="text-gray-500 text-sm mt-1">
          Registro profesional
        </p>
      </div>
    </div>

    <!-- Card Container -->
    <div class="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
      <!-- HEADER -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-3xl font-black">
              Crea tu perfil profesional
            </h3>

            <p class="text-blue-100 mt-2">
              Completa tu información y comienza a recibir clientes.
            </p>
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
              step >= item ? 'bg-white' : 'bg-white/20'
            ]"
          />
        </div>
      </div>

      <!-- BODY -->
      <div class="p-6 sm:p-8">
        <!-- Step 1: Basic Info -->
        <div v-if="step === 1" class="space-y-6">
          <div>
            <h4 class="text-2xl font-bold text-gray-900 mb-2">
              Información principal
            </h4>

            <p class="text-gray-500">
              Construye una primera impresión profesional.
            </p>
          </div>

          <!-- PROFILE PHOTO -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              Foto de perfil
            </label>

            <label class="relative border-2 border-dashed border-gray-300 hover:border-blue-600 transition rounded-[2rem] p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50" />

              <div class="relative z-10 flex flex-col items-center">
                <div class="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-xl mb-5">
                  <Camera class="w-10 h-10" />
                </div>

                <h3 class="font-bold text-lg text-gray-800">
                  Sube tu foto profesional
                </h3>

                <p class="text-gray-500 text-sm mt-1">
                  Una foto clara genera más confianza
                </p>

                <div class="mt-5 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
                  Seleccionar imagen
                </div>
              </div>

              <input
                type="file"
                className="hidden"
                accept="image/*"
                @change="handleFileUpload('profilePhoto', $event)"
              />
            </label>

            <p v-if="errors.profilePhoto" class="text-red-500 text-sm mt-2">{{ errors.profilePhoto }}</p>
            <p v-if="form.profilePhoto" class="text-green-600 text-sm mt-2">
              ✓ Foto seleccionada: {{ (form.profilePhoto as any).name }}
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
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Especialidad
              </label>

              <select
                v-model="form.specialty"
                @change="clearError('specialty')"
                class="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-blue-600"
                :class="errors.specialty ? 'border-red-400' : ''"
              >
                <option value="">
                  Selecciona
                </option>

                <option
                  v-for="item in specialties"
                  :key="item"
                  :value="item"
                >
                  {{ item }}
                </option>
              </select>
              <p v-if="errors.specialty" class="text-red-500 text-sm mt-2">{{ errors.specialty }}</p>
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
              <p v-if="errors.hourlyRate" class="text-red-500 text-sm mt-2">{{ errors.hourlyRate }}</p>
            </div>

            <!-- COMMUNE -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Comuna / zona
              </label>

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
            <h4 class="text-2xl font-bold text-gray-900 mb-2">
              Experiencia profesional
            </h4>

            <p class="text-gray-500">
              Cuéntale a los clientes por qué deberían contratarte.
            </p>
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
            <p v-if="errors.experience" class="text-red-500 text-sm mt-2">{{ errors.experience }}</p>
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
              <span class="text-gray-400">
                Mínimo 50 caracteres
              </span>

              <span :class="form.description.length >= 50 ? 'text-green-600' : 'text-gray-500'">
                {{ form.description.length }} / 300
              </span>
            </div>
            <p v-if="errors.description" class="text-red-500 text-sm mt-2">{{ errors.description }}</p>
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
            <h4 class="text-2xl font-bold text-gray-900 mb-2">
              Certificados y portafolio
            </h4>

            <p class="text-gray-500">
              Muestra evidencia de tu trabajo y aumenta tu credibilidad.
            </p>
          </div>

          <!-- CERTIFICATES -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              Certificados
            </label>

            <label class="border-2 border-dashed border-gray-300 hover:border-blue-600 transition rounded-[2rem] bg-gray-50 p-8 flex flex-col items-center justify-center cursor-pointer">
              <FileBadge class="w-12 h-12 text-blue-600 mb-4" />

              <h3 class="font-bold text-lg text-gray-800">
                Sube certificados
              </h3>

              <p class="text-sm text-gray-500 mt-1">
                PDF, JPG, PNG
              </p>

              <input
                type="file"
                multiple
                className="hidden"
                @change="handleMultipleFileUpload('certificates', $event)"
              />
            </label>
            <p v-if="errors.certificates" class="text-red-500 text-sm mt-2">{{ errors.certificates }}</p>
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

            <label class="border-2 border-dashed border-gray-300 hover:border-blue-600 transition rounded-[2rem] bg-gray-50 p-8 flex flex-col items-center justify-center cursor-pointer">
              <ImagePlus class="w-12 h-12 text-blue-600 mb-4" />

              <h3 class="font-bold text-lg text-gray-800">
                Agrega fotos de trabajos
              </h3>

              <p class="text-sm text-gray-500 mt-1">
                Los perfiles con portafolio reciben más solicitudes
              </p>

              <input
                type="file"
                multiple
                className="hidden"
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
          <div class="rounded-[2rem] border border-gray-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white overflow-hidden relative">
            <div class="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

            <div class="relative z-10">
              <div class="flex items-center gap-4 mb-5">
                <div class="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center">
                  <Eye class="w-9 h-9" />
                </div>

                <div>
                  <h3 class="text-2xl font-bold">
                    Vista previa
                  </h3>

                  <p class="text-blue-100">
                    Así verán los clientes tu perfil
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 mb-2">
                <Star class="w-5 h-5 fill-yellow-400 text-yellow-400" />

                <span class="font-semibold">
                  Perfil destacado
                </span>
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
              class="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-bold shadow-xl flex items-center justify-center gap-2"
            >
              Completar registro
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
import { ref } from 'vue'
import {
  Wrench,
  Briefcase,
  Camera,
  Clock3,
  ArrowLeft,
  ArrowRight,
  FileBadge,
  ImagePlus,
  Eye,
  Star,
  CheckCircle2
} from '@lucide/vue'

const step = ref(1)

const specialties = [
  'Plomería',
  'Electricidad',
  'Carpintería',
  'Pintura',
  'Aires acondicionados',
  'Cerrajería',
  'Construcción',
  'Drywall',
]

const form = ref({
  fullName: '',
  specialty: '',
  hourlyRate: '',
  commune: '',
  experience: '',
  description: '',
  profilePhoto: null,
  certificates: [] as File[],
  portfolio: [] as File[],
})

const errors = ref({
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

const clearError = (field: string) => {
  errors.value[field as keyof typeof errors.value] = ''
}

const validateStep1 = () => {
  const newErrors = {
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

  if (!form.value.fullName) {
    newErrors.fullName = 'Ingresa tu nombre completo'
  }

  if (!form.value.specialty) {
    newErrors.specialty = 'Selecciona una especialidad'
  }

  if (!form.value.hourlyRate) {
    newErrors.hourlyRate = 'Ingresa tu tarifa'
  } else if (Number(form.value.hourlyRate) < 1000) {
    newErrors.hourlyRate = 'La tarifa debe ser mayor a $1.000'
  }

  if (!form.value.commune) {
    newErrors.commune = 'Ingresa tu comuna'
  }

  if (!form.value.profilePhoto) {
    newErrors.profilePhoto = 'Sube una foto de perfil'
  }

  errors.value = newErrors
  return !newErrors.fullName && !newErrors.specialty && !newErrors.hourlyRate && !newErrors.commune && !newErrors.profilePhoto
}

const validateStep2 = () => {
  const newErrors = {
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

  if (!form.value.experience) {
    newErrors.experience = 'Ingresa tus años de experiencia'
  }

  if (!form.value.description) {
    newErrors.description = 'Describe tus servicios'
  } else if (form.value.description.length < 50) {
    newErrors.description = 'La descripción debe tener al menos 50 caracteres'
  }

  errors.value = newErrors
  return !newErrors.experience && !newErrors.description
}

const validateStep3 = () => {
  const newErrors = {
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

  if (!form.value.certificates || form.value.certificates.length === 0) {
    newErrors.certificates = 'Sube al menos un certificado'
  }

  if (!form.value.portfolio || form.value.portfolio.length < 2) {
    newErrors.portfolio = 'Sube al menos 2 fotos de tus trabajos'
  }

  errors.value = newErrors
  return !newErrors.certificates && !newErrors.portfolio
}

const nextStep = (currentStep: number) => {
  if (currentStep === 1 && validateStep1()) {
    step.value = 2
  } else if (currentStep === 2 && validateStep2()) {
    step.value = 3
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

const handleMultipleFileUpload = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (files.length > 0) {
    form.value[field as keyof typeof form.value] = files as any
    clearError(field)
  }
}

const handleSubmit = (event: Event) => {
  event.preventDefault()
  if (validateStep3()) {
    console.log('Registro profesional completado:', form.value)
    // TODO: Llamar a API
  }
}
</script>

<style scoped></style>
