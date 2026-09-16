import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Avatar, Badge, type BadgeTone } from '@/components/ui/Basics'
import type { ReferralCredit, ReferralStatus } from '@/data/types'
import { useReducedMotion } from '@/hooks'
import { formatDate, formatINR } from '@/lib/format'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

const statusMeta: Record<ReferralStatus, { label: string; tone: BadgeTone }> = {
  credited: { label: 'Credited', tone: 'success' },
  pending: { label: 'Pending', tone: 'gold' },
  redeemed: { label: 'Redeemed', tone: 'maroon' },
}

export function ReferralCreditItem({ credit, dense }: { credit: ReferralCredit; dense?: boolean }) {
  const reduced = useReducedMotion()
  const meta = statusMeta[credit.status]
  const redeemed = credit.status === 'redeemed'
  return (
    <motion.li
      variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: spring.soft } }}
      className={cn('flex items-center gap-3.5 rounded-2xl border border-gold/20 bg-white shadow-soft', dense ? 'p-3' : 'p-3.5 sm:p-4')}
    >
      {redeemed ? (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-maroon/15 bg-maroon-tint text-maroon" aria-hidden="true">
          <ArrowUpRight size={18} strokeWidth={1.8} />
        </span>
      ) : (
        <Avatar name={credit.friendName} size={44} />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-maroon">{credit.friendName}</p>
        <p className="truncate text-xs text-ink-soft">{credit.schemeName}</p>
        <p className="text-[11px] text-ink-mute">
          <time dateTime={credit.date}>{formatDate(credit.date)}</time>
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className={cn('text-sm font-medium tabular', redeemed ? 'text-maroon' : credit.status === 'pending' ? 'text-ink-mute' : 'text-success')}>
          <span className="sr-only">{redeemed ? 'Debit' : 'Credit'} </span>
          {redeemed ? '−' : '+'}
          {formatINR(Math.abs(credit.amount), { decimals: false })}
        </p>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>
    </motion.li>
  )
}
