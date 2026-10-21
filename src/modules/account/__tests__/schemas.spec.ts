import { describe, expect, it } from 'vitest'

import { changePasswordSchema, updateLocationSchema } from '../schemas'

const validPayload = {
  current_password: 'ContrasenaActual123!',
  password: 'NuevaContrasenaSegura456!',
  password_confirmation: 'NuevaContrasenaSegura456!',
}

describe('account changePasswordSchema', () => {
  it('accepts a valid password change payload', () => {
    expect(changePasswordSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects empty current password', () => {
    const result = changePasswordSchema.safeParse({
      ...validPayload,
      current_password: '',
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.current_password).toEqual([
      'Ingresa tu contraseña actual.',
    ])
  })

  it('rejects a new password shorter than 8 characters', () => {
    const result = changePasswordSchema.safeParse({
      ...validPayload,
      password: 'corta',
      password_confirmation: 'corta',
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password).toEqual([
      'La contraseña debe tener al menos 8 caracteres.',
    ])
  })

  it('rejects mismatched password confirmation', () => {
    const result = changePasswordSchema.safeParse({
      ...validPayload,
      password_confirmation: 'otra-diferente!',
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password_confirmation).toEqual([
      'Las contraseñas no coinciden.',
    ])
  })
})

describe('account updateLocationSchema (HU022)', () => {
  it('accepts a valid address and commune payload', () => {
    const result = updateLocationSchema.safeParse({
      address: 'Calle 10 # 43E-12',
      commune_id: 14,
      latitude: 6.2089,
      longitude: -75.5682,
    })

    expect(result.success).toBe(true)
  })

  it('accepts valid payload with only address', () => {
    const result = updateLocationSchema.safeParse({
      address: 'Carrera 70 # 10-20',
      commune_id: null,
    })

    expect(result.success).toBe(true)
  })

  it('accepts valid payload with only commune', () => {
    const result = updateLocationSchema.safeParse({
      address: '',
      commune_id: 11,
    })

    expect(result.success).toBe(true)
  })

  it('rejects when neither address nor commune is provided', () => {
    const result = updateLocationSchema.safeParse({
      address: '',
      commune_id: null,
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.commune_id).toEqual([
      'Ingresa una dirección o selecciona tu comuna.',
    ])
  })

  it('rejects out of range latitude', () => {
    const result = updateLocationSchema.safeParse({
      commune_id: 14,
      latitude: 105,
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.latitude).toEqual([
      'La latitud debe estar entre -90 y 90.',
    ])
  })

  it('rejects out of range longitude', () => {
    const result = updateLocationSchema.safeParse({
      commune_id: 14,
      longitude: -200,
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.longitude).toEqual([
      'La longitud debe estar entre -180 y 180.',
    ])
  })

  it('rejects address longer than 255 characters', () => {
    const result = updateLocationSchema.safeParse({
      address: 'a'.repeat(256),
      commune_id: 14,
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.address).toEqual([
      'La dirección no puede superar 255 caracteres.',
    ])
  })
})
