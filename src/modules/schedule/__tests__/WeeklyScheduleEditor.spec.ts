import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import type { ProfessionalAvailability } from '@/shared/types/models'

import { scheduleApi } from '../api'
import WeeklyScheduleEditor from '../components/WeeklyScheduleEditor.vue'

vi.mock('../api', () => ({
  scheduleApi: { updateRules: vi.fn<(typeof scheduleApi)['updateRules']>() },
}))

const availability: ProfessionalAvailability = {
  buffer_minutes: 30,
  rules: [{ id: 1, weekday: 1, start_time: '08:00', end_time: '12:00' }],
  blocks: [],
}

function setup() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(WeeklyScheduleEditor, {
    props: { availability },
    global: { plugins: [pinia, PiniaColada] },
  })
  const saveButton = () => wrapper.findAll('button').find((b) => b.text() === 'Guardar horario')!

  return { wrapper, saveButton }
}

describe('WeeklyScheduleEditor', () => {
  it('only lets you save after a change', async () => {
    const { wrapper, saveButton } = setup()

    expect(saveButton().attributes('disabled')).toBeDefined()

    await wrapper.get('[aria-label="Atiendo los martes"]').trigger('click')

    expect(saveButton().attributes('disabled')).toBeUndefined()
  })

  it('saves the whole week with the rest time', async () => {
    vi.mocked(scheduleApi.updateRules).mockResolvedValue({
      success: true,
      message: 'Horario guardado.',
      data: availability,
    })
    const { wrapper, saveButton } = setup()

    // Activar el martes agrega la franja por defecto de 08:00 a 17:00.
    await wrapper.get('[aria-label="Atiendo los martes"]').trigger('click')
    await saveButton().trigger('click')
    await flushPromises()

    expect(scheduleApi.updateRules).toHaveBeenCalledWith({
      buffer_minutes: 30,
      rules: [
        { weekday: 1, start_time: '08:00', end_time: '12:00' },
        { weekday: 2, start_time: '08:00', end_time: '17:00' },
      ],
    })
  })

  it('does not save overlapping ranges', async () => {
    const { wrapper, saveButton } = setup()

    await wrapper
      .findAll('button')
      .find((b) => b.text().includes('Agregar franja'))!
      .trigger('click')
    const [, , start, end] = wrapper.findAll('input[type="time"]')
    await start!.setValue('11:00')
    await end!.setValue('13:00')

    expect(wrapper.text()).toContain('Se cruza con otra franja del mismo día.')
    expect(saveButton().attributes('disabled')).toBeDefined()
  })
})
