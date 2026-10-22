import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { computed } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import type { User } from '@/shared/types/models'

import { authApi } from '../api'
import RegisterProfessionalForm from '../components/RegisterProfessionalForm.vue'

vi.mock('../api', () => ({
  authApi: { registerProfessional: vi.fn<(typeof authApi)['registerProfessional']>() },
}))
vi.mock('@/modules/catalog', () => ({
  useCommunes: () => ({ options: computed(() => [{ value: 1, label: 'Popular' }]) }),
  useCategories: () => ({ rootOptions: computed(() => [{ value: 9, label: 'Plomería' }]) }),
}))

function mountForm() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } },
      {
        path: '/profesional',
        name: 'professional-dashboard',
        component: { template: '<div />' },
      },
    ],
  })
  return mount(RegisterProfessionalForm, { global: { plugins: [createPinia(), router] } })
}

describe('RegisterProfessionalForm', () => {
  it('sends the fields of both steps when creating the profile', async () => {
    vi.mocked(authApi.registerProfessional).mockResolvedValue({
      success: true,
      message: 'Cuenta creada.',
      data: { user: { id: 20, role: 'professional' } as User, token: 'token' },
    })
    const wrapper = mountForm()

    // Paso 1: la cuenta.
    await wrapper.find('input[autocomplete="name"]').setValue('Juan Castaño')
    await wrapper.find('input[type="email"]').setValue('juan@maestros.test')
    await wrapper.find('select').setValue(1)
    const [password, confirmation] = wrapper.findAll('input[type="password"]')
    await password!.setValue('password123')
    await confirmation!.setValue('password123')
    await wrapper.find('form').trigger('submit')
    await vi.waitFor(() => expect(wrapper.text()).toContain('Especialidades'))

    // Paso 2: el perfil profesional.
    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Plomería')!
      .trigger('click')
    const [years, rate] = wrapper.findAll('input[type="number"]')
    await years!.setValue('5')
    await rate!.setValue('40000')
    await wrapper
      .find('textarea')
      .setValue('Plomero con experiencia en fugas, redes de agua y baños.')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() =>
      expect(authApi.registerProfessional).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Juan Castaño',
          email: 'juan@maestros.test',
          commune_id: 1,
          password: 'password123',
          password_confirmation: 'password123',
          category_ids: [9],
          experience_years: 5,
          hourly_rate: 40000,
        }),
      ),
    )
  })
})
