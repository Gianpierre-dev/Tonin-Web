import React, { useEffect, useCallback, useRef, useState } from 'react'
import { hexToRgb } from '@/lib/utils'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { useFraseRandom } from '@/shared/hooks/useFraseRandom'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { useAppStore } from '@/shared/store/useAppStore'
import { SWIPE_THRESHOLD, SWIPE_MAX_ROTATION } from '@/lib/constants'
import { SwipeCard } from './SwipeCard'
import { EmptyCard } from './EmptyCard'

interface SwipeStackProps {
  moodName: string
  colorPrimario: string
  onSwipe: () => void
  onBack: () => void
}

const FLYOUT_DISTANCE = 500
const FLYOUT_ROTATION = 30

export const SwipeStack = ({
  moodName,
  colorPrimario,
  onSwipe,
  onBack,
}: SwipeStackProps): React.JSX.Element => {
  const { frase, isEmpty, loading, error, fetchNext } = useFraseRandom(moodName)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const resetExcluded = useAppStore((s) => s.resetExcluded)

  const prefersReducedMotion = useReducedMotion()
  const hasFetched = useRef(false)
  const isAnimating = useRef(false)
  const [badgeOpacity, setBadgeOpacity] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-SWIPE_MAX_ROTATION, 0, SWIPE_MAX_ROTATION])
  const cardOpacity = useTransform(x, [-FLYOUT_DISTANCE, -200, 0, 200, FLYOUT_DISTANCE], [0, 1, 1, 1, 0])

  // Fetch first phrase on mount
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      void fetchNext()
    }
  }, [fetchNext])

  const handleSwipeComplete = useCallback(
    async (swipeDirection: 'left' | 'right') => {
      if (!frase || isAnimating.current) return
      isAnimating.current = true
      onSwipe()

      if (swipeDirection === 'right') {
        toggleFavorite(frase.id)
      }

      const targetX = swipeDirection === 'right' ? FLYOUT_DISTANCE : -FLYOUT_DISTANCE
      const targetRotate = swipeDirection === 'right' ? FLYOUT_ROTATION : -FLYOUT_ROTATION

      if (prefersReducedMotion) {
        x.set(0)
        setBadgeOpacity(0)
        setDirection(null)
        await fetchNext()
        isAnimating.current = false
        return
      }

      await animate(x, targetX, { duration: 0.4, ease: 'easeIn' })
      void animate(rotate, targetRotate, { duration: 0.4, ease: 'easeIn' })

      // Reset position instantly before loading new card
      x.set(0)
      setBadgeOpacity(0)
      setDirection(null)

      await fetchNext()
      isAnimating.current = false
    },
    [frase, fetchNext, toggleFavorite, x, rotate, onSwipe, prefersReducedMotion],
  )

  const bind = useDrag(
    ({ movement: [mx], down, cancel }) => {
      if (isAnimating.current) {
        cancel()
        return
      }

      if (down) {
        x.set(mx)
        const progress = Math.min(Math.abs(mx) / SWIPE_THRESHOLD, 1)
        setBadgeOpacity(progress)
        setDirection(mx > 0 ? 'right' : mx < 0 ? 'left' : null)
      } else {
        // Released
        if (Math.abs(mx) >= SWIPE_THRESHOLD) {
          void handleSwipeComplete(mx > 0 ? 'right' : 'left')
        } else {
          // Snap back
          if (prefersReducedMotion) {
            x.set(0)
          } else {
            void animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 })
          }
          setBadgeOpacity(0)
          setDirection(null)
        }
      }
    },
    {
      axis: 'x',
      filterTaps: true,
    },
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (isAnimating.current || !frase) return

      if (e.key === 'Enter') {
        e.preventDefault()
        void handleSwipeComplete('right')
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        void handleSwipeComplete('left')
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [frase, handleSwipeComplete, onBack])

  const handleReset = useCallback(async () => {
    resetExcluded()
    hasFetched.current = false
    await fetchNext()
  }, [resetExcluded, fetchNext])

  // Empty state
  if (isEmpty && !frase) {
    return <EmptyCard colorPrimario={colorPrimario} onReset={() => void handleReset()} />
  }

  return (
    <div
      className="relative flex h-[min(420px,60vh)] w-full max-w-sm items-center justify-center"
      aria-live="polite"
    >
      {/* Decorative cards behind */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="h-full w-full rounded-3xl"
          style={{
            transform: 'scale(0.9)',
            opacity: 0.15,
            background: `rgba(${hexToRgb(colorPrimario)}, 0.03)`,
            border: `1px solid rgba(${hexToRgb(colorPrimario)}, 0.05)`,
          }}
        />
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="h-full w-full rounded-3xl"
          style={{
            transform: 'scale(0.95)',
            opacity: 0.3,
            background: `rgba(${hexToRgb(colorPrimario)}, 0.03)`,
            border: `1px solid rgba(${hexToRgb(colorPrimario)}, 0.06)`,
          }}
        />
      </div>

      {/* Active card */}
      {frase ? (
        <div
          {...bind()}
          tabIndex={0}
          className="relative z-10 w-full cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          <motion.div style={{ x, rotate, opacity: cardOpacity }}>
            <SwipeCard
              frase={frase}
              badgeOpacity={badgeOpacity}
              direction={direction}
            />
          </motion.div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center">
          <div
            className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: `${colorPrimario} transparent transparent transparent` }}
          />
        </div>
      ) : error ? (
        <p className="text-center text-sm text-text-dark opacity-60">{error}</p>
      ) : null}
    </div>
  )
}

