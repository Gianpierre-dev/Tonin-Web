import { useRef, useCallback, useState } from 'react'
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
  const [isPlaying, setIsPlaying] = useState(false)
  const isMuted = useAppStore((s) => s.isMuted)
  const volume = useAppStore((s) => s.volume)

  const stop = useCallback(() => {
    const howl = howlRef.current
    if (!howl) return
    howl.fade(howl.volume(), 0, AUDIO_FADE_OUT_MS)
    setTimeout(() => {
      howl.unload()
      howlRef.current = null
      setIsPlaying(false)
    }, AUDIO_FADE_OUT_MS)
  }, [])

  const play = useCallback(
    (url: string) => {
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
          if (!isMuted) {
            howl.fade(0, volume, AUDIO_FADE_IN_MS)
          }
        },
        onloaderror: () => {
          setIsPlaying(false)
        },
      })

      howlRef.current = howl
      howl.play()
    },
    [isMuted, volume],
  )

  return { play, stop, isPlaying }
}
