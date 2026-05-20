<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="h-20 flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 hover:opacity-80 transition">
          <div class="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h1 class="font-black text-xl text-gray-900">Maestros a un clic</h1>
            <p class="text-xs text-gray-500">Marketplace de servicios</p>
          </div>
        </router-link>

        <!-- Desktop Search -->
        <div class="hidden lg:flex flex-1 max-w-2xl mx-10">
          <div class="w-full relative">
            <svg
              class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="¿Qué servicio necesitas hoy?"
              class="w-full h-14 rounded-2xl bg-slate-50 border border-gray-200 pl-14 pr-5 outline-none focus:border-blue-600 transition"
            />
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-3">
          <!-- Desktop Icons -->
          <button
            class="hidden md:flex w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center hover:bg-gray-200 transition"
          >
            <svg
              class="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <div class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500" />
          </button>
          <button
            class="hidden md:flex w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center hover:bg-gray-200 transition"
          >
            <svg
              class="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          <!-- Desktop Profile -->
          <router-link
            to="/login"
            class="hidden md:flex items-center gap-3 bg-slate-50 rounded-2xl pl-3 pr-5 py-2 border border-gray-200 hover:bg-gray-100 transition"
          >
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
              alt="Profile"
              class="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <h3 class="font-semibold text-sm">Mi Cuenta</h3>
              <p class="text-xs text-gray-500">Inicia sesión</p>
            </div>
          </router-link>

          <!-- Mobile Menu Button -->
          <button
            class="lg:hidden w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Search -->
      <div class="pb-4 lg:hidden">
        <div class="relative">
          <svg
            class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar servicio..."
            class="w-full h-12 rounded-2xl bg-slate-50 border border-gray-200 pl-14 pr-5 outline-none focus:border-blue-600 transition text-sm"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped></style>
