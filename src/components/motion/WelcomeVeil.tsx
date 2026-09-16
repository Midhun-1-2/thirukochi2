import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '@/components/brand/Logo'
import { GoldParticles } from '@/components/motion/GoldParticles'
import { SplitText } from '@/components/motion/Signature'
import { useReducedMotion } from '@/hooks'
import { ease, spring } from '@/lib/motion'

/* ------------------------------------------------------------------
   Welcome veil — plays once right after sign-in. A maroon curtain
   greets the member by name (emblem drops in, a gold ring draws
   around it, the name types out), then the whole curtain lifts
   upward to reveal the home screen animating in beneath it.
------------------------------------------------------------------- */

/** Sign-in raises this flag; the shell consumes it on mount. sessionStorage
 *  (not router state) because the auth guard may redirect before the login
 *  page gets to navigate itself. */
export const WELCOME_FLAG = 'tkgd2.welcome'

/** How long the curtain stays before it lifts. */
export const VEIL_HOLD_MS = 1500
export const VEIL_LIFT_S = 0.85

export function WelcomeVeil({ name, onLift }: { name: string; onLift: () => void }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    const id = window.setTimeout(onLift, reduced ? 500 : VEIL_HOLD_MS)
    return () => window.clearTimeout(id)
  }, [onLift, reduced])

  return (
    <motion.div
      role="status"
      aria-label={`Welcome back, ${name}`}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden maroon-surface grain text-cream"
      initial={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0 0)' }}
      exit={reduced ? { opacity: 0, transition: { duration: 0.3 } } : { clipPath: 'inset(0 0 100% 0)', transition: { duration: VEIL_LIFT_S, ease: ease.luxe } }}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full gold-glow opacity-60" aria-hidden="true" />
      {!reduced && <GoldParticles count={22} opacity={0.7} />}

      {/* emblem inside a ring that draws itself */}
      <motion.div
        className="relative flex h-28 w-28 items-center justify-center"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: -24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={reduced ? { duration: 0.2 } : { ...spring.soft, delay: 0.05 }}
      >
        <svg viewBox="0 0 112 112" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
          <motion.circle
            cx="56"
            cy="56"
            r="53"
            fill="none"
            stroke="#d4af37"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 1, ease: ease.luxe, delay: 0.15 }}
            style={{ rotate: -90, transformOrigin: '50% 50%' }}
          />
        </svg>
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/50 bg-white/[0.05] shadow-[0_0_0_6px_rgba(212,175,55,0.08)]">
          <Logo variant="emblem" width={46} priority decode="sync" />
        </span>
      </motion.div>

      <motion.p
        className="eyebrow mt-7 text-gold-light/80"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: reduced ? 0 : 0.35, ease: ease.soft }}
      >
        Welcome back
      </motion.p>
      <SplitText as="h1" className="mt-1.5 font-display text-[clamp(1.9rem,7vw,2.6rem)] leading-tight text-cream" words={[{ text: name, className: 'italic font-normal gold-text' }]} delay={0.45} />
      <motion.span
        className="mt-5 h-px w-24 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: reduced ? 0 : 0.7, ease: ease.luxe }}
        aria-hidden="true"
      />
    </motion.div>
  )
}
