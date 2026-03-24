import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/shared/store/useAppStore'
import { useAudioContext } from '@/shared/audio/AudioProvider'
import { ANIMATION_PRESETS, DEFAULT_ANIMATION } from '@/lib/constants'
import type { AnimationConfig } from '@/lib/constants'
import { SwipeStack } from './SwipeStack'
import { SwipeHints, markHintsSeen } from './SwipeHints'

export const PhraseScreen = (): React.JSX.Element => {
  const { moodName } = useParams<{ moodName: string }>()
  const navigate = useNavigate()
  const estados = useAppStore((s) => s.estados)
  const setActiveMood = useAppStore((s) => s.setActiveMood)
  const clearActiveMood = useAppStore((s) => s.clearActiveMood)
  const isMuted = useAppStore((s) => s.isMuted)
  const toggleMute = useAppStore((s) => s.toggleMute)
  const { play, stop, isPlaying } = useAudioContext()
  const [hintsVisible, setHintsVisible] = useState(true)

  const estado = useMemo(
    () => estados.find((e) => e.nombre.toLowerCase() === moodName?.toLowerCase()),
    [estados, moodName],
  )

  const colorPrimario = estado?.colorPrimario ?? '#c4a882'
  const colorSecundario = estado?.colorSecundario ?? '#a89278'

  const animConfig = useMemo((): AnimationConfig => {
    const type = estado?.animationType ?? DEFAULT_ANIMATION
    const preset = ANIMATION_PRESETS[type] ?? ANIMATION_PRESETS[DEFAULT_ANIMATION]
    // DEFAULT_ANIMATION ('fade') always exists in ANIMATION_PRESETS
    return preset ?? { duration: 10, opacity: [0.7, 1], ease: 'easeInOut' as const }
  }, [estado])

  // Set active mood on mount, clear on unmount
  useEffect(() => {
    if (estado) {
      setActiveMood(estado)
    }
    return () => {
      clearActiveMood()
    }
  }, [estado, setActiveMood, clearActiveMood])

  // Start audio on mount
  useEffect(() => {
    if (estado?.musicaUrl) {
      play(estado.musicaUrl)
    }
    return () => {
      stop()
    }
  }, [estado?.musicaUrl, play, stop])

  // Redirect if estado not found (after estados are loaded)
  useEffect(() => {
    if (estados.length > 0 && !estado) {
      void navigate('/', { replace: true })
    }
  }, [estados, estado, navigate])

  const handleBack = useCallback(() => {
    stop()
    void navigate('/')
  }, [stop, navigate])

  const handleSwipe = useCallback(() => {
    if (hintsVisible) {
      setHintsVisible(false)
      markHintsSeen()
    }
  }, [hintsVisible])

  if (!estado) {
    return <div className="min-h-screen bg-warm-black" />
  }

  // Build animation props for breathing glows
  const buildBreathingAnimation = () => {
    const animateProps: Record<string, number[]> = {}
    if (animConfig.opacity) animateProps.opacity = animConfig.opacity
    if (animConfig.scale) animateProps.scale = animConfig.scale
    if (animConfig.y) animateProps.y = animConfig.y
    if (animConfig.rotate) animateProps.rotate = animConfig.rotate

    // Fallback: at minimum animate opacity
    if (Object.keys(animateProps).length === 0) {
      animateProps.opacity = [0.7, 1]
    }

    return {
      animate: animateProps,
      transition: {
        duration: animConfig.duration,
        ease: animConfig.ease,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    }
  }

  const breathingAnim = buildBreathingAnimation()

  return (
    <AnimatePresence>
      <motion.div
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <motion.div
            className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${colorPrimario}40 0%, transparent 70%)`,
            }}
            {...breathingAnim}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${colorSecundario}30 0%, transparent 70%)`,
            }}
            animate={{
              ...breathingAnim.animate,
              ...(animConfig.y ? { y: animConfig.y.map((v) => -v) } : {}),
            }}
            transition={{
              ...breathingAnim.transition,
              delay: 1.5,
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${colorPrimario}20 0%, transparent 70%)`,
            }}
            animate={{
              ...breathingAnim.animate,
              ...(animConfig.scale ? { scale: animConfig.scale.map((v) => v * 0.9) } : {}),
            }}
            transition={{
              ...breathingAnim.transition,
              delay: 3,
            }}
          />
        </div>

        {/* Audio indicator + mute button (top-right) */}
        <div className="absolute right-4 top-4 z-20 flex items-center gap-3">
          {/* Audio bars */}
          {isPlaying && !isMuted && (
            <div className="flex items-end gap-0.5 h-5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full"
                  style={{
                    backgroundColor: colorPrimario,
                    animation: `audioBar 1.2s ease-in-out ${i * 0.15}s infinite alternate`,
                    height: '40%',
                  }}
                />
              ))}
            </div>
          )}

          {/* Mute button */}
          <button
            type="button"
            onClick={toggleMute}
            className="flex h-10 w-10 items-center justify-center rounded-full text-lg transition-colors"
            style={{
              background: `rgba(${hexToRgb(colorPrimario)}, 0.1)`,
            }}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>

        {/* Swipe stack */}
        <motion.div
          className="relative z-10 flex w-full flex-col items-center gap-4 px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <SwipeStack
            moodName={moodName ?? ''}
            colorPrimario={colorPrimario}
            onSwipe={handleSwipe}
            onBack={handleBack}
          />

          {/* Hints */}
          <SwipeHints visible={hintsVisible} />

          {/* Mood label */}
          <p
            className="mt-2 text-xs uppercase tracking-widest opacity-15"
            style={{ color: colorPrimario }}
          >
            {estado.nombre}
          </p>
        </motion.div>

        {/* Back button */}
        <motion.button
          type="button"
          onClick={handleBack}
          className="absolute bottom-8 z-20 rounded-full px-5 py-2 text-sm transition-colors"
          style={{
            color: colorPrimario,
            background: `rgba(${hexToRgb(colorPrimario)}, 0.08)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ↩ cambiar
        </motion.button>

        {/* Audio bar keyframes (injected via style tag) */}
        <style>{`
          @keyframes audioBar {
            0% { height: 20%; }
            100% { height: 100%; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  )
}

function hexToRgb(hex: string): string {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}
