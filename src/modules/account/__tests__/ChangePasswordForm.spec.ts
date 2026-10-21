import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'

import { accountApi } from '../api'
import ChangePasswordForm from '../components/ChangePasswordForm.vue'

type Api = typeof accountApi

vi.mock('../api', () => ({
  accountApi: {
    updatePassword: vi.fn<Api['updatePassword']>(),
  },
}))

function setup() {
  const pinia = createPinia()
  setActivePinia(pinia)

  const wrapper = mount(ChangePasswordForm, {
    global: {
      plugins: [pinia, PiniaColada],
    },
  })

  return { wrapper, toast: useToastStore() }
}

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all password inputs and submit button', () => {
    const { wrapper } = setup()

    expect(wrapper.find('input[autocomplete="current-password"]').exists()).toBe(true)
    expect(wrapper.findAll('input[autocomplete="new-password"]').length).toBe(2)
    expect(wrapper.find('button[type="submit"]').text()).toContain('Guardar nueva contraseña')
  })

  it('validates fields on empty submission without calling API', async () => {
    const { wrapper } = setup()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() => {
      expect(accountApi.updatePassword).not.toHaveBeenCalled()
      expect(wrapper.text()).toContain('Ingresa tu contraseña actual.')
      expect(wrapper.text()).toContain('La contraseña debe tener al menos 8 caracteres.')
    })
  })

  it('submits valid data to accountApi and triggers success toast', async () => {
    vi.mocked(accountApi.updatePassword).mockResolvedValueOnce({
      success: true,
      message: 'Contraseña actualizada correctamente.',
      data: null,
    })

    const { wrapper, toast } = setup()
    const toastSpy = vi.spyOn(toast, 'success')

    const currentInput = wrapper.find('input[autocomplete="current-password"]')
    const [newInput, confirmInput] = wrapper.findAll('input[autocomplete="new-password"]')

    await currentInput!.setValue('ClaveActual123!')
    await newInput!.setValue('NuevaClave456!')
    await confirmInput!.setValue('NuevaClave456!')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() => {
      expect(accountApi.updatePassword).toHaveBeenCalledWith({
        current_password: 'ClaveActual123!',
        password: 'NuevaClave456!',
        password_confirmation: 'NuevaClave456!',
      })
    })

    expect(toastSpy).toHaveBeenCalledWith('Contraseña actualizada correctamente.')
  })

  it('displays error alert when server returns validation error', async () => {
    vi.mocked(accountApi.updatePassword).mockRejectedValueOnce(
      new ApiError('La contraseña actual no es correcta.', 422, {
        current_password: ['La contraseña actual no es correcta.'],
      }),
    )

    const { wrapper } = setup()

    const currentInput = wrapper.find('input[autocomplete="current-password"]')
    const [newInput, confirmInput] = wrapper.findAll('input[autocomplete="new-password"]')

    await currentInput!.setValue('ClaveEquivocada123!')
    await newInput!.setValue('NuevaClave456!')
    await confirmInput!.setValue('NuevaClave456!')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('La contraseña actual no es correcta.')
    })
  })
})
