import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { DiamondArt } from '@/components/brand/JewelArt'
import { GoldParticles } from '@/components/motion/GoldParticles'
import { PageTransition, Stagger, StaggerItem } from '@/components/motion/Primitives'
import { SplitText } from '@/components/motion/Signature'
import { SchemeCard, SchemeCardSkeleton, SchemeRow, SchemeRowSkeleton } from '@/components/schemes/SchemeComponents'
import { SectionHeading } from '@/components/ui/Basics'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { schemes } from '@/data/mock'
import type { SchemeCategory } from '@/data/types'
import { useDemoFlag, useDocumentTitle, useIsDesktop, useMediaQuery, useMockQuery, useReducedMotion } from '@/hooks'

type Filter = 'all' | SchemeCategory

const filters = [
  { value: 'all' as const, label: 'All Schemes' },
  { value: 'gold-savings' as const, label: 'Gold Savings' },
  { value: 'fixed-deposit' as const, label: 'Fixed Deposit' },
]

export function Schemes() {
  useDocumentTitle('Schemes')
  const [filter, setFilter] = useState<Filter>('all')
  const fail = useDemoFlag('error')
  const query = useMockQuery(() => schemes, [], { fail })
  const isDesktop = useIsDesktop()
  /** Vitrine grid needs ~300px per card; below that the index rows keep the page short. */
  const wide = useMediaQuery('(min-width: 1280px)')
  const reduced = useReducedMotion()
  const visible = (query.data ?? []).filter((s) => filter === 'all' || s.category === filter)

  return (
    <PageTransition>
      <Stagger className="space-y-4 pt-4 sm:space-y-6 sm:pt-5 md:pt-8 lg:pt-4">
        <StaggerItem>
          <Card tone="maroon" radius="xl" padding="none" className="grain">
            {isDesktop && <GoldParticles count={16} opacity={0.6} />}
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full gold-glow opacity-60" aria-hidden="true" />
            <div className="relative grid items-center gap-4 p-5 sm:grid-cols-[1fr_auto] sm:p-7">
              <div>
                <p className="eyebrow text-gold-light/80">Gold Schemes</p>
                <SplitText as="h1" className="mt-1.5 font-display text-[clamp(1.45rem,3vw,2.4rem)] leading-tight text-cream sm:mt-2" words={['Secure', 'Your', 'Future', { text: 'With Gold', className: 'gold-text' }]} delay={0.25} />
                <p className="mt-1.5 max-w-md text-[13px] text-cream/70 sm:mt-2 sm:text-sm">
                  <span className="sm:hidden">Small steps. Big dreams.</span>
                  <span className="hidden sm:inline">Small steps. Big dreams. Choose a plan that grows with you and redeem it against jewellery you will treasure.</span>
                </p>
                <ButtonLink to="/join-scheme" size="md" className="mt-3.5 sm:mt-5" magnetic trailing={<ArrowRight size={16} />}>
                  Join Scheme
                </ButtonLink>
              </div>
              <div className="float-slow hidden h-36 w-36 sm:block lg:h-44 lg:w-44">
                <DiamondArt />
              </div>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <SectionHeading eyebrow="Discover" title="Choose a scheme" className="hidden xl:block" />
          <Tabs options={filters} value={filter} onChange={setFilter} ariaLabel="Scheme categories" stretch={!wide} />
        </StaggerItem>

        <StaggerItem>
          {query.status === 'error' ? (
            <Card tone="white" padding="none">
              <ErrorState onRetry={query.retry} />
            </Card>
          ) : query.status === 'loading' ? (
            wide ? (
              <div className="grid grid-cols-3 gap-5">
                {[0, 1, 2].map((i) => (
                  <SchemeCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <Card tone="white" padding="none" radius="xl" className="divide-y divide-gold/15">
                {[0, 1, 2].map((i) => (
                  <SchemeRowSkeleton key={i} />
                ))}
              </Card>
            )
          ) : visible.length === 0 ? (
            <Card tone="white" padding="none">
              <EmptyState art="diamond" title="No schemes in this category" description="Try another category or view all schemes." />
            </Card>
          ) : wide ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={filter}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.06 } } }}
                className="grid grid-cols-3 gap-5"
              >
                {visible.map((s, i) => (
                  <SchemeCard key={s.id} scheme={s} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <Card tone="white" padding="none" radius="xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={filter}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  className="divide-y divide-gold/15"
                >
                  {visible.map((s, i) => (
                    <SchemeRow key={s.id} scheme={s} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </Card>
          )}
        </StaggerItem>
      </Stagger>
    </PageTransition>
  )
}
