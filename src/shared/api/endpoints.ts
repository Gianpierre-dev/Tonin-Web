import axios from 'axios'
import { apiClient } from './client'
import {
  type EstadoAnimoDTO,
  type EstadoAnimoWriteDTO,
  type FraseDTO,
  type FraseWriteDTO,
  type AuthResponse,
  type UploadResponse,
  estadoAnimoDTOSchema,
  fraseDTOSchema,
  authResponseSchema,
  uploadResponseSchema,
} from '@/lib/schemas'
import { z } from 'zod'

// Public
export const getEstados = async (): Promise<EstadoAnimoDTO[]> => {
  const { data } = await apiClient.get<unknown[]>('/api/estados')
  return z.array(estadoAnimoDTOSchema).parse(data)
}

export const getFraseRandom = async (
  codigo: string,
  excluidos: number[] = [],
): Promise<FraseDTO | null> => {
  // El back recibe el query param como `animo` (case-insensitive) por
  // backward-compat, pero el valor que va es el `codigo` del estado.
  const params: Record<string, string> = { animo: codigo }
  if (excluidos.length > 0) {
    params.excluidos = excluidos.join(',')
  }
  try {
    const { data } = await apiClient.get<unknown>('/api/frases/random', { params })
    return fraseDTOSchema.parse(data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

// Auth
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post<unknown>('/api/auth/login', { username, password })
  return authResponseSchema.parse(data)
}

// Admin - Estados
export const getEstadoById = async (id: number): Promise<EstadoAnimoDTO> => {
  const { data } = await apiClient.get<unknown>(`/api/estados/${id}`)
  return estadoAnimoDTOSchema.parse(data)
}

export const createEstado = async (body: EstadoAnimoWriteDTO): Promise<EstadoAnimoDTO> => {
  const { data } = await apiClient.post<unknown>('/api/estados', body)
  return estadoAnimoDTOSchema.parse(data)
}

export const updateEstado = async (id: number, body: EstadoAnimoWriteDTO): Promise<EstadoAnimoDTO> => {
  const { data } = await apiClient.put<unknown>(`/api/estados/${id}`, body)
  return estadoAnimoDTOSchema.parse(data)
}

export const deleteEstado = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/estados/${id}`)
}

// Admin - Frases
export const getFrases = async (): Promise<FraseDTO[]> => {
  const { data } = await apiClient.get<unknown[]>('/api/frases')
  return z.array(fraseDTOSchema).parse(data)
}

export const getFraseById = async (id: number): Promise<FraseDTO> => {
  const { data } = await apiClient.get<unknown>(`/api/frases/${id}`)
  return fraseDTOSchema.parse(data)
}

export const createFrase = async (body: FraseWriteDTO): Promise<FraseDTO> => {
  const { data } = await apiClient.post<unknown>('/api/frases', body)
  return fraseDTOSchema.parse(data)
}

export const updateFrase = async (id: number, body: FraseWriteDTO): Promise<FraseDTO> => {
  const { data } = await apiClient.put<unknown>(`/api/frases/${id}`, body)
  return fraseDTOSchema.parse(data)
}

export const deleteFrase = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/frases/${id}`)
}

// Admin - Uploads
export const uploadImagen = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post<unknown>('/api/uploads/imagen', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return uploadResponseSchema.parse(data)
}

export const uploadMusica = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post<unknown>('/api/uploads/musica', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return uploadResponseSchema.parse(data)
}

export const deleteUpload = async (url: string): Promise<void> => {
  await apiClient.delete('/api/uploads', { params: { url } })
}
