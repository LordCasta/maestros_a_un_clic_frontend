import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { connectRealtime, disconnectRealtime } from '@/shared/realtime/echo'
import type { User } from '@/shared/types/models'

import { authApi, type Session } from './api'
import { sessionStorage } from './storage'

/**
 * Sesión del usuario. Es el único estado global de la app junto con los toasts:
 * los datos del servidor se manejan con queries de Pinia Colada en cada módulo.
 */
export const useAuthStore = defineStore('auth', () => {
  const saved = sessionStorage.load()
  const token = ref<string | null>(saved.token)
  const user = ref<User | null>(saved.user)

  const isAuthenticated = computed(() => token.value !== null && user.value !== null)
  const role = computed(() => user.value?.role ?? null)
  const isVerified = computed(() => user.value?.verification_status === 'approved')

  function start(session: Session) {
    token.value = session.token
    user.value = session.user
    sessionStorage.save(session.token, session.user)
    connectRealtime(session.token)
  }

  /** Cierra la sesión local sin llamar a la API (p. ej. tras un 401). */
  function clear() {
    token.value = null
    user.value = null
    sessionStorage.clear()
    disconnectRealtime()
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      clear()
    }
  }

  /** Vuelve a pedir el usuario (p. ej. tras verificar la identidad). */
  async function refreshUser() {
    const { data } = await authApi.me()
    user.value = data
    sessionStorage.saveUser(data)
  }

  if (token.value) connectRealtime(token.value)

  return { token, user, isAuthenticated, role, isVerified, start, clear, logout, refreshUser }
})
