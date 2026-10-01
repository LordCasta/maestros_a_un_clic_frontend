import { z } from 'zod'

import { ApiError } from '../http/client'

/**
 * Formularios: VeeValidate + Zod. Ver docs/arquitectura.md § Formularios.
 *
 * Regla: los nombres de campo del formulario son los mismos del request de la API
 * (snake_case), así los errores 422 del backend se asignan al campo sin traducir nombres.
 */

/** Mensajes de Zod en español. Se registra una vez en app/main.ts. */
export const spanishErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === 'undefined' || issue.received === 'null') {
        return { message: 'Este campo es obligatorio.' }
      }
      if (issue.expected === 'number') return { message: 'Debe ser un número.' }
      break
    case z.ZodIssueCode.too_small:
      if (issue.type === 'string') {
        return {
          message:
            issue.minimum === 1
              ? 'Este campo es obligatorio.'
              : `Debe tener al menos ${issue.minimum} caracteres.`,
        }
      }
      if (issue.type === 'number') {
        return {
          message: issue.inclusive
            ? `Debe ser mayor o igual a ${issue.minimum}.`
            : `Debe ser mayor que ${issue.minimum}.`,
        }
      }
      if (issue.type === 'array') {
        return {
          message:
            issue.minimum === 1
              ? 'Selecciona al menos una opción.'
              : `Selecciona al menos ${issue.minimum} opciones.`,
        }
      }
      break
    case z.ZodIssueCode.too_big:
      if (issue.type === 'string')
        return { message: `No debe tener más de ${issue.maximum} caracteres.` }
      if (issue.type === 'number') return { message: `Debe ser menor o igual a ${issue.maximum}.` }
      break
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === 'email') return { message: 'Ingresa un correo electrónico válido.' }
      break
    case z.ZodIssueCode.invalid_enum_value:
      return { message: 'Selecciona una opción válida.' }
  }

  return { message: ctx.defaultError }
}

/**
 * Pasa los errores de un 422 a los campos del formulario y devuelve el mensaje general
 * para mostrar en un BaseAlert. Para cualquier otro error devuelve su mensaje.
 *
 *   } catch (error) {
 *     formError.value = applyServerErrors(error, setErrors)
 *   }
 */
export function applyServerErrors(
  error: unknown,
  setErrors: (errors: Record<string, string>) => void,
): string {
  if (error instanceof ApiError) {
    if (error.isValidation) {
      const fieldErrors: Record<string, string> = {}
      for (const [field, messages] of Object.entries(error.errors)) {
        // `category_ids.0` → `category_ids`
        const name = field.split('.')[0] ?? field
        if (messages[0] && !fieldErrors[name]) fieldErrors[name] = messages[0]
      }
      setErrors(fieldErrors)
    }
    return error.message
  }

  return 'Ocurrió un error inesperado. Inténtalo de nuevo.'
}
