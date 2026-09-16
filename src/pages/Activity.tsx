import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Banknote, Layers, Sparkles, TrendingUp, type LucideIcon } from 'lucide-react'
import { ActivityList } from '@/components/activity/ActivityList'
import { PageTransition, Stagger, StaggerItem } from '@/components/motion/Primitives'
import { SectionHeading } from '@/components/ui/Basics'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States'
import { activity as allActivity } from '@/data/mock'
import type { ActivityCategory } from '@/data/types'
import { useDemoFlag, useDocumentTitle, useMediaQuery, useMockQuery, useReducedMotion } from '@/hooks'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Filter = 'all' | ActivityCategory

const filterIcons: Record<Filter, LucideIcon> = { all: Sparkles, payments: Banknote, schemes: Layers, rate: TrendingUp }

/* Narrow phones: four icon tiles in one row instead of wrapped text pills —
   a gold tile slides to the chosen filter. */
function FilterTiles({ options, value, onChange }: { options: Array<{ value: Filter; label: string; count?: number }>; value: Filter; onChange: (v: Filter) => void }) {
  const reduced = useReducedMotion()
  return (
    <div role="tablist" aria-label="Activity filters" className="grid grid-cols-4 gap-1.5 rounded-2xl border border-gold-light/15 bg-white/[0.06] p-1.5">
      {options.map((opt) => {
        const active = opt.value === value
        const Icon = filterIcons[opt.value]
        return (
          <button
            key={opt.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium tracking-[0.06em] uppercase transition-colors duration-300',
              active ? 'text-maroon-deep' : 'text-cream/70 hover:text-cream',
            )}
          >
            {active && <motion.span layoutId="activity-filter-tile" transition={reduced ? { duration: 0 } : spring.snappy} className="absolute inset-0 rounded-xl gold-surface shadow-[0_6px_16px_-8px_rgba(212,175,55,0.9)]" aria-hidden="true" />}
            <span className="relative">
              <Icon size={18} strokeWidth={active ? 2 : 1.7} aria-hidden="true" />
              {opt.count !== undefined && (
                <span className={cn('absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold tabular', active ? 'bg-maroon-deep text-gold-light' : 'bg-gold/90 text-maroon-deep')}>
                  {opt.count}
                </span>
              )}
            </span>
            <span className="relative truncate">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function Activity() {
  useDocumentTitle('Activity')
  const [filter, setFilter] = useState<Filter>('all')
  const fail = useDemoFlag('error')
  const empty = useDemoFlag('empty')
  const query = useMockQuery(() => (empty ? [] : allActivity), [empty], { fail })
  const items = useMemo(() => (query.data ?? []).filter((a) => filter === 'all' || a.category === filter), [query.data, filter])

  // Filters sit beside the heading from 640px. Below that they drop under it and
  // share the full row; under 400px text pills cannot fit, so icon tiles take over.
  const tiles = !useMediaQuery('(min-width: 400px)')
  const stacked = !useMediaQuery('(min-width: 640px)')
  const options = [
    { value: 'all' as const, label: 'All', count: query.data?.length },
    { value: 'payments' as const, label: 'Payments' },
    { value: 'schemes' as const, label: 'Schemes' },
    { value: 'rate' as const, label: 'Gold Rate' },
  ]

  return (
    <PageTransition>
      <Stagger className="mx-auto max-w-3xl space-y-6 pt-5 md:pt-8 lg:pt-4">
        <StaggerItem>
          <Card tone="maroon" radius="xl" padding="md" className="grain">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full gold-glow opacity-60" aria-hidden="true" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading as="h1" eyebrow="Timeline" title="Activity" tone="dark" />
              {tiles ? (
                <FilterTiles options={options} value={filter} onChange={setFilter} />
              ) : (
                <Tabs options={options} value={filter} onChange={setFilter} tone="dark" size="sm" ariaLabel="Activity filters" stretch={stacked} />
              )}
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          {query.status === 'error' ? (
            <Card tone="white" padding="none">
              <ErrorState onRetry={query.retry} />
            </Card>
          ) : query.status === 'loading' ? (
            <div className="space-y-4" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <Skeleton className="h-[88px] flex-1 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <Card tone="white" padding="none">
              <EmptyState title="No recent activity" description="Payments, rate updates and scheme announcements will appear here." />
            </Card>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                <ActivityList items={items} inView={false} />
              </motion.div>
            </AnimatePresence>
          )}
        </StaggerItem>
      </Stagger>
    </PageTransition>
  )
}
