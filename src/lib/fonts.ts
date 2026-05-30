/**
 * Lista cerrada de fuentes permitidas para los moods.
 *
 * Fuente única de verdad: la usan tanto el form de admin (Select)
 * como `loadFont` (inyecta el <link> a Google Fonts) y `useMoodTheme`
 * (setea la CSS var --mood-font). Si una `fontFamily` viene del back
 * pero no está acá, se ignora — evita CSS injection vía valor con
 * comilla simple o `;` que pisaría la cascada.
 */
export const ALLOWED_FONTS = [
  'DM Sans',
  'Fraunces',
  'Outfit',
  'Cormorant Garamond',
  'Playfair Display',
  'Lora',
] as const

export type AllowedFont = (typeof ALLOWED_FONTS)[number]

const FONT_SET = new Set<string>(ALLOWED_FONTS)

export const isAllowedFont = (family: string | null | undefined): family is AllowedFont => {
  return typeof family === 'string' && FONT_SET.has(family)
}
