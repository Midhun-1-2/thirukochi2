import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Horizontal stepper: numbered gold nodes joined by a hairline that
   fills as the user progresses. Compact on phones (labels hidden).
------------------------------------------------------------------- */

interface StepperProps {
  steps: string[]
  current: number // 0-based
  onStepClick?: (index: number) => void
  tone?: 'light' | 'dark'
  className?: string
}

export function Stepper({ steps, current, onStepClick, tone = 'light', className }: StepperProps) {
  const dark = tone === 'dark'
  const progress = steps.length > 1 ? current / (steps.length - 1) : 1
  return (
    <nav aria-label="Progress" className={cn('relative', className)}>
      <ol className="relative flex items-start justify-between">
        <div className={cn('absolute left-4 right-4 top-4 h-px', dark ? 'bg-gold-light/20' : 'bg-gold/25')} aria-hidden="true">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-gold-deep via-gold to-gold-light"
            initial={false}
            animate={{ scaleX: progress }}
            transition={spring.gentle}
            style={{ willChange: 'transform' }}
          />
        </div>
        {steps.map((label, i) => {
          const done = i < current
          const active = i === current
          const clickable = Boolean(onStepClick) && i < current
          return (
            <li key={label} className="relative z-10 flex flex-1 flex-col items-center first:items-start last:items-end">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(i)}
                aria-current={active ? 'step' : undefined}
                aria-label={`Step ${i + 1}: ${label}${done ? ' (completed)' : active ? ' (current)' : ''}`}
                className={cn('group flex flex-col items-center gap-2', !clickable && 'cursor-default')}
              >
                <motion.span
                  initial={false}
                  animate={{ scale: active ? 1.1 : 1 }}
                  transition={spring.snappy}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border text-[12px] font-semibold transition-colors duration-300',
                    done && 'gold-surface border-transparent',
                    active && (dark ? 'border-gold-light bg-maroon text-gold-light shadow-[0_0_0_4px_rgba(212,175,55,0.18)]' : 'border-gold bg-maroon text-gold-light shadow-[0_0_0_4px_rgba(212,175,55,0.18)]'),
                    !done && !active && (dark ? 'border-gold-light/25 bg-maroon-deep text-cream/50' : 'border-gold/30 bg-white text-ink-mute'),
                  )}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                </motion.span>
                <span
                  className={cn(
                    'hidden text-[11px] font-medium tracking-wide sm:block',
                    active ? (dark ? 'text-gold-light' : 'text-maroon') : dark ? 'text-cream/50' : 'text-ink-mute',
                    clickable && 'group-hover:text-maroon',
                  )}
                >
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      <p className={cn('mt-3 text-center text-xs font-medium sm:hidden', dark ? 'text-gold-light' : 'text-maroon')}>
        Step {current + 1} of {steps.length} · {steps[current]}
      </p>
    </nav>
  )
}
