import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/shared/store/useAppStore'

/**
 * Toggle de idioma ES ↔ EN. Lee y escribe el `lang` del store, que es la fuente
 * de verdad. `useLanguageSync` propaga el cambio a i18n.
 */
export const LangToggle = (): React.JSX.Element => {
  const { t } = useTranslation()
  const lang = useAppStore((s) => s.lang)
  const setLang = useAppStore((s) => s.setLang)

  const next = lang === 'es' ? 'en' : 'es'
  const label = t('home.lang.toggle')

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={label}
      title={label}
      className="flex h-10 min-w-10 items-center justify-center rounded-full px-2 text-xs font-semibold uppercase tracking-wide text-text-light/60 transition-colors hover:bg-black/5 dark:text-text-dark/60 dark:hover:bg-white/10"
    >
      {lang}
    </button>
  )
}
