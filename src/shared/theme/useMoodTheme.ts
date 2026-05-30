import { useEffect } from 'react'
import { useAppStore } from '@/shared/store/useAppStore'
import { loadFont } from '@/lib/utils'
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

    if (activeMood.colorPrimario) {
      root.style.setProperty('--mood-primary', activeMood.colorPrimario)
    }
    if (activeMood.colorSecundario) {
      root.style.setProperty('--mood-secondary', activeMood.colorSecundario)
    }
    // Whitelist: solo seteamos la CSS var si la fuente está en la lista
    // permitida. Sin esto, un valor con comilla simple o `;` desde el back
    // podía pisar la cascada (CSS injection).
    if (isAllowedFont(activeMood.fontFamily)) {
      loadFont(activeMood.fontFamily)
      root.style.setProperty('--mood-font', `'${activeMood.fontFamily}', 'Outfit', system-ui, sans-serif`)
    }
  }, [activeMood])
}
