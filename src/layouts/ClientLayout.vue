<template>
  <div class="flex flex-col min-h-screen bg-slate-50">
    <Navbar />
    <div class="flex flex-1">
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
</script>

<style scoped></style>
