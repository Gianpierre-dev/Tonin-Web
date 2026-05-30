import axios from 'axios'
import { API_BASE_URL, TOKEN_KEY } from '@/lib/constants'
import { useAppStore } from '@/shared/store/useAppStore'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Idioma activo → el back devuelve contenido y mensajes de error traducidos.
  config.headers['Accept-Language'] = useAppStore.getState().lang
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  },
)
