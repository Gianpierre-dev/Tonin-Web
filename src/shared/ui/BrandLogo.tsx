import { cn } from '@/lib/utils'

interface BrandLogoProps {
  /** Clases para controlar el tamaño (ej: "h-20") y ajustes extra */
  className?: string
  /** Muestra un glow con el gradiente de marca detrás del logo */
  withGlow?: boolean
}

/**
 * Logo de marca SOMA. Fuente unica de verdad: si cambia el logo,
 * solo se toca este componente. El archivo vive en /public/logoSOMA.png.
 */
export const BrandLogo = ({ className, withGlow = false }: BrandLogoProps): React.JSX.Element => {
  const img = (
    <img
      src="/logoSOMA.png"
      alt="SOMA"
      className={cn('w-auto select-none', className)}
      draggable={false}
    />
  )

  if (!withGlow) return img

  return (
    <div className="relative flex items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 scale-[1.6] rounded-full bg-[image:var(--gradient-brand)] opacity-20 blur-2xl dark:opacity-30"
      />
      {img}
    </div>
  )
}
