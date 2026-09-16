import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronRight, Pencil } from 'lucide-react'
import { SchemeArtwork } from '@/components/brand/JewelArt'
import { Badge } from '@/components/ui/Basics'
import { Card, GoldRule } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/States'
import { DrawnArt, WipeReveal } from '@/components/motion/Signature'
import type { PaymentMethod, Scheme, SchemeSelection } from '@/data/types'
import { useRichMotion } from '@/hooks'
import { formatINR } from '@/lib/format'
import { cn } from '@/lib/utils'

/* ---------- Catalog card ---------- */
/**
 * A display case: the maroon vitrine unveils behind a gold light, the
 * jewellery draws itself, then rests. Hover moves a spotlight — not the
 * card — across the glass and draws the "View Scheme" underline.
 */
export function SchemeCard({ scheme, className, index = 0 }: { scheme: Scheme; className?: string; index?: number }) {
  const rich = useRichMotion()
  const monthly = scheme.presetAmounts[1] ?? scheme.minAmount
  const delay = 0.15 + index * 0.18

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!rich) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--sx', `${((e.clientX - r.left) / r.width) * 100}%`)
    e.currentTarget.style.setProperty('--sy', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <WipeReveal className={cn('h-full', className)} delay={delay} duration={1} inView>
      <Card tone="white" padding="none" interactive radius="xl" className="group flex h-full flex-col">
        <Link to={`/schemes/${scheme.id}`} className="flex h-full flex-col focus-visible:outline-none" aria-label={`View ${scheme.name}`}>
          {/* vitrine */}
          <div
            className="relative h-40 overflow-hidden maroon-surface grain"
            onPointerMove={onPointerMove}
            style={{ ['--sx' as string]: '70%', ['--sy' as string]: '30%' }}
          >
            {/* ambient glow blooms on hover */}
            <div className="absolute -right-6 -top-10 h-40 w-40 rounded-full gold-glow opacity-60 transition-[opacity,transform] duration-700 ease-out group-hover:scale-125 group-hover:opacity-90" aria-hidden="true" />
            {/* pointer spotlight on the glass */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: 'radial-gradient(190px circle at var(--sx) var(--sy), rgba(249,223,146,0.22), rgba(249,223,146,0) 62%)' }}
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-maroon-deep/60 to-transparent" aria-hidden="true" />
            {/* jewellery draws itself, then floats */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="float-slow h-full w-auto aspect-square transition-[filter] duration-700 group-hover:brightness-110 group-hover:drop-shadow-[0_0_14px_rgba(249,223,146,0.45)]">
                <DrawnArt delay={delay + 0.5} duration={1.6}>
                  <SchemeArtwork art={scheme.art} />
                </DrawnArt>
              </div>
            </div>
            {/* glass edge hairline */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" aria-hidden="true" />
            {scheme.highlight && <Badge tone="onMaroon" className="absolute left-4 top-4">{scheme.highlight}</Badge>}
          </div>

          <div className="flex flex-1 flex-col p-5">
            <p className="eyebrow text-gold-deep">{scheme.category === 'fixed-deposit' ? 'Fixed Deposit' : 'Gold Savings'}</p>
            <h3 className="mt-1.5 font-display text-lg text-maroon">{scheme.name}</h3>
            <p className="mt-1 text-[13px] text-ink-soft">{scheme.tagline}</p>
            <dl className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-cream/80 p-3 text-center transition-colors duration-500 group-hover:bg-gold-pale/60">
              <div>
                <dt className="text-[10px] tracking-wider text-ink-mute uppercase">From</dt>
                <dd className="mt-0.5 text-[13px] font-medium text-maroon tabular">{formatINR(scheme.minAmount, { decimals: false })}</dd>
              </div>
              <div className="border-x border-gold/20">
                <dt className="text-[10px] tracking-wider text-ink-mute uppercase">Tenure</dt>
                <dd className="mt-0.5 text-[13px] font-medium text-maroon tabular">{scheme.tenure} mo</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-wider text-ink-mute uppercase">Monthly</dt>
                <dd className="mt-0.5 text-[13px] font-medium text-maroon tabular">{formatINR(monthly, { decimals: false })}</dd>
              </div>
            </dl>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-maroon">
              <span className="draw-underline pb-0.5 [.group:hover_&]:[background-size:100%_2px]">View Scheme</span>
              <ArrowRight size={15} className="transition-transform duration-500 ease-out group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </Link>
      </Card>
    </WipeReveal>
  )
}

export function SchemeCardSkeleton() {
  return (
    <div className="card-surface overflow-hidden rounded-[28px]" aria-hidden="true">
      <Skeleton className="h-40 rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-4 h-16 w-full rounded-2xl" />
      </div>
    </div>
  )
}

/* ---------- Catalog row (compact, small screens) ---------- */
/**
 * A jeweller's index line: a small maroon medallion holds the piece, the
 * name and three figures sit beside it. Three schemes fit in one
 * viewport — no horizontal rail, no long stack.
 */
export function SchemeRow({ scheme, index = 0, className }: { scheme: Scheme; index?: number; className?: string }) {
  const monthly = scheme.presetAmounts[1] ?? scheme.minAmount
  const delay = 0.1 + index * 0.14
  const stats = [
    { label: 'Min', value: formatINR(scheme.minAmount, { decimals: false }) },
    { label: 'Months', value: String(scheme.tenure) },
    { label: 'Monthly', value: formatINR(monthly, { decimals: false }) },
  ]
  return (
    <WipeReveal className={cn('min-w-0', className)} delay={delay} duration={0.9} inView>
      <Link
        to={`/schemes/${scheme.id}`}
        aria-label={`View ${scheme.name}`}
        className="group/row relative flex min-w-0 items-center gap-3.5 px-4 py-3 transition-colors duration-300 active:bg-cream/70 focus-visible:outline-none focus-visible:bg-cream/70"
      >
        {/* gold thread along the left on press / focus */}
        <span className="absolute inset-y-3 left-0 w-0.5 origin-top scale-y-0 rounded-full bg-gold transition-transform duration-500 ease-out group-active/row:scale-y-100 group-focus-visible/row:scale-y-100" aria-hidden="true" />
        {/* medallion */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[18px] maroon-surface grain">
          <div className="absolute -right-4 -top-5 h-16 w-16 rounded-full gold-glow opacity-70" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center p-2.5">
            <div className="float-slow h-full w-full">
              <DrawnArt delay={delay + 0.4} duration={1.4}>
                <SchemeArtwork art={scheme.art} />
              </DrawnArt>
            </div>
          </div>
          <div className="absolute inset-0 rounded-[18px] border border-gold/30" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="eyebrow whitespace-nowrap text-gold-deep">{scheme.category === 'fixed-deposit' ? 'Fixed Deposit' : 'Gold Savings'}</p>
          <h3 className="mt-0.5 truncate font-display text-[17px] leading-tight text-maroon">{scheme.name}</h3>
          <dl className="mt-1.5 grid max-w-[240px] grid-cols-3 gap-2">
            {stats.map((st, i) => (
              <div key={st.label} className={cn('min-w-0', i > 0 && 'border-l border-gold/25 pl-2')}>
                <dd className="truncate text-[12px] font-medium leading-none text-maroon tabular">{st.value}</dd>
                <dt className="mt-0.5 text-[9px] font-medium tracking-[0.12em] text-ink-mute uppercase">{st.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <ChevronRight size={18} strokeWidth={2} className="shrink-0 text-gold-deep transition-transform duration-500 ease-out group-active/row:translate-x-0.5" aria-hidden="true" />
        {scheme.highlight && (
          <Badge tone="maroon" className="absolute right-3 top-2 h-5 px-2 text-[10px] whitespace-nowrap">
            {scheme.highlight}
          </Badge>
        )}
      </Link>
    </WipeReveal>
  )
}

export function SchemeRowSkeleton() {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3" aria-hidden="true">
      <Skeleton className="h-16 w-16 shrink-0 rounded-[18px]" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-6 w-48" />
      </div>
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
  )
}

/* ---------- Summary ---------- */
interface SummaryProps {
  scheme: Scheme
  selection: SchemeSelection
  method?: PaymentMethod
  editHref?: string
  onEditStep?: (step: number) => void
  className?: string
  showBenefits?: boolean
}

export function SchemeSummary({ scheme, selection, method, editHref, onEditStep, className, showBenefits = true }: SummaryProps) {
  const total = selection.amount * scheme.tenure
  const rows: Array<{ label: string; value: string; step?: number; pending?: boolean }> = [
    { label: 'Scheme Name', value: scheme.name, step: 0 },
    { label: 'Monthly Amount', value: formatINR(selection.amount, { decimals: false }), step: 1 },
    { label: 'Tenure', value: `${scheme.tenure} Months` },
    // no method yet means it is picked on the next step, not a missing value
    method ? { label: 'Payment Method', value: method.label, step: 2 } : { label: 'Payment Method', value: 'Choose after Proceed', pending: true },
  ]
  return (
    <Card tone="white" radius="xl" padding="none" className={className}>
      <div className="relative maroon-surface grain px-5 py-5 sm:px-7">
        <p className="eyebrow text-gold-light/80">Scheme Summary</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h3 className="font-display text-xl text-cream sm:text-2xl">{scheme.name}</h3>
          <p className="text-sm text-cream/70">
            Total saved <span className="font-medium gold-text tabular">{formatINR(total, { decimals: false })}</span>
          </p>
        </div>
      </div>
      <dl className="divide-y divide-gold/15 px-5 sm:px-7">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-3.5">
            <dt className="text-[13px] text-ink-soft">{row.label}</dt>
            <dd className={cn('flex items-center gap-2 text-right text-sm tabular', row.pending ? 'italic text-ink-soft' : 'font-medium text-maroon')}>
              {row.value}
              {onEditStep && row.step !== undefined ? (
                <button type="button" onClick={() => onEditStep(row.step!)} aria-label={`Edit ${row.label}`} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-mute transition hover:bg-maroon-tint hover:text-maroon">
                  <Pencil size={13} />
                </button>
              ) : onEditStep ? (
                <span className="h-8 w-8" aria-hidden="true" />
              ) : null}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-[13px] text-ink-soft">Monthly Instalment</dt>
          <dd className="font-figures text-xl font-semibold text-maroon tabular">{formatINR(selection.amount, { decimals: false })}</dd>
        </div>
      </dl>
      {showBenefits && (
        <div className="px-5 pb-5 sm:px-7 sm:pb-7">
          <GoldRule ornament className="my-2" />
          <p className="eyebrow mt-4 text-gold-deep">Benefits</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {scheme.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-[13px] text-ink">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-pale text-gold-deep">
                  <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                </span>
                {b}
              </li>
            ))}
          </ul>
          {editHref && (
            <Link to={editHref} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-maroon underline-offset-4 hover:underline">
              <Pencil size={14} /> Edit Details
            </Link>
          )}
        </div>
      )}
    </Card>
  )
}
