import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useAuthStore } from '@/modules/auth'
import { useToastStore } from '@/shared/stores/toast'
import type { User } from '@/shared/types/models'

import { accountApi } from '../api'
import ManualLocationForm from '../components/ManualLocationForm.vue'

type Api = typeof accountApi

vi.mock('../api', () => ({
  accountApi: {
    updateProfile: vi.fn<Api['updateProfile']>(),
    updatePassword: vi.fn<Api['updatePassword']>(),
  },
}))

vi.mock('@/modules/catalog', () => ({
  useCommunes: () => ({
    options: ref([
      { value: 14, label: 'El Poblado' },
      { value: 11, label: 'Laureles-Estadio' },
    ]),
    data: ref([]),
  }),
}))

const mockUser: User = {
  id: 1,
  name: 'Cliente Prueba',
  email: 'cliente@maestros.test',
  phone: '3001234567',
  avatar_url: null,
  role: 'client',
  commune: { id: 14, code: '14', name: 'El Poblado', type: 'comuna' },
  address: 'Calle 10 # 43E-12',
  latitude: 6.2089,
  longitude: -75.5682,
  verification_status: 'approved',
  rating: { average: 5, count: 2 },
  created_at: '2026-01-01T00:00:00-05:00',
}

function setup(user: User | null = mockUser) {
  const pinia = createPinia()
  setActivePinia(pinia)

  const auth = useAuthStore()
  auth.user = user ? { ...user } : null
  vi.spyOn(auth, 'refreshUser').mockResolvedValue()

  const wrapper = mount(ManualLocationForm, {
    global: {
      plugins: [pinia, PiniaColada],
      stubs: {
        GoogleMapsEmbed: true,
      },
    },
  })

  return { wrapper, auth, toast: useToastStore() }
}

describe('ManualLocationForm (HU022)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders select for commune and address input with initial values', () => {
    const { wrapper } = setup()

    expect(wrapper.find('select').exists()).toBe(true)
    const addressInput = wrapper.find('input[placeholder="Ej: Calle 10 # 43E-12, El Poblado"]')
    expect(addressInput.exists()).toBe(true)
    expect((addressInput.element as HTMLInputElement).value).toBe('Calle 10 # 43E-12')
    expect(wrapper.find('button[type="submit"]').text()).toContain('Guardar ubicación')
  })

  it('submits updated location successfully and updates auth user and shows toast', async () => {
    const updatedUser: User = {
      ...mockUser,
      address: 'Circular 1 # 70-30',
      commune: { id: 11, code: '11', name: 'Laureles-Estadio', type: 'comuna' },
    }

    vi.mocked(accountApi.updateProfile).mockResolvedValueOnce({
      success: true,
      message: 'Ubicación actualizada correctamente.',
      data: updatedUser,
    })

    const { wrapper, auth, toast } = setup()
    const toastSpy = vi.spyOn(toast, 'success')

    const addressInput = wrapper.find('input[placeholder="Ej: Calle 10 # 43E-12, El Poblado"]')
    await addressInput.setValue('Circular 1 # 70-30')

    const select = wrapper.find('select')
    await select.setValue('11')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() => {
      expect(accountApi.updateProfile).toHaveBeenCalledWith({
        address: 'Circular 1 # 70-30',
        commune_id: 11,
        latitude: 6.2089,
        longitude: -75.5682,
      })
    })

    expect(auth.refreshUser).toHaveBeenCalled()
    expect(toastSpy).toHaveBeenCalledWith('Ubicación actualizada correctamente.')
  })

  it('validates that at least address or commune is provided', async () => {
    const emptyUser: User = {
      ...mockUser,
      address: null,
      commune: null,
    }

    const { wrapper } = setup(emptyUser)

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() => {
      expect(accountApi.updateProfile).not.toHaveBeenCalled()
      expect(wrapper.text()).toContain('Ingresa una dirección o selecciona tu comuna.')
    })
  })
})
