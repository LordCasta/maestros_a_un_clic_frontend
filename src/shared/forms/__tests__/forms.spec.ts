import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { ApiError } from '../../http/client'
import { applyServerErrors, spanishErrorMap } from '../index'

describe('applyServerErrors', () => {
  it('maps 422 errors to form fields, including array fields', () => {
    const setErrors = vi.fn<(errors: Record<string, string>) => void>()
    const error = new ApiError('Los datos enviados no son válidos.', 422, {
      email: ['El valor de correo electrónico ya está en uso.'],
      'category_ids.0': ['El valor seleccionado en especialidad no es válido.'],
    })

    const message = applyServerErrors(error, setErrors)

    expect(message).toBe('Los datos enviados no son válidos.')
    expect(setErrors).toHaveBeenCalledWith({
      email: 'El valor de correo electrónico ya está en uso.',
      category_ids: 'El valor seleccionado en especialidad no es válido.',
    })
  })

  it('returns the message of other API errors without touching fields', () => {
    const setErrors = vi.fn<(errors: Record<string, string>) => void>()

    expect(applyServerErrors(new ApiError('Credenciales incorrectas.', 401), setErrors)).toBe(
      'Credenciales incorrectas.',
    )
    expect(setErrors).not.toHaveBeenCalled()
  })
})

describe('spanishErrorMap', () => {
  it('translates common validation messages', () => {
    const schema = z.object({ email: z.string().min(1).email(), name: z.string().min(3) })
    const result = schema.safeParse({ email: 'x', name: 'a' }, { errorMap: spanishErrorMap })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors).toEqual({
      email: ['Ingresa un correo electrónico válido.'],
      name: ['Debe tener al menos 3 caracteres.'],
    })
  })
})
