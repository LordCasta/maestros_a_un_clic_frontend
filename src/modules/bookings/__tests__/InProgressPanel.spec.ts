import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth'
import type { ApiPaginated } from '@/shared/types/api'
import type { Booking, User } from '@/shared/types/models'

import { bookingsApi } from '../api'
import InProgressPanel from '../components/InProgressPanel.vue'

vi.mock('../api', () => ({
  bookingsApi: { list: vi.fn<(typeof bookingsApi)['list']>() },
}))

const page = (data: Booking[]): ApiPaginated<Booking> => ({
  success: true,
  message: null,
  data,
  meta: { current_page: 1, last_page: 1, per_page: 15, total: data.length },
})

const inProgress = {
  id: 12,
  status: 'in_progress',
  started_at: '2026-10-20T10:05:00-05:00',
  service: { title: 'Reparación de fugas' },
  client: { id: 3, name: 'Camila Restrepo', avatar_url: null },
  professional: { id: 5, name: 'Juan Castaño', avatar_url: null },
} as Booking

async function mountPanel(role: User['role'], bookings: Booking[]) {
  vi.mocked(bookingsApi.list).mockResolvedValue(page(bookings))
  const pinia = createPinia()
  setActivePinia(pinia)
  const auth = useAuthStore()
  auth.token = 'token'
  auth.user = { id: 5, name: 'Juan', role } as User

  const stub = { template: '<div />' }
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/p/bookings', name: 'professional-bookings', component: stub },
      { path: '/p/bookings/:id', name: 'professional-booking-detail', component: stub },
      { path: '/c/bookings', name: 'client-bookings', component: stub },
      { path: '/c/bookings/:id', name: 'client-booking-detail', component: stub },
    ],
  })
  const wrapper = mount(InProgressPanel, { global: { plugins: [pinia, PiniaColada, router] } })
  await flushPromises()
  return wrapper
}

describe('InProgressPanel', () => {
  it('lists the services in progress with the other party and a link to the detail', async () => {
    const wrapper = await mountPanel('professional', [inProgress])

    expect(bookingsApi.list).toHaveBeenCalledWith({ page: 1, status: ['in_progress'] })
    expect(wrapper.text()).toContain('Reparación de fugas')
    expect(wrapper.text()).toContain('Camila Restrepo')
    expect(wrapper.text()).toContain('En proceso')
    expect(wrapper.find('a[href="/p/bookings/12"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/p/bookings?filtro=in-progress"]').exists()).toBe(true)
  })

  it('shows the professional to the client', async () => {
    const wrapper = await mountPanel('client', [inProgress])

    expect(wrapper.text()).toContain('Juan Castaño')
    expect(wrapper.find('a[href="/c/bookings/12"]').exists()).toBe(true)
  })

  it('says so when nothing is in progress', async () => {
    const wrapper = await mountPanel('client', [])

    expect(wrapper.text()).toContain('No tienes servicios en curso')
  })
})
