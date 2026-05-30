import { useEffect } from 'react'
import i18n from '@/i18n'
import { useAppStore } from '@/shared/store/useAppStore'

/**
 * Mantiene `i18n.language` en sincronía con el `lang` persistido en el store.
 * El store es la fuente de verdad del idioma activo; i18n se adapta.
 */
export const useLanguageSync = (): void => {
  const lang = useAppStore((s) => s.lang)

  useEffect(() => {
    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang)
    }
  }, [lang])
}
