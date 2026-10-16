import { z } from 'zod'

/** Validación en el cliente. Replica StoreAvailabilityBlockRequest; el backend vuelve a validar. */

export const blockSchema = z
  .object({
    date: z.string().min(1, 'Elige el día.'),
    start_time: z.string().min(1, 'Elige la hora de inicio.'),
    end_time: z.string().min(1, 'Elige la hora de fin.'),
    reason: z.string().trim().max(255).optional(),
  })
  .refine((block) => block.end_time > block.start_time, {
    message: 'Debe ser después de la hora de inicio.',
    path: ['end_time'],
  })
