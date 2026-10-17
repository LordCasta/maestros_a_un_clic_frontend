import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'

import type { Conversation, Message } from '@/shared/types/models'

import { chatApi } from './api'

export const chatKeys = {
  all: ['chat'] as const,
  conversation: (bookingId: number) => ['chat', bookingId] as const,
}

export function useConversation(bookingId: MaybeRefOrGetter<number>) {
  return useQuery({
    key: () => chatKeys.conversation(toValue(bookingId)),
    query: async () => (await chatApi.conversation(toValue(bookingId))).data,
  })
}

/** Agrega un mensaje a la conversación en caché, sin duplicarlo (llega por la API y por el canal). */
export function appendMessage(
  queryCache: ReturnType<typeof useQueryCache>,
  message: Message,
): void {
  queryCache.setQueryData(
    chatKeys.conversation(message.booking_id),
    (current: Conversation | undefined) =>
      current && !current.messages.some((item) => item.id === message.id)
        ? { ...current, messages: [...current.messages, message] }
        : (current ?? { can_send: true, messages: [message] }),
  )
}

export function useSendMessage(bookingId: MaybeRefOrGetter<number>) {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ body, attachment }: { body: string; attachment: File | null }) =>
      chatApi.send(toValue(bookingId), body, attachment),
    onSuccess: (response) => appendMessage(queryCache, response.data),
  })
}
