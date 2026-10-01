/**
 * Configuración leída de las variables de entorno (.env). Ver .env.example.
 */
export const config = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(
    /\/$/,
    '',
  ),
  reverb: {
    key: import.meta.env.VITE_REVERB_APP_KEY,
    host: import.meta.env.VITE_REVERB_HOST || 'localhost',
    port: Number(import.meta.env.VITE_REVERB_PORT || 8080),
    scheme: import.meta.env.VITE_REVERB_SCHEME || 'http',
  },
  timezone: 'America/Bogota',
  locale: 'es-CO',
} as const
