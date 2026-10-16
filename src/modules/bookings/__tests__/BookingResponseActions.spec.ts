import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import type { ApiSuccess } from '@/shared/types/api'
import type { Booking } from '@/shared/types/models'

import { bookingsApi } from '../api'
import BookingResponseActions from '../components/BookingResponseActions.vue'

type Api = typeof bookingsApi

vi.mock('../api', () => ({
  bookingsApi: {
    accept: vi.fn<Api['accept']>(),
    reject: vi.fn<Api['reject']>(),
  },
}))

function setup() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(BookingResponseActions, {
    props: { bookingId: 42 },
    global: { plugins: [pinia, PiniaColada], stubs: { RejectBookingModal: true } },
  })
  const button = (label: string) => wrapper.findAll('button').find((b) => b.text().includes(label))!

  return { wrapper, button, toast: useToastStore() }
}

describe('BookingResponseActions', () => {
  it('accepts the request and confirms it with a toast', async () => {
    vi.mocked(bookingsApi.accept).mockResolvedValue({
      success: true,
      message: 'Solicitud aceptada. El cliente debe confirmarla.',
      data: { id: 42, status: 'accepted' } as Booking,
    } satisfies ApiSuccess<Booking>)
    const { button, toast } = setup()

    await button('Aceptar').trigger('click')
    await flushPromises()

    expect(bookingsApi.accept).toHaveBeenCalledWith(42)
    expect(toast.toasts[toast.toasts.length - 1]).toMatchObject({
      tone: 'success',
      message: 'Solicitud aceptada. El cliente debe confirmarla.',
    })
  })

  it('shows the API message when the request was already answered', async () => {
    vi.mocked(bookingsApi.accept).mockImplementation(async () => {
      throw new ApiError("No se puede pasar una reserva de 'accepted' a 'accepted'.", 409)
    })
    const { button, toast } = setup()

    await button('Aceptar').trigger('click')
    await flushPromises()

    expect(toast.toasts[toast.toasts.length - 1]?.tone).toBe('danger')
  })

  it('opens the reject dialog instead of rejecting right away', async () => {
    const { wrapper, button } = setup()

    await button('Rechazar').trigger('click')

    expect(bookingsApi.reject).not.toHaveBeenCalled()
    expect(wrapper.findComponent({ name: 'RejectBookingModal' }).attributes('open')).toBe('true')
  })
})
