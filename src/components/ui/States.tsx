import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { DiamondArt, NecklaceArt, RingArt } from '@/components/brand/JewelArt'
import { Button } from '@/components/ui/Button'
import { fadeUp } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ---------- Skeleton ---------- */
export function Skeleton({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  return <div className={cn('skeleton', tone === 'dark' && 'skeleton-maroon', className)} aria-hidden="true" />
}

export function SkeletonText({ lines = 3, className, tone }: { lines?: number; className?: string; tone?: 'light' | 'dark' }) {
  return (
    <div className={cn('space-y-2.5', className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} tone={tone} className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  )
}

/* ---------- Empty state ---------- */
export function EmptyState({
  title,
  description,
  art = 'ring',
  action,
  className,
  compact,
}: {
  title: string
  description?: string
  art?: 'ring' | 'diamond' | 'necklace'
  action?: ReactNode
  className?: string
  compact?: boolean
}) {
  const Art = art === 'diamond' ? DiamondArt : art === 'necklace' ? NecklaceArt : RingArt
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn('flex flex-col items-center text-center', compact ? 'px-4 py-8' : 'px-6 py-12', className)}
    >
      <div className={cn('relative mb-4 rounded-full bg-maroon', compact ? 'h-20 w-20 p-3' : 'h-28 w-28 p-4')}>
        <div className="absolute inset-0 rounded-full gold-glow opacity-70" aria-hidden="true" />
        <div className="float-slow relative h-full w-full">
          <Art />
        </div>
      </div>
      <h3 className="font-display text-lg text-maroon">{title}</h3>
      {description && <p className="mt-1.5 max-w-xs text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}

/* ---------- Error state ---------- */
export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again.',
  onRetry,
  className,
  tone = 'light',
}: {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
  tone?: 'light' | 'dark'
}) {
  const dark = tone === 'dark'
  return (
    <motion.div
      role="alert"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn('flex flex-col items-center px-6 py-10 text-center', className)}
    >
      <div className={cn('mb-4 flex h-14 w-14 items-center justify-center rounded-full border', dark ? 'border-gold-light/30 bg-white/[0.06] text-gold-light' : 'border-maroon/15 bg-maroon-tint text-maroon')}>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M12 3 2.5 19.5h19L12 3Z" strokeLinejoin="round" />
          <path d="M12 9.5v4.5M12 17h.01" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className={cn('font-display text-lg', dark ? 'text-cream' : 'text-maroon')}>{title}</h3>
      <p className={cn('mt-1 text-sm', dark ? 'text-cream/70' : 'text-ink-soft')}>{description}</p>
      {onRetry && (
        <Button variant={dark ? 'onMaroon' : 'outline'} size="sm" className="mt-5" onClick={onRetry} leading={<RefreshCw size={15} />}>
          Retry
        </Button>
      )}
    </motion.div>
  )
}
