import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { useAppStore } from '@/shared/store/useAppStore'
import { logError } from '@/lib/logError'
import es from './locales/es.json'
import en from './locales/en.json'

/**
 * Inicialización de i18n.
 *
 * - Recursos locales (JSON), no HTTP backend.
 * - El idioma activo lo gobierna el store de zustand (`lang`).
 * - `fallbackLng: 'es'` cubre claves faltantes en `en`.
 *
 * Importante: leemos el `lang` ANTES del primer render para evitar el "flash"
 * de idioma anterior (zustand persist hidrata sincrónicamente desde localStorage).
 * Y nos suscribimos al store FUERA del árbol React para no provocar re-renders
 * globales en cada toggle de idioma.
 */
const initialLang = useAppStore.getState().lang

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: initialLang,
  fallbackLng: 'es',
  interpolation: { escapeValue: false }, // React ya escapa el render.
  returnNull: false,
})

// Reflejar el idioma activo en el atributo `lang` del <html> para lectores de
// pantalla y traductores automáticos.
document.documentElement.setAttribute('lang', initialLang)

// Suscripción zustand SIN React: cambiar `lang` actualiza i18n y <html lang>.
// Antes esto se hacía dentro de un hook montado en el ThemeProvider que envolvía
// toda la app → cada toggle re-renderizaba el árbol entero. Acá no.
useAppStore.subscribe((state, prev) => {
  if (state.lang === prev.lang) return
  document.documentElement.setAttribute('lang', state.lang)
  void i18n.changeLanguage(state.lang).catch((err) => {
    logError('i18n.changeLanguage', err, { lang: state.lang })
  })
})

export default i18n
