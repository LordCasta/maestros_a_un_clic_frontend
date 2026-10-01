import { storage } from '@/services/storage'

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://127.0.0.1:8000/api'

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

type RequestOptions = {
  method?: string
  body?: BodyInit | object | null
  headers?: Record<string, string>
  auth?: boolean
}

const resolveUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text ? { message: text } : null
}

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body = null, headers = {}, auth = true } = options
  const token = auth ? storage.getToken() : null
  const requestHeaders = new Headers({ Accept: 'application/json', ...headers })

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  const init: RequestInit = {
    method,
    headers: requestHeaders,
  }

  if (body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer) {
    init.body = body
  } else if (body && typeof body === 'object') {
    requestHeaders.set('Content-Type', 'application/json')
    init.body = JSON.stringify(body)
  } else if (body) {
    init.body = body
  }

  const response = await fetch(resolveUrl(path), init)
  const data = await parseResponse(response)

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'Request failed'

    throw new ApiError(message, response.status, data)
  }

  return data as T
}
