import { describe, it, expect } from 'vitest'
import { hexToRgb, isTokenExpired, decodeJwtPayload, getGreetingKey } from '@/lib/utils'

describe('hexToRgb', () => {
  it('converts hex to rgb string', () => {
    expect(hexToRgb('#FF0000')).toBe('255, 0, 0')
    expect(hexToRgb('#00FF00')).toBe('0, 255, 0')
    expect(hexToRgb('#0000FF')).toBe('0, 0, 255')
  })

  it('handles hex without hash', () => {
    expect(hexToRgb('FFFFFF')).toBe('255, 255, 255')
  })

  it('handles lowercase hex', () => {
    expect(hexToRgb('#ff8800')).toBe('255, 136, 0')
  })
})

describe('decodeJwtPayload', () => {
  it('decodes a valid JWT payload', () => {
    const payload = { exp: 1234567890, sub: 'user' }
    const encoded = btoa(JSON.stringify(payload))
    const token = `header.${encoded}.signature`
    expect(decodeJwtPayload(token)).toEqual(payload)
  })

  it('returns null for invalid token', () => {
    expect(decodeJwtPayload('not-a-jwt')).toBeNull()
    expect(decodeJwtPayload('')).toBeNull()
  })
})

describe('isTokenExpired', () => {
  it('returns true for expired token', () => {
    const payload = { exp: Math.floor(Date.now() / 1000) - 3600 }
    const encoded = btoa(JSON.stringify(payload))
    const token = `h.${encoded}.s`
    expect(isTokenExpired(token)).toBe(true)
  })

  it('returns false for valid token', () => {
    const payload = { exp: Math.floor(Date.now() / 1000) + 3600 }
    const encoded = btoa(JSON.stringify(payload))
    const token = `h.${encoded}.s`
    expect(isTokenExpired(token)).toBe(false)
  })

  it('returns true for token without exp', () => {
    const encoded = btoa(JSON.stringify({ sub: 'user' }))
    const token = `h.${encoded}.s`
    expect(isTokenExpired(token)).toBe(true)
  })
})

describe('getGreetingKey', () => {
  it('returns a valid i18n key', () => {
    const key = getGreetingKey()
    expect([
      'home.greetingMorning',
      'home.greetingAfternoon',
      'home.greetingEvening',
    ]).toContain(key)
  })
})
