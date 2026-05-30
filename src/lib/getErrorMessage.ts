import axios from 'axios'

interface BackendErrorPayload {
  timestamp?: string
  status?: number
  message?: string
  errors?: string[]
}

/**
 * Extrae el mensaje legible de un error de la API.
 *
 * El GlobalExceptionHandler del back devuelve dos shapes según el tipo:
 *  - Errores de negocio (BadRequest, NotFound, etc.):
 *      { timestamp, status, message: "<texto>" }
 *  - Bean Validation (`@Valid` rebota el body):
 *      { timestamp, status, errors: ["campo: <texto>", ...] }
 *
 * Los textos ya vienen traducidos según el `Accept-Language` que mandamos,
 * así que se muestran directo (NO se re-traducen ni se buscan claves i18n).
 *
 * `fallback` se usa cuando no hay respuesta del back (network error, timeout,
 * etc.). El llamador pasa un mensaje ya localizado vía `t(...)`.
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) return fallback
  const data = error.response?.data as BackendErrorPayload | undefined
  if (!data) return fallback
  if (typeof data.message === 'string' && data.message.length > 0) {
    return data.message
  }
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.join(' · ')
  }
  return fallback
}
