import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import type { Booking, Earnings } from '@/shared/types/models'

import { professionalProfileApi } from '../api'
import EarningsView from '../views/EarningsView.vue'

vi.mock('../api', () => ({
  professionalProfileApi: { earnings: vi.fn<(typeof professionalProfileApi)['earnings']>() },
}))

const earnings = (overrides: Partial<Earnings> = {}): Earnings => ({
  from: '2026-10-01',
  to: '2026-10-20',
  total: 250000,
  count: 2,
  average: 125000,
  by_day: [],
  bookings: [
    {
      id: 42,
      agreed_price: 200000,
      completed_at: '2026-10-02T12:00:00-05:00',
      service: { title: 'Reparación de fugas' },
      client: { id: 3, name: 'Camila Restrepo', avatar_url: null },
    } as Booking,
  ],
  ...overrides,
})

async function mountView(data: Earnings) {
  vi.mocked(professionalProfileApi.earnings).mockResolvedValue({
    success: true,
    message: null,
    data,
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/b/:id', name: 'professional-booking-detail', component: { template: '<div />' } },
    ],
  })
  const wrapper = mount(EarningsView, { global: { plugins: [createPinia(), PiniaColada, router] } })
  await flushPromises()
  return wrapper
}

describe('EarningsView', () => {
  afterEach(() => vi.useRealTimers())

  it('shows the totals and the services of the current month', async () => {
    vi.useFakeTimers({ now: new Date('2026-10-20T17:00:00Z'), shouldAdvanceTime: true })
    const wrapper = await mountView(earnings())

    expect(professionalProfileApi.earnings).toHaveBeenCalledWith('2026-10-01', '2026-10-20')
    expect(wrapper.text()).toContain('Servicios finalizados')
    expect(wrapper.text()).toContain('Reparación de fugas')
    expect(wrapper.find('a[href="/b/42"]').exists()).toBe(true)
  })

  it('asks for another range with the quick filters', async () => {
    vi.useFakeTimers({ now: new Date('2026-10-20T17:00:00Z'), shouldAdvanceTime: true })
    const wrapper = await mountView(earnings())

    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Mes pasado')!
      .trigger('click')
    await flushPromises()

    expect(professionalProfileApi.earnings).toHaveBeenLastCalledWith('2026-09-01', '2026-09-30')
  })

  it('says so when there are no earnings', async () => {
    const wrapper = await mountView(earnings({ total: 0, count: 0, average: 0, bookings: [] }))

    expect(wrapper.text()).toContain('Sin ingresos en estas fechas')
  })
})
