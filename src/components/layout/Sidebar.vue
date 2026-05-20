<template>
  <aside
    v-if="isOpen"
    class="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto"
  >
    <div class="p-6 space-y-8">
      <!-- Navigation Links -->
      <nav class="space-y-2">
        <router-link
          to="/"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-slate-50 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 5l3-3m0 0l3 3m-3-3v12"
            />
          </svg>
          <span>Inicio</span>
        </router-link>
        <router-link
          to="/client/dashboard"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-slate-50 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Dashboard</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(true)
</script>

<style scoped></style>
