import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import type { BookingStatusChange } from '@/shared/types/models'

import { bookingsApi } from '../api'
import BookingHistory from '../components/BookingHistory.vue'

vi.mock('../api', () => ({
  bookingsApi: { history: vi.fn<(typeof bookingsApi)['history']>() },
}))

const change = (overrides: Partial<BookingStatusChange>): BookingStatusChange => ({
  id: 1,
  from_status: 'pending',
  to_status: 'accepted',
  reason: null,
  previous_starts_at: null,
  changed_by: { id: 5, name: 'Juan Castaño' },
  created_at: '2026-10-16T10:31:00-05:00',
  ...overrides,
})

describe('BookingHistory', () => {
  it('lists every status change with who did it and why', async () => {
    vi.mocked(bookingsApi.history).mockResolvedValue({
      success: true,
      message: null,
      data: [
        change({
          id: 1,
          from_status: null,
          to_status: 'pending',
          changed_by: { id: 3, name: 'Camila' },
        }),
        change({ id: 2 }),
        change({
          id: 3,
          from_status: 'accepted',
          to_status: 'cancelled',
          reason: 'Me salió un viaje.',
        }),
        change({
          id: 4,
          from_status: 'confirmed',
          to_status: 'pending',
          previous_starts_at: '2026-10-18T09:00:00-05:00',
        }),
      ],
    })

    const wrapper = mount(BookingHistory, {
      props: { bookingId: 42 },
      global: { plugins: [createPinia(), PiniaColada] },
    })
    await flushPromises()

    expect(bookingsApi.history).toHaveBeenCalledWith(42)
    const items = wrapper.findAll('li').map((li) => li.text())
    expect(items).toHaveLength(4)
    expect(items[0]).toContain('Solicitud enviada')
    expect(items[0]).toContain('Camila')
    expect(items[1]).toContain('Aceptada')
    expect(items[2]).toContain('Cancelada')
    expect(items[2]).toContain('“Me salió un viaje.”')
    expect(items[3]).toContain('Reprogramada')
    expect(items[3]).toContain('Antes era el')
  })
})
