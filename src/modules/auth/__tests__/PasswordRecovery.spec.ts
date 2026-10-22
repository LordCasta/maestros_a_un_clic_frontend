import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'

import { authApi } from '../api'
import ForgotPasswordForm from '../components/ForgotPasswordForm.vue'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'

type Api = typeof authApi

vi.mock('../api', () => ({
  authApi: {
    forgotPassword: vi.fn<Api['forgotPassword']>(),
    resetPassword: vi.fn<Api['resetPassword']>(),
    login: vi.fn<Api['login']>(),
    logout: vi.fn<Api['logout']>(),
    me: vi.fn<Api['me']>(),
    registerClient: vi.fn<Api['registerClient']>(),
    registerProfessional: vi.fn<Api['registerProfessional']>(),
  },
}))

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: { template: '<div />' },
      },
      {
        path: '/reset-password',
        name: 'reset-password',
        component: { template: '<div />' },
      },
    ],
  })
}

describe('ForgotPasswordForm (HU020)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('renders email input and submit button', () => {
    const router = createTestRouter()
    const wrapper = mount(ForgotPasswordForm, {
      global: { plugins: [router] },
    })

    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toContain('Enviar enlace de recuperación')
  })

  it('validates email on empty submit', async () => {
    const router = createTestRouter()
    const wrapper = mount(ForgotPasswordForm, {
      global: { plugins: [router] },
    })

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() => {
      expect(authApi.forgotPassword).not.toHaveBeenCalled()
      expect(wrapper.text()).toContain('Ingresa tu correo electrónico.')
    })
  })

  it('sends reset link and displays success message', async () => {
    vi.mocked(authApi.forgotPassword).mockResolvedValueOnce({
      success: true,
      message:
        'Si el correo está registrado, te enviamos el enlace para restablecer tu contraseña.',
      data: null,
    })

    const router = createTestRouter()
    const wrapper = mount(ForgotPasswordForm, {
      global: { plugins: [router] },
    })

    await wrapper.find('input[type="email"]').setValue('usuario@example.com')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() => {
      expect(authApi.forgotPassword).toHaveBeenCalledWith({ email: 'usuario@example.com' })
      expect(wrapper.text()).toContain(
        'Si el correo está registrado, te enviamos el enlace para restablecer tu contraseña.',
      )
    })
  })

  it('displays error alert on server error', async () => {
    vi.mocked(authApi.forgotPassword).mockRejectedValueOnce(
      new ApiError('No encontramos un usuario con ese correo electrónico.', 422, {
        email: ['No encontramos un usuario con ese correo electrónico.'],
      }),
    )

    const router = createTestRouter()
    const wrapper = mount(ForgotPasswordForm, {
      global: { plugins: [router] },
    })

    await wrapper.find('input[type="email"]').setValue('noexiste@example.com')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('No encontramos un usuario con ese correo electrónico.')
    })
  })
})

describe('ResetPasswordForm (HU020)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('displays warning when token or email query parameters are missing', async () => {
    const router = createTestRouter()
    await router.push({ name: 'reset-password' })
    await router.isReady()

    const wrapper = mount(ResetPasswordForm, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('Enlace inválido o incompleto')
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('renders form when token and email are provided in route', async () => {
    const router = createTestRouter()
    await router.push({
      name: 'reset-password',
      query: { token: 'token123', email: 'usuario@example.com' },
    })
    await router.isReady()

    const wrapper = mount(ResetPasswordForm, {
      global: { plugins: [router] },
    })

    expect(wrapper.find('form').exists()).toBe(true)
    const emailInput = wrapper.find('input[type="email"]')
    expect(emailInput.exists()).toBe(true)
    expect((emailInput.element as HTMLInputElement).value).toBe('usuario@example.com')
  })

  it('submits new password to authApi and redirects to login with toast', async () => {
    vi.mocked(authApi.resetPassword).mockResolvedValueOnce({
      success: true,
      message: 'Tu contraseña fue restablecida.',
      data: null,
    })

    const router = createTestRouter()
    await router.push({
      name: 'reset-password',
      query: { token: 'token123', email: 'usuario@example.com' },
    })
    await router.isReady()

    const toast = useToastStore()
    const toastSpy = vi.spyOn(toast, 'success')
    const replaceSpy = vi.spyOn(router, 'replace')

    const wrapper = mount(ResetPasswordForm, {
      global: { plugins: [router] },
    })

    const [pwdInput, confirmInput] = wrapper.findAll('input[autocomplete="new-password"]')
    await pwdInput!.setValue('NuevaClaveSegura123!')
    await confirmInput!.setValue('NuevaClaveSegura123!')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() => {
      expect(authApi.resetPassword).toHaveBeenCalledWith({
        token: 'token123',
        email: 'usuario@example.com',
        password: 'NuevaClaveSegura123!',
        password_confirmation: 'NuevaClaveSegura123!',
      })
      expect(toastSpy).toHaveBeenCalledWith('Tu contraseña fue restablecida.')
      expect(replaceSpy).toHaveBeenCalledWith({ name: 'login' })
    })
  })
})
