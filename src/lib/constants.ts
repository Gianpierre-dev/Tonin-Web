export type EasingName = 'easeIn' | 'easeOut' | 'easeInOut' | 'linear'

export interface AnimationConfig {
  duration: number
  y?: number[]
  scale?: number[]
  rotate?: number[]
  opacity?: number[]
  ease: EasingName
}

export const ANIMATION_PRESETS = {
  float: { duration: 5, y: [-6, 6], ease: 'easeInOut' },
  pulse: { duration: 8, scale: [1, 1.15], ease: 'easeInOut' },
  wave: { duration: 6, rotate: [-2, 2], ease: 'easeInOut' },
  fade: { duration: 10, opacity: [0.7, 1], ease: 'easeInOut' },
} as const satisfies Record<string, AnimationConfig>

export type AnimationType = keyof typeof ANIMATION_PRESETS

export const DEFAULT_ANIMATION: AnimationType = 'fade'

/**
 * Validación contra el SET cerrado de animaciones conocidas.
 *
 * `ANIMATION_PRESETS[type]` con un `Record<string, ...>` devolvía Object.prototype
 * para keys como `__proto__` (no undefined), lo que esquivaba el `??` fallback.
 * Acá garantizamos type-safety.
 */
const VALID_TYPES = new Set<string>(Object.keys(ANIMATION_PRESETS))

export const getAnimationPreset = (type: string | null | undefined): AnimationConfig => {
  if (typeof type === 'string' && VALID_TYPES.has(type)) {
    return ANIMATION_PRESETS[type as AnimationType]
  }
  return ANIMATION_PRESETS[DEFAULT_ANIMATION]
}

export const SWIPE_THRESHOLD = 120
export const SWIPE_MAX_ROTATION = 12

export const AUDIO_DEFAULT_VOLUME = 0.6
export const AUDIO_FADE_IN_MS = 2000
export const AUDIO_FADE_OUT_MS = 1500

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''

export const TOKEN_KEY = 'tonin_token'
