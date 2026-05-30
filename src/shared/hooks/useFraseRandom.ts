import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getFraseRandom } from '@/shared/api/endpoints'
import { useAppStore } from '@/shared/store/useAppStore'
import type { FraseDTO } from '@/lib/schemas'

interface UseFraseRandomReturn {
  frase: FraseDTO | null
  isEmpty: boolean
  loading: boolean
  error: string | null
  fetchNext: () => Promise<void>
}

export const useFraseRandom = (moodName: string): UseFraseRandomReturn => {
  const { t } = useTranslation()
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
      const result = await getFraseRandom(moodName, currentExcluded)
      if (result === null) {
        setFrase(null) // limpiar frase vieja si el back ya no tiene más
        setIsEmpty(true)
      } else {
        setFrase(result)
        addExcludedId(result.id)
      }
    } catch {
      setError(t('phrase.error'))
    } finally {
      setLoading(false)
    }
  }, [moodName, addExcludedId, t])

  return { frase, isEmpty, loading, error, fetchNext }
}
