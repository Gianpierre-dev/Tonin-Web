import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Buenos días'
  if (hour >= 12 && hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export const decodeJwtPayload = (token: string): { exp?: number } | null => {
  try {
    const base64 = token.split('.')[1]
    if (!base64) return null
    return JSON.parse(atob(base64)) as { exp?: number }
  } catch {
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

export const loadFont = (family: string): void => {
  if (document.fonts.check(`16px "${family}"`)) return
  const link = document.createElement('link')
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@300;400;500;700&display=swap`
  link.rel = 'stylesheet'
  link.onerror = () => link.remove()
  document.head.appendChild(link)
}
