import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/http/client'
import type { Review } from '@/shared/types/models'

import { bookingsApi } from '../api'
import ReviewBookingModal from '../components/ReviewBookingModal.vue'

vi.mock('../api', () => ({
  bookingsApi: { review: vi.fn<(typeof bookingsApi)['review']>() },
}))

const mockReview: Review = {
  id: 1,
  booking_id: 12,
  reviewer: { id: 3, name: 'Camila Restrepo', avatar_url: null, rating: { average: 5, count: 1 } },
  reviewee: { id: 5, name: 'Juan Castaño', avatar_url: null, rating: { average: 4.8, count: 12 } },
  rating: 5,
  comment: 'Excelente trabajo.',
  created_at: '2026-10-17T12:00:00-05:00',
}

function setup() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(ReviewBookingModal, {
    props: {
      open: true,
      bookingId: 12,
      counterpartName: 'Juan Castaño',
    },
    global: {
      plugins: [pinia, PiniaColada],
      stubs: { teleport: true },
    },
  })
  const submit = () =>
    wrapper.findAll('button').find((b) => b.text().includes('Enviar calificación'))!

  return { wrapper, submit }
}

describe('ReviewBookingModal', () => {
  it('renders modal with counterpart name and rating options', () => {
    const { wrapper } = setup()

    expect(wrapper.text()).toContain('Calificar servicio')
    expect(wrapper.text()).toContain('Juan Castaño')
    expect(wrapper.text()).toContain('Excelente')
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('submits review successfully and closes modal', async () => {
    vi.mocked(bookingsApi.review).mockResolvedValue({
      success: true,
      message: 'Calificación enviada correctamente.',
      data: mockReview,
    })

    const { wrapper } = setup()

    const textarea = wrapper.get('textarea')
    await textarea.setValue('Muy cumplido y profesional.')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() => {
      expect(bookingsApi.review).toHaveBeenCalledWith(12, {
        rating: 5,
        comment: 'Muy cumplido y profesional.',
      })
    })

    expect(wrapper.emitted('update:open')?.slice(-1)[0]).toEqual([false])
    expect(wrapper.emitted('reviewed')).toBeDefined()
  })

  it('displays server error when review fails', async () => {
    vi.mocked(bookingsApi.review).mockRejectedValue(
      new ApiError('Ya calificaste esta reserva.', 409),
    )

    const { wrapper } = setup()

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Ya calificaste esta reserva.')
    })
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })
})
