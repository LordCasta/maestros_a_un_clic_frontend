import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/modules/auth'
import type { Booking, Conversation, Message, User } from '@/shared/types/models'

import { chatApi } from '../api'
import BookingChat from '../components/BookingChat.vue'

type Api = typeof chatApi

vi.mock('../api', () => ({
  chatApi: {
    conversation: vi.fn<Api['conversation']>(),
    send: vi.fn<Api['send']>(),
    markAsRead: vi.fn<Api['markAsRead']>(),
    remove: vi.fn<Api['remove']>(),
  },
}))
// Sin Reverb en los tests: el canal de presencia no se conecta.
vi.mock('@/shared/realtime/echo', () => ({ getRealtime: () => null }))

const client = {
  id: 3,
  name: 'Camila Restrepo',
  avatar_url: null,
  rating: { average: 5, count: 1 },
}
const professional = {
  id: 5,
  name: 'Juan Castaño',
  avatar_url: null,
  rating: { average: 4.8, count: 12 },
}
const booking = { id: 42, client, professional } as Booking

const message = (id: number, sender: typeof client, overrides: Partial<Message> = {}): Message => ({
  id,
  booking_id: 42,
  sender,
  body: `Mensaje ${id}`,
  attachment_url: null,
  read_at: null,
  created_at: '2026-10-16T10:40:00-05:00',
  ...overrides,
})

async function mountChat(conversation: Conversation) {
  vi.mocked(chatApi.conversation).mockResolvedValue({
    success: true,
    message: null,
    data: conversation,
  })
  vi.mocked(chatApi.markAsRead).mockResolvedValue({
    success: true,
    message: null,
    data: { marked: 0 },
  })
  const pinia = createPinia()
  setActivePinia(pinia)
  const auth = useAuthStore()
  auth.token = 'token'
  auth.user = { id: client.id, name: client.name, role: 'client' } as User

  const wrapper = mount(BookingChat, {
    props: { booking },
    global: { plugins: [pinia, PiniaColada], stubs: { teleport: true } },
  })
  await flushPromises()
  return wrapper
}

describe('BookingChat', () => {
  // Solo limpia las llamadas registradas; cada test define sus propias respuestas.
  beforeEach(() => vi.clearAllMocks())

  it('shows the conversation with the other party and marks received messages as read', async () => {
    const wrapper = await mountChat({
      can_send: true,
      messages: [message(1, client), message(2, professional, { body: 'Llevo los materiales.' })],
    })

    expect(wrapper.get('h2').text()).toBe('Juan Castaño')
    expect(wrapper.text()).toContain('Desconectado')
    expect(wrapper.text()).toContain('Llevo los materiales.')
    expect(chatApi.markAsRead).toHaveBeenCalledWith(42)
  })

  it('sends a message with Enter and shows it', async () => {
    vi.mocked(chatApi.send).mockResolvedValue({
      success: true,
      message: 'Mensaje enviado.',
      data: message(3, client, { body: '¿A qué hora llega?' }),
    })
    const wrapper = await mountChat({ can_send: true, messages: [] })

    const textarea = wrapper.get('textarea')
    await textarea.setValue('¿A qué hora llega?')
    await textarea.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(chatApi.send).toHaveBeenCalledWith(42, '¿A qué hora llega?', null)
    expect(wrapper.text()).toContain('¿A qué hora llega?')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('')
  })

  it('rejects an attachment that is not an image', async () => {
    const wrapper = await mountChat({ can_send: true, messages: [] })

    const input = wrapper.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [new File(['%PDF'], 'cotizacion.pdf', { type: 'application/pdf' })],
    })
    await input.trigger('change')

    expect(wrapper.text()).toContain('Usa una imagen JPG, PNG o WEBP.')
    expect(chatApi.send).not.toHaveBeenCalled()
  })

  it('deletes an own message after confirming', async () => {
    vi.mocked(chatApi.remove).mockResolvedValue({
      success: true,
      message: 'Mensaje eliminado.',
      data: null,
    })
    const wrapper = await mountChat({
      can_send: true,
      messages: [message(1, client, { body: 'Por error' }), message(2, professional)],
    })

    // Solo los mensajes propios tienen el botón.
    const buttons = wrapper.findAll('[aria-label="Eliminar mensaje"]')
    expect(buttons).toHaveLength(1)

    await buttons[0]!.trigger('click')
    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Eliminar')!
      .trigger('click')
    await flushPromises()

    expect(chatApi.remove).toHaveBeenCalledWith(1)
    expect(wrapper.text()).not.toContain('Por error')
    expect(wrapper.text()).toContain('Mensaje 2')
  })

  it('becomes read-only when the booking is over', async () => {
    const wrapper = await mountChat({ can_send: false, messages: [message(1, client)] })

    expect(wrapper.find('textarea').exists()).toBe(false)
    expect(wrapper.text()).toContain('El chat se cerró')
  })
})
