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
      // NO redirigir si:
      //  - el request era el propio login (las credenciales malas dan 401:
      //    el redirect recargaba la página y tapaba el mensaje "Credenciales
      //    incorrectas" del LoginScreen).
      //  - no había token previo (usuario anónimo cuyo 401 viene de un
      //    endpoint público: no es una sesión que expira, no debe ir a login).
      const url = error.config?.url ?? ''
      const isLoginRequest = url.includes('/auth/login')
      const hadToken = localStorage.getItem(TOKEN_KEY) !== null
      if (!isLoginRequest && hadToken) {
        localStorage.removeItem(TOKEN_KEY)
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  },
)
