import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import type { ApiPaginated } from '@/shared/types/api'
import type { Booking } from '@/shared/types/models'

import { bookingsApi } from '../api'
import BookingList from '../components/BookingList.vue'

vi.mock('../api', () => ({
  bookingsApi: { list: vi.fn<(typeof bookingsApi)['list']>() },
}))

const empty: ApiPaginated<Booking> = {
  success: true,
  message: null,
  data: [],
  meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 },
}

function mountList(initialFilter?: string) {
  vi.mocked(bookingsApi.list).mockResolvedValue(empty)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', name: 'search', component: { template: '<div />' } }],
  })
  return mount(BookingList, {
    props: { viewer: 'professional', initialFilter },
    global: { plugins: [createPinia(), PiniaColada, router] },
  })
}

describe('BookingList', () => {
  it('filters by the statuses of the chosen tab', async () => {
    const wrapper = mountList()
    await flushPromises()

    expect(bookingsApi.list).toHaveBeenLastCalledWith({ page: 1, status: [] })

    await wrapper
      .findAll('[role="tab"]')
      .find((tab) => tab.text() === 'Canceladas')!
      .trigger('click')
    await flushPromises()

    expect(bookingsApi.list).toHaveBeenLastCalledWith({
      page: 1,
      status: ['cancelled', 'rejected'],
    })
    expect(wrapper.text()).toContain('No tienes reservas en «Canceladas»')
  })

  it('can start on a given filter', async () => {
    mountList('in-progress')
    await flushPromises()

    expect(bookingsApi.list).toHaveBeenLastCalledWith({ page: 1, status: ['in_progress'] })
  })
})
