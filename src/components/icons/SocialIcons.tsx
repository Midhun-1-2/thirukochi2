import type { SVGProps } from 'react'

/* Brand glyphs drawn in-house (lucide no longer ships brand icons). */

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

export function InstagramIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d="M14.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.5-1.5h1.5V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H9v3h2.6v7" />
    </svg>
  )
}

export function YoutubeIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d="M21.6 7.4a2.4 2.4 0 0 0-1.7-1.7C18.4 5.3 12 5.3 12 5.3s-6.4 0-7.9.4A2.4 2.4 0 0 0 2.4 7.4C2 8.9 2 12 2 12s0 3.1.4 4.6a2.4 2.4 0 0 0 1.7 1.7c1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4a2.4 2.4 0 0 0 1.7-1.7c.4-1.5.4-4.6.4-4.6s0-3.1-.4-4.6Z" />
      <path d="m10 9.2 4.6 2.8L10 14.8V9.2Z" fill="currentColor" stroke="none" />
    </svg>
  )
}
