import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { useRichMotion } from '@/hooks'
import { cardHover } from '@/lib/motion'
import { cn } from '@/lib/utils'

export type CardTone = 'white' | 'cream' | 'maroon' | 'gold' | 'glass'

const tones: Record<CardTone, string> = {
  white: 'bg-white border border-gold/20 text-ink shadow-soft',
  cream: 'bg-ivory border border-gold/25 text-ink shadow-soft',
  maroon: 'maroon-surface border border-gold-light/15 text-cream shadow-maroon',
  gold: 'gold-surface border border-gold-light/40 text-maroon-deep shadow-gold',
  glass: 'glass-cream text-ink shadow-soft',
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
}

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  tone?: CardTone
  padding?: keyof typeof paddings
  interactive?: boolean
  radius?: 'lg' | 'xl' | '2xl'
}

const radii = { lg: 'rounded-[20px]', xl: 'rounded-[28px]', '2xl': 'rounded-[36px]' }

export function Card({ children, tone = 'white', padding = 'md', interactive = false, radius = 'lg', className, ...rest }: CardProps) {
  const rich = useRichMotion()
  return (
    <motion.div
      variants={interactive ? cardHover : undefined}
      initial={interactive ? 'rest' : undefined}
      whileHover={interactive && rich ? 'hover' : undefined}
      whileTap={interactive ? 'tap' : undefined}
      className={cn(
        'relative overflow-hidden transition-[box-shadow,border-color] duration-300',
        tones[tone],
        radii[radius],
        paddings[padding],
        interactive && 'card-sheen cursor-pointer hover:border-gold/60 hover:shadow-lift',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Thin gold rule with optional centred ornament. */
export function GoldRule({ className, ornament = false }: { className?: string; ornament?: boolean }) {
  if (!ornament) return <div className={cn('gold-hairline w-full', className)} aria-hidden="true" />
  return (
    <div className={cn('flex w-full items-center gap-3', className)} aria-hidden="true">
      <div className="gold-hairline flex-1" />
      <span className="block h-1.5 w-1.5 rotate-45 border border-gold/70" />
      <div className="gold-hairline flex-1" />
    </div>
  )
}
