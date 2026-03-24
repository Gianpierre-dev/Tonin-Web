export type EasingName = 'easeIn' | 'easeOut' | 'easeInOut' | 'linear'

export interface AnimationConfig {
  duration: number
  y?: number[]
  scale?: number[]
  rotate?: number[]
  opacity?: number[]
  ease: EasingName
}

export const ANIMATION_PRESETS: Record<string, AnimationConfig> = {
  float: { duration: 5, y: [-6, 6], ease: 'easeInOut' },
  pulse: { duration: 8, scale: [1, 1.15], ease: 'easeInOut' },
  wave: { duration: 6, rotate: [-2, 2], ease: 'easeInOut' },
  fade: { duration: 10, opacity: [0.7, 1], ease: 'easeInOut' },
}

export const DEFAULT_ANIMATION = 'fade'

export const SWIPE_THRESHOLD = 120
export const SWIPE_MAX_ROTATION = 12

export const AUDIO_DEFAULT_VOLUME = 0.6
export const AUDIO_FADE_IN_MS = 2000
export const AUDIO_FADE_OUT_MS = 1500

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
