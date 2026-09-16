import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Official Thirukochi Gold & Diamonds logo — always the client asset,
   never recreated in code. Proportions are preserved via intrinsic
   width/height + `h-auto`.
------------------------------------------------------------------- */

interface LogoProps {
  variant?: 'full' | 'emblem'
  className?: string
  /** Rendered width in px (height follows the intrinsic ratio). */
  width?: number
  priority?: boolean
  /** Adds a slow light sweep masked to the logo artwork. */
  shine?: boolean
  /** `sync` paints the logo in the same frame it loads — for above-the-fold slots where a late async decode would leave a blank. */
  decode?: 'async' | 'sync'
}

const FULL_RATIO = 1115 / 2262 // h / w of the lockup
const EMBLEM_RATIO = 1

export function Logo({ variant = 'full', className, width, priority = false, shine = false, decode = 'async' }: LogoProps) {
  if (variant === 'emblem') {
    const w = width ?? 44
    return (
      <img
        src="/assets/logo/thirukochi-emblem.png"
        srcSet="/assets/logo/thirukochi-emblem.png 1x, /assets/logo/thirukochi-emblem-512.png 2x"
        width={w}
        height={Math.round(w * EMBLEM_RATIO)}
        alt="Thirukochi Gold & Diamonds"
        className={cn('h-auto select-none', className)}
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        decoding={decode}
      />
    )
  }

  const w = width ?? 220
  const picture = (
    <picture className={cn('block', !shine && className)}>
      <source srcSet="/assets/logo/thirukochi-logo.webp" type="image/webp" />
      <img
        src="/assets/logo/thirukochi-logo-800.png"
        srcSet="/assets/logo/thirukochi-logo-400.png 400w, /assets/logo/thirukochi-logo-800.png 800w, /assets/logo/thirukochi-logo.png 2262w"
        sizes={`${w}px`}
        width={w}
        height={Math.round(w * FULL_RATIO)}
        alt="Thirukochi Gold & Diamonds"
        className="h-auto w-full select-none"
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        decoding={decode}
        style={{ maxWidth: w }}
      />
    </picture>
  )
  if (!shine) return picture
  return (
    <span className={cn('relative inline-block', className)} style={{ width: w, maxWidth: '100%' }}>
      {picture}
      <span className="logo-shine" style={{ ['--logo-mask' as string]: 'url(/assets/logo/thirukochi-logo-800.png)' }} aria-hidden="true" />
    </span>
  )
}
