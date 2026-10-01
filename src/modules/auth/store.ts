import { defineStore } from 'pinia'

import { storage } from '@/services/storage'
import type { AuthSession, AuthUser } from '@/types'

type AuthState = {
  token: string | null
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: storage.getToken(),
    user: storage.getUser<AuthUser>(),
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    setSession(session: AuthSession) {
      this.token = session.token
      this.user = session.user
      storage.setToken(session.token)
      storage.setUser(session.user)
    },
    hydrate() {
      this.token = storage.getToken()
      this.user = storage.getUser<AuthUser>()
    },
    clearSession() {
      this.token = null
      this.user = null
      storage.clearAuth()
    },
    setLoading(value: boolean) {
      this.loading = value
    },
    setError(message: string | null) {
      this.error = message
    },
  },
})
