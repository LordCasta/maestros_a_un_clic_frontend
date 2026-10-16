import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ApiSuccess } from '@/shared/types/api'
import type { ProfessionalSlots } from '@/shared/types/models'

import { scheduleApi } from '../api'
import SlotPicker from '../components/SlotPicker.vue'

vi.mock('../api', () => ({
  scheduleApi: { slots: vi.fn<(typeof scheduleApi)['slots']>() },
}))

const response = (startsAt: string[]): ApiSuccess<ProfessionalSlots> => ({
  success: true,
  message: null,
  data: {
    date: '2026-10-17',
    service_id: 9,
    duration_minutes: 60,
    slots: startsAt.map((starts_at) => ({ starts_at, ends_at: starts_at })),
  },
})

function mountPicker(serviceId: number | null) {
  return mount(SlotPicker, {
    props: { professionalId: 5, serviceId, modelValue: null },
    global: { plugins: [createPinia(), PiniaColada] },
  })
}

describe('SlotPicker', () => {
  beforeEach(() => vi.mocked(scheduleApi.slots).mockReset())

  it('asks for a service before loading the agenda', async () => {
    const wrapper = mountPicker(null)
    await flushPromises()

    expect(wrapper.text()).toContain('Elige un servicio')
    expect(scheduleApi.slots).not.toHaveBeenCalled()
  })

  it('shows the free times and selects one', async () => {
    vi.mocked(scheduleApi.slots).mockResolvedValue(
      response(['2026-10-17T08:00:00-05:00', '2026-10-17T08:30:00-05:00']),
    )
    const wrapper = mountPicker(9)
    await flushPromises()

    expect(scheduleApi.slots).toHaveBeenCalledWith(
      5,
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      9,
    )

    const times = wrapper.get('[aria-label="Hora"]').findAll('button')
    expect(times).toHaveLength(2)

    await times[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual([
      '2026-10-17T08:30:00-05:00',
    ])
  })

  it('says so when the day has no free times', async () => {
    vi.mocked(scheduleApi.slots).mockResolvedValue(response([]))
    const wrapper = mountPicker(9)
    await flushPromises()

    expect(wrapper.text()).toContain('No hay horas libres este día')
  })

  it('loads another day when it is chosen', async () => {
    vi.mocked(scheduleApi.slots).mockResolvedValue(response([]))
    const wrapper = mountPicker(9)
    await flushPromises()

    await wrapper.get('[aria-label="Día"]').findAll('button')[1]!.trigger('click')
    await flushPromises()

    const [first, second] = vi.mocked(scheduleApi.slots).mock.calls
    expect(second?.[1]).not.toBe(first?.[1])
  })
})
