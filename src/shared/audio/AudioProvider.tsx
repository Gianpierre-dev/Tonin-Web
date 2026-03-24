import React, { createContext, useContext, type ReactNode } from 'react'
import { useAudio } from './useAudio'

interface AudioContextValue {
  play: (url: string) => void
  stop: () => void
  isPlaying: boolean
}

const AudioContext = createContext<AudioContextValue | null>(null)

export const AudioProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const audio = useAudio()
  return <AudioContext.Provider value={audio}>{children}</AudioContext.Provider>
}

export const useAudioContext = (): AudioContextValue => {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudioContext must be used within AudioProvider')
  return ctx
}
