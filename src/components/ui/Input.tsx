import { useId, useState, type InputHTMLAttributes, type ReactNode, type Ref } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Floating-label text input with prefix / icon / trailing slots and
   accessible error + success states.
------------------------------------------------------------------- */

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'> {
  label: string
  error?: string
  success?: boolean
  hint?: string
  prefix?: string
  icon?: ReactNode
  trailing?: ReactNode
  ref?: Ref<HTMLInputElement>
  tone?: 'light' | 'dark'
  /** 48px tall (auth forms) instead of 56px */
  dense?: boolean
}

export function Input({
  label,
  error,
  success,
  hint,
  prefix,
  icon,
  trailing,
  className,
  id,
  tone = 'light',
  dense = false,
  onFocus,
  onBlur,
  ref,
  ...rest
}: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const [focused, setFocused] = useState(false)
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
  const dark = tone === 'dark'

  return (
    <div className={cn('group', className)}>
      <div
        className={cn(
          'relative flex items-center rounded-2xl border transition-all duration-300',
          dense ? 'h-12' : 'h-14',
          dark ? 'bg-white/[0.06] border-gold-light/25' : 'bg-white border-maroon/10',
          focused && (dark ? 'border-gold-light/80 shadow-[0_0_0_4px_rgba(212,175,55,0.14)]' : 'border-gold shadow-[0_0_0_4px_rgba(212,175,55,0.14)]'),
          error && 'border-danger/70 shadow-[0_0_0_4px_rgba(143,45,45,0.10)]',
          success && !error && 'border-success/60',
        )}
      >
        {icon && (
          <span
            className={cn(
              'ml-4 flex shrink-0 items-center transition-colors duration-300',
              dark ? 'text-gold-light/60' : 'text-ink-mute',
              focused && (dark ? 'text-gold-light' : 'text-gold-deep'),
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        {prefix && (
          <span
            className={cn(
              'select-none pl-4 pr-2 text-sm font-medium',
              icon && 'pl-3',
              dark ? 'text-gold-light/80' : 'text-maroon/70',
            )}
            aria-hidden="true"
          >
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          className={cn(
            'peer h-full w-full min-w-0 flex-1 bg-transparent px-4 outline-none tabular placeholder-transparent',
            dense ? 'pt-3.5 text-[14px]' : 'pt-4 text-[15px]',
            (icon || prefix) && 'pl-1',
            dark ? 'text-cream' : 'text-ink',
          )}
          {...rest}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2 text-[15px] transition-all duration-200 ease-out',
            dense
              ? 'text-[14px] peer-focus:top-[10px] peer-focus:text-[10px] peer-focus:tracking-wide peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-wide'
              : 'peer-focus:top-[13px] peer-focus:text-[11px] peer-focus:tracking-wide peer-[:not(:placeholder-shown)]:top-[13px] peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:tracking-wide',
            icon ? 'left-[44px]' : 'left-4',
            prefix && (icon ? 'left-[76px]' : 'left-[48px]'),
            dark ? 'text-cream/60 peer-focus:text-gold-light' : 'text-ink-mute peer-focus:text-gold-deep',
            error && 'text-danger peer-focus:text-danger',
          )}
        >
          {label}
        </label>
        <div className="mr-3 flex shrink-0 items-center gap-1">
          <AnimatePresence>
            {success && !error && (
              <motion.span
                key="ok"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-success-soft text-success"
                aria-hidden="true"
              >
                <Check size={13} strokeWidth={3} />
              </motion.span>
            )}
          </AnimatePresence>
          {trailing}
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <motion.p
            key="error"
            id={`${inputId}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="mt-1.5 flex items-center gap-1.5 overflow-hidden px-1 text-xs text-danger"
          >
            <AlertCircle size={13} aria-hidden="true" />
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            id={`${inputId}-hint`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn('mt-1.5 px-1 text-xs', dark ? 'text-cream/55' : 'text-ink-mute')}
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
