import React, { useState } from 'react'
import type { FraseDTO } from '@/lib/schemas'

interface SwipeCardProps {
  frase: FraseDTO
  badgeOpacity: number
  direction: 'left' | 'right' | null
}

export const SwipeCard = ({
  frase,
  badgeOpacity,
  direction,
}: SwipeCardProps): React.JSX.Element => {
  const colorPrimario = frase.estadoAnimo.colorPrimario ?? '#c4a882'
  const emoji = frase.estadoAnimo.emoji
  const iconUrl = frase.estadoAnimo.iconUrl
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className="relative w-full max-w-sm rounded-3xl px-8 py-10 select-none"
      style={{
        background: `rgba(${hexToRgb(colorPrimario)}, 0.04)`,
        border: `1px solid rgba(${hexToRgb(colorPrimario)}, 0.08)`,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Badge: GUARDADA (right swipe) */}
      <div
        className="absolute top-6 left-6 rounded-lg border-2 border-green-400 px-3 py-1 text-sm font-bold text-green-400"
        style={{
          opacity: direction === 'right' ? badgeOpacity : 0,
          transform: 'rotate(-12deg)',
          transition: 'opacity 50ms ease-out',
        }}
        aria-hidden="true"
      >
        ♡ GUARDADA
      </div>

      {/* Badge: SIGUIENTE (left swipe) */}
      <div
        className="absolute top-6 right-6 rounded-lg border-2 border-orange-400 px-3 py-1 text-sm font-bold text-orange-400"
        style={{
          opacity: direction === 'left' ? badgeOpacity : 0,
          transform: 'rotate(12deg)',
          transition: 'opacity 50ms ease-out',
        }}
        aria-hidden="true"
      >
        SIGUIENTE →
      </div>

      {/* Emoji / Icon */}
      <div className="mb-6 mt-4 flex justify-center text-5xl">
        {iconUrl && !imgError ? (
          <img
            src={iconUrl}
            alt={frase.estadoAnimo.nombre}
            className="h-12 w-12 object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{emoji}</span>
        )}
      </div>

      {/* Phrase text */}
      <p
        aria-live="polite"
        className="text-center text-xl leading-relaxed text-text-dark dark:text-text-dark"
        style={{
          fontFamily: 'var(--mood-font)',
          fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
          maxHeight: '60vh',
          overflowY: 'auto',
        }}
      >
        {frase.texto}
      </p>
    </div>
  )
}

function hexToRgb(hex: string): string {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}
