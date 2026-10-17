import { z } from 'zod'

/** Replica StoreMessageRequest; el backend vuelve a validar. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export const attachmentSchema = z
  .custom<File>((value) => value instanceof File)
  .refine((file) => /^image\/(jpeg|png|webp)$/.test(file.type), 'Usa una imagen JPG, PNG o WEBP.')
  .refine((file) => file.size <= MAX_IMAGE_BYTES, 'La imagen no debe pesar más de 5 MB.')

export const MAX_BODY_LENGTH = 2000
