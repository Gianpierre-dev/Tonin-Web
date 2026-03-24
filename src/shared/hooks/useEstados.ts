import { useEffect } from 'react'
import { useAppStore } from '@/shared/store/useAppStore'

export const useEstados = () => {
  const estados = useAppStore((s) => s.estados)
  const loading = useAppStore((s) => s.estadosLoading)
  const error = useAppStore((s) => s.estadosError)
  const loadEstados = useAppStore((s) => s.loadEstados)

  useEffect(() => {
    if (estados.length === 0 && !loading) {
      void loadEstados()
    }
  }, [estados.length, loading, loadEstados])

  return { estados, loading, error, retry: loadEstados }
}
