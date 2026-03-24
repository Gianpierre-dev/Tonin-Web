import { motion } from 'framer-motion'
import type { EstadoAnimoDTO } from '@/lib/schemas'

interface MoodCellProps {
  estado: EstadoAnimoDTO
  onSelect: (estado: EstadoAnimoDTO) => void
}

export const MoodCell = ({ estado, onSelect }: MoodCellProps): React.JSX.Element => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(estado)}
      className="flex min-h-[80px] min-w-[80px] flex-col items-center justify-center gap-2 rounded-2xl border border-black/5 bg-white/5 p-4 transition-colors hover:bg-white/10 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
      aria-label={`Seleccionar estado: ${estado.nombre}`}
    >
      {estado.iconUrl ? (
        <img
          src={estado.iconUrl}
          alt={estado.nombre}
          className="h-10 w-10 object-contain"
          loading="lazy"
        />
      ) : (
        <span className="text-3xl leading-none" role="img" aria-hidden="true">
          {estado.emoji}
        </span>
      )}
      <span className="text-sm font-medium capitalize text-text-light dark:text-text-dark">
        {estado.nombre.toLowerCase()}
      </span>
    </motion.button>
  )
}
