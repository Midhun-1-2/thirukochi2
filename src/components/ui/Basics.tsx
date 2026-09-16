import { motion, type HTMLMotionProps } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { initials } from '@/lib/format'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ---------- Badge ---------- */
export type BadgeTone = 'gold' | 'maroon' | 'success' | 'neutral' | 'danger' | 'onMaroon'

const badgeTones: Record<BadgeTone, string> = {
  gold: 'bg-gold-pale text-gold-deep border-gold/30',
  maroon: 'bg-maroon-tint text-maroon border-maroon/10',
  success: 'bg-success-soft text-success border-success/20',
  neutral: 'bg-sand text-ink-soft border-ink/5',
  danger: 'bg-danger-soft text-danger border-danger/15',
  onMaroon: 'bg-white/10 text-gold-light border-gold-light/25',
}

export function Badge({ children, tone = 'gold', className, dot }: { children: ReactNode; tone?: BadgeTone; className?: string; dot?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium tracking-wide',
        badgeTones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}

export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-2 rounded-full border border-gold-light/30 bg-white/10 px-2.5 text-[10px] font-semibold tracking-[0.16em] text-gold-light',
        className,
      )}
    >
      <span className="live-dot relative block h-1.5 w-1.5 rounded-full bg-current text-[#ffd76a]" aria-hidden="true" />
      LIVE
    </span>
  )
}

/* ---------- Avatar ---------- */
export function Avatar({ name, size = 40, className, tone = 'maroon' }: { name: string; size?: number; className?: string; tone?: 'maroon' | 'gold' }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full border font-display font-medium',
        tone === 'maroon' ? 'bg-maroon text-gold-light border-gold/50' : 'gold-surface border-gold-light/60',
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}

/* ---------- Icon button ---------- */
interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  label: string
  children: ReactNode
  tone?: 'light' | 'dark' | 'ghost'
  size?: 'sm' | 'md'
  badge?: boolean
}

export function IconButton({ label, children, tone = 'light', size = 'md', badge, className, ...rest }: IconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.92 }}
      transition={spring.press}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-200 touch-target',
        size === 'sm' ? 'h-10 w-10' : 'h-11 w-11',
        tone === 'light' && 'bg-white text-maroon border border-gold/25 shadow-soft hover:border-gold/60 hover:bg-gold-pale/40',
        tone === 'dark' && 'bg-white/[0.08] text-gold-light border border-gold-light/20 hover:bg-white/[0.14] hover:border-gold-light/50',
        tone === 'ghost' && 'text-maroon hover:bg-maroon-tint',
        className,
      )}
      {...rest}
    >
      {children}
      {badge && (
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold ring-2 ring-white" aria-hidden="true" />
      )}
    </motion.button>
  )
}

/* ---------- Back link ---------- */
export function BackLink({ to, label = 'Back', className, tone = 'light' }: { to?: string; label?: string; className?: string; tone?: 'light' | 'dark' }) {
  const cls = cn(
    'inline-flex items-center gap-2 rounded-full text-sm font-medium transition-colors duration-200 touch-target -ml-2 px-2',
    tone === 'light' ? 'text-maroon hover:text-maroon-soft' : 'text-gold-light hover:text-white',
    className,
  )
  const inner = (
    <>
      <span className={cn('flex h-9 w-9 items-center justify-center rounded-full border', tone === 'light' ? 'border-gold/40 bg-white' : 'border-gold-light/30 bg-white/[0.08]')}>
        <ArrowLeft size={16} />
      </span>
      <span>{label}</span>
    </>
  )
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  return (
    <button type="button" onClick={() => window.history.back()} className={cls}>
      {inner}
    </button>
  )
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  action,
  tone = 'light',
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: ReactNode
  action?: ReactNode
  tone?: 'light' | 'dark'
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && <p className={cn('eyebrow mb-1.5', tone === 'light' ? 'text-gold-deep' : 'text-gold-light/80')}>{eyebrow}</p>}
        <Tag className={cn('font-display text-xl sm:text-2xl', tone === 'light' ? 'text-maroon' : 'text-cream')}>{title}</Tag>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/* ---------- Chip (selectable pill) ---------- */
interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  tone?: 'light' | 'dark'
}

export function Chip({ active, tone = 'light', className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'relative inline-flex h-10 shrink-0 items-center justify-center rounded-full border px-4 text-[13px] font-medium transition-all duration-300 select-none',
        tone === 'light' &&
          (active ? 'border-maroon bg-maroon text-gold-light shadow-[0_8px_20px_-10px_rgba(84,0,0,0.6)]' : 'border-maroon/10 bg-white text-ink-soft hover:border-gold/60 hover:text-maroon'),
        tone === 'dark' &&
          (active ? 'gold-surface border-transparent' : 'border-gold-light/25 bg-white/[0.06] text-cream/85 hover:bg-white/[0.12]'),
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
