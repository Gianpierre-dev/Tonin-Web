import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'

/**
 * Inicialización de i18n.
 *
 * - Recursos locales (JSON), no HTTP backend.
 * - El idioma activo lo gobierna el store de zustand (`lang`), no un detector
 *   del navegador. `useLanguageSync` se encarga de mantenerlos en fase.
 * - `fallbackLng: 'es'` cubre claves faltantes en `en` mientras la traducción crece.
 */
void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false }, // React ya escapa el render.
  returnNull: false,
})

export default i18n
