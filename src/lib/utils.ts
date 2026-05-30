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

export const hexToRgb = (hex: string): string => {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

import { isAllowedFont } from './fonts'

export const loadFont = (family: string): void => {
  // Whitelist: si llega cualquier cosa que no esté en la lista cerrada
  // (config del back, valor inyectado por admin, etc.) la ignoramos. Sin
  // esto, un `family` con comilla simple/`;` podía pisar la cascada CSS
  // donde luego se usa la var --mood-font.
  if (!isAllowedFont(family)) return
  if (document.fonts.check(`16px "${family}"`)) return
  const link = document.createElement('link')
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@300;400;500;700&display=swap`
  link.rel = 'stylesheet'
  link.onerror = () => link.remove()
  document.head.appendChild(link)
}
