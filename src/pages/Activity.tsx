import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ActivityList } from '@/components/activity/ActivityList'
import { PageTransition, Stagger, StaggerItem } from '@/components/motion/Primitives'
import { SectionHeading } from '@/components/ui/Basics'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States'
import { activity as allActivity } from '@/data/mock'
import type { ActivityCategory } from '@/data/types'
import { useDemoFlag, useDocumentTitle, useMediaQuery, useMockQuery } from '@/hooks'

type Filter = 'all' | ActivityCategory

export function Activity() {
  useDocumentTitle('Activity')
  const [filter, setFilter] = useState<Filter>('all')
  const fail = useDemoFlag('error')
  const empty = useDemoFlag('empty')
  const query = useMockQuery(() => (empty ? [] : allActivity), [empty], { fail })
  const items = useMemo(() => (query.data ?? []).filter((a) => filter === 'all' || a.category === filter), [query.data, filter])

  // Filters sit beside the heading from 640px. Below that they drop under it and
  // share the full row; under 400px they shrink a size so all four still fit one row.
  const tiny = !useMediaQuery('(min-width: 400px)')
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
              <Tabs options={options} value={filter} onChange={setFilter} tone="dark" size={tiny ? 'xs' : 'sm'} ariaLabel="Activity filters" stretch={stacked} />
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
