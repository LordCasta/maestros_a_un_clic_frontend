<template>
  <div class="flex flex-col min-h-screen bg-slate-50">
    <Navbar v-if="!$route.meta.hideNavbar" />
    <div class="flex flex-1">
      <Sidebar v-if="$route.meta.showSidebar" />
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
</script>

<style scoped></style>
