<template>
  <div class="min-h-screen bg-slate-50 flex overflow-hidden">
    <!-- Left Panel -->
    <div
      class="hidden lg:flex w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-700 overflow-hidden items-center justify-center"
    >
      <!-- Decorations -->
      <div
        class="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-white/10 rounded-full"
      />
      <div
        class="absolute bottom-[-150px] left-[-150px] w-[450px] h-[450px] bg-white/10 rounded-full"
      />

      <!-- Content -->
      <div class="relative z-10 text-white text-center px-8">
        <svg class="w-20 h-20 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <h2 class="text-3xl font-bold mb-4">Maestros a un clic</h2>
        <p class="text-blue-100 text-lg mb-8">
          Conecta con profesionales verificados para tus servicios del hogar
        </p>
        <ul class="space-y-3 text-left max-w-sm">
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Profesionales verificados</span>
          </li>
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Pago seguro y confiable</span>
          </li>
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Servicio rápido y eficiente</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Right Panel -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-10">
      <div class="w-full max-w-md">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
