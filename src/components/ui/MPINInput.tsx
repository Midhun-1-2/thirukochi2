import { useEffect, useRef, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Delete } from 'lucide-react'
import { useReducedMotion } from '@/hooks'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   MPIN entry: four masked dots + an on-screen numeric keypad with
   tactile feedback. Hardware keyboards also work (hidden input).
------------------------------------------------------------------- */

interface MPINInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  error?: boolean
  disabled?: boolean
  label?: string
  showKeypad?: boolean
  tone?: 'light' | 'dark'
  className?: string
}

export function MPINDots({ length = 4, value, error, tone = 'light' }: { length?: number; value: string; error?: boolean; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  return (
    <div className="flex items-center justify-center gap-4" aria-hidden="true">
      {Array.from({ length }, (_, i) => {
        const filled = i < value.length
        const active = i === value.length
        return (
          <div
            key={i}
            className={cn(
              'flex h-14 w-12 items-center justify-center rounded-2xl border transition-all duration-300',
              dark ? 'border-gold-light/25 bg-white/[0.06]' : 'border-maroon/10 bg-white',
              active && (dark ? 'border-gold-light/80 shadow-[0_0_0_4px_rgba(212,175,55,0.14)]' : 'border-gold shadow-[0_0_0_4px_rgba(212,175,55,0.16)]'),
              filled && (dark ? 'border-gold-light/60' : 'border-gold/70 bg-gold-pale/40'),
              error && 'border-danger/70',
            )}
          >
            <AnimatePresence mode="popLayout">
              {filled && (
                <motion.span
                  key="dot"
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, transition: spring.snappy }}
                  exit={{ scale: 0.3, opacity: 0, transition: { duration: 0.12 } }}
                  className={cn('h-3 w-3 rounded-full', dark ? 'bg-gold-light' : 'bg-maroon', error && 'bg-danger')}
                />
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] as const

export function NumericKeypad({
  onKey,
  onDelete,
  disabled,
  tone = 'light',
  className,
}: {
  onKey: (digit: string) => void
  onDelete: () => void
  disabled?: boolean
  tone?: 'light' | 'dark'
  className?: string
}) {
  const reduced = useReducedMotion()
  const dark = tone === 'dark'
  return (
    <div className={cn('mx-auto grid w-full max-w-[300px] grid-cols-3 gap-2.5 xs:gap-3', className)} role="group" aria-label="Numeric keypad">
      {KEYS.map((k, i) => {
        if (k === '') return <span key={`sp-${i}`} aria-hidden="true" />
        const isDel = k === 'del'
        return (
          <motion.button
            key={k}
            type="button"
            disabled={disabled}
            aria-label={isDel ? 'Delete' : k}
            onClick={() => (isDel ? onDelete() : onKey(k))}
            whileTap={reduced ? undefined : { scale: 0.9, backgroundColor: dark ? 'rgba(249,223,146,0.22)' : 'rgba(212,175,55,0.22)' }}
            transition={spring.press}
            className={cn(
              'flex h-14 items-center justify-center rounded-2xl font-display text-2xl transition-colors duration-200 select-none',
              dark
                ? 'bg-white/[0.06] text-cream hover:bg-white/[0.12] border border-gold-light/15'
                : 'bg-white text-maroon shadow-[0_2px_10px_-4px_rgba(84,0,0,0.12)] border border-maroon/[0.06] hover:border-gold/60 hover:bg-gold-pale/40',
              isDel && 'text-lg',
              disabled && 'opacity-50',
            )}
          >
            {isDel ? <Delete size={22} strokeWidth={1.8} /> : k}
          </motion.button>
        )
      })}
    </div>
  )
}

export function MPINInput({
  length = 4,
  value,
  onChange,
  onComplete,
  error,
  disabled,
  label = 'MPIN',
  showKeypad = true,
  tone = 'light',
  className,
}: MPINInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value.length === length) onComplete?.(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const push = (d: string) => {
    if (disabled || value.length >= length) return
    onChange(value + d)
  }
  const pop = () => {
    if (disabled) return
    onChange(value.slice(0, -1))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (/^\d$/.test(e.key)) {
      e.preventDefault()
      push(e.key)
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      pop()
    }
  }

  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      <button
        type="button"
        className="w-full cursor-text rounded-2xl focus-visible:outline-none"
        onClick={() => inputRef.current?.focus()}
        aria-label={`${label}: ${value.length} of ${length} digits entered`}
      >
        <MPINDots length={length} value={value} error={error} tone={tone} />
      </button>
      {/* hidden input for hardware keyboards / screen readers */}
      <input
        ref={inputRef}
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, length))}
        onKeyDown={handleKeyDown}
        aria-label={label}
        aria-invalid={error || undefined}
        disabled={disabled}
        maxLength={length}
        className="sr-only"
      />
      {showKeypad && <NumericKeypad onKey={push} onDelete={pop} disabled={disabled} tone={tone} />}
    </div>
  )
}
