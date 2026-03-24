import { useState, useCallback } from 'react'
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
  const [frase, setFrase] = useState<FraseDTO | null>(null)
  const [isEmpty, setIsEmpty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const excludedIds = useAppStore((s) => s.excludedIds)
  const addExcludedId = useAppStore((s) => s.addExcludedId)

  const fetchNext = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getFraseRandom(moodName, excludedIds)
      if (result === null) {
        setIsEmpty(true)
      } else {
        setFrase(result)
        addExcludedId(result.id)
      }
    } catch {
      setError('Sin conexión')
    } finally {
      setLoading(false)
    }
  }, [moodName, excludedIds, addExcludedId])

  return { frase, isEmpty, loading, error, fetchNext }
}
