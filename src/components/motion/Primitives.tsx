import { motion, type HTMLMotionProps, type Variants } from 'framer-motion'
import { useContext, type ReactNode } from 'react'
import { TransitionDirection } from '@/lib/transition-context'
import { useReducedMotion } from '@/hooks'
import {
  authPageVariants,
  blurIn,
  fadeUp,
  pageVariants,
  pageVariantsReduced,
  staggerContainer,
  staggerItem,
  viewportOnce,
} from '@/lib/motion'

/* ---------- Page transition wrapper ---------- */
export function PageTransition({ children, className, mode = 'app' }: { children: ReactNode; className?: string; mode?: 'app' | 'auth' }) {
  const reduced = useReducedMotion()
  const dir = useContext(TransitionDirection)
  const variants = reduced ? pageVariantsReduced : mode === 'auth' ? authPageVariants : pageVariants
  return (
    <motion.div
      custom={dir}
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={className}
      style={{ willChange: 'transform, opacity, clip-path' }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Scroll reveal ---------- */
interface RevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  variant?: 'fadeUp' | 'blurIn'
  delay?: number
  once?: boolean
}

export function Reveal({ children, variant = 'fadeUp', delay = 0, once = true, ...rest }: RevealProps) {
  const reduced = useReducedMotion()
  const variants: Variants = reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : variant === 'blurIn' ? blurIn : fadeUp
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewportOnce, once }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Staggered groups ---------- */
interface StaggerProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  stagger?: number
  delay?: number
  /** animate on mount (default) or when scrolled into view */
  inView?: boolean
}

export function Stagger({ children, stagger = 0.07, delay = 0.05, inView = false, ...rest }: StaggerProps) {
  const reduced = useReducedMotion()
  const container = staggerContainer(reduced ? 0.02 : stagger, reduced ? 0 : delay)
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate={inView ? undefined : 'visible'}
      whileInView={inView ? 'visible' : undefined}
      viewport={inView ? viewportOnce : undefined}
      exit="exit"
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, ...rest }: HTMLMotionProps<'div'> & { children: ReactNode }) {
  const reduced = useReducedMotion()
  return (
    <motion.div variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : staggerItem} {...rest}>
      {children}
    </motion.div>
  )
}
