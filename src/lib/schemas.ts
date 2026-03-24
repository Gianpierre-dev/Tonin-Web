import { z } from 'zod'

export const estadoAnimoDTOSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  emoji: z.string(),
  iconUrl: z.string().nullable(),
  musicaUrl: z.string().nullable(),
  imagenUrl: z.string().nullable(),
  colorPrimario: z.string().nullable(),
  colorSecundario: z.string().nullable(),
  fontFamily: z.string().nullable(),
  animationType: z.string().nullable(),
})

export const fraseDTOSchema = z.object({
  id: z.number(),
  texto: z.string(),
  estadoAnimo: estadoAnimoDTOSchema,
})

export const authResponseSchema = z.object({
  token: z.string(),
})

export const uploadResponseSchema = z.object({
  url: z.string(),
  tipo: z.string(),
})

export type EstadoAnimoDTO = z.infer<typeof estadoAnimoDTOSchema>
export type FraseDTO = z.infer<typeof fraseDTOSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type UploadResponse = z.infer<typeof uploadResponseSchema>
