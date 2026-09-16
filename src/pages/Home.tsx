import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Gift } from 'lucide-react'
import { ActivityList } from '@/components/activity/ActivityList'
import { JoinSchemeCTA, PromoBanner, ReferralCard, SocialLinks } from '@/components/dashboard/DashboardWidgets'
import { GoldRateCard } from '@/components/gold-rate/GoldRateCard'
import { CountUp } from '@/components/motion/CountUp'
import { PageTransition } from '@/components/motion/Primitives'
import { WipeReveal } from '@/components/motion/Signature'
import { SectionHeading } from '@/components/ui/Basics'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/States'
import { useAuth } from '@/context/AuthContext'
import { activity, goldRates, promo, social, wallet } from '@/data/mock'
import { useDemoFlag, useDocumentTitle, useMockQuery } from '@/hooks'
import { formatINR } from '@/lib/format'

function WalletMiniCard() {
  return (
    <Card tone="white" padding="sm" interactive className="group">
      <Link to="/wallet" className="flex items-center justify-between gap-3 focus-visible:outline-none" aria-label="Open referral wallet">
        <div className="min-w-0">
          <p className="eyebrow font-ui text-gold-ink">Referral Bonus</p>
          <p className="mt-0.5 font-figures text-xl font-semibold text-maroon tabular">
            <CountUp value={wallet.balance} format={(n) => formatINR(n, { decimals: false })} duration={1} />
          </p>
          <p className="font-ui text-xs text-ink-soft tabular">
            {wallet.referrals.filter((r) => r.status !== 'redeemed').length} referrals · {formatINR(wallet.pending, { decimals: false })} pending
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon text-gold-light transition-transform duration-300 group-hover:scale-105">
          <Gift size={18} strokeWidth={1.8} aria-hidden="true" />
        </span>
      </Link>
    </Card>
  )
}

export function Home() {
  useDocumentTitle('Home')
  const { user } = useAuth()
  const rateFail = useDemoFlag('rate-error')
  const emptyActivity = useDemoFlag('empty-activity')
  const rates = useMockQuery(() => goldRates, [], { fail: rateFail })
  const recent = emptyActivity ? [] : activity.slice(0, 4)

  return (
    <PageTransition>
      <div className="pt-5 md:pt-8 lg:pt-4">
        {/* Tablet greeting (mobile shows it in the header, desktop in the top bar) */}
        <WipeReveal className="mb-5 hidden md:block lg:hidden" delay={0.1}>
          <p className="eyebrow text-gold-deep">Welcome back</p>
          <h1 className="mt-1 font-display text-2xl text-maroon">
            Good day, <span className="italic font-normal">{user?.name}</span>
          </h1>
        </WipeReveal>

        <div className="grid gap-5 md:grid-cols-12 md:gap-6 lg:gap-7">
          {/* ---------- primary column ---------- */}
          <div className="space-y-5 md:col-span-7 md:space-y-6 lg:col-span-8 lg:space-y-7">
            <WipeReveal delay={0.15} duration={1}>
              <GoldRateCard data={rates.data} status={rates.status} onRetry={rates.retry} />
            </WipeReveal>

            <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:hidden">
              <WipeReveal delay={0.45}>
                <ReferralCard code={user?.referenceCode ?? 'TKGD123'} />
              </WipeReveal>
              <WipeReveal delay={0.55}>
                <WalletMiniCard />
              </WipeReveal>
            </div>

            <WipeReveal className="md:hidden" delay={0.65}>
              <JoinSchemeCTA />
            </WipeReveal>

            <WipeReveal delay={0.4} duration={1.1}>
              <PromoBanner promo={promo} />
            </WipeReveal>

            <WipeReveal className="md:hidden" delay={0.8}>
              <Card tone="cream" padding="sm" className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow text-gold-deep">Follow us</p>
                  <p className="mt-0.5 text-sm text-ink-soft">New collections, first.</p>
                </div>
                <SocialLinks links={social} />
              </Card>
            </WipeReveal>

            <WipeReveal inView axis="y" duration={0.8}>
              <section aria-labelledby="activity-heading">
                <SectionHeading
                  eyebrow="Timeline"
                  title={<span id="activity-heading">Activity</span>}
                  action={
                    <Link to="/activity" className="inline-flex items-center gap-1 text-sm font-medium text-maroon underline-offset-4 hover:underline">
                      View all <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  }
                />
                <div className="mt-4">
                  {recent.length ? (
                    <ActivityList items={recent} dense />
                  ) : (
                    <Card tone="white" padding="none">
                      <EmptyState compact title="No recent activity" description="Payments, rate updates and scheme news will appear here." />
                    </Card>
                  )}
                </div>
              </section>
            </WipeReveal>
          </div>

          {/* ---------- side column (desktop) ---------- */}
          <aside className="hidden space-y-5 md:col-span-5 md:block lg:col-span-4 lg:space-y-6">
            <WipeReveal delay={0.35}>
              <ReferralCard code={user?.referenceCode ?? 'TKGD123'} />
            </WipeReveal>
            <WipeReveal delay={0.5}>
              <WalletMiniCard />
            </WipeReveal>
            <WipeReveal delay={0.65}>
              <JoinSchemeCTA compact />
            </WipeReveal>
            <WipeReveal delay={0.8}>
              <Card tone="maroon" padding="md" className="grain">
                <p className="eyebrow text-gold-light/80">Follow Thirukochi</p>
                <p className="mt-1.5 font-display text-lg text-cream">New collections, first.</p>
                <SocialLinks links={social} tone="dark" className="mt-4" />
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex items-center gap-1 text-xs text-gold-light/80 underline-offset-4 hover:underline"
                >
                  Visit our store page <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </Card>
            </WipeReveal>
          </aside>
        </div>
      </div>
    </PageTransition>
  )
}
