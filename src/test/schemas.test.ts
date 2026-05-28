import { describe, it, expect } from 'vitest'
import {
  estadoAnimoDTOSchema,
  fraseDTOSchema,
  authResponseSchema,
  uploadResponseSchema,
} from '@/lib/schemas'

describe('estadoAnimoDTOSchema', () => {
  it('parses a valid estado', () => {
    const data = {
      id: 1,
      nombre: 'FELIZ',
      emoji: '😊',
      iconUrl: null,
      musicaUrl: 'https://example.com/music.mp3',
      imagenUrl: null,
      colorPrimario: '#FFD700',
      colorSecundario: '#FFA500',
      fontFamily: 'Outfit',
      animationType: 'float',
    }
    expect(estadoAnimoDTOSchema.parse(data)).toEqual(data)
  })

  it('rejects missing required fields', () => {
    expect(() => estadoAnimoDTOSchema.parse({ id: 1 })).toThrow()
  })

  it('rejects invalid id type', () => {
    expect(() =>
      estadoAnimoDTOSchema.parse({
        id: 'not-a-number',
        nombre: 'FELIZ',
        emoji: '😊',
        iconUrl: null,
        musicaUrl: null,
        imagenUrl: null,
        colorPrimario: null,
        colorSecundario: null,
        fontFamily: null,
        animationType: null,
      }),
    ).toThrow()
  })
})

describe('fraseDTOSchema', () => {
  it('parses a valid frase with nested estado', () => {
    const data = {
      id: 1,
      texto: 'Todo va a estar bien',
      estadoAnimo: {
        id: 1,
        nombre: 'FELIZ',
        emoji: '😊',
        iconUrl: null,
        musicaUrl: null,
        imagenUrl: null,
        colorPrimario: null,
        colorSecundario: null,
        fontFamily: null,
        animationType: null,
      },
    }
    expect(fraseDTOSchema.parse(data)).toEqual(data)
  })

  it('rejects frase without estadoAnimo', () => {
    expect(() => fraseDTOSchema.parse({ id: 1, texto: 'test' })).toThrow()
  })
})

describe('authResponseSchema', () => {
  it('parses a valid token', () => {
    const data = { token: 'eyJhbGciOi...' }
    expect(authResponseSchema.parse(data)).toEqual(data)
  })

  it('rejects missing token', () => {
    expect(() => authResponseSchema.parse({})).toThrow()
  })
})

describe('uploadResponseSchema', () => {
  it('parses a valid upload response', () => {
    const data = { url: 'https://s3.example.com/file.png', tipo: 'imagen' }
    expect(uploadResponseSchema.parse(data)).toEqual(data)
  })
})
