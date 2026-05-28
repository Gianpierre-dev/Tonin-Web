import React from 'react'
import { hexToRgb } from '@/lib/utils'

interface EmptyCardProps {
  colorPrimario: string
  onReset: () => void
}

export const EmptyCard = ({ colorPrimario, onReset }: EmptyCardProps): React.JSX.Element => {
  return (
    <div
      className="flex w-full max-w-sm flex-col items-center justify-center rounded-3xl px-8 py-12 text-center select-none"
      style={{
        background: `rgba(${hexToRgb(colorPrimario)}, 0.04)`,
        border: `1px solid rgba(${hexToRgb(colorPrimario)}, 0.08)`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <p
        className="mb-8 text-lg leading-relaxed text-text-dark"
        style={{ fontFamily: 'var(--mood-font)' }}
      >
        Ya viste todas las frases para este momento. Vuelve pronto, siempre hay nuevas.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
        style={{
          background: `rgba(${hexToRgb(colorPrimario)}, 0.15)`,
          color: colorPrimario,
          border: `1px solid rgba(${hexToRgb(colorPrimario)}, 0.2)`,
        }}
      >
        Ver de nuevo
      </button>
    </div>
  )
}

