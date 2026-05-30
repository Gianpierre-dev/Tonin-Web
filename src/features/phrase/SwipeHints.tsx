import React from 'react'
import { useTranslation } from 'react-i18next'

const HINTS_STORAGE_KEY = 'tonin_hints_seen'

interface SwipeHintsProps {
  visible: boolean
}

export const SwipeHints = ({ visible }: SwipeHintsProps): React.JSX.Element | null => {
  const { t } = useTranslation()
  const alreadySeen = localStorage.getItem(HINTS_STORAGE_KEY) === 'true'

  if (alreadySeen || !visible) return null

  return (
    <div className="flex w-full max-w-sm justify-between px-6 opacity-20" aria-hidden="true">
      <span className="text-xs text-text-dark">{t('phrase.hintNext')}</span>
      <span className="text-xs text-text-dark">{t('phrase.hintSave')}</span>
    </div>
  )
}

export const markHintsSeen = (): void => {
  localStorage.setItem(HINTS_STORAGE_KEY, 'true')
}
