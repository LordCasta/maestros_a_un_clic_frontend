import { describe, expect, it } from 'vitest'

import { profileSchema, serviceSchema } from '../schemas'

describe('profileSchema', () => {
  it('requires an hourly rate greater than zero', () => {
    expect(profileSchema.safeParse({ hourly_rate: '0', service_radius_km: '10' }).success).toBe(
      false,
    )
    expect(profileSchema.safeParse({ hourly_rate: '', service_radius_km: '10' }).success).toBe(
      false,
    )
    expect(profileSchema.safeParse({ hourly_rate: '45000', service_radius_km: '10' }).success).toBe(
      true,
    )
  })

  it('turns the number inputs into numbers and an empty experience into null', () => {
    const result = profileSchema.parse({
      hourly_rate: '45000',
      service_radius_km: '15',
      experience_years: '',
    })

    expect(result).toMatchObject({
      hourly_rate: 45000,
      service_radius_km: 15,
      experience_years: null,
    })
  })
})

describe('serviceSchema', () => {
  const valid = {
    category_id: 2,
    title: 'Reparación de fugas',
    price_type: 'fixed',
    price: '80000',
    estimated_duration_minutes: 90,
  }

  it('accepts a complete service', () => {
    expect(serviceSchema.parse(valid)).toMatchObject({
      price: 80000,
      estimated_duration_minutes: 90,
    })
  })

  it('requires category, price above zero and a duration of at least 15 minutes', () => {
    const result = serviceSchema.safeParse({
      ...valid,
      category_id: undefined,
      price: '0',
      estimated_duration_minutes: 10,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path[0]).sort()).toEqual([
      'category_id',
      'estimated_duration_minutes',
      'price',
    ])
  })
})
