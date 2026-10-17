<script setup lang="ts">
import { useQueryCache } from '@pinia/colada'
import { Bell, BellOff } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth'
import { getRealtime } from '@/shared/realtime/echo'
import type { NotificationItem } from '@/shared/types/models'
import { BaseButton, BaseSkeleton } from '@/shared/ui'
import { formatDateTime } from '@/shared/utils/format'

import {
  notificationKeys,
  useLatestNotifications,
  useMarkAllAsRead,
  useMarkAsRead,
  useUnreadCount,
} from '../queries'

/**
 * HU018: campana con las notificaciones del usuario (solicitudes, respuestas, cambios de estado
 * y mensajes). Se actualiza sola con las que llegan por el canal privado del usuario.
 */
const auth = useAuthStore()
const router = useRouter()
const queryCache = useQueryCache()

const open = ref(false)
const { data: unread } = useUnreadCount()
const { data: notifications, isPending } = useLatestNotifications()
const { mutate: markAsRead } = useMarkAsRead()
const { mutate: markAllAsRead, isLoading: markingAll } = useMarkAllAsRead()

const badge = computed(() => (unread.value && unread.value > 99 ? '99+' : unread.value))

// Llegó una nueva: refrescar contador y lista.
function onNotification() {
  void queryCache.invalidateQueries({ key: notificationKeys.all })
}
let channel: string | null = null
onMounted(() => {
  const echo = getRealtime()
  if (!echo || !auth.user) return
  channel = `App.Models.User.${auth.user.id}`
  echo.private(channel).notification(onNotification)
})
onBeforeUnmount(() => {
  if (channel) getRealtime()?.private(channel).stopListeningForNotification(onNotification)
})

function openNotification(item: NotificationItem) {
  if (!item.read_at) markAsRead(item.id)
  open.value = false
  if (item.booking_id) {
    void router.push({
      name: auth.role === 'professional' ? 'professional-booking-detail' : 'client-booking-detail',
      params: { id: item.booking_id },
    })
  }
}

// Se cierra al hacer clic afuera o con Esc.
const root = ref<HTMLElement | null>(null)
function onDocumentClick(event: MouseEvent) {
  if (open.value && root.value && !root.value.contains(event.target as Node)) open.value = false
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}
onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="relative flex size-10 items-center justify-center rounded-xl text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
      :aria-expanded="open"
      aria-haspopup="true"
      :aria-label="unread ? `Notificaciones, ${unread} sin leer` : 'Notificaciones'"
      @click="open = !open"
    >
      <Bell class="size-5" />
      <span
        v-if="unread"
        class="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger-600 px-1 text-xs font-bold text-white"
        data-test="badge"
      >
        {{ badge }}
      </span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-neutral-100 bg-surface shadow-raised sm:w-96"
      role="dialog"
      aria-label="Notificaciones"
    >
      <div class="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <p class="font-bold text-neutral-900">Notificaciones</p>
        <BaseButton
          v-if="unread"
          variant="ghost"
          size="sm"
          :loading="markingAll"
          @click="markAllAsRead()"
        >
          Marcar todas como leídas
        </BaseButton>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="isPending" class="space-y-2 p-4">
          <BaseSkeleton v-for="n in 3" :key="n" class="h-14" />
        </div>

        <div
          v-else-if="!notifications?.length"
          class="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-neutral-500"
        >
          <BellOff class="size-6 text-neutral-400" />
          No tienes notificaciones todavía.
        </div>

        <ul v-else class="divide-y divide-neutral-100">
          <li v-for="item in notifications" :key="item.id">
            <button
              type="button"
              :class="[
                'flex w-full gap-3 px-4 py-3 text-left transition hover:bg-surface-muted',
                !item.read_at && 'bg-primary-50',
              ]"
              @click="openNotification(item)"
            >
              <span
                :class="[
                  'mt-1.5 size-2 shrink-0 rounded-full',
                  item.read_at ? 'bg-transparent' : 'bg-primary-600',
                ]"
                aria-hidden="true"
              />
              <span class="min-w-0">
                <span
                  :class="[
                    'block text-sm text-neutral-900',
                    item.read_at ? 'font-medium' : 'font-bold',
                  ]"
                >
                  {{ item.title }}
                </span>
                <span class="mt-0.5 block text-sm text-neutral-600">{{ item.body }}</span>
                <span class="mt-1 block text-xs text-neutral-400">
                  {{ formatDateTime(item.created_at) }}
                </span>
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
