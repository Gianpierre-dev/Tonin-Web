import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useEstados } from '@/shared/hooks/useEstados'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import type { EstadoAnimoDTO } from '@/lib/schemas'
import { MoodCell } from './MoodCell'

interface MoodGridProps {
  onSelect: (estado: EstadoAnimoDTO) => void
}

const SKELETON_COUNT = 6

export const MoodGrid = ({ onSelect }: MoodGridProps): React.JSX.Element => {
  const prefersReducedMotion = useReducedMotion()

  const container = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: prefersReducedMotion ? 0 : 0.05 },
      },
    }),
    [prefersReducedMotion],
  )

  const item = useMemo(
    () => ({
      hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 },
      show: { opacity: 1, scale: 1 },
    }),
    [prefersReducedMotion],
  )
  const { estados, loading, error, retry } = useEstados()

  if (loading) {
    return (
      <div className="grid w-full max-w-sm grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <div
            key={i}
            className="flex min-h-[80px] animate-pulse items-center justify-center rounded-2xl bg-white/5 dark:bg-white/5"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-text-light/70 dark:text-text-dark/70">{error}</p>
        <button
          type="button"
          onClick={() => void retry()}
          className="rounded-lg border border-accent/30 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (estados.length === 0) {
    return (
      <p className="text-center text-sm text-text-light/60 dark:text-text-dark/60">
        Aún no hay estados de ánimo. Vuelve pronto.
      </p>
    )
  }

  return (
    <motion.div
      className="grid w-full max-w-sm grid-cols-2 gap-3 sm:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {estados.map((estado) => (
        <motion.div key={estado.id} variants={item}>
          <MoodCell estado={estado} onSelect={onSelect} />
        </motion.div>
      ))}
    </motion.div>
  )
}
