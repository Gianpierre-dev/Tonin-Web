import { useRef, useCallback, useState, useEffect } from 'react'
import { Howl } from 'howler'
import { useAppStore } from '@/shared/store/useAppStore'
import { AUDIO_FADE_IN_MS, AUDIO_FADE_OUT_MS } from '@/lib/constants'

interface UseAudioReturn {
  play: (url: string) => void
  stop: () => void
  isPlaying: boolean
}

export const useAudio = (): UseAudioReturn => {
  const howlRef = useRef<Howl | null>(null)
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const isMuted = useAppStore((s) => s.isMuted)
  const volume = useAppStore((s) => s.volume)

  // Propagar mute/volume al Howl en curso. Sin esto, tocar el botón de mute
  // solo cambiaba el icono pero la música seguía sonando (bug original).
  useEffect(() => {
    howlRef.current?.mute(isMuted)
  }, [isMuted])

  useEffect(() => {
    if (!isMuted) {
      howlRef.current?.volume(volume)
    }
  }, [volume, isMuted])

  const stop = useCallback(() => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current)
      fadeTimeoutRef.current = null
    }
    const howl = howlRef.current
    if (!howl) return
    howl.fade(howl.volume(), 0, AUDIO_FADE_OUT_MS)
    fadeTimeoutRef.current = setTimeout(() => {
      howl.unload()
      // Solo limpiar la ref si seguimos apuntando al mismo howl (evita pisar
      // un howl nuevo creado por un `play` rápido durante el fade-out).
      if (howlRef.current === howl) {
        howlRef.current = null
      }
      fadeTimeoutRef.current = null
      setIsPlaying(false)
    }, AUDIO_FADE_OUT_MS)
  }, [])

  // `play` no depende de isMuted/volume: el estado actual se lee fresco al
  // arrancar, y los useEffect de arriba propagan cambios subsiguientes.
  const play = useCallback((url: string) => {
    // Cancelar cualquier fade-out pendiente del Howl anterior.
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current)
      fadeTimeoutRef.current = null
    }
    if (howlRef.current) {
      howlRef.current.unload()
    }

    const howl = new Howl({
      src: [url],
      loop: true,
      volume: 0,
      html5: true,
      onplay: () => {
        setIsPlaying(true)
        // Leer estado actual al momento del onplay (no de la creación).
        const { isMuted: muted, volume: vol } = useAppStore.getState()
        howl.mute(muted)
        howl.fade(0, vol, AUDIO_FADE_IN_MS)
      },
      onloaderror: () => {
        setIsPlaying(false)
      },
    })

    howlRef.current = howl
    howl.play()
  }, [])

  return { play, stop, isPlaying }
}
