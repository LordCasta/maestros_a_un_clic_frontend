<script setup lang="ts">
import { useBookingAlerts } from '@/modules/bookings'

import AppFooter from './components/AppFooter.vue'
import AppNavbar from './components/AppNavbar.vue'

// Avisos de reservas en tiempo real en toda el área (HU004).
useBookingAlerts()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppNavbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
