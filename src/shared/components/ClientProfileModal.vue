<script setup lang="ts">
import { Calendar, CheckCircle2, MapPin } from '@lucide/vue'
import { toRef } from 'vue'

import { useClientProfile } from '@/modules/professionals'
import { BaseAlert, BaseAvatar, BaseButton, BaseModal, BaseRating, BaseSkeleton } from '@/shared/ui'
import { formatDate } from '@/shared/utils/format'

const props = defineProps<{
  open: boolean
  clientId: number
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const clientIdRef = toRef(props, 'clientId')
const { data: client, isPending, error, refetch } = useClientProfile(clientIdRef)

function close() {
  emit('update:open', false)
}
</script>

<template>
  <BaseModal :open="open" title="Perfil del cliente" @update:open="emit('update:open', $event)">
    <div v-if="isPending" class="space-y-4 py-4">
      <div class="flex items-center gap-4">
        <BaseSkeleton class="size-16 rounded-full" />
        <div class="flex-1 space-y-2">
          <BaseSkeleton class="h-5 w-40" />
          <BaseSkeleton class="h-4 w-24" />
        </div>
      </div>
      <BaseSkeleton class="h-20 rounded-2xl" />
    </div>

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar el perfil del cliente">
      {{ error.message }}
      <BaseButton variant="ghost" size="sm" class="mt-2" @click="refetch()">
        Reintentar
      </BaseButton>
    </BaseAlert>

    <div v-else-if="client" class="space-y-6">
      <div class="flex items-center gap-4">
        <BaseAvatar :name="client.name" :src="client.avatar_url" size="lg" />
        <div>
          <h3 class="text-xl font-bold text-neutral-900">{{ client.name }}</h3>
          <div class="mt-1 flex items-center gap-2">
            <BaseRating :rating="client.rating" />
            <span
              v-if="client.commune"
              class="inline-flex items-center gap-1 text-xs text-neutral-500"
            >
              <MapPin class="size-3.5" /> {{ client.commune.name }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-2xl border border-neutral-100 bg-surface-muted p-4">
          <div class="flex items-center gap-2 text-primary-600">
            <CheckCircle2 class="size-4" />
            <span class="text-xs font-semibold text-neutral-500 uppercase">Servicios</span>
          </div>
          <p class="mt-1 text-lg font-black text-neutral-900">
            {{ client.completed_bookings_count }}
          </p>
          <p class="text-xs text-neutral-500">completados con éxito</p>
        </div>

        <div class="rounded-2xl border border-neutral-100 bg-surface-muted p-4">
          <div class="flex items-center gap-2 text-primary-600">
            <Calendar class="size-4" />
            <span class="text-xs font-semibold text-neutral-500 uppercase">Miembro</span>
          </div>
          <p class="mt-1 text-sm font-bold text-neutral-900">
            {{ formatDate(client.member_since) }}
          </p>
          <p class="text-xs text-neutral-500">en la plataforma</p>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <BaseButton variant="secondary" @click="close"> Cerrar </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
