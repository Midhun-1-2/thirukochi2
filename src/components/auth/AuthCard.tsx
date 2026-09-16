import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Flourish } from '@/components/brand/JewelArt'
import { Logo } from '@/components/brand/Logo'
import { PageTransition } from '@/components/motion/Primitives'
import { useReducedMotion } from '@/hooks'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Shared auth surface — a jharokha arch: ivory card with an arched
   crown, double gold rule and the emblem set at the keystone.
------------------------------------------------------------------- */

interface AuthCardProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
  /** kept for API compatibility — the arch is always ivory */
  tone?: 'light' | 'dark'
}

export function AuthCard({ eyebrow, title, description, children, footer, className }: AuthCardProps) {
  const reduced = useReducedMotion()
  return (
    <PageTransition mode="auth">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: 0.12 } } }}
        className={cn('arch-card relative mx-auto w-full max-w-[470px] bg-ivory text-ink', className)}
      >
        <div className="arch-ring" aria-hidden="true" />
        {/* keystone emblem */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.6, y: 10 }, visible: { opacity: 1, scale: 1, y: 0, transition: spring.snappy } }}
          className="absolute left-1/2 top-3 flex h-[52px] w-[52px] -translate-x-1/2 items-center justify-center rounded-full border border-gold bg-maroon shadow-[0_10px_24px_-10px_rgba(84,0,0,0.7)] ring-4 ring-ivory sm:top-4 sm:h-[60px] sm:w-[60px]"
          aria-hidden="true"
        >
          <span className="absolute inset-[3px] rounded-full border border-gold-light/40" />
          <Logo variant="emblem" width={30} priority />
        </motion.div>

        <div className="px-5 pb-4 pt-[66px] sm:px-8 sm:pb-7 sm:pt-[92px]">
          <motion.header
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: spring.soft } }}
            className="flex flex-col items-center text-center"
          >
            {eyebrow && <p className="eyebrow text-gold-deep">{eyebrow}</p>}
            <h1 className="mt-1.5 font-display text-[clamp(1.5rem,4vw,1.9rem)] leading-tight text-maroon">{title}</h1>
            {description && <div className="mt-1.5 max-w-xs text-[13px] text-ink-soft">{description}</div>}
            <Flourish className="mt-3 w-24" />
          </motion.header>
          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: spring.soft } }} className="mt-4 text-left sm:mt-5">
            {children}
          </motion.div>
          {footer && (
            <motion.footer variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }} className="mt-3 text-center text-[11px] leading-snug text-ink-mute sm:mt-4">
              {footer}
            </motion.footer>
          )}
        </div>
      </motion.section>
    </PageTransition>
  )
}
