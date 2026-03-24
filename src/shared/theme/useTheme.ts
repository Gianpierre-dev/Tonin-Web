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
