import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useAppStore } from '@/shared/store/useAppStore'
import { getGreeting } from '@/lib/utils'
import type { EstadoAnimoDTO } from '@/lib/schemas'
import { MoodGrid } from './MoodGrid'

const THEME_CYCLE: Array<'system' | 'dark' | 'light'> = ['system', 'dark', 'light']

const ThemeToggle = (): React.JSX.Element => {
  const themeMode = useAppStore((s) => s.themeMode)
  const setThemeMode = useAppStore((s) => s.setThemeMode)

  const cycleTheme = (): void => {
    const currentIndex = THEME_CYCLE.indexOf(themeMode)
    const nextIndex = (currentIndex + 1) % THEME_CYCLE.length
    setThemeMode(THEME_CYCLE[nextIndex] ?? 'system')
  }

  const icon = themeMode === 'dark' ? '☽' : themeMode === 'light' ? '☀' : '⚙'
  const label =
    themeMode === 'system'
      ? 'Tema: sistema'
      : themeMode === 'dark'
        ? 'Tema: oscuro'
        : 'Tema: claro'

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-text-light/60 transition-colors hover:bg-black/5 dark:text-text-dark/60 dark:hover:bg-white/10"
    >
      {icon}
    </button>
  )
}

export const HomeScreen = (): React.JSX.Element => {
  const navigate = useNavigate()
  const setActiveMood = useAppStore((s) => s.setActiveMood)

  const handleSelect = useCallback(
    (estado: EstadoAnimoDTO) => {
      setActiveMood(estado)
      void navigate(`/phrase/${estado.nombre.toLowerCase()}`)
    },
    [setActiveMood, navigate],
  )

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-warm-cream px-6 py-12 dark:bg-warm-black">
      {/* Ambient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 animate-[drift_20s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,183,130,0.15),transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(196,168,130,0.08),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 animate-[drift_25s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle,rgba(255,200,180,0.12),transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(168,146,120,0.06),transparent_70%)]"
      />

      {/* Top bar */}
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="z-10 flex flex-col items-center gap-8">
        {/* Brand */}
        <img
          src="/logoSOMA.png"
          alt="SOMA"
          className="h-20 w-auto select-none"
          draggable={false}
        />

        {/* Greeting */}
        <p className="text-sm font-light tracking-wide text-text-light/50 dark:text-text-dark/50">
          {getGreeting()}
        </p>

        {/* Question */}
        <h1
          className="max-w-xs text-center text-2xl font-light leading-relaxed text-text-light dark:text-text-dark sm:text-3xl"
          style={{ fontFamily: "'Cormorant Garamond', 'Outfit', serif" }}
        >
          ¿Cómo te sientes en este momento?
        </h1>

        {/* Mood grid */}
        <MoodGrid onSelect={handleSelect} />
      </div>
    </main>
  )
}
