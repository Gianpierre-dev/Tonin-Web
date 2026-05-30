/**
 * Validación de archivos en el cliente ANTES de subir.
 *
 * Defensa en profundidad: el back es la fuente de verdad (rechaza con 413/415
 * si la regla del cliente se evade). Acá damos feedback inmediato y evitamos
 * subir 15 MB para que el back los rebote después.
 */

import i18n from '@/i18n'

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB
export const MAX_AUDIO_BYTES = 15 * 1024 * 1024 // 15 MB

export const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const

export const ALLOWED_AUDIO_MIMES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg',
] as const

type ValidationResult = { ok: true } | { ok: false; message: string }

const formatMB = (bytes: number): string => `${Math.round(bytes / 1024 / 1024)} MB`

export const validateImageFile = (file: File): ValidationResult => {
  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      message: i18n.t('admin.uploads.errorTooLarge', { max: formatMB(MAX_IMAGE_BYTES) }),
    }
  }
  if (!(ALLOWED_IMAGE_MIMES as readonly string[]).includes(file.type)) {
    return { ok: false, message: i18n.t('admin.uploads.invalidImageFormat') }
  }
  return { ok: true }
}

export const validateAudioFile = (file: File): ValidationResult => {
  if (file.size > MAX_AUDIO_BYTES) {
    return {
      ok: false,
      message: i18n.t('admin.uploads.errorTooLarge', { max: formatMB(MAX_AUDIO_BYTES) }),
    }
  }
  if (!(ALLOWED_AUDIO_MIMES as readonly string[]).includes(file.type)) {
    return { ok: false, message: i18n.t('admin.uploads.invalidAudioFormat') }
  }
  return { ok: true }
}
