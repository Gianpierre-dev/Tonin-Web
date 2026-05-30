import axios from 'axios'
import { z } from 'zod'
import { logError } from './logError'

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
 * drift de contrato/ZodError, HTML 5xx de la infra, etc.). El llamador pasa
 * un mensaje ya localizado vía `t(...)`.
 *
 * IMPORTANTE: este texto se renderiza siempre como texto JSX (React escapa),
 * NUNCA con dangerouslySetInnerHTML. No hace falta sanitizar HTML acá.
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  // Drift de contrato: el back devolvió un shape que el schema Zod no acepta.
  // Lo logueamos para diagnosticar y mostramos el fallback genérico.
  if (error instanceof z.ZodError) {
    logError('getErrorMessage.zod', error)
    return fallback
  }

  if (!axios.isAxiosError(error)) {
    logError('getErrorMessage.unknown', error)
    return fallback
  }

  const data: unknown = error.response?.data

  // Infra (Railway/nginx 502/503): a veces vuelve HTML. No lo mostramos al
  // usuario; usamos el fallback. Detectamos `<` al inicio tras trim.
  if (typeof data === 'string') {
    const trimmed = data.trim()
    if (trimmed.length > 0 && !trimmed.startsWith('<')) {
      return trimmed
    }
    return fallback
  }

  if (typeof data !== 'object' || data === null) return fallback

  const payload = data as BackendErrorPayload
  if (typeof payload.message === 'string' && payload.message.length > 0) {
    return payload.message
  }
  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    return payload.errors.join(' · ')
  }
  return fallback
}
