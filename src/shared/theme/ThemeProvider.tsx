import React, { type ReactNode } from 'react'
import { useTheme } from './useTheme'
import { useMoodTheme } from './useMoodTheme'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * La sincronización de idioma (lang ↔ i18n ↔ <html lang>) ya NO vive acá.
 * Se hace en `src/i18n/index.ts` vía `useAppStore.subscribe()` para no
 * disparar re-renders del árbol completo en cada toggle.
 */
export const ThemeProvider = ({ children }: ThemeProviderProps): React.JSX.Element => {
  useTheme()
  useMoodTheme()
  return <>{children}</>
}
