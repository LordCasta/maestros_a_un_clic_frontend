/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API, incluida la versión. Ej: http://127.0.0.1:8000/api/v1 */
  readonly VITE_API_BASE_URL: string
  readonly VITE_REVERB_APP_KEY: string
  readonly VITE_REVERB_HOST: string
  readonly VITE_REVERB_PORT: string
  readonly VITE_REVERB_SCHEME: 'http' | 'https'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  /** Laravel Echo necesita el cliente de Pusher en window (Reverb usa su protocolo). */
  Pusher: typeof import('pusher-js').default
}
