import { PiniaColada } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth'
import type { ApiPaginated } from '@/shared/types/api'
import type { NotificationItem, User } from '@/shared/types/models'

import { notificationsApi } from '../api'
import NotificationBell from '../components/NotificationBell.vue'

type Api = typeof notificationsApi

vi.mock('../api', () => ({
  notificationsApi: {
    list: vi.fn<Api['list']>(),
    markAsRead: vi.fn<Api['markAsRead']>(),
    markAllAsRead: vi.fn<Api['markAllAsRead']>(),
  },
}))
vi.mock('@/shared/realtime/echo', () => ({ getRealtime: () => null }))

const item = (id: string, overrides: Partial<NotificationItem> = {}): NotificationItem => ({
  id,
  type: 'booking.requested',
  booking_id: 42,
  title: 'Nueva solicitud de reserva',
  body: 'Camila Restrepo solicitó «Reparación de fugas».',
  read_at: null,
  created_at: '2026-10-16T10:20:00-05:00',
  ...overrides,
})

const page = (data: NotificationItem[], total = data.length): ApiPaginated<NotificationItem> => ({
  success: true,
  message: null,
  data,
  meta: { current_page: 1, last_page: 1, per_page: 20, total },
})

async function mountBell(items: NotificationItem[], unread: number) {
  vi.mocked(notificationsApi.list).mockImplementation(async (query) =>
    query?.unread ? page([], unread) : page(items),
  )
  const pinia = createPinia()
  setActivePinia(pinia)
  const auth = useAuthStore()
  auth.token = 'token'
  auth.user = { id: 5, name: 'Juan', role: 'professional' } as User

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      {
        path: '/professional/bookings/:id',
        name: 'professional-booking-detail',
        component: { template: '<div />' },
      },
    ],
  })
  await router.push('/')
  const wrapper = mount(NotificationBell, {
    global: { plugins: [pinia, PiniaColada, router] },
    attachTo: document.body,
  })
  await flushPromises()
  return { wrapper, router }
}

describe('NotificationBell', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the unread count and the list', async () => {
    const { wrapper } = await mountBell(
      [item('a'), item('b', { read_at: '2026-10-16T11:00:00-05:00' })],
      1,
    )

    expect(wrapper.get('[data-test="badge"]').text()).toBe('1')

    await wrapper.get('button[aria-haspopup]').trigger('click')
    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.text()).toContain('Nueva solicitud de reserva')
    wrapper.unmount()
  })

  it('marks a notification as read and opens its booking', async () => {
    vi.mocked(notificationsApi.markAsRead).mockResolvedValue({
      success: true,
      message: null,
      data: item('a', { read_at: '2026-10-16T11:00:00-05:00' }),
    })
    const { wrapper, router } = await mountBell([item('a')], 1)

    await wrapper.get('button[aria-haspopup]').trigger('click')
    await wrapper.get('li button').trigger('click')
    await flushPromises()

    expect(notificationsApi.markAsRead).toHaveBeenCalledWith('a')
    expect(router.currentRoute.value.fullPath).toBe('/professional/bookings/42')
    wrapper.unmount()
  })

  it('marks all as read', async () => {
    vi.mocked(notificationsApi.markAllAsRead).mockResolvedValue({
      success: true,
      message: 'Notificaciones marcadas como leídas.',
      data: { marked: 2 },
    })
    const { wrapper } = await mountBell([item('a'), item('b')], 2)

    await wrapper.get('button[aria-haspopup]').trigger('click')
    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Marcar todas como leídas')!
      .trigger('click')
    await flushPromises()

    expect(notificationsApi.markAllAsRead).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('says so when there are no notifications', async () => {
    const { wrapper } = await mountBell([], 0)

    expect(wrapper.find('[data-test="badge"]').exists()).toBe(false)
    await wrapper.get('button[aria-haspopup]').trigger('click')
    expect(wrapper.text()).toContain('No tienes notificaciones todavía.')
    wrapper.unmount()
  })
})
