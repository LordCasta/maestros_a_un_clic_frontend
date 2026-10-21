import { z } from 'zod'

const passwordRule = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.')

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Ingresa tu contraseña actual.'),
    password: passwordRule,
    password_confirmation: z.string().min(1, 'Confirma tu nueva contraseña.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden.',
    path: ['password_confirmation'],
  })

export const updateLocationSchema = z
  .object({
    address: z
      .string()
      .max(255, 'La dirección no puede superar 255 caracteres.')
      .nullable()
      .optional()
      .or(z.literal('')),
    commune_id: z
      .number({ invalid_type_error: 'Selecciona una comuna válida.' })
      .optional()
      .nullable(),
    latitude: z
      .number()
      .min(-90, 'La latitud debe estar entre -90 y 90.')
      .max(90, 'La latitud debe estar entre -90 y 90.')
      .optional()
      .nullable(),
    longitude: z
      .number()
      .min(-180, 'La longitud debe estar entre -180 y 180.')
      .max(180, 'La longitud debe estar entre -180 y 180.')
      .optional()
      .nullable(),
  })
  .refine((data) => Boolean(data.commune_id || (data.address && data.address.trim().length > 0)), {
    message: 'Ingresa una dirección o selecciona tu comuna.',
    path: ['commune_id'],
  })

export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>
export type UpdateLocationPayload = z.infer<typeof updateLocationSchema>
