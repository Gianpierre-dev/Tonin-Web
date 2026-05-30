import { z } from 'zod'

/**
 * Mapa de traducciones de un campo.
 * El back garantiza `es` siempre presente y no vacío; `en` es opcional.
 */
export const traduccionesSchema = z.object({
  es: z.string(),
  en: z.string().optional(),
})

// --- LECTURA ---

export const estadoAnimoDTOSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  nombre: z.string(), // resuelto por Accept-Language
  emoji: z.string(),
  iconUrl: z.string().nullable(),
  musicaUrl: z.string().nullable(),
  imagenUrl: z.string().nullable(),
  colorPrimario: z.string().nullable(),
  colorSecundario: z.string().nullable(),
  fontFamily: z.string().nullable(),
  animationType: z.string().nullable(),
  traducciones: traduccionesSchema, // todas las traducciones, para el form
})

export const fraseDTOSchema = z.object({
  id: z.number(),
  texto: z.string(), // resuelto por Accept-Language
  estadoAnimo: estadoAnimoDTOSchema,
  traducciones: traduccionesSchema, // todas las traducciones, para el form
})

// --- ESCRITURA ---
// Tipos separados de la lectura: sin `id`, sin `nombre`/`texto` resueltos.

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const traduccionesWriteSchema = z.object({
  es: z.string().min(1),
  en: z.string().optional(),
})

export const estadoAnimoWriteSchema = z.object({
  codigo: z.string().regex(slugRegex),
  emoji: z.string(),
  iconUrl: z.string().nullable(),
  musicaUrl: z.string().nullable(),
  imagenUrl: z.string().nullable(),
  colorPrimario: z.string().nullable(),
  colorSecundario: z.string().nullable(),
  fontFamily: z.string().nullable(),
  animationType: z.string().nullable(),
  traducciones: traduccionesWriteSchema,
})

export const fraseWriteSchema = z.object({
  traducciones: traduccionesWriteSchema,
  estadoAnimoId: z.number(),
})

// --- OTROS ---

export const authResponseSchema = z.object({
  token: z.string(),
})

export const uploadResponseSchema = z.object({
  url: z.string(),
  tipo: z.string(),
})

export type Traducciones = z.infer<typeof traduccionesSchema>
export type EstadoAnimoDTO = z.infer<typeof estadoAnimoDTOSchema>
export type FraseDTO = z.infer<typeof fraseDTOSchema>
export type EstadoAnimoWriteDTO = z.infer<typeof estadoAnimoWriteSchema>
export type FraseWriteDTO = z.infer<typeof fraseWriteSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type UploadResponse = z.infer<typeof uploadResponseSchema>
