import { z } from 'zod'

/**
 * Validación en el cliente. Replica StoreBookingRequest y RejectBookingRequest del backend,
 * que vuelve a validar siempre (y además revisa horario, bloqueos y cruces).
 */

export const bookingSchema = z.object({
  professional_service_id: z.number({
    required_error: 'Elige un servicio.',
    invalid_type_error: 'Elige un servicio.',
  }),
  starts_at: z.string({
    required_error: 'Elige una hora disponible.',
    invalid_type_error: 'Elige una hora disponible.',
  }),
  address: z.string().trim().min(1).max(255),
  commune_id: z.number().nullable().optional(),
  description: z.string().trim().max(2000).optional(),
})

export const rejectSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(1000)
    .refine((value) => value.length === 0 || value.length >= 5, 'Debe tener al menos 5 caracteres.')
    .optional(),
})

export const reviewSchema = z.object({
  rating: z
    .number({
      required_error: 'Elige una calificación.',
      invalid_type_error: 'Elige una calificación.',
    })
    .int('Debe ser un número entero.')
    .min(1, 'La calificación mínima es 1 estrella.')
    .max(5, 'La calificación máxima es 5 estrellas.'),
  comment: z
    .string()
    .trim()
    .max(1000, 'El comentario no puede superar 1000 caracteres.')
    .optional(),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>
