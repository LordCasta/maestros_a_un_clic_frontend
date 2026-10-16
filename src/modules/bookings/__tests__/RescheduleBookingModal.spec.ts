import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { ApiError } from '@/shared/http/client'
import type { Booking } from '@/shared/types/models'

import { bookingsApi } from '../api'
import RescheduleBookingModal from '../components/RescheduleBookingModal.vue'

vi.mock('../api', () => ({
  bookingsApi: { reschedule: vi.fn<(typeof bookingsApi)['reschedule']>() },
}))

const NEW_TIME = '2026-10-21T15:00:00-05:00'

// El selector real consulta la agenda; aquí basta con un botón que elige una hora.
const SlotPickerStub = defineComponent({
  props: { modelValue: { type: String, default: null }, professionalId: Number, serviceId: Number },
  emits: ['update:modelValue'],
  setup:
    (props, { emit }) =>
    () =>
      h('button', { 'data-test': 'slot', onClick: () => emit('update:modelValue', NEW_TIME) }, [
        `slots de ${props.professionalId}/${props.serviceId}`,
      ]),
})

const booking = {
  id: 8,
  status: 'confirmed',
  starts_at: '2026-10-20T10:00:00-05:00',
  professional: { id: 5 },
  service: { id: 9 },
} as Booking

function setup() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(RescheduleBookingModal, {
    props: { open: true, booking },
    global: {
      plugins: [pinia, PiniaColada],
      stubs: { teleport: true, SlotPicker: SlotPickerStub },
    },
  })
  const submit = () => wrapper.findAll('button').find((b) => b.text() === 'Reprogramar')!

  return { wrapper, submit }
}

describe('RescheduleBookingModal', () => {
  it('shows the free times of the same professional and service', () => {
    const { wrapper, submit } = setup()

    expect(wrapper.get('[data-test="slot"]').text()).toBe('slots de 5/9')
    expect(submit().attributes('disabled')).toBeDefined()
  })

  it('sends the chosen time and closes', async () => {
    vi.mocked(bookingsApi.reschedule).mockResolvedValue({
      success: true,
      message: 'Reserva reprogramada. El profesional debe aceptar el nuevo horario.',
      data: { ...booking, status: 'pending', starts_at: NEW_TIME },
    })
    const { wrapper, submit } = setup()

    await wrapper.get('[data-test="slot"]').trigger('click')
    await submit().trigger('click')
    await flushPromises()

    expect(bookingsApi.reschedule).toHaveBeenCalledWith(8, NEW_TIME)
    expect(wrapper.emitted('update:open')?.slice(-1)[0]).toEqual([false])
  })

  it('stays open and explains when the time was just taken', async () => {
    vi.mocked(bookingsApi.reschedule).mockImplementation(async () => {
      throw new ApiError('El profesional ya tiene una reserva en ese horario.', 409)
    })
    const { wrapper, submit } = setup()

    await wrapper.get('[data-test="slot"]').trigger('click')
    await submit().trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('El profesional ya tiene una reserva en ese horario.')
    expect(wrapper.emitted('update:open')).toBeUndefined()
    expect(submit().attributes('disabled')).toBeDefined()
  })
})
