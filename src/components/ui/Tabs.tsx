import { useId } from 'react'
import { motion } from 'framer-motion'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Segmented tabs with a shared-layout active pill (maroon + gold).
------------------------------------------------------------------- */

export interface TabOption<T extends string> {
  value: T
  label: string
  count?: number
}

interface TabsProps<T extends string> {
  options: TabOption<T>[]
  value: T
  onChange: (value: T) => void
  tone?: 'light' | 'dark'
  className?: string
  ariaLabel?: string
  size?: 'sm' | 'md'
  /** Buttons share the width equally (no internal scroll). */
  stretch?: boolean
  /** Pills flow onto extra rows instead of scrolling — for narrow phones with many options. */
  wrap?: boolean
}

export function Tabs<T extends string>({ options, value, onChange, tone = 'light', className, ariaLabel, size = 'md', stretch = false, wrap = false }: TabsProps<T>) {
  const id = useId()
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'hide-scrollbar inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full p-1',
        stretch && 'flex w-full',
        wrap && 'flex w-full flex-wrap overflow-visible rounded-[22px]',
        tone === 'light' ? 'bg-sand/80 border border-gold/20' : 'bg-white/[0.06] border border-gold-light/15',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative shrink-0 rounded-full font-medium transition-colors duration-300 whitespace-nowrap',
              size === 'sm' ? 'h-8 px-3.5 text-xs' : 'h-10 px-4 text-[13px]',
              stretch && 'min-w-0 flex-1 px-2',
              active
                ? tone === 'light' ? 'text-gold-light' : 'text-maroon-deep'
                : tone === 'light' ? 'text-ink-soft hover:text-maroon' : 'text-cream/75 hover:text-cream',
            )}
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                transition={spring.snappy}
                className={cn('absolute inset-0 rounded-full', tone === 'light' ? 'bg-maroon shadow-[0_6px_16px_-8px_rgba(84,0,0,0.7)]' : 'gold-surface')}
                aria-hidden="true"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {opt.label}
              {typeof opt.count === 'number' && (
                <span className={cn('rounded-full px-1.5 text-[10px] tabular', active ? 'bg-gold/25' : 'bg-maroon/10')}>{opt.count}</span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
