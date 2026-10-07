import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/modules/auth'
import type { User } from '@/shared/types/models'

import { router } from '../router'

function signIn(role: User['role']) {
  const auth = useAuthStore()
  auth.token = 'test-token'
  auth.user = { id: 1, name: 'Test', role } as User
}

describe('router guards', () => {
  beforeEach(async () => {
    // jsdom no implementa scrollTo (lo usa scrollBehavior del router).
    vi.stubGlobal('scrollTo', vi.fn())
    localStorage.clear()
    setActivePinia(createPinia())
    await router.push('/')
  })

  it('shows the home page at the root, not an empty layout', async () => {
    await router.push('/')

    const route = router.currentRoute.value
    expect(route.name).toBe('home')
    // El último registro coincidente es la página (no un layout padre sin hijo).
    expect(route.matched[route.matched.length - 1]?.name).toBe('home')
  })

  it('resolves every guest page inside its layout', () => {
    for (const [path, name] of [
      ['/login', 'login'],
      ['/register/client', 'register-client'],
      ['/register/professional', 'register-professional'],
    ]) {
      const route = router.resolve(path)
      expect(route.name).toBe(name)
      expect(route.matched).toHaveLength(2)
    }
  })

  it('sends guests to the login and remembers the requested page', async () => {
    await router.push('/client/favorites')

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/client/favorites')
  })

  it('keeps signed-in users out of the login page', async () => {
    signIn('client')
    await router.push('/login')

    expect(router.currentRoute.value.name).toBe('client-dashboard')
  })

  it('redirects a user to their own area when the role does not match', async () => {
    signIn('professional')
    await router.push('/client/bookings')

    expect(router.currentRoute.value.name).toBe('professional-dashboard')
  })

  it('lets a client open client pages', async () => {
    signIn('client')
    await router.push('/client/bookings')

    expect(router.currentRoute.value.name).toBe('client-bookings')
  })

  it('shows the not found page for unknown routes', async () => {
    await router.push('/does-not-exist')

    expect(router.currentRoute.value.name).toBe('not-found')
  })
})
