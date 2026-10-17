import { http, toFormData } from '@/shared/http/client'
import type { ApiSuccess } from '@/shared/types/api'
import type { Conversation, Message } from '@/shared/types/models'

/** Contrato: backend/docs/api/endpoints.md § Chat de la reserva */
export const chatApi = {
  conversation: (bookingId: number) =>
    http.get<ApiSuccess<Conversation>>(`/bookings/${bookingId}/messages`),
  send: (bookingId: number, body: string, attachment: File | null) =>
    http.post<ApiSuccess<Message>>(
      `/bookings/${bookingId}/messages`,
      attachment ? toFormData({ body, attachment }) : { body },
    ),
  remove: (messageId: number) => http.delete<ApiSuccess<null>>(`/messages/${messageId}`),
  markAsRead: (bookingId: number) =>
    http.post<ApiSuccess<{ marked: number }>>(`/bookings/${bookingId}/messages/read`),
}
