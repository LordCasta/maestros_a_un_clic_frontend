import { config } from '../config'
import type { ApiErrorBody } from '../types/api'

/**
 * Cliente HTTP único de la app. Ningún módulo llama a fetch directamente.
 *
 * - Agrega `Accept: application/json` y el token Bearer.
 * - Convierte cualquier error en ApiError con el mensaje del backend (ya en español).
 * - Ante un 401 con sesión iniciada, avisa al módulo de auth (configureHttp) para cerrarla.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    /** 0 si no hubo respuesta (sin conexión, servidor caído). */
    readonly status: number,
    /** Errores por campo (solo 422). */
    readonly errors: Record<string, string[]> = {},
  ) {
    super(message)
    this.name = 'ApiError'
  }

  get isValidation(): boolean {
    return this.status === 422
  }
}

type QueryValue = string | number | boolean | null | undefined
export type Query = Record<string, QueryValue>

export interface RequestOptions {
  query?: Query
  /** Objeto (se envía como JSON) o FormData (archivos). */
  body?: FormData | object
  signal?: AbortSignal
}

let getToken: () => string | null = () => null
let onUnauthorized: () => void = () => {}

/** La configura el módulo de auth al iniciar la app (ver app/main.ts). */
export function configureHttp(options: {
  getToken: () => string | null
  onUnauthorized: () => void
}) {
  getToken = options.getToken
  onUnauthorized = options.onUnauthorized
}

function buildUrl(path: string, query?: Query): string {
  const url = new URL(`${config.apiBaseUrl}/${path.replace(/^\//, '')}`)

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken()
  const headers = new Headers({ Accept: 'application/json' })
  let body: BodyInit | undefined

  if (token) headers.set('Authorization', `Bearer ${token}`)

  if (options.body instanceof FormData) {
    body = options.body
  } else if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(options.body)
  }

  let response: Response
  try {
    response = await fetch(buildUrl(path, options.query), {
      method,
      headers,
      body,
      signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(
      'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
      0,
    )
  }

  const payload: unknown = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    const error = (payload ?? {}) as Partial<ApiErrorBody>

    if (response.status === 401 && token) onUnauthorized()

    throw new ApiError(
      error.message ?? 'Ocurrió un error inesperado.',
      response.status,
      error.errors,
    )
  }

  return payload as T
}

export const http = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('GET', path, options),
  post: <T>(path: string, body?: RequestOptions['body'], options?: RequestOptions) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: RequestOptions['body'], options?: RequestOptions) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: RequestOptions['body'], options?: RequestOptions) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
}

/**
 * Convierte un objeto en FormData para endpoints con archivos.
 * Arrays → `campo[]`, booleanos → '1'/'0', null/undefined/'' se omiten.
 */
export function toFormData(values: Record<string, unknown>): FormData {
  const formData = new FormData()

  const append = (key: string, value: unknown) => {
    if (value === null || value === undefined || value === '') return
    if (value instanceof Blob) formData.append(key, value)
    else if (typeof value === 'boolean') formData.append(key, value ? '1' : '0')
    else formData.append(key, String(value))
  }

  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value)) value.forEach((item) => append(`${key}[]`, item))
    else append(key, value)
  }

  return formData
}
