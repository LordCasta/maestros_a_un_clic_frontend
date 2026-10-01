import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

import { config } from '../config'

/**
 * Conexión de tiempo real con Laravel Reverb. Una sola instancia para toda la app:
 * se conecta al iniciar sesión y se desconecta al cerrarla (lo hace el módulo de auth).
 *
 * Canales y eventos: backend/docs/tiempo-real.md
 *
 *   const echo = getRealtime()
 *   echo?.join(`booking.${id}`).listen('.message.sent', (message) => { … })
 */

let echo: Echo<'reverb'> | null = null

export function connectRealtime(token: string): Echo<'reverb'> | null {
  if (!config.reverb.key) return null
  if (echo) return echo

  window.Pusher = Pusher

  echo = new Echo({
    broadcaster: 'reverb',
    key: config.reverb.key,
    wsHost: config.reverb.host,
    wsPort: config.reverb.port,
    wssPort: config.reverb.port,
    forceTLS: config.reverb.scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${config.apiBaseUrl}/broadcasting/auth`,
    auth: { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } },
  })

  return echo
}

export function disconnectRealtime(): void {
  echo?.disconnect()
  echo = null
}

export function getRealtime(): Echo<'reverb'> | null {
  return echo
}
