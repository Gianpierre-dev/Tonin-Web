import React from 'react'

const HINTS_STORAGE_KEY = 'tonin_hints_seen'

interface SwipeHintsProps {
  visible: boolean
}

export const SwipeHints = ({ visible }: SwipeHintsProps): React.JSX.Element | null => {
  const alreadySeen = localStorage.getItem(HINTS_STORAGE_KEY) === 'true'

  if (alreadySeen || !visible) return null

  return (
    <div className="flex w-full max-w-sm justify-between px-6 opacity-20" aria-hidden="true">
      <span className="text-xs text-text-dark">← siguiente</span>
      <span className="text-xs text-text-dark">guardar →</span>
    </div>
  )
}

export const markHintsSeen = (): void => {
  localStorage.setItem(HINTS_STORAGE_KEY, 'true')
}
