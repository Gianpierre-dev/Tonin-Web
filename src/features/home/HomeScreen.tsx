import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/shared/store/useAppStore'
import { getGreetingKey } from '@/lib/utils'
import type { EstadoAnimoDTO } from '@/lib/schemas'
import { MoodGrid } from './MoodGrid'
import { BrandLogo } from '@/shared/ui/BrandLogo'
import { LangToggle } from '@/shared/ui/LangToggle'

const THEME_CYCLE: Array<'system' | 'dark' | 'light'> = ['system', 'dark', 'light']

const ThemeToggle = (): React.JSX.Element => {
  const { t } = useTranslation()
  const themeMode = useAppStore((s) => s.themeMode)
  const setThemeMode = useAppStore((s) => s.setThemeMode)

  const cycleTheme = (): void => {
    const currentIndex = THEME_CYCLE.indexOf(themeMode)
    const nextIndex = (currentIndex + 1) % THEME_CYCLE.length
    setThemeMode(THEME_CYCLE[nextIndex] ?? 'system')
  }

  const icon = themeMode === 'dark' ? '☽' : themeMode === 'light' ? '☀' : '⚙'
  const label = t(`home.theme.${themeMode}`)

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
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setActiveMood = useAppStore((s) => s.setActiveMood)

  const handleSelect = useCallback(
    (estado: EstadoAnimoDTO) => {
      setActiveMood(estado)
      void navigate(`/phrase/${estado.codigo}`)
    },
    [setActiveMood, navigate],
  )

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-warm-cream px-6 py-12 dark:bg-warm-black">
      {/* Ambient orbs — paleta de marca SOMA (violeta + coral) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 animate-[drift_20s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(96,84,144,0.20),transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(120,96,156,0.14),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 animate-[drift_25s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle,rgba(240,156,108,0.18),transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(240,156,108,0.10),transparent_70%)]"
      />

      {/* Top bar */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1">
        <LangToggle />
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="z-10 flex flex-col items-center gap-8">
        {/* Brand */}
        <BrandLogo withGlow className="h-20" />

        {/* Greeting */}
        <p className="text-sm font-light tracking-wide text-text-light/50 dark:text-text-dark/50">
          {t(getGreetingKey())}
        </p>

        {/* Question */}
        <h1
          className="max-w-xs text-center text-2xl font-light leading-relaxed text-text-light dark:text-text-dark sm:text-3xl"
          style={{ fontFamily: "'Cormorant Garamond', 'Outfit', serif" }}
        >
          {t('home.question')}
        </h1>

        {/* Mood grid */}
        <MoodGrid onSelect={handleSelect} />
      </div>
    </main>
  )
}
