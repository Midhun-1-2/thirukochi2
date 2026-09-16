import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { SchemeArt } from '@/data/types'

/* ------------------------------------------------------------------
   Original jewellery-inspired line artwork. Thin gold strokes on any
   surface; used as illustrations, empty states and hero accents.
------------------------------------------------------------------- */

interface ArtProps {
  className?: string
  /** stroke opacity multiplier */
  intensity?: number
}

function GoldDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#b3871c" />
        <stop offset="45%" stopColor="#f2d27a" />
        <stop offset="60%" stopColor="#f9df92" />
        <stop offset="100%" stopColor="#b3871c" />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f9df92" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#f9df92" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
  )
}

/** A solitaire ring seen at a gentle angle. */
export function RingArt({ className, intensity = 1 }: ArtProps) {
  const id = useId()
  return (
    <svg viewBox="0 0 240 240" className={cn('h-full w-full', className)} aria-hidden="true" focusable="false">
      <GoldDefs id={id} />
      <circle cx="120" cy="130" r="100" fill={`url(#${id}-glow)`} opacity={0.7 * intensity} />
      <g transform="rotate(-16 120 138)">
        <ellipse cx="120" cy="138" rx="78" ry="46" fill="none" stroke={`url(#${id}-g)`} strokeWidth="9" opacity={intensity} />
        <ellipse cx="120" cy="138" rx="78" ry="46" fill="none" stroke={`url(#${id}-shine)`} strokeWidth="1.2" opacity={0.7 * intensity} />
        <ellipse cx="120" cy="138" rx="66" ry="36" fill="none" stroke="#f9df92" strokeWidth="0.8" opacity={0.35 * intensity} />
      </g>
      {/* gem setting */}
      <g transform="translate(163 74)">
        <polygon points="0,-22 20,-6 12,18 -12,18 -20,-6" fill="none" stroke={`url(#${id}-g)`} strokeWidth="2.2" strokeLinejoin="round" opacity={intensity} />
        <polygon points="0,-22 20,-6 0,2 -20,-6" fill="#fffdf7" opacity={0.18 * intensity} />
        <polyline points="-20,-6 0,2 20,-6" fill="none" stroke="#f9df92" strokeWidth="1" opacity={0.7 * intensity} />
        <polyline points="-12,18 0,2 12,18" fill="none" stroke="#f9df92" strokeWidth="1" opacity={0.7 * intensity} />
        <line x1="0" y1="2" x2="0" y2="18" stroke="#f9df92" strokeWidth="0.8" opacity={0.6 * intensity} />
        <circle cx="-6" cy="-12" r="1.6" fill="#ffffff" opacity={0.9 * intensity} />
      </g>
      {/* sparkle */}
      <g stroke="#f9df92" strokeWidth="1.2" strokeLinecap="round" opacity={0.8 * intensity}>
        <line x1="52" y1="70" x2="52" y2="84" />
        <line x1="45" y1="77" x2="59" y2="77" />
        <line x1="200" y1="160" x2="200" y2="170" />
        <line x1="195" y1="165" x2="205" y2="165" />
      </g>
    </svg>
  )
}

/** A brilliant-cut diamond outline. */
export function DiamondArt({ className, intensity = 1 }: ArtProps) {
  const id = useId()
  return (
    <svg viewBox="0 0 240 240" className={cn('h-full w-full', className)} aria-hidden="true" focusable="false">
      <GoldDefs id={id} />
      <circle cx="120" cy="120" r="96" fill={`url(#${id}-glow)`} opacity={0.6 * intensity} />
      <g fill="none" stroke={`url(#${id}-g)`} strokeWidth="2" strokeLinejoin="round" opacity={intensity}>
        <polygon points="120,44 178,82 196,104 120,204 44,104 62,82" />
        <polyline points="44,104 196,104" />
        <polyline points="62,82 178,82" />
        <polyline points="120,44 96,82 78,104 120,204" />
        <polyline points="120,44 144,82 162,104 120,204" />
        <polyline points="62,82 96,82 120,44 144,82 178,82" strokeWidth="1.2" opacity="0.7" />
        <polyline points="44,104 78,104 96,82" strokeWidth="1.2" opacity="0.7" />
        <polyline points="196,104 162,104 144,82" strokeWidth="1.2" opacity="0.7" />
      </g>
      <polygon points="96,82 144,82 162,104 78,104" fill="#fffdf7" opacity={0.14 * intensity} />
      <g stroke="#f9df92" strokeWidth="1.2" strokeLinecap="round" opacity={0.8 * intensity}>
        <line x1="190" y1="48" x2="190" y2="64" />
        <line x1="182" y1="56" x2="198" y2="56" />
        <line x1="44" y1="176" x2="44" y2="186" />
        <line x1="39" y1="181" x2="49" y2="181" />
      </g>
    </svg>
  )
}

/** A pendant necklace on a fine chain. */
export function NecklaceArt({ className, intensity = 1 }: ArtProps) {
  const id = useId()
  return (
    <svg viewBox="0 0 240 240" className={cn('h-full w-full', className)} aria-hidden="true" focusable="false">
      <GoldDefs id={id} />
      <circle cx="120" cy="150" r="80" fill={`url(#${id}-glow)`} opacity={0.6 * intensity} />
      <path
        d="M28 26 C 44 120, 96 150, 120 150 C 144 150, 196 120, 212 26"
        fill="none"
        stroke={`url(#${id}-g)`}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={intensity}
      />
      <path
        d="M28 26 C 44 120, 96 150, 120 150 C 144 150, 196 120, 212 26"
        fill="none"
        stroke="#fffdf7"
        strokeWidth="1"
        strokeDasharray="1 6"
        strokeLinecap="round"
        opacity={0.55 * intensity}
      />
      {/* pendant */}
      <g transform="translate(120 152)">
        <circle cx="0" cy="8" r="6" fill="none" stroke={`url(#${id}-g)`} strokeWidth="2" opacity={intensity} />
        <path d="M0 14 C -18 34, -18 56, 0 66 C 18 56, 18 34, 0 14 Z" fill="none" stroke={`url(#${id}-g)`} strokeWidth="2.2" strokeLinejoin="round" opacity={intensity} />
        <path d="M0 24 C -9 36, -9 48, 0 56 C 9 48, 9 36, 0 24 Z" fill="#fffdf7" opacity={0.16 * intensity} stroke="#f9df92" strokeWidth="0.8" />
        <circle cx="-4" cy="34" r="1.5" fill="#ffffff" opacity={0.9 * intensity} />
      </g>
      <g stroke="#f9df92" strokeWidth="1.2" strokeLinecap="round" opacity={0.8 * intensity}>
        <line x1="60" y1="180" x2="60" y2="192" />
        <line x1="54" y1="186" x2="66" y2="186" />
        <line x1="184" y1="96" x2="184" y2="106" />
        <line x1="179" y1="101" x2="189" y2="101" />
      </g>
    </svg>
  )
}

/** Stacked bangles — large decorative motif for hero panels. */
export function BangleArt({ className, intensity = 1 }: ArtProps) {
  const id = useId()
  return (
    <svg viewBox="0 0 600 420" className={cn('h-full w-full', className)} aria-hidden="true" focusable="false">
      <GoldDefs id={id} />
      <ellipse cx="330" cy="260" rx="220" ry="150" fill={`url(#${id}-glow)`} opacity={0.35 * intensity} />
      <g fill="none" stroke={`url(#${id}-g)`} strokeLinecap="round">
        <ellipse cx="300" cy="250" rx="210" ry="86" strokeWidth="1.4" opacity={0.85 * intensity} transform="rotate(-8 300 250)" />
        <ellipse cx="320" cy="270" rx="210" ry="86" strokeWidth="6" opacity={0.9 * intensity} transform="rotate(-8 320 270)" />
        <ellipse cx="320" cy="270" rx="196" ry="74" strokeWidth="0.8" opacity={0.45 * intensity} transform="rotate(-8 320 270)" />
        <ellipse cx="342" cy="292" rx="210" ry="86" strokeWidth="1.4" opacity={0.7 * intensity} transform="rotate(-8 342 292)" />
      </g>
      <g stroke="#f9df92" strokeWidth="1.2" strokeLinecap="round" opacity={0.85 * intensity}>
        <line x1="118" y1="150" x2="118" y2="170" />
        <line x1="108" y1="160" x2="128" y2="160" />
        <line x1="512" y1="108" x2="512" y2="122" />
        <line x1="505" y1="115" x2="519" y2="115" />
      </g>
    </svg>
  )
}

/** Thin ornamental divider: line · diamond · line */
export function Flourish({ className, tone = 'gold' }: { className?: string; tone?: 'gold' | 'maroon' }) {
  const color = tone === 'gold' ? '#d4af37' : '#540000'
  return (
    <svg viewBox="0 0 200 12" className={cn('h-3 w-40', className)} aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <line x1="0" y1="6" x2="86" y2="6" stroke={color} strokeWidth="0.8" opacity="0.7" />
      <line x1="114" y1="6" x2="200" y2="6" stroke={color} strokeWidth="0.8" opacity="0.7" />
      <polygon points="100,1 105,6 100,11 95,6" fill="none" stroke={color} strokeWidth="1" />
      <circle cx="100" cy="6" r="1.2" fill={color} />
    </svg>
  )
}

export function SchemeArtwork({ art, className, intensity }: { art: SchemeArt; className?: string; intensity?: number }) {
  if (art === 'diamond') return <DiamondArt className={className} intensity={intensity} />
  if (art === 'necklace') return <NecklaceArt className={className} intensity={intensity} />
  return <RingArt className={className} intensity={intensity} />
}
