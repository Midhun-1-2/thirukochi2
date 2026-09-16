import type { Transition, Variants } from 'framer-motion'

/* ------------------------------------------------------------------
   Centralised motion system.
   Every component reuses these presets so the whole product moves
   with one voice: spring-based, quick (300–700ms), never flashy.
------------------------------------------------------------------- */

export const spring = {
  soft: { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 } satisfies Transition,
  snappy: { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 } satisfies Transition,
  gentle: { type: 'spring', stiffness: 120, damping: 22, mass: 1 } satisfies Transition,
  press: { type: 'spring', stiffness: 600, damping: 30, mass: 0.6 } satisfies Transition,
} as const

export const ease = {
  luxe: [0.22, 1, 0.36, 1] as const,
  soft: [0.4, 0, 0.2, 1] as const,
}

export const duration = {
  fast: 0.28,
  base: 0.45,
  slow: 0.7,
}

/* ----- basic reveals ----- */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease: ease.soft } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: ease.soft } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: spring.soft },
  exit: { opacity: 0, y: 10, transition: { duration: duration.fast } },
}

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -18 },
  visible: { opacity: 1, y: 0, transition: spring.soft },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: spring.soft },
  exit: { opacity: 0, scale: 0.97, transition: { duration: duration.fast } },
}

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 12 },
  visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: duration.slow, ease: ease.luxe } },
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: spring.soft },
  exit: { opacity: 0, x: -24, transition: { duration: duration.fast } },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: spring.soft },
  exit: { opacity: 0, x: 24, transition: { duration: duration.fast } },
}

/* ----- page transitions ----- */
/** App pages: the new page is unveiled from a soft clip while rising. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 28, scale: 0.985, clipPath: 'inset(8% 2% 12% 2% round 28px)' },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0% round 0px)',
    transition: { duration: 0.62, ease: ease.luxe, clipPath: { duration: 0.7, ease: ease.luxe } },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.99,
    clipPath: 'inset(4% 1% 6% 1% round 24px)',
    transition: { duration: 0.28, ease: ease.soft },
  },
}

/** Auth pages: horizontal slide keyed to the direction of travel through the flow. */
export const authPageVariants: Variants = {
  initial: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 64 : -64, rotate: dir >= 0 ? 1.2 : -1.2, filter: 'blur(6px)' }),
  enter: { opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: ease.luxe } },
  exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -48 : 48, rotate: dir >= 0 ? -1 : 1, filter: 'blur(4px)', transition: { duration: 0.26, ease: ease.soft } }),
}

export const pageVariantsReduced: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

/** Directional step transitions (stepper forms). */
export const stepVariants: Variants = {
  initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40, filter: 'blur(4px)' }),
  enter: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.42, ease: ease.luxe } },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -32 : 32, filter: 'blur(3px)', transition: { duration: 0.22 } }),
}

/* ----- stagger ----- */
export const staggerContainer = (stagger = 0.07, delay = 0.05): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
})

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: spring.soft },
  exit: { opacity: 0, y: 8, transition: { duration: duration.fast } },
}

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: spring.soft },
}

/* ----- interaction ----- */
export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: { y: -4, scale: 1.005, transition: spring.snappy },
  tap: { scale: 0.99, transition: spring.press },
}

export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.015, transition: spring.snappy },
  tap: { scale: 0.975, transition: spring.press },
}

export const iconNudge = {
  rest: { x: 0 },
  hover: { x: 3, transition: spring.snappy },
}

/** whileInView defaults for scroll reveals. */
export const viewportOnce = { once: true, amount: 0.25, margin: '0px 0px -8% 0px' } as const
