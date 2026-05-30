import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/shared/store/useAppStore'
import type { EstadoAnimoDTO } from '@/lib/schemas'

const mockEstado: EstadoAnimoDTO = {
  id: 1,
  codigo: 'feliz',
  nombre: 'Feliz',
  emoji: '😊',
  iconUrl: null,
  musicaUrl: null,
  imagenUrl: null,
  colorPrimario: '#FFD700',
  colorSecundario: '#FFA500',
  fontFamily: null,
  animationType: null,
}

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      estados: [],
      estadosLoaded: false,
      estadosLoading: false,
      estadosError: null,
      activeMood: null,
      excludedIds: [],
      favorites: [],
      isMuted: false,
      volume: 0.6,
      themeMode: 'system',
    })
  })

  describe('activeMood', () => {
    it('sets active mood and resets excluded ids', () => {
      useAppStore.getState().addExcludedId(1)
      useAppStore.getState().setActiveMood(mockEstado)

      expect(useAppStore.getState().activeMood).toEqual(mockEstado)
      expect(useAppStore.getState().excludedIds).toEqual([])
    })

    it('clears active mood', () => {
      useAppStore.getState().setActiveMood(mockEstado)
      useAppStore.getState().clearActiveMood()

      expect(useAppStore.getState().activeMood).toBeNull()
    })
  })

  describe('excludedIds', () => {
    it('adds excluded ids', () => {
      useAppStore.getState().addExcludedId(1)
      useAppStore.getState().addExcludedId(2)

      expect(useAppStore.getState().excludedIds).toEqual([1, 2])
    })

    it('resets excluded ids', () => {
      useAppStore.getState().addExcludedId(1)
      useAppStore.getState().resetExcluded()

      expect(useAppStore.getState().excludedIds).toEqual([])
    })
  })

  describe('favorites', () => {
    it('toggles favorite on', () => {
      useAppStore.getState().toggleFavorite(1)
      expect(useAppStore.getState().favorites).toEqual([1])
    })

    it('toggles favorite off', () => {
      useAppStore.getState().toggleFavorite(1)
      useAppStore.getState().toggleFavorite(1)
      expect(useAppStore.getState().favorites).toEqual([])
    })

    it('handles multiple favorites', () => {
      useAppStore.getState().toggleFavorite(1)
      useAppStore.getState().toggleFavorite(3)
      useAppStore.getState().toggleFavorite(5)

      expect(useAppStore.getState().favorites).toEqual([1, 3, 5])
    })
  })

  describe('audio', () => {
    it('toggles mute', () => {
      expect(useAppStore.getState().isMuted).toBe(false)
      useAppStore.getState().toggleMute()
      expect(useAppStore.getState().isMuted).toBe(true)
      useAppStore.getState().toggleMute()
      expect(useAppStore.getState().isMuted).toBe(false)
    })

    it('sets volume', () => {
      useAppStore.getState().setVolume(0.3)
      expect(useAppStore.getState().volume).toBe(0.3)
    })
  })

  describe('theme', () => {
    it('sets theme mode', () => {
      useAppStore.getState().setThemeMode('dark')
      expect(useAppStore.getState().themeMode).toBe('dark')

      useAppStore.getState().setThemeMode('light')
      expect(useAppStore.getState().themeMode).toBe('light')
    })
  })
})
