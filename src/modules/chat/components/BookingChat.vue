<script setup lang="ts">
import { useQueryCache } from '@pinia/colada'
import { Check, CheckCheck, ImagePlus, Lock, SendHorizontal, X } from '@lucide/vue'
import { computed, nextTick, ref, watch } from 'vue'

import { useAuthStore } from '@/modules/auth'
import { ApiError } from '@/shared/http/client'
import { usePresenceChannel } from '@/shared/realtime/presence'
import type { Booking, Message } from '@/shared/types/models'
import { BaseAlert, BaseAvatar, BaseButton, BaseCard, BaseSkeleton } from '@/shared/ui'
import { formatDateTime, formatTime } from '@/shared/utils/format'

import { chatApi } from '../api'
import { appendMessage, useConversation, useSendMessage } from '../queries'
import { attachmentSchema, MAX_BODY_LENGTH } from '../schemas'

/**
 * HU011, HU041, HU042: chat de la reserva entre el cliente y el profesional.
 * Los mensajes llegan al instante por el canal de presencia `booking.{id}`, que también dice
 * si la otra persona está conectada.
 */
const props = defineProps<{ booking: Booking }>()

const auth = useAuthStore()
const queryCache = useQueryCache()
const { data: conversation, isPending, error } = useConversation(() => props.booking.id)
const { mutateAsync: send, isLoading: sending } = useSendMessage(() => props.booking.id)

const me = computed(() => auth.user?.id)
const counterpart = computed(() =>
  me.value === props.booking.client.id ? props.booking.professional : props.booking.client,
)

// HU041: en línea si la otra persona está en el canal de la reserva.
const { members, listen } = usePresenceChannel(() => `booking.${props.booking.id}`)
const online = computed(() => members.value.some((member) => member.id === counterpart.value.id))

function markAsRead() {
  void chatApi.markAsRead(props.booking.id).catch(() => {})
}

listen<Message>('.message.sent', (message) => {
  appendMessage(queryCache, message)
  if (message.sender.id !== me.value) markAsRead()
})

// Al abrir el chat, lo recibido queda leído.
watch(
  () => conversation.value?.messages.some((m) => m.sender.id !== me.value && !m.read_at),
  (hasUnread) => hasUnread && markAsRead(),
  { immediate: true },
)

// Siempre se ve el último mensaje.
const scroller = ref<HTMLElement | null>(null)
watch(
  () => conversation.value?.messages.length,
  async () => {
    await nextTick()
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
  },
)

const body = ref('')
const attachment = ref<File | null>(null)
const attachmentPreview = computed(() =>
  attachment.value ? URL.createObjectURL(attachment.value) : null,
)
const formError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

function pickFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  ;(event.target as HTMLInputElement).value = ''
  if (!file) return
  const check = attachmentSchema.safeParse(file)
  if (!check.success) {
    formError.value = check.error.issues[0]?.message ?? 'Imagen no válida.'
    return
  }
  formError.value = ''
  attachment.value = file
}

const canSubmit = computed(
  () => !sending.value && (body.value.trim().length > 0 || attachment.value !== null),
)

async function submit() {
  if (!canSubmit.value) return
  formError.value = ''
  try {
    await send({ body: body.value.trim(), attachment: attachment.value })
    body.value = ''
    attachment.value = null
  } catch (failure) {
    formError.value =
      failure instanceof ApiError ? failure.message : 'No pudimos enviar el mensaje.'
  }
}

function onKeydown(event: KeyboardEvent) {
  // Enter envía; Shift + Enter hace un salto de línea.
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    void submit()
  }
}
</script>

<template>
  <BaseCard as="section" padding="none" class="overflow-hidden">
    <header class="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
      <div class="relative">
        <BaseAvatar :name="counterpart.name" :src="counterpart.avatar_url" />
        <span
          :class="[
            'absolute right-0 bottom-0 size-3 rounded-full ring-2 ring-surface',
            online ? 'bg-success-500' : 'bg-neutral-300',
          ]"
          aria-hidden="true"
        />
      </div>
      <div>
        <h2 class="font-bold text-neutral-900">{{ counterpart.name }}</h2>
        <p :class="['text-xs font-medium', online ? 'text-success-700' : 'text-neutral-500']">
          {{ online ? 'En línea' : 'Desconectado' }}
        </p>
      </div>
    </header>

    <div ref="scroller" class="h-96 space-y-3 overflow-y-auto bg-surface-muted px-5 py-4">
      <BaseSkeleton v-if="isPending" class="h-20" />
      <BaseAlert v-else-if="error" tone="danger">No pudimos cargar los mensajes.</BaseAlert>
      <p
        v-else-if="!conversation?.messages.length"
        class="py-10 text-center text-sm text-neutral-500"
      >
        Aún no hay mensajes. Acuerden aquí materiales, acceso y tiempos del servicio.
      </p>
      <template v-else>
        <div
          v-for="message in conversation.messages"
          :key="message.id"
          :class="['flex', message.sender.id === me ? 'justify-end' : 'justify-start']"
        >
          <div
            :class="[
              'max-w-4/5 rounded-2xl px-4 py-2.5 text-sm shadow-sm',
              message.sender.id === me
                ? 'rounded-br-md bg-primary-600 text-white'
                : 'rounded-bl-md bg-surface text-neutral-800',
            ]"
          >
            <a
              v-if="message.attachment_url"
              :href="message.attachment_url"
              target="_blank"
              rel="noopener"
              class="mb-2 block"
            >
              <img
                :src="message.attachment_url"
                alt="Imagen adjunta"
                class="max-h-60 rounded-xl object-cover"
              />
            </a>
            <p v-if="message.body" class="whitespace-pre-line">{{ message.body }}</p>
            <p
              :class="[
                'mt-1 flex items-center justify-end gap-1 text-xs',
                message.sender.id === me ? 'text-primary-100' : 'text-neutral-400',
              ]"
              :title="formatDateTime(message.created_at)"
            >
              {{ formatTime(message.created_at) }}
              <template v-if="message.sender.id === me">
                <CheckCheck v-if="message.read_at" class="size-3.5" aria-label="Leído" />
                <Check v-else class="size-3.5" aria-label="Enviado" />
              </template>
            </p>
          </div>
        </div>
      </template>
    </div>

    <footer class="border-t border-neutral-100 px-5 py-4">
      <p
        v-if="conversation && !conversation.can_send"
        class="flex items-center gap-2 text-sm text-neutral-500"
      >
        <Lock class="size-4" /> El chat se cerró porque la reserva ya terminó o se canceló.
      </p>
      <form v-else class="space-y-3" @submit.prevent="submit">
        <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>
        <div v-if="attachmentPreview" class="relative inline-block">
          <img
            :src="attachmentPreview"
            alt="Imagen por enviar"
            class="h-20 rounded-xl object-cover"
          />
          <button
            type="button"
            class="absolute -top-2 -right-2 rounded-full bg-neutral-900 p-1 text-white"
            aria-label="Quitar imagen"
            @click="attachment = null"
          >
            <X class="size-3" />
          </button>
        </div>
        <div class="flex items-end gap-2">
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            @change="pickFile"
          />
          <BaseButton
            variant="ghost"
            size="sm"
            aria-label="Adjuntar imagen"
            @click="fileInput?.click()"
          >
            <ImagePlus class="size-5" />
          </BaseButton>
          <textarea
            v-model="body"
            rows="1"
            :maxlength="MAX_BODY_LENGTH"
            placeholder="Escribe un mensaje…"
            aria-label="Mensaje"
            class="max-h-32 min-h-11 flex-1 resize-y rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none"
            @keydown="onKeydown"
          />
          <BaseButton type="submit" :loading="sending" :disabled="!canSubmit" aria-label="Enviar">
            <SendHorizontal class="size-4" />
          </BaseButton>
        </div>
      </form>
    </footer>
  </BaseCard>
</template>
