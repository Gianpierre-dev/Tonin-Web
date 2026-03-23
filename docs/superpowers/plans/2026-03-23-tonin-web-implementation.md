# Tonin-Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Tonin-Web frontend — a mobile-first motivational phrases app with Tinder-style swipe, mood-based theming, ambient audio, and an admin CRUD panel.

**Architecture:** Feature-based React SPA. Three features (home, phrase, admin) share a Zustand store, Axios API client, theme provider, and audio provider. All visual configuration comes from the backend — zero hardcoded moods.

**Tech Stack:** Vite + React 19 + TypeScript (strict) + Tailwind CSS 4 + React Router 7 + Framer Motion + @use-gesture/react + Howler.js + Zustand + Axios + shadcn/ui + Zod

**Spec:** `docs/superpowers/specs/2026-03-23-tonin-web-design.md`

---

## File Map

```
src/
  features/
    home/
      HomeScreen.tsx          — Main screen: greeting + mood grid + theme toggle
      MoodGrid.tsx            — Dynamic grid from API estados
      MoodCell.tsx             — Single mood cell: icon/emoji + name + tap handler
    phrase/
      PhraseScreen.tsx        — Immersive screen: glows + swipe + audio
      SwipeStack.tsx          — Card stack manager + gesture logic
      SwipeCard.tsx           — Individual swipeable card with phrase
      SwipeHints.tsx          — "← siguiente / guardar →" overlay
      EmptyCard.tsx           — End-of-phrases empathetic message
    admin/
      LoginScreen.tsx         — JWT login form
      AdminLayout.tsx         — Sidebar + outlet
      ProtectedRoute.tsx      — JWT guard with expiration check
      EstadosPage.tsx         — CRUD table + form for estados
      EstadoForm.tsx          — Form with color pickers, font select, uploads
      FrasesPage.tsx          — CRUD table + form for frases
      FraseForm.tsx           — Textarea + estado select
      UploadsPage.tsx         — Drag & drop uploads for images/audio
  shared/
    api/
      client.ts              — Axios instance + interceptors
      endpoints.ts           — Typed API functions
    hooks/
      useEstados.ts          — Fetch + cache estados
      useFraseRandom.ts      — Fetch random phrase with exclusions
    audio/
      AudioProvider.tsx       — React context for global audio
      useAudio.ts            — Play, pause, fade, mute via Howler
    theme/
      ThemeProvider.tsx       — Dark/light + mood CSS variables
      useTheme.ts            — Toggle + system detection + localStorage
      useMoodTheme.ts        — Inject mood CSS vars + load font
    store/
      useAppStore.ts         — Zustand store (full AppState)
    ui/                      — shadcn/ui components (added via CLI)
  lib/
    schemas.ts              — Zod schemas for API responses
    constants.ts            — Animation presets, swipe threshold, font map
    utils.ts                — Greeting helper, JWT decode, misc
  App.tsx                   — Router + providers
  main.tsx                  — Entry point
  index.css                 — Tailwind directives + CSS custom properties
```

---

## Phase 1: Project Scaffold & Foundation

### Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`

- [ ] **Step 1: Create Vite project**

```bash
cd C:/dev/gian/Tonin-Web
pnpm create vite@latest . --template react-ts
```

Select: React, TypeScript

- [ ] **Step 2: Install dependencies**

```bash
pnpm install
```

- [ ] **Step 3: Enable strict TypeScript**

In `tsconfig.app.json`, ensure:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

In `vite.config.ts`, add path alias:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Install `@types/node`:
```bash
pnpm add -D @types/node
```

- [ ] **Step 4: Verify dev server runs**

```bash
pnpm dev
```

Expected: Vite dev server starts on http://localhost:5173

- [ ] **Step 5: Clean boilerplate**

Remove `src/App.css`, `src/assets/`, default content in `src/App.tsx`. Replace with:

```tsx
const App = (): JSX.Element => {
  return <div>Tonin</div>
}

export default App
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold proyecto Vite + React + TypeScript"
```

---

### Task 2: Install and configure Tailwind CSS 4

**Files:**
- Modify: `package.json`, `src/index.css`, `index.html`

- [ ] **Step 1: Install Tailwind + Vite plugin**

```bash
pnpm add tailwindcss @tailwindcss/vite
```

- [ ] **Step 2: Configure Vite plugin**

In `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 3: Create index.css with Tailwind + CSS custom properties**

```css
@import "tailwindcss";

@theme {
  --color-warm-black: #0a0a0f;
  --color-warm-dark: #0f1520;
  --color-warm-cream: #fdf6ee;
  --color-warm-beige: #f8f0e6;
  --color-text-dark: #e8e4df;
  --color-text-light: #2a2520;
  --color-accent: #c4a882;
}

:root {
  --mood-primary: #c4a882;
  --mood-secondary: #a89278;
  --mood-font: 'Outfit', system-ui, sans-serif;
}
```

- [ ] **Step 4: Import in main.tsx**

```tsx
import './index.css'
```

- [ ] **Step 5: Verify Tailwind works**

In `App.tsx`, add a Tailwind class:
```tsx
const App = (): JSX.Element => {
  return <div className="bg-warm-black text-text-dark min-h-screen flex items-center justify-center">Tonin</div>
}
```

Run `pnpm dev`, verify dark background with light text.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: configurar Tailwind CSS 4 con tema custom"
```

---

### Task 3: Install core dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install all runtime dependencies**

```bash
pnpm add react-router framer-motion @use-gesture/react howler zustand axios zod
```

- [ ] **Step 2: Install type definitions**

```bash
pnpm add -D @types/howler
```

- [ ] **Step 3: Install dev tools**

```bash
pnpm add -D eslint @eslint/js typescript-eslint globals
```

- [ ] **Step 4: Verify no type errors**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: instalar dependencias core"
```

---

### Task 4: Setup shadcn/ui

**Files:**
- Create: `components.json`, `src/shared/ui/` components
- Modify: `src/index.css`

- [ ] **Step 1: Initialize shadcn**

```bash
pnpm dlx shadcn@latest init
```

Select: New York style, Zinc base color, CSS variables.

- [ ] **Step 2: Add commonly needed components**

```bash
pnpm dlx shadcn@latest add button input label table dialog select textarea toast tabs
```

- [ ] **Step 3: Verify import works**

In `App.tsx`, temporarily import a Button:
```tsx
import { Button } from '@/shared/ui/button'
```

Run `pnpm dev` — no errors.

- [ ] **Step 4: Remove temporary import, commit**

```bash
git add .
git commit -m "chore: configurar shadcn/ui con componentes base"
```

---

## Phase 2: Shared Infrastructure

### Task 5: Zod schemas and TypeScript types

**Files:**
- Create: `src/lib/schemas.ts`

- [ ] **Step 1: Define all schemas**

```ts
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
```

- [ ] **Step 2: Verify types compile**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/schemas.ts
git commit -m "feat: agregar schemas Zod y tipos TypeScript para la API"
```

---

### Task 6: Constants and utilities

**Files:**
- Create: `src/lib/constants.ts`, `src/lib/utils.ts`

- [ ] **Step 1: Create constants**

```ts
// src/lib/constants.ts

export interface AnimationConfig {
  duration: number
  y?: number[]
  scale?: number[]
  rotate?: number[]
  opacity?: number[]
  ease: string
}

export const ANIMATION_PRESETS: Record<string, AnimationConfig> = {
  float: { duration: 5, y: [-6, 6], ease: 'easeInOut' },
  pulse: { duration: 8, scale: [1, 1.15], ease: 'easeInOut' },
  wave: { duration: 6, rotate: [-2, 2], ease: 'easeInOut' },
  fade: { duration: 10, opacity: [0.7, 1], ease: 'easeInOut' },
}

export const DEFAULT_ANIMATION = 'fade'

export const SWIPE_THRESHOLD = 120
export const SWIPE_MAX_ROTATION = 12

export const AUDIO_DEFAULT_VOLUME = 0.6
export const AUDIO_FADE_IN_MS = 2000
export const AUDIO_FADE_OUT_MS = 1500

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
```

- [ ] **Step 2: Create utilities**

```ts
// src/lib/utils.ts

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]): string => {
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

export const loadFont = (family: string): void => {
  if (document.fonts.check(`16px "${family}"`)) return
  const link = document.createElement('link')
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@300;400;500;700&display=swap`
  link.rel = 'stylesheet'
  document.head.appendChild(link)
}
```

- [ ] **Step 3: Install clsx + tailwind-merge (shadcn dependency)**

```bash
pnpm add clsx tailwind-merge
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/constants.ts src/lib/utils.ts package.json pnpm-lock.yaml
git commit -m "feat: agregar constantes y funciones utilitarias"
```

---

### Task 7: Axios API client with interceptors

**Files:**
- Create: `src/shared/api/client.ts`, `src/shared/api/endpoints.ts`

- [ ] **Step 1: Create Axios instance**

```ts
// src/shared/api/client.ts

import axios from 'axios'
import { API_BASE_URL } from '@/lib/constants'

const TOKEN_KEY = 'tonin_token'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
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
```

- [ ] **Step 2: Create typed endpoint functions**

```ts
// src/shared/api/endpoints.ts

import { apiClient } from './client'
import {
  type EstadoAnimoDTO,
  type FraseDTO,
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
  animo: string,
  excluidos: number[] = [],
): Promise<FraseDTO | null> => {
  const params: Record<string, string> = { animo }
  if (excluidos.length > 0) {
    params.excluidos = excluidos.join(',')
  }
  try {
    const { data } = await apiClient.get<unknown>('/api/frases/random', { params })
    return fraseDTOSchema.parse(data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null // No more phrases available — triggers EmptyCard
    }
    throw error // Re-throw network errors and other failures
  }
}
// Note: import axios at the top of this file

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

export const createEstado = async (body: Omit<EstadoAnimoDTO, 'id'>): Promise<EstadoAnimoDTO> => {
  const { data } = await apiClient.post<unknown>('/api/estados', body)
  return estadoAnimoDTOSchema.parse(data)
}

export const updateEstado = async (id: number, body: Omit<EstadoAnimoDTO, 'id'>): Promise<EstadoAnimoDTO> => {
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

export const createFrase = async (texto: string, estadoAnimoId: number): Promise<FraseDTO> => {
  const { data } = await apiClient.post<unknown>('/api/frases', { texto, estadoAnimoId })
  return fraseDTOSchema.parse(data)
}

export const updateFrase = async (id: number, texto: string, estadoAnimoId: number): Promise<FraseDTO> => {
  const { data } = await apiClient.put<unknown>(`/api/frases/${id}`, { texto, estadoAnimoId })
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
```

- [ ] **Step 3: Verify types compile**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/api/
git commit -m "feat: agregar cliente Axios con interceptors y endpoints tipados"
```

---

### Task 8: Zustand store

**Files:**
- Create: `src/shared/store/useAppStore.ts`

- [ ] **Step 1: Create store with localStorage persistence**

```ts
// src/shared/store/useAppStore.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EstadoAnimoDTO } from '@/lib/schemas'
import { getEstados } from '@/shared/api/endpoints'

interface AppState {
  // Estados from API
  estados: EstadoAnimoDTO[]
  estadosLoading: boolean
  estadosError: string | null
  loadEstados: () => Promise<void>

  // Active mood
  activeMood: EstadoAnimoDTO | null
  setActiveMood: (mood: EstadoAnimoDTO) => void
  clearActiveMood: () => void

  // Excluded phrase IDs (per session, not persisted)
  excludedIds: number[]
  addExcludedId: (id: number) => void
  resetExcluded: () => void

  // Favorites (persisted)
  favorites: number[]
  toggleFavorite: (id: number) => void

  // Audio (persisted)
  isMuted: boolean
  volume: number
  setVolume: (volume: number) => void
  toggleMute: () => void

  // Theme (persisted)
  themeMode: 'system' | 'dark' | 'light'
  setThemeMode: (mode: 'system' | 'dark' | 'light') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estados
      estados: [],
      estadosLoading: false,
      estadosError: null,
      loadEstados: async () => {
        set({ estadosLoading: true, estadosError: null })
        try {
          const estados = await getEstados()
          set({ estados, estadosLoading: false })
        } catch {
          set({ estadosError: 'No se pudieron cargar los estados', estadosLoading: false })
        }
      },

      // Active mood
      activeMood: null,
      setActiveMood: (mood) => set({ activeMood: mood, excludedIds: [] }),
      clearActiveMood: () => set({ activeMood: null, excludedIds: [] }),

      // Excluded IDs
      excludedIds: [],
      addExcludedId: (id) => set((state) => ({ excludedIds: [...state.excludedIds, id] })),
      resetExcluded: () => set({ excludedIds: [] }),

      // Favorites
      favorites: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),

      // Audio
      isMuted: false,
      volume: 0.6,
      setVolume: (volume) => set({ volume }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      // Theme
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: 'tonin-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        isMuted: state.isMuted,
        volume: state.volume,
        themeMode: state.themeMode,
      }),
    },
  ),
)
```

- [ ] **Step 2: Verify types compile**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/shared/store/useAppStore.ts
git commit -m "feat: agregar store Zustand con persistencia en localStorage"
```

---

### Task 9: Shared hooks (useEstados, useFraseRandom)

**Files:**
- Create: `src/shared/hooks/useEstados.ts`, `src/shared/hooks/useFraseRandom.ts`

- [ ] **Step 1: Create useEstados hook**

```ts
// src/shared/hooks/useEstados.ts

import { useEffect } from 'react'
import { useAppStore } from '@/shared/store/useAppStore'

export const useEstados = () => {
  const estados = useAppStore((s) => s.estados)
  const loading = useAppStore((s) => s.estadosLoading)
  const error = useAppStore((s) => s.estadosError)
  const loadEstados = useAppStore((s) => s.loadEstados)

  useEffect(() => {
    if (estados.length === 0 && !loading) {
      void loadEstados()
    }
  }, [estados.length, loading, loadEstados])

  return { estados, loading, error, retry: loadEstados }
}
```

- [ ] **Step 2: Create useFraseRandom hook**

```ts
// src/shared/hooks/useFraseRandom.ts

import { useState, useCallback } from 'react'
import { getFraseRandom } from '@/shared/api/endpoints'
import { useAppStore } from '@/shared/store/useAppStore'
import type { FraseDTO } from '@/lib/schemas'

interface UseFraseRandomReturn {
  frase: FraseDTO | null
  isEmpty: boolean
  loading: boolean
  error: string | null
  fetchNext: () => Promise<void>
}

export const useFraseRandom = (moodName: string): UseFraseRandomReturn => {
  const [frase, setFrase] = useState<FraseDTO | null>(null)
  const [isEmpty, setIsEmpty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const excludedIds = useAppStore((s) => s.excludedIds)
  const addExcludedId = useAppStore((s) => s.addExcludedId)

  const fetchNext = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getFraseRandom(moodName, excludedIds)
      if (result === null) {
        setIsEmpty(true)
      } else {
        setFrase(result)
        addExcludedId(result.id)
      }
    } catch {
      setError('Sin conexión')
    } finally {
      setLoading(false)
    }
  }, [moodName, excludedIds, addExcludedId])

  return { frase, isEmpty, loading, error, fetchNext }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/shared/hooks/
git commit -m "feat: agregar hooks useEstados y useFraseRandom"
```

---

### Task 10: Theme provider (dark/light + mood CSS variables)

**Files:**
- Create: `src/shared/theme/ThemeProvider.tsx`, `src/shared/theme/useTheme.ts`, `src/shared/theme/useMoodTheme.ts`

- [ ] **Step 1: Create useTheme hook**

```ts
// src/shared/theme/useTheme.ts

import { useEffect } from 'react'
import { useAppStore } from '@/shared/store/useAppStore'

export const useTheme = (): void => {
  const themeMode = useAppStore((s) => s.themeMode)

  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (isDark: boolean): void => {
      root.classList.toggle('dark', isDark)
    }

    if (themeMode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mq.matches)
      const handler = (e: MediaQueryListEvent): void => applyTheme(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }

    applyTheme(themeMode === 'dark')
  }, [themeMode])
}
```

- [ ] **Step 2: Create useMoodTheme hook**

```ts
// src/shared/theme/useMoodTheme.ts

import { useEffect } from 'react'
import { useAppStore } from '@/shared/store/useAppStore'
import { loadFont } from '@/lib/utils'

export const useMoodTheme = (): void => {
  const activeMood = useAppStore((s) => s.activeMood)

  useEffect(() => {
    const root = document.documentElement

    if (!activeMood) {
      root.style.removeProperty('--mood-primary')
      root.style.removeProperty('--mood-secondary')
      root.style.removeProperty('--mood-font')
      return
    }

    if (activeMood.colorPrimario) {
      root.style.setProperty('--mood-primary', activeMood.colorPrimario)
    }
    if (activeMood.colorSecundario) {
      root.style.setProperty('--mood-secondary', activeMood.colorSecundario)
    }
    if (activeMood.fontFamily) {
      loadFont(activeMood.fontFamily)
      root.style.setProperty('--mood-font', `'${activeMood.fontFamily}', 'Outfit', system-ui, sans-serif`)
    }
  }, [activeMood])
}
```

- [ ] **Step 3: Create ThemeProvider**

```tsx
// src/shared/theme/ThemeProvider.tsx

import type { ReactNode } from 'react'
import { useTheme } from './useTheme'
import { useMoodTheme } from './useMoodTheme'

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
  useTheme()
  useMoodTheme()
  return <>{children}</>
}
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/theme/
git commit -m "feat: agregar theme provider con dark/light y CSS variables de mood"
```

---

### Task 10: Audio provider (Howler.js)

**Files:**
- Create: `src/shared/audio/AudioProvider.tsx`, `src/shared/audio/useAudio.ts`

- [ ] **Step 1: Create useAudio hook**

```ts
// src/shared/audio/useAudio.ts

import { useRef, useCallback, useState } from 'react'
import { Howl } from 'howler'
import { useAppStore } from '@/shared/store/useAppStore'
import { AUDIO_FADE_IN_MS, AUDIO_FADE_OUT_MS } from '@/lib/constants'

interface UseAudioReturn {
  play: (url: string) => void
  stop: () => void
  isPlaying: boolean
}

export const useAudio = (): UseAudioReturn => {
  const howlRef = useRef<Howl | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const isMuted = useAppStore((s) => s.isMuted)
  const volume = useAppStore((s) => s.volume)

  const stop = useCallback(() => {
    const howl = howlRef.current
    if (!howl) return
    howl.fade(howl.volume(), 0, AUDIO_FADE_OUT_MS)
    setTimeout(() => {
      howl.unload()
      howlRef.current = null
      setIsPlaying(false)
    }, AUDIO_FADE_OUT_MS)
  }, [])

  const play = useCallback(
    (url: string) => {
      if (howlRef.current) {
        howlRef.current.unload()
      }

      const howl = new Howl({
        src: [url],
        loop: true,
        volume: 0,
        html5: true,
        onplay: () => {
          setIsPlaying(true)
          if (!isMuted) {
            howl.fade(0, volume, AUDIO_FADE_IN_MS)
          }
        },
        onloaderror: () => {
          setIsPlaying(false)
        },
      })

      howlRef.current = howl
      howl.play()
    },
    [isMuted, volume],
  )

  return { play, stop, isPlaying }
}
```

- [ ] **Step 2: Create AudioProvider**

```tsx
// src/shared/audio/AudioProvider.tsx

import { createContext, useContext, type ReactNode } from 'react'
import { useAudio } from './useAudio'

interface AudioContextValue {
  play: (url: string) => void
  stop: () => void
  isPlaying: boolean
}

const AudioContext = createContext<AudioContextValue | null>(null)

export const AudioProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const audio = useAudio()
  return <AudioContext.Provider value={audio}>{children}</AudioContext.Provider>
}

export const useAudioContext = (): AudioContextValue => {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudioContext must be used within AudioProvider')
  return ctx
}
```

- [ ] **Step 3: Commit**

```bash
git add src/shared/audio/
git commit -m "feat: agregar audio provider con Howler.js fade-in/out"
```

---

### Task 11: App shell with routing and providers

**Files:**
- Modify: `src/App.tsx`, `src/main.tsx`

- [ ] **Step 1: Setup App with Router + Providers**

```tsx
// src/App.tsx

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ThemeProvider } from '@/shared/theme/ThemeProvider'
import { AudioProvider } from '@/shared/audio/AudioProvider'
import { HomeScreen } from '@/features/home/HomeScreen'
import { PhraseScreen } from '@/features/phrase/PhraseScreen'

const AdminLayout = lazy(() => import('@/features/admin/AdminLayout'))
const LoginScreen = lazy(() => import('@/features/admin/LoginScreen'))
const EstadosPage = lazy(() => import('@/features/admin/EstadosPage'))
const FrasesPage = lazy(() => import('@/features/admin/FrasesPage'))
const UploadsPage = lazy(() => import('@/features/admin/UploadsPage'))
const ProtectedRoute = lazy(() => import('@/features/admin/ProtectedRoute'))

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AudioProvider>
          <Suspense fallback={<div className="min-h-screen bg-warm-black" />}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/phrase/:moodName" element={<PhraseScreen />} />
              <Route path="/admin/login" element={<LoginScreen />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="estados" replace />} />
                  <Route path="estados" element={<EstadosPage />} />
                  <Route path="frases" element={<FrasesPage />} />
                  <Route path="uploads" element={<UploadsPage />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </AudioProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 2: Create placeholder components for all routes**

Create minimal placeholder files for every route component that just renders the route name, so the app compiles and routes work. Each file exports a default component.

Files to create:
- `src/features/home/HomeScreen.tsx`
- `src/features/phrase/PhraseScreen.tsx`
- `src/features/admin/LoginScreen.tsx`
- `src/features/admin/AdminLayout.tsx`
- `src/features/admin/EstadosPage.tsx`
- `src/features/admin/FrasesPage.tsx`
- `src/features/admin/UploadsPage.tsx`

Example placeholder:
```tsx
const HomeScreen = (): JSX.Element => {
  return <div>HomeScreen</div>
}

export { HomeScreen }
```

Admin components must use `export default` for lazy loading.

- [ ] **Step 3: Verify all routes work**

```bash
pnpm dev
```

Navigate to `/`, `/phrase/test`, `/admin/login`, `/admin/estados`, `/admin/frases`, `/admin/uploads`. Each should show its name.

- [ ] **Step 4: Commit**

```bash
git add src/
git commit -m "feat: agregar app shell con routing y providers"
```

---

## Phase 3: Public Experience — Home

### Task 12: MoodCell component

**Files:**
- Create: `src/features/home/MoodCell.tsx`

- [ ] **Step 1: Build MoodCell**

Renders the emoji/icon, name, and handles tap. Uses Framer Motion for hover/tap animation. Resolves iconUrl vs emoji. Touch target 80px minimum.

- [ ] **Step 2: Verify it renders in isolation**

Temporarily render in HomeScreen with mock data.

- [ ] **Step 3: Commit**

```bash
git add src/features/home/MoodCell.tsx
git commit -m "feat: agregar componente MoodCell con resolucion de icono"
```

---

### Task 13: MoodGrid component

**Files:**
- Create: `src/features/home/MoodGrid.tsx`

- [ ] **Step 1: Build MoodGrid**

3-column CSS grid. Maps `estados` from store to MoodCells. Shows skeleton loader while loading. Shows error state with retry button. Shows empty state message if no estados.

- [ ] **Step 2: Commit**

```bash
git add src/features/home/MoodGrid.tsx
git commit -m "feat: agregar MoodGrid con estados de carga/error/vacio"
```

---

### Task 14: HomeScreen with greeting, grid, and theme toggle

**Files:**
- Modify: `src/features/home/HomeScreen.tsx`

- [ ] **Step 1: Build HomeScreen**

Full implementation: ambient orbs (CSS), contextual greeting, question text, MoodGrid, theme toggle button. Calls `loadEstados` on mount. On mood tap: `setActiveMood` + navigate to `/phrase/{moodName}`. Dark/light mode styles via Tailwind `dark:` classes. Stagger animation on MoodCells via Framer Motion.

- [ ] **Step 2: Test with backend running**

Start the Spring Boot backend, verify estados load and display.

- [ ] **Step 3: Commit**

```bash
git add src/features/home/
git commit -m "feat: implementar HomeScreen con seleccion de mood y theming"
```

---

## Phase 4: Public Experience — Phrase + Swipe

### Task 15: SwipeCard component

**Files:**
- Create: `src/features/phrase/SwipeCard.tsx`

- [ ] **Step 1: Build SwipeCard**

Displays phrase text in mood font, emoji, mood label. Semi-transparent background with mood color. Shows "♡ GUARDADA" and "SIGUIENTE" badges with dynamic opacity. Styled for both dark and light mode.

- [ ] **Step 2: Commit**

```bash
git add src/features/phrase/SwipeCard.tsx
git commit -m "feat: agregar SwipeCard con estilos por mood y badges"
```

---

### Task 16: SwipeStack with gesture logic

**Files:**
- Create: `src/features/phrase/SwipeStack.tsx`

- [ ] **Step 1: Build SwipeStack**

Uses `@use-gesture/react` for drag detection. Manages card stack (active + 2 behind). Handles swipe right (toggleFavorite + addExcludedId + fetch next), swipe left (addExcludedId + fetch next). Spring snap-back when under threshold. Framer Motion for card fly-out animation. Respects `prefers-reduced-motion`. Keyboard: Enter = right, Backspace = left.

- [ ] **Step 2: Commit**

```bash
git add src/features/phrase/SwipeStack.tsx
git commit -m "feat: agregar SwipeStack con logica de gestos tipo Tinder"
```

---

### Task 17: SwipeHints and EmptyCard

**Files:**
- Create: `src/features/phrase/SwipeHints.tsx`, `src/features/phrase/EmptyCard.tsx`

- [ ] **Step 1: Build SwipeHints**

"← siguiente / guardar →" indicators. Check localStorage `tonin_hints_seen`. If seen, don't render. After first swipe, set flag and fade out.

- [ ] **Step 2: Build EmptyCard**

Empathetic message: "Ya viste todas las frases para este momento. Vuelve pronto, siempre hay nuevas." Button to reset excludedIds and cycle again.

- [ ] **Step 3: Commit**

```bash
git add src/features/phrase/SwipeHints.tsx src/features/phrase/EmptyCard.tsx
git commit -m "feat: agregar SwipeHints y EmptyCard"
```

---

### Task 18: PhraseScreen — immersive experience

**Files:**
- Modify: `src/features/phrase/PhraseScreen.tsx`

- [ ] **Step 1: Build PhraseScreen**

Full implementation: reads moodName from URL params, finds estado in store, injects mood theme. Renders ambient glows (Framer Motion breathing with duration from `ANIMATION_PRESETS`). Renders SwipeStack. Audio indicator bars. Mute button (always visible). "↩ cambiar" button. On mount: fetch first phrase + play audio. On unmount: stop audio with fade-out. Route transitions via AnimatePresence.

- [ ] **Step 2: Test full flow with backend**

Start backend, select a mood from HomeScreen, verify: transition, phrase loads, glows animate, audio plays, swipe works.

- [ ] **Step 3: Commit**

```bash
git add src/features/phrase/
git commit -m "feat: implementar PhraseScreen con experiencia inmersiva de mood"
```

---

## Phase 5: Admin Panel

### Task 19: ProtectedRoute and LoginScreen

**Files:**
- Create: `src/features/admin/ProtectedRoute.tsx`
- Modify: `src/features/admin/LoginScreen.tsx`

- [ ] **Step 1: Build ProtectedRoute**

Checks localStorage for token. Decodes JWT payload to verify expiration (no server call). If no token or expired → redirect to `/admin/login`. Wraps with `<Outlet />`.

- [ ] **Step 2: Build LoginScreen**

shadcn/ui form: username + password. Calls `login()` endpoint. On success: stores token in localStorage, navigates to `/admin/estados`. Shows error toast on failure.

- [ ] **Step 3: Wire ProtectedRoute into AdminLayout**

- [ ] **Step 4: Commit**

```bash
git add src/features/admin/ProtectedRoute.tsx src/features/admin/LoginScreen.tsx
git commit -m "feat: agregar autenticacion admin con guard JWT"
```

---

### Task 20: AdminLayout with sidebar

**Files:**
- Modify: `src/features/admin/AdminLayout.tsx`

- [ ] **Step 1: Build AdminLayout**

Fixed sidebar with links: Estados, Frases, Uploads. Mobile: hamburger menu. Active link highlight. Logout button (clears token + redirect). Renders `<Outlet />` for nested routes. Wrapped in ProtectedRoute.

- [ ] **Step 2: Commit**

```bash
git add src/features/admin/AdminLayout.tsx
git commit -m "feat: agregar layout admin con sidebar de navegacion"
```

---

### Task 21: Estados CRUD page

**Files:**
- Create: `src/features/admin/EstadoForm.tsx`
- Modify: `src/features/admin/EstadosPage.tsx`

- [ ] **Step 1: Build EstadosPage**

shadcn Table listing all estados. Columns: nombre, emoji/icon preview, color swatches, font, animation, actions (edit/delete). Add button opens dialog with EstadoForm.

- [ ] **Step 2: Build EstadoForm**

Form fields: nombre (input), emoji (input), iconUrl (file upload with preview), colorPrimario (color input), colorSecundario (color input), fontFamily (select from curated list with preview), animationType (select: float/pulse/wave/fade), musicaUrl (file upload), imagenUrl (file upload). Uses upload endpoints for files. Zod validation.

- [ ] **Step 3: Test CRUD operations with backend**

- [ ] **Step 4: Commit**

```bash
git add src/features/admin/EstadosPage.tsx src/features/admin/EstadoForm.tsx
git commit -m "feat: agregar pagina CRUD de Estados en admin"
```

---

### Task 22: Frases CRUD page

**Files:**
- Create: `src/features/admin/FraseForm.tsx`
- Modify: `src/features/admin/FrasesPage.tsx`

- [ ] **Step 1: Build FrasesPage**

shadcn Table: texto (truncated), estado de animo (emoji + name), actions. Add button opens dialog.

- [ ] **Step 2: Build FraseForm**

Textarea (5-500 chars, live char count). Estado select (emoji + name dropdown). Helper text for negative states. Zod validation.

- [ ] **Step 3: Test CRUD with backend**

- [ ] **Step 4: Commit**

```bash
git add src/features/admin/FrasesPage.tsx src/features/admin/FraseForm.tsx
git commit -m "feat: agregar pagina CRUD de Frases en admin"
```

---

### Task 23: Uploads page

**Files:**
- Modify: `src/features/admin/UploadsPage.tsx`

- [ ] **Step 1: Build UploadsPage**

Two sections: Images and Audio. Drag & drop zone for each. Frontend MIME validation before upload. Preview (img thumbnail / audio player). Session-local list of uploaded files. Delete button per file.

- [ ] **Step 2: Test uploads with backend + Wasabi**

- [ ] **Step 3: Commit**

```bash
git add src/features/admin/UploadsPage.tsx
git commit -m "feat: agregar pagina de Uploads con drag & drop"
```

---

## Phase 6: Polish & Accessibility

### Task 24: Accessibility pass

**Files:**
- Modify: multiple components

- [ ] **Step 1: Add `prefers-reduced-motion` support**

In all animated components: check `window.matchMedia('(prefers-reduced-motion: reduce)')`. Disable breathing/float/fly-out animations. Swipe gesture still works but snaps instead of animating.

- [ ] **Step 2: Add ARIA attributes**

`aria-live="polite"` on phrase text container. `aria-label` on all buttons (theme toggle, mute, back, swipe hints). Semantic HTML: `<main>`, `<nav>`, `<section>`.

- [ ] **Step 3: Verify keyboard navigation**

Tab through all interactive elements. Enter = swipe right, Backspace = swipe left, Escape = go back. Focus rings visible.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: agregar soporte de accesibilidad (reduced motion, ARIA, teclado)"
```

---

### Task 25: Error handling and edge cases

**Files:**
- Modify: multiple components

- [ ] **Step 1: Network error handling**

HomeScreen: skeleton + retry on API fail. PhraseScreen: toast "Sin conexión" on fetch fail, keep current card. Admin: toast on CRUD errors.

- [ ] **Step 2: Image error handling**

`onError` handler on all `<img>` tags — hide broken image, show gradient fallback.

- [ ] **Step 3: Empty states**

No estados: "Aún no hay estados de ánimo." No phrases: EmptyCard already handled. Admin empty tables: "No hay datos."

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: agregar manejo de errores y edge cases"
```

---

### Task 26: Environment config and build verification

**Files:**
- Create: `.env`, `.env.example`
- Modify: `vite.config.ts`

- [ ] **Step 1: Create .env**

```
VITE_API_URL=http://localhost:8080
```

- [ ] **Step 2: Create .env.example**

```
VITE_API_URL=http://localhost:8080
```

- [ ] **Step 3: Verify production build**

```bash
pnpm build
pnpm preview
```

Test all routes in preview mode.

- [ ] **Step 4: Commit**

```bash
git add .env .env.example vite.config.ts
git commit -m "chore: agregar configuracion de entorno y verificar build de produccion"
```

---

## Summary

| Phase | Tasks | What it delivers |
|-------|-------|-----------------|
| 1. Scaffold | 1-4 | Working Vite + React + Tailwind + shadcn project |
| 2. Infrastructure | 5-12 | API client, store, hooks, theme, audio, routing |
| 3. Home | 13-15 | Public home screen with mood selection |
| 4. Phrase + Swipe | 16-19 | Immersive phrase experience with Tinder swipe |
| 5. Admin | 20-24 | Full CRUD admin panel with auth |
| 6. Polish | 25-27 | Accessibility, error handling, build |
