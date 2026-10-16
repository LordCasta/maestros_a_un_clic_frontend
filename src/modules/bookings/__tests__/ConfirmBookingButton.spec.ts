import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import type { Booking } from '@/shared/types/models'

import { bookingsApi } from '../api'
import ConfirmBookingButton from '../components/ConfirmBookingButton.vue'

vi.mock('../api', () => ({
  bookingsApi: { confirm: vi.fn<(typeof bookingsApi)['confirm']>() },
}))

function setup() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(ConfirmBookingButton, {
    props: { bookingId: 7 },
    global: { plugins: [pinia, PiniaColada] },
  })

  return { wrapper, toast: useToastStore() }
}

describe('ConfirmBookingButton', () => {
  it('confirms the booking and says so', async () => {
    vi.mocked(bookingsApi.confirm).mockResolvedValue({
      success: true,
      message: 'Reserva confirmada.',
      data: { id: 7, status: 'confirmed' } as Booking,
    })
    const { wrapper, toast } = setup()

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(bookingsApi.confirm).toHaveBeenCalledWith(7)
    expect(toast.toasts[toast.toasts.length - 1]).toMatchObject({
      tone: 'success',
      message: 'Reserva confirmada.',
    })
  })

  it('shows the API message when it can no longer be confirmed', async () => {
    vi.mocked(bookingsApi.confirm).mockImplementation(async () => {
      throw new ApiError("No se puede pasar una reserva de 'cancelled' a 'confirmed'.", 409)
    })
    const { wrapper, toast } = setup()

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(toast.toasts[toast.toasts.length - 1]?.tone).toBe('danger')
  })
})
