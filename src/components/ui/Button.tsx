import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, type LinkProps } from 'react-router-dom'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Button — still and composed. Nothing moves or scales. On hover a
   thin light traces the gold rim once around and the label breathes
   (letter-spacing opens a touch). Loading shows a hairline progress
   sweep; success fades a check in.
------------------------------------------------------------------- */

export type ButtonVariant = 'primary' | 'maroon' | 'outline' | 'ghost' | 'subtle' | 'onMaroon'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'group/btn btn-trace relative isolate inline-flex min-w-0 items-center justify-center gap-2 select-none overflow-hidden whitespace-nowrap rounded-full font-body font-medium tracking-[0.02em] transition-[box-shadow,background-color,color,border-color,filter,letter-spacing] duration-500 ease-out disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold'

const variants: Record<ButtonVariant, string> = {
  primary:
    'gold-surface text-maroon-deep shadow-[0_10px_26px_-12px_rgba(179,135,28,0.6)] hover:shadow-[0_14px_34px_-12px_rgba(179,135,28,0.75)] hover:brightness-[1.04] hover:tracking-[0.07em] active:brightness-[0.96]',
  maroon:
    'bg-maroon text-cream shadow-[0_10px_28px_-12px_rgba(84,0,0,0.6)] hover:bg-maroon-soft hover:tracking-[0.07em] active:brightness-[0.94]',
  outline: 'border border-gold/60 bg-transparent text-maroon hover:border-gold hover:bg-gold-pale/50 hover:tracking-[0.06em]',
  ghost: 'bg-transparent text-maroon hover:bg-maroon-tint',
  subtle: 'bg-maroon-tint text-maroon hover:bg-[#efdede]',
  onMaroon: 'border border-gold-light/40 bg-white/5 text-gold-light hover:border-gold-light/80 hover:bg-white/10 hover:tracking-[0.06em]',
}

/** rim-trace light colour per variant */
const trace: Record<ButtonVariant, string> = {
  primary: '[--trace:rgba(255,255,255,0.95)]',
  maroon: '[--trace:rgba(249,223,146,0.95)]',
  outline: '[--trace:rgba(212,175,55,0.95)]',
  ghost: '[--trace:transparent]',
  subtle: '[--trace:rgba(212,175,55,0.7)]',
  onMaroon: '[--trace:rgba(249,223,146,0.95)]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[13px]',
  md: 'h-12 px-6 text-sm',
  lg: 'h-[52px] px-7 text-[15px]',
}

interface SharedProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  success?: boolean
  /** kept for API compatibility — buttons no longer shimmer */
  shimmer?: boolean
  /** kept for API compatibility — buttons no longer drift */
  magnetic?: boolean
  leading?: ReactNode
  trailing?: ReactNode
  loadingText?: string
  successText?: string
}

function Label({
  children,
  loading,
  success,
  leading,
  trailing,
  loadingText = 'Please wait',
  successText = 'Done',
}: Pick<SharedProps, 'loading' | 'success' | 'leading' | 'trailing' | 'loadingText' | 'successText'> & { children: ReactNode }) {
  const state = loading ? 'loading' : success ? 'success' : 'idle'
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25, ease: ease.soft } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="relative z-10 inline-flex items-center gap-2"
        >
          {state === 'loading' && <span>{loadingText}</span>}
          {state === 'success' && (
            <>
              <motion.svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, ease: ease.luxe }} aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <motion.path d="M7.5 12.5l3 3 6-6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.15, ease: ease.luxe }} />
              </motion.svg>
              <span>{successText}</span>
            </>
          )}
          {state === 'idle' && (
            <>
              {leading && (
                <span className="shrink-0" aria-hidden="true">
                  {leading}
                </span>
              )}
              <span>{children}</span>
              {trailing && (
                <span className="shrink-0 transition-transform duration-500 ease-out group-hover/btn:translate-x-0.5" aria-hidden="true">
                  {trailing}
                </span>
              )}
            </>
          )}
        </motion.span>
      </AnimatePresence>
      {loading && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-5 bottom-[5px] z-0 h-px origin-left bg-current opacity-50"
          initial={{ scaleX: 0, x: '0%' }}
          animate={{ scaleX: [0, 1, 1], x: ['0%', '0%', '100%'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: ease.soft }}
        />
      )}
    </>
  )
}

/* ---------- Button ---------- */
type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  success,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shimmer,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  magnetic,
  leading,
  trailing,
  loadingText,
  successText,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], trace[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <Label loading={loading} success={success} leading={leading} trailing={trailing} loadingText={loadingText} successText={successText}>
        {children}
      </Label>
    </button>
  )
}

/* ---------- ButtonLink ---------- */
type ButtonLinkProps = SharedProps & {
  to: LinkProps['to']
  replace?: boolean
  state?: unknown
  target?: string
  rel?: string
  children: ReactNode
  className?: string
  'aria-label'?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  fullWidth,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shimmer,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  magnetic,
  leading,
  trailing,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={cn(base, variants[variant], trace[variant], sizes[size], fullWidth && 'w-full', className)} {...rest}>
      <span className="relative z-10 inline-flex items-center gap-2">
        {leading && (
          <span className="shrink-0" aria-hidden="true">
            {leading}
          </span>
        )}
        <span>{children}</span>
        {trailing && (
          <span className="shrink-0 transition-transform duration-500 ease-out group-hover/btn:translate-x-0.5" aria-hidden="true">
            {trailing}
          </span>
        )}
      </span>
    </Link>
  )
}
