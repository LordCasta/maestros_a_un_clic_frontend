import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError, configureHttp, http, toFormData } from '../client'

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('http client', () => {
  const fetchMock = vi.fn<typeof fetch>()
  const onUnauthorized = vi.fn<() => void>()
  let token: string | null = null

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    token = null
    configureHttp({ getToken: () => token, onUnauthorized })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('returns the API envelope and sends JSON with the bearer token', async () => {
    token = 'abc'
    fetchMock.mockResolvedValue(
      jsonResponse(200, { success: true, message: null, data: { id: 1 } }),
    )

    const result = await http.post('/bookings', { address: 'Calle 10' }, { query: { page: 2 } })

    expect(result).toEqual({ success: true, message: null, data: { id: 1 } })
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('http://api.test/api/v1/bookings?page=2')
    const headers = new Headers(init?.headers)
    expect(headers.get('Authorization')).toBe('Bearer abc')
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(init?.body).toBe(JSON.stringify({ address: 'Calle 10' }))
  })

  it('skips empty query params', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { success: true, message: null, data: [] }))

    await http.get('/professionals', { query: { q: '', commune_id: undefined, sort: 'rating' } })

    expect(fetchMock.mock.calls[0]![0]).toBe('http://api.test/api/v1/professionals?sort=rating')
  })

  it('turns a 422 into an ApiError with field errors', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(422, {
        success: false,
        message: 'Los datos enviados no son válidos.',
        errors: { email: ['El campo correo electrónico es obligatorio.'] },
      }),
    )

    const error = await http.post('/auth/login', {}).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      status: 422,
      isValidation: true,
      message: 'Los datos enviados no son válidos.',
      errors: { email: ['El campo correo electrónico es obligatorio.'] },
    })
  })

  it('closes the session on a 401 only when a token was sent', async () => {
    fetchMock.mockImplementation(async () =>
      jsonResponse(401, { success: false, message: 'No autenticado.' }),
    )

    await http.get('/auth/me').catch(() => {})
    expect(onUnauthorized).not.toHaveBeenCalled()

    token = 'expired'
    await http.get('/auth/me').catch(() => {})
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })

  it('reports a friendly error when the server cannot be reached', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(http.get('/communes')).rejects.toMatchObject({
      status: 0,
      message: expect.stringContaining('No pudimos conectar'),
    })
  })
})

describe('toFormData', () => {
  it('serializes arrays, booleans and files and skips empty values', () => {
    const file = new File(['x'], 'avatar.png', { type: 'image/png' })

    const data = toFormData({
      name: 'Juan',
      category_ids: [1, 2],
      is_active: true,
      phone: '',
      address: null,
      avatar: file,
    })

    expect(data.get('name')).toBe('Juan')
    expect(data.getAll('category_ids[]')).toEqual(['1', '2'])
    expect(data.get('is_active')).toBe('1')
    expect(data.has('phone')).toBe(false)
    expect(data.has('address')).toBe(false)
    expect(data.get('avatar')).toBeInstanceOf(File)
  })
})
