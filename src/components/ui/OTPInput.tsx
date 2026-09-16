import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Six individual OTP boxes with keyboard, paste and SMS autofill
   support. Active box glows gold; boxes stagger into view.
------------------------------------------------------------------- */

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  error?: boolean
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

export function OTPInput({ length = 6, value, onChange, onComplete, error, disabled, autoFocus = true, className }: OTPInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const [active, setActive] = useState<number>(-1)
  const reduced = useReducedMotion()
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus()
  }, [autoFocus])

  const commit = (next: string) => {
    const clean = next.replace(/\D/g, '').slice(0, length)
    onChange(clean)
    if (clean.length === length) onComplete?.(clean)
  }

  const handleChange = (index: number, raw: string) => {
    const incoming = raw.replace(/\D/g, '')
    if (!incoming) {
      commit(value.slice(0, index) + value.slice(index + 1))
      return
    }
    if (incoming.length > 1) {
      // autofill / multi-char insertion
      const next = (value.slice(0, index) + incoming).slice(0, length)
      commit(next)
      refs.current[Math.min(next.length, length - 1)]?.focus()
      return
    }
    const next = value.slice(0, index) + incoming + value.slice(index + 1)
    commit(next)
    if (index < length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (digits[index]) {
        commit(value.slice(0, index) + value.slice(index + 1))
      } else if (index > 0) {
        commit(value.slice(0, index - 1) + value.slice(index))
        refs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      refs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      refs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!text) return
    commit(text)
    refs.current[Math.min(text.length, length - 1)]?.focus()
  }

  return (
    <motion.div
      className={cn('flex items-center justify-between gap-2 xs:gap-3', className)}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.05, delayChildren: 0.1 } } }}
      role="group"
      aria-label="One-time password"
    >
      {digits.map((d, i) => {
        const isActive = active === i
        const filled = Boolean(d)
        return (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 14, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: spring.soft } }}
            className="relative flex-1"
          >
            <input
              ref={(el) => {
                refs.current[i] = el
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={length}
              value={d}
              disabled={disabled}
              aria-label={`Digit ${i + 1} of ${length}`}
              aria-invalid={error || undefined}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => {
                setActive(i)
                e.target.select()
              }}
              onBlur={() => setActive(-1)}
              className={cn(
                'h-14 w-full rounded-2xl border bg-white text-center font-display text-2xl text-maroon outline-none transition-all duration-300 tabular',
                'border-maroon/10',
                filled && 'border-gold/70 bg-gold-pale/40',
                isActive && 'border-gold shadow-[0_0_0_4px_rgba(212,175,55,0.16),0_8px_24px_-10px_rgba(212,175,55,0.6)]',
                error && 'border-danger/70 bg-danger-soft/40',
                disabled && 'opacity-60',
              )}
            />
            {isActive && !filled && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-gold"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
