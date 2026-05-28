import { useEffect } from 'react'
import { useAppStore } from '@/shared/store/useAppStore'

export const useEstados = () => {
  const estados = useAppStore((s) => s.estados)
  const loaded = useAppStore((s) => s.estadosLoaded)
  const loading = useAppStore((s) => s.estadosLoading)
  const error = useAppStore((s) => s.estadosError)
  const loadEstados = useAppStore((s) => s.loadEstados)

  useEffect(() => {
    if (!loaded && !loading) {
      void loadEstados()
    }
  }, [loaded, loading, loadEstados])

  return { estados, loading, error, retry: loadEstados }
}
