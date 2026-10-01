import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Avisos breves (toasts) para confirmar acciones o reportar errores.
 * Reemplaza alert(): nunca usar alert/confirm del navegador.
 *
 *   const toast = useToastStore()
 *   toast.success('Reserva cancelada.')
 */

export type ToastTone = 'success' | 'danger' | 'info' | 'warning'

export interface Toast {
  id: number
  tone: ToastTone
  message: string
}

const DURATION_MS = 4500

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let nextId = 1

  function show(tone: ToastTone, message: string) {
    const id = nextId++
    toasts.value.push({ id, tone, message })
    setTimeout(() => dismiss(id), DURATION_MS)
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return {
    toasts,
    dismiss,
    success: (message: string) => show('success', message),
    error: (message: string) => show('danger', message),
    info: (message: string) => show('info', message),
    warning: (message: string) => show('warning', message),
  }
})
