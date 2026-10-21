import { onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth'
import { useToastStore } from '@/shared/stores/toast'

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000 // 15 minutos (HU050)

export function useInactivityTimer() {
  const auth = useAuthStore()
  const toast = useToastStore()
  const router = useRouter()
  let timer: ReturnType<typeof setTimeout> | null = null

  function resetTimer() {
    if (timer) clearTimeout(timer)
    if (!auth.isAuthenticated) return

    timer = setTimeout(async () => {
      if (auth.isAuthenticated) {
        await auth.logout()
        toast.warning('Tu sesión ha expirado por inactividad (15 minutos).')
        router.push({ name: 'login' })
      }
    }, INACTIVITY_TIMEOUT_MS)
  }

  const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']

  function handleActivity() {
    resetTimer()
  }

  onMounted(() => {
    events.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }))
    resetTimer()
  })

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
    events.forEach((event) => window.removeEventListener(event, handleActivity))
  })

  watch(
    () => auth.isAuthenticated,
    (isAuth) => {
      if (isAuth) {
        resetTimer()
      } else if (timer) {
        clearTimeout(timer)
        timer = null
      }
    },
  )
}
