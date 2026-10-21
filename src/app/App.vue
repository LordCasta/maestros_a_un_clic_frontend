<script setup lang="ts">
import { ToastContainer } from '@/shared/ui'

import { useInactivityTimer } from './useInactivityTimer'

useInactivityTimer()
</script>

<template>
  <RouterView />
  <ToastContainer />
</template>
