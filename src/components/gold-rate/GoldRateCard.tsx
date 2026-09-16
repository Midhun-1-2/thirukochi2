import { useEffect, useId, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { RollingNumber } from '@/components/motion/Signature'
import { LiveBadge } from '@/components/ui/Basics'
import { Card } from '@/components/ui/Card'
import { ErrorState, Skeleton } from '@/components/ui/States'
import type { GoldRate, GoldRateData } from '@/data/types'
import { useReducedMotion } from '@/hooks'
import { formatDate, formatINR, formatNumberIN } from '@/lib/format'
import { ease, spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Gold rate — editorial ticker. A slim white card with a maroon
   masthead, text-tab rate switch, odometer price and a thin gold
   sparkline. Light, quiet, no scrolling regions.
------------------------------------------------------------------- */

function buildPath(values: number[], w: number, h: number, pad = 4) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const pts = values.map((v, i) => ({
    x: pad + (i / (values.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`
  }
  const last = pts[pts.length - 1]
  const area = `${d} L ${last.x} ${h} L ${pts[0].x} ${h} Z`
  return { line: d, area, last }
}

export function GoldRateChart({ rate, className }: { rate: GoldRate; className?: string }) {
  const id = useId()
  const reduced = useReducedMotion()
  const W = 240
  const H = 64
  const { line, area, last } = useMemo(() => buildPath(rate.history, W, H), [rate.history])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn('block w-full', className)} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#b3871c" />
        </linearGradient>
      </defs>
      <AnimatePresence mode="wait">
        <motion.g key={rate.id} initial="hidden" animate="visible" exit="exit">
          <motion.path
            d={area}
            fill={`url(#${id}-area)`}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: reduced ? 0 : 0.5, duration: 0.5 } }, exit: { opacity: 0, transition: { duration: 0.12 } } }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke={`url(#${id}-line)`}
            strokeWidth="1.8"
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 1, transition: { duration: reduced ? 0 : 1.2, ease: ease.luxe } },
              exit: { opacity: 0, transition: { duration: 0.12 } },
            }}
          />
          <motion.g
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1, transition: { delay: reduced ? 0 : 1.05, ...spring.snappy } }, exit: { opacity: 0 } }}
            style={{ transformOrigin: `${last.x}px ${last.y}px` }}
          >
            <circle cx={last.x} cy={last.y} r="7" fill="#540000" fillOpacity="0.12" />
            <circle cx={last.x} cy={last.y} r="3" fill="#540000" />
          </motion.g>
        </motion.g>
      </AnimatePresence>
    </svg>
  )
}

export function GoldRateSkeleton({ className }: { className?: string }) {
  return (
    <Card tone="white" radius="xl" padding="none" className={className} aria-busy="true" aria-label="Loading gold rate">
      <div className="maroon-surface h-11" />
      <div className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[1fr_220px]">
        <div>
          <div className="flex gap-4">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="mt-5 h-12 w-60" />
          <Skeleton className="mt-3 h-3 w-40" />
        </div>
        <Skeleton className="h-16 w-full" />
      </div>
    </Card>
  )
}

interface GoldRateCardProps {
  data?: GoldRateData
  status: 'loading' | 'error' | 'success'
  onRetry?: () => void
  className?: string
  compact?: boolean
}

const ROTATE_MS = 4500

export function GoldRateCard({ data, status, onRetry, className, compact = false }: GoldRateCardProps) {
  const [selectedId, setSelectedId] = useState<string>('1g-22k')
  const reduced = useReducedMotion()
  const rate = data?.rates.find((r) => r.id === selectedId) ?? data?.rates[0]

  // Auto-rotate through the rates. A manual pick simply restarts the timer
  // from that rate — the carousel never stops.
  useEffect(() => {
    if (!data) return
    const id = window.setInterval(() => {
      if (document.hidden) return
      setSelectedId((current) => {
        const i = data.rates.findIndex((r) => r.id === current)
        return data.rates[(i + 1) % data.rates.length].id
      })
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [data, selectedId])

  if (status === 'loading' || !data || !rate) {
    if (status === 'error') {
      return (
        <Card tone="white" radius="xl" padding="none" className={className}>
          <div className="maroon-surface h-11" />
          <ErrorState title="Gold rate unavailable" description="We could not fetch today's rate. Please try again." onRetry={onRetry} />
        </Card>
      )
    }
    return <GoldRateSkeleton className={className} />
  }

  const down = rate.change < 0
  // Reserve the widest price so the change pill never jumps as rates rotate.
  const widestPrice = data.rates.map((r) => formatNumberIN(r.price, 2)).reduce((a, b) => (b.length > a.length ? b : a), '')
  const lo = Math.min(...rate.history)
  const hi = Math.max(...rate.history)
  const updated = new Date(data.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <Card tone="white" radius="xl" padding="none" className={cn('card-sheen', className)}>
      {/* masthead */}
      <div className="relative flex h-11 items-center justify-between overflow-hidden maroon-surface px-5 sm:px-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full gold-glow opacity-70" aria-hidden="true" />
        <p className="eyebrow relative text-gold-light">Today&apos;s Gold Rate</p>
        <div className="relative flex items-center gap-3 text-[11px] text-cream/70">
          <span className="hidden xs:inline">{formatDate(data.date)} · {updated}</span>
          {data.live && <LiveBadge />}
        </div>
      </div>

      <div className={cn('grid gap-5 px-5 py-5 sm:px-6', !compact && 'lg:grid-cols-[1fr_230px] lg:items-center lg:gap-8 xl:grid-cols-[1fr_260px]')}>
        {/* ---------- price ---------- */}
        <div className="min-w-0">
          <div className="flex items-center gap-5" role="radiogroup" aria-label="Rate options">
            {data.rates.map((r) => {
              const active = r.id === rate.id
              return (
                <button
                  key={r.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedId(r.id)}
                  className={cn(
                    'relative pb-1.5 text-[11px] font-medium tracking-[0.16em] uppercase transition-colors duration-300',
                    active ? 'text-maroon' : 'text-ink-mute hover:text-maroon',
                  )}
                >
                  {r.label}
                  {active && (
                    <motion.span
                      layoutId="rate-tab-underline"
                      transition={reduced ? { duration: 0 } : spring.snappy}
                      className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden rounded-full bg-gold/25"
                      aria-hidden="true"
                    >
                      {/* fills across the rotation interval, restarts on every switch */}
                      <motion.span
                        key={rate.id}
                        className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-light"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }}
                      />
                    </motion.span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-1.5">
            <p className="font-display leading-none text-maroon">
              <span className="mr-1 align-top text-[clamp(1.1rem,3vw,1.6rem)] text-gold-deep">₹</span>
              <span className="inline-grid text-[clamp(2.2rem,6.5vw,3.5rem)] tracking-tight">
                <span className="invisible [grid-area:1/1] tabular" aria-hidden="true">{widestPrice}</span>
                <RollingNumber value={rate.price} format={(n) => formatNumberIN(n, 2)} className="[grid-area:1/1]" />
              </span>
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={rate.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'mb-1 inline-flex h-6 items-center gap-1 rounded-full px-2 text-[11px] font-medium tabular',
                  down ? 'bg-maroon-tint text-maroon' : 'bg-gold-pale text-gold-deep',
                )}
                aria-label={`${down ? 'Down' : 'Up'} ${formatINR(Math.abs(rate.change))} since last update`}
              >
                {down ? <ArrowDownRight size={13} aria-hidden="true" /> : <ArrowUpRight size={13} aria-hidden="true" />}
                {formatINR(Math.abs(rate.change))}
              </motion.span>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={rate.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-xs text-ink-mute"
            >
              per {rate.weightGrams} gram{rate.weightGrams > 1 ? 's' : ''} · {rate.purity} · indicative, showroom rate applies
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ---------- sparkline ---------- */}
        {!compact && (
          <div className="border-t border-gold/20 pt-3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="flex items-center justify-between text-[10px] tracking-[0.14em] text-ink-mute uppercase">
              <span>12 updates</span>
              <span className="tabular">
                {formatINR(lo, { decimals: false })} – {formatINR(hi, { decimals: false })}
              </span>
            </div>
            <GoldRateChart rate={rate} className="mt-1 h-12 lg:h-16" />
          </div>
        )}
      </div>
    </Card>
  )
}
