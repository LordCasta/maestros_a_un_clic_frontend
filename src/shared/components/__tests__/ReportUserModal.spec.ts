import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { http } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'

import ReportUserModal from '../ReportUserModal.vue'

vi.mock('@/shared/http/client', () => ({
  http: {
    post: vi.fn<(path: string, body?: unknown) => Promise<unknown>>(),
  },
}))

function setup(props = { open: true, reportedUserId: 42, reportedUserName: 'Juan Maestro' }) {
  const pinia = createPinia()
  setActivePinia(pinia)

  const wrapper = mount(ReportUserModal, {
    props,
    global: {
      plugins: [pinia],
      stubs: { teleport: true },
    },
  })

  return { wrapper, toast: useToastStore() }
}

describe('ReportUserModal (HU024)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal with reported user name', () => {
    const { wrapper } = setup()

    expect(wrapper.text()).toContain('Reportar a Juan Maestro')
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('validates reason and description length before submitting', async () => {
    const { wrapper } = setup()

    const submitBtn = wrapper.findAll('button').find((btn) => btn.text().includes('Enviar reporte'))
    await submitBtn?.trigger('click')
    await flushPromises()

    expect(http.post).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Por favor selecciona un motivo.')
  })

  it('submits report and displays success toast', async () => {
    const { wrapper, toast } = setup()
    const toastSpy = vi.spyOn(toast, 'success')
    vi.mocked(http.post).mockResolvedValueOnce({
      data: { id: 1, reason: 'Sospecha de fraude' },
      message: 'Reporte enviado',
    })

    await wrapper.find('select').setValue('Sospecha de fraude')
    await wrapper.find('textarea').setValue('El usuario solicitó dinero por fuera de la app.')

    const submitBtn = wrapper.findAll('button').find((btn) => btn.text().includes('Enviar reporte'))
    await submitBtn?.trigger('click')
    await flushPromises()

    expect(http.post).toHaveBeenCalledWith('/reports', {
      reported_user_id: 42,
      booking_id: null,
      reason: 'Sospecha de fraude',
      description: 'El usuario solicitó dinero por fuera de la app.',
    })
    expect(toastSpy).toHaveBeenCalledWith(
      'Reporte enviado. Nuestro equipo de moderación revisará el caso.',
    )
  })
})
