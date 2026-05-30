import { useState, useCallback } from 'react'
import i18n from '@/i18n'
import { getFraseRandom } from '@/shared/api/endpoints'
import { useAppStore } from '@/shared/store/useAppStore'
import { logError } from '@/lib/logError'
import type { FraseDTO } from '@/lib/schemas'

interface UseFraseRandomReturn {
  frase: FraseDTO | null
  isEmpty: boolean
  loading: boolean
  error: string | null
  fetchNext: () => Promise<void>
}

export const useFraseRandom = (codigo: string): UseFraseRandomReturn => {
  const [frase, setFrase] = useState<FraseDTO | null>(null)
  const [isEmpty, setIsEmpty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const addExcludedId = useAppStore((s) => s.addExcludedId)

  // No leemos `excludedIds` con suscripción (provocaba stale closure: la
  // versión vieja se cerraba dentro de `fetchNext` y al swipear rápido las
  // frases se repetían). Lo leemos fresco con `getState()` en cada llamada.
  const fetchNext = useCallback(async () => {
    setLoading(true)
    setError(null)
    setIsEmpty(false) // limpiar bandera previa antes del intento
    try {
      const currentExcluded = useAppStore.getState().excludedIds
      const result = await getFraseRandom(codigo, currentExcluded)
      if (result === null) {
        setFrase(null) // limpiar frase vieja si el back ya no tiene más
        setIsEmpty(true)
      } else {
        setFrase(result)
        addExcludedId(result.id)
      }
    } catch (err) {
      logError('useFraseRandom.fetchNext', err, { codigo })
      // `i18n.t` global: el mensaje sigue el idioma activo al MOMENTO del error.
      setError(i18n.t('phrase.error'))
    } finally {
      setLoading(false)
    }
  }, [codigo, addExcludedId])

  return { frase, isEmpty, loading, error, fetchNext }
}
