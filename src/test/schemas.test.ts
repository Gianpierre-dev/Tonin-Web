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
      codigo: 'feliz',
      nombre: 'Feliz',
      emoji: '😊',
      iconUrl: null,
      musicaUrl: 'https://example.com/music.mp3',
      imagenUrl: null,
      colorPrimario: '#FFD700',
      colorSecundario: '#FFA500',
      fontFamily: 'Outfit',
      animationType: 'float',
      traducciones: { es: 'Feliz', en: 'Happy' },
    }
    expect(estadoAnimoDTOSchema.parse(data)).toEqual(data)
  })

  it('parses estado with only es translation', () => {
    const data = {
      id: 1,
      codigo: 'feliz',
      nombre: 'Feliz',
      emoji: '😊',
      iconUrl: null,
      musicaUrl: null,
      imagenUrl: null,
      colorPrimario: null,
      colorSecundario: null,
      fontFamily: null,
      animationType: null,
      traducciones: { es: 'Feliz' },
    }
    expect(estadoAnimoDTOSchema.parse(data).traducciones.en).toBeUndefined()
  })

  it('rejects missing required fields', () => {
    expect(() => estadoAnimoDTOSchema.parse({ id: 1 })).toThrow()
  })

  it('rejects estado without traducciones', () => {
    expect(() =>
      estadoAnimoDTOSchema.parse({
        id: 1,
        codigo: 'feliz',
        nombre: 'Feliz',
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

  it('rejects invalid id type', () => {
    expect(() =>
      estadoAnimoDTOSchema.parse({
        id: 'not-a-number',
        codigo: 'feliz',
        nombre: 'Feliz',
        emoji: '😊',
        iconUrl: null,
        musicaUrl: null,
        imagenUrl: null,
        colorPrimario: null,
        colorSecundario: null,
        fontFamily: null,
        animationType: null,
        traducciones: { es: 'Feliz' },
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
        codigo: 'feliz',
        nombre: 'Feliz',
        emoji: '😊',
        iconUrl: null,
        musicaUrl: null,
        imagenUrl: null,
        colorPrimario: null,
        colorSecundario: null,
        fontFamily: null,
        animationType: null,
        traducciones: { es: 'Feliz', en: 'Happy' },
      },
      traducciones: { es: 'Todo va a estar bien', en: 'It will be alright' },
    }
    expect(fraseDTOSchema.parse(data)).toEqual(data)
  })

  it('rejects frase without estadoAnimo', () => {
    expect(() => fraseDTOSchema.parse({ id: 1, texto: 'test' })).toThrow()
  })

  it('rejects frase without traducciones', () => {
    expect(() =>
      fraseDTOSchema.parse({
        id: 1,
        texto: 'test',
        estadoAnimo: {
          id: 1,
          codigo: 'feliz',
          nombre: 'Feliz',
          emoji: '😊',
          iconUrl: null,
          musicaUrl: null,
          imagenUrl: null,
          colorPrimario: null,
          colorSecundario: null,
          fontFamily: null,
          animationType: null,
          traducciones: { es: 'Feliz' },
        },
      }),
    ).toThrow()
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
