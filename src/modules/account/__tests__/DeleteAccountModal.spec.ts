import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useToastStore } from '@/shared/stores/toast'

import { accountApi } from '../api'
import DeleteAccountModal from '../components/DeleteAccountModal.vue'

vi.mock('../api', () => ({
  accountApi: {
    deleteAccount: vi.fn<(payload: { current_password: string }) => Promise<unknown>>(),
  },
}))

const mockPush = vi.fn<(to: unknown) => void>()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

function setup(props = { open: true }) {
  const pinia = createPinia()
  setActivePinia(pinia)

  const wrapper = mount(DeleteAccountModal, {
    props,
    global: {
      plugins: [pinia],
      stubs: { teleport: true },
    },
  })

  return { wrapper, toast: useToastStore() }
}

describe('DeleteAccountModal (HU023)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal with warning and password input when open is true', () => {
    const { wrapper } = setup({ open: true })

    expect(wrapper.text()).toContain('Eliminar cuenta')
    expect(wrapper.text()).toContain('Esta acción es irreversible')
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('requires password before calling deleteAccount', async () => {
    const { wrapper } = setup({ open: true })

    const confirmBtn = wrapper.findAll('button').find((btn) => btn.text().includes('Confirmar'))
    expect(confirmBtn).toBeDefined()
    await confirmBtn?.trigger('click')
    await flushPromises()

    expect(accountApi.deleteAccount).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Debes ingresar tu contraseña actual.')
  })

  it('calls deleteAccount and triggers toast on submit', async () => {
    const { wrapper, toast } = setup({ open: true })
    const toastSpy = vi.spyOn(toast, 'info')
    vi.mocked(accountApi.deleteAccount).mockResolvedValueOnce({
      success: true,
      data: null,
      message: 'Cuenta eliminada',
    })

    const input = wrapper.find('input[type="password"]')
    await input.setValue('MiClave123!')

    const confirmBtn = wrapper.findAll('button').find((btn) => btn.text().includes('Confirmar'))
    await confirmBtn?.trigger('click')
    await flushPromises()

    expect(accountApi.deleteAccount).toHaveBeenCalledWith({
      current_password: 'MiClave123!',
    })
    expect(toastSpy).toHaveBeenCalledWith('Tu cuenta ha sido eliminada correctamente.')
    expect(mockPush).toHaveBeenCalledWith({ name: 'home' })
  })
})
