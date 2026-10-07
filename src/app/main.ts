import '@fontsource-variable/plus-jakarta-sans'
import './main.css'

import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { z } from 'zod'

import { useAuthStore } from '@/modules/auth'
import { spanishErrorMap } from '@/shared/forms'
import { configureHttp } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'

import App from './App.vue'
import { router } from './router'

z.setErrorMap(spanishErrorMap)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PiniaColada, {
  // Datos "frescos" por 30 s: navegar entre páginas no repite pedidos innecesarios.
  queryOptions: { staleTime: 30_000 },
})

const auth = useAuthStore(pinia)
const toast = useToastStore(pinia)

configureHttp({
  getToken: () => auth.token,
  // El token venció o fue revocado: cerrar la sesión local y volver al login.
  onUnauthorized: () => {
    auth.clear()
    toast.info('Tu sesión terminó. Inicia sesión de nuevo.')
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
  },
})

app.use(router)
app.mount('#app')
