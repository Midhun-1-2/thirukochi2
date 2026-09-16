import { motion } from 'framer-motion'
import { BellRing, CircleCheck, Sparkles, TrendingUp, type LucideIcon } from 'lucide-react'
import { Badge, type BadgeTone } from '@/components/ui/Basics'
import type { ActivityItem, ActivityStatus } from '@/data/types'
import { useReducedMotion } from '@/hooks'
import { formatDate, formatINR } from '@/lib/format'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Activity — a timeline/card hybrid. A hairline gold rail with
   maroon nodes; each entry is a soft white card.
------------------------------------------------------------------- */

const categoryIcons: Record<ActivityItem['category'], LucideIcon> = {
  payments: CircleCheck,
  rate: TrendingUp,
  schemes: Sparkles,
}

const statusMeta: Record<ActivityStatus, { label: string; tone: BadgeTone }> = {
  completed: { label: 'Completed', tone: 'success' },
  info: { label: 'Update', tone: 'gold' },
  due: { label: 'Due', tone: 'maroon' },
  new: { label: 'New', tone: 'gold' },
}

export function ActivityEntry({ item, last, dense }: { item: ActivityItem; last?: boolean; dense?: boolean }) {
  const Icon = item.status === 'due' ? BellRing : categoryIcons[item.category]
  const meta = statusMeta[item.status]
  const reduced = useReducedMotion()
  return (
    <motion.li
      variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : { hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: spring.soft } }}
      className="relative flex gap-4"
    >
      <div className="relative flex w-10 shrink-0 flex-col items-center">
        <motion.span
          variants={reduced ? undefined : { hidden: { scale: 0.4, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: spring.snappy } }}
          className={cn(
            'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border',
            item.status === 'due' ? 'border-gold bg-gold-pale text-maroon' : 'border-gold/40 bg-maroon text-gold-light',
          )}
        >
          {!reduced && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-gold"
              variants={{ hidden: { scale: 1, opacity: 0 }, visible: { scale: [1, 2.1], opacity: [0.7, 0], transition: { duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] } } }}
            />
          )}
          <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
          {item.unread && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-white" aria-label="Unread" />}
        </motion.span>
        {!last && (
          <motion.span
            variants={reduced ? undefined : { hidden: { scaleY: 0 }, visible: { scaleY: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 } } }}
            className="absolute top-10 bottom-[-16px] w-px origin-top bg-gradient-to-b from-gold/60 to-gold/10"
            aria-hidden="true"
          />
        )}
      </div>
      <div className={cn('min-w-0 flex-1 rounded-2xl border border-gold/20 bg-white shadow-soft', dense ? 'p-3.5' : 'p-4', !last && 'mb-4')}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-maroon">{item.title}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-ink-soft">{item.description}</p>
          </div>
          <Badge tone={meta.tone} className="shrink-0">
            {meta.label}
          </Badge>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-3 text-xs text-ink-mute">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          {typeof item.amount === 'number' && (
            <span className={cn('font-medium tabular', item.status === 'due' ? 'text-maroon' : 'text-success')}>
              {item.status === 'due' ? '' : '+'}
              {formatINR(item.amount, { decimals: false })}
            </span>
          )}
        </div>
      </div>
    </motion.li>
  )
}

export function ActivityList({ items, dense, className, inView = true }: { items: ActivityItem[]; dense?: boolean; className?: string; inView?: boolean }) {
  const reduced = useReducedMotion()
  return (
    <motion.ol
      initial="hidden"
      animate={inView ? undefined : 'visible'}
      whileInView={inView ? 'visible' : undefined}
      viewport={inView ? { once: true, amount: 0.15 } : undefined}
      variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.07, delayChildren: 0.05 } } }}
      className={cn('list-none', className)}
    >
      {items.map((item, i) => (
        <ActivityEntry key={item.id} item={item} last={i === items.length - 1} dense={dense} />
      ))}
    </motion.ol>
  )
}
