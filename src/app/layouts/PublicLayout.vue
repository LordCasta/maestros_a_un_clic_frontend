<script setup lang="ts">
import AppFooter from './components/AppFooter.vue'
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppNavbar v-if="!$route.meta.hideNavbar" />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
