import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useToastStore } from '@/shared/stores/toast'
import type { Booking } from '@/shared/types/models'

import { bookingsApi } from '../api'
import ServiceProgressCard from '../components/ServiceProgressCard.vue'

type Api = typeof bookingsApi

vi.mock('../api', () => ({
  bookingsApi: { start: vi.fn<Api['start']>(), complete: vi.fn<Api['complete']>() },
}))

const booking = (overrides: Partial<Booking>) =>
  ({
    id: 3,
    status: 'confirmed',
    starts_at: '2026-10-20T10:00:00-05:00',
    started_at: null,
    ...overrides,
  }) as Booking

function setup(props: Booking) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(ServiceProgressCard, {
    props: { booking: props },
    // El modal se monta en línea para poder pulsar sus botones.
    global: { plugins: [pinia, PiniaColada], stubs: { teleport: true } },
  })
  const button = (label: string) => wrapper.findAll('button').find((b) => b.text().includes(label))

  return { wrapper, button, toast: useToastStore() }
}

describe('ServiceProgressCard', () => {
  afterEach(() => vi.useRealTimers())

  it('does not let the service start before the scheduled time', () => {
    vi.useFakeTimers({ now: new Date('2026-10-20T09:30:00-05:00') })
    const { wrapper, button } = setup(booking({}))

    expect(button('Iniciar servicio')?.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Podrás iniciar el servicio desde')
  })

  it('starts the service once it is time', async () => {
    vi.useFakeTimers({ now: new Date('2026-10-20T10:05:00-05:00'), shouldAdvanceTime: true })
    vi.mocked(bookingsApi.start).mockResolvedValue({
      success: true,
      message: 'Servicio iniciado.',
      data: booking({ status: 'in_progress' }),
    })
    const { button, toast } = setup(booking({}))

    await button('Iniciar servicio')!.trigger('click')
    await flushPromises()

    expect(bookingsApi.start).toHaveBeenCalledWith(3)
    expect(toast.toasts[toast.toasts.length - 1]?.message).toBe('Servicio iniciado.')
  })

  it('asks before completing the service', async () => {
    vi.mocked(bookingsApi.complete).mockResolvedValue({
      success: true,
      message: 'Servicio finalizado.',
      data: booking({ status: 'completed' }),
    })
    const { button } = setup(
      booking({ status: 'in_progress', started_at: '2026-10-20T10:05:00-05:00' }),
    )

    await button('Finalizar servicio')!.trigger('click')
    expect(bookingsApi.complete).not.toHaveBeenCalled()

    await button('Sí, finalizar')!.trigger('click')
    await flushPromises()

    expect(bookingsApi.complete).toHaveBeenCalledWith(3)
  })
})
