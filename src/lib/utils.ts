import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { logError } from "./logError"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Devuelve la CLAVE de traducción del saludo según la hora local.
 * El componente la pasa por `t()` — esta función es i18n-agnóstica.
 */
export const getGreetingKey = (): 'home.greetingMorning' | 'home.greetingAfternoon' | 'home.greetingEvening' => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'home.greetingMorning'
  if (hour >= 12 && hour < 19) return 'home.greetingAfternoon'
  return 'home.greetingEvening'
}

export const decodeJwtPayload = (token: string): { exp?: number } | null => {
  try {
    const base64 = token.split('.')[1]
    if (!base64) return null
    return JSON.parse(atob(base64)) as { exp?: number }
  } catch (err) {
    logError('decodeJwtPayload', err)
    return null
  }
}

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return true
  return Date.now() >= payload.exp * 1000
}

const HEX_COLOR_RE = /^#?[0-9a-fA-F]{6}$/

/**
 * Sanitiza un color hex. Devuelve el valor canónico con `#` o el fallback si
 * el input no es un hex válido. Defensa en profundidad contra CSS injection
 * cuando el valor termina interpolado en `style={{ background: ... }}` o
 * `rgba(${hexToRgb(...)},...)`.
 */
export const sanitizeHex = (value: string | null | undefined, fallback: string): string => {
  if (typeof value !== 'string' || !HEX_COLOR_RE.test(value)) return fallback
  return value.startsWith('#') ? value : `#${value}`
}

export const hexToRgb = (hex: string): string => {
  // Guard: si llega un hex malformado (back, valor del store viejo, lo que
  // sea), devolvemos un rgb neutral en vez de `NaN, NaN, NaN` que rompía
  // visualmente las cards y los fondos.
  if (!HEX_COLOR_RE.test(hex)) return '196, 168, 130' // brand accent fallback
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

// `loadFont` se eliminó: las fuentes del whitelist (@/lib/fonts) ahora se
// importan en src/index.css vía paquetes @fontsource. Eso permite quitar
// los hosts de Google de la CSP y elimina la inyección dinámica de <link>
// en runtime.
