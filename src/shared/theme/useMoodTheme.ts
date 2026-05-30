import { useEffect } from 'react'
import { useAppStore } from '@/shared/store/useAppStore'
import { sanitizeHex } from '@/lib/utils'
import { isAllowedFont } from '@/lib/fonts'

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

    // Colores: sanitizamos contra hex válido antes de meterlos en la CSS var.
    // Si el back devuelve algo malformado, queda el fallback de marca.
    if (activeMood.colorPrimario) {
      root.style.setProperty('--mood-primary', sanitizeHex(activeMood.colorPrimario, '#c4a882'))
    }
    if (activeMood.colorSecundario) {
      root.style.setProperty('--mood-secondary', sanitizeHex(activeMood.colorSecundario, '#a89278'))
    }
    // Whitelist: solo seteamos la CSS var si la fuente está en la lista
    // permitida (mitiga CSS injection vía comilla simple/`;` en el valor).
    // Las fuentes ya están bundle-eadas vía index.css, no hace falta cargarlas.
    if (isAllowedFont(activeMood.fontFamily)) {
      root.style.setProperty('--mood-font', `'${activeMood.fontFamily}', 'Outfit', system-ui, sans-serif`)
    }
  }, [activeMood])
}
