import React, { type ReactNode } from 'react'
import { useTheme } from './useTheme'
import { useMoodTheme } from './useMoodTheme'

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps): React.JSX.Element => {
  useTheme()
  useMoodTheme()
  return <>{children}</>
}
