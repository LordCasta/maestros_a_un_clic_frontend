import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth'
import type { Favorite, User } from '@/shared/types/models'

import { favoritesApi } from '../api'
import FavoriteButton from '../components/FavoriteButton.vue'

type Api = typeof favoritesApi

/*
 * Test de referencia para componentes que usan datos del servidor:
 * se mockea el objeto `<modulo>Api` y se monta con Pinia, Pinia Colada y un router de memoria.
 */
vi.mock('../api', () => ({
  favoritesApi: {
    list: vi.fn<Api['list']>(),
    add: vi.fn<Api['add']>(),
    remove: vi.fn<Api['remove']>(),
  },
}))

const favorite = (professionalId: number): Favorite =>
  ({ id: 1, professional: { id: professionalId }, created_at: '' }) as Favorite

function setup(role: User['role'] | null) {
  const pinia = createPinia()
  setActivePinia(pinia)
  if (role) {
    const auth = useAuthStore()
    auth.token = 'token'
    auth.user = { id: 9, name: 'Camila', role } as User
  }

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } },
    ],
  })

  const wrapper = mount(FavoriteButton, {
    props: { professionalId: 5 },
    global: { plugins: [pinia, PiniaColada, router] },
  })

  return { wrapper, router }
}

describe('FavoriteButton', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(favoritesApi.list).mockResolvedValue({ success: true, message: null, data: [] })
    vi.mocked(favoritesApi.add).mockResolvedValue({
      success: true,
      message: 'Agregado a favoritos.',
      data: favorite(5),
    })
  })

  it('sends guests to the login page', async () => {
    const { wrapper, router } = setup(null)

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('login')
    expect(favoritesApi.add).not.toHaveBeenCalled()
  })

  it('is hidden for professionals', () => {
    const { wrapper } = setup('professional')

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('adds the professional for a client and reflects the new state', async () => {
    const { wrapper } = setup('client')
    await flushPromises()
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false')

    vi.mocked(favoritesApi.list).mockResolvedValue({
      success: true,
      message: null,
      data: [favorite(5)],
    })
    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(favoritesApi.add).toHaveBeenCalledWith(5)
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true')
  })
})
