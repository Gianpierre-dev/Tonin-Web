import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EstadoAnimoDTO } from '@/lib/schemas'
import { getEstados } from '@/shared/api/endpoints'

interface AppState {
  estados: EstadoAnimoDTO[]
  estadosLoaded: boolean
  estadosLoading: boolean
  estadosError: string | null
  loadEstados: () => Promise<void>

  activeMood: EstadoAnimoDTO | null
  setActiveMood: (mood: EstadoAnimoDTO) => void
  clearActiveMood: () => void

  excludedIds: number[]
  addExcludedId: (id: number) => void
  resetExcluded: () => void

  favorites: number[]
  toggleFavorite: (id: number) => void

  isMuted: boolean
  volume: number
  setVolume: (volume: number) => void
  toggleMute: () => void

  themeMode: 'system' | 'dark' | 'light'
  setThemeMode: (mode: 'system' | 'dark' | 'light') => void

  lang: 'es' | 'en'
  setLang: (lang: 'es' | 'en') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      estados: [],
      estadosLoaded: false,
      estadosLoading: false,
      estadosError: null,
      loadEstados: async () => {
        set({ estadosLoading: true, estadosError: null })
        try {
          const estados = await getEstados()
          set({ estados, estadosLoaded: true, estadosLoading: false })
        } catch {
          set({ estadosError: 'No se pudieron cargar los estados', estadosLoading: false })
        }
      },

      activeMood: null,
      setActiveMood: (mood) => set({ activeMood: mood, excludedIds: [] }),
      clearActiveMood: () => set({ activeMood: null, excludedIds: [] }),

      excludedIds: [],
      addExcludedId: (id) => set((state) => ({ excludedIds: [...state.excludedIds, id] })),
      resetExcluded: () => set({ excludedIds: [] }),

      favorites: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),

      isMuted: false,
      volume: 0.6,
      setVolume: (volume) => set({ volume }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),

      lang: 'es',
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'tonin-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        isMuted: state.isMuted,
        volume: state.volume,
        themeMode: state.themeMode,
        lang: state.lang,
      }),
    },
  ),
)
