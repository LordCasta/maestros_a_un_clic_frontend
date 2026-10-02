<script setup lang="ts">
import type { BookingStatus } from '@/shared/types/models'
import { BaseBadge } from '@/shared/ui'

import { BOOKING_STATUS } from '../status'

defineProps<{ status: BookingStatus }>()
</script>

<template>
  <BaseBadge :tone="BOOKING_STATUS[status].tone">{{ BOOKING_STATUS[status].label }}</BaseBadge>
</template>
