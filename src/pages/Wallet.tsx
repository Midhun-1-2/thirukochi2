import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Gift, Share2, Sparkles, Store, Users, Wallet as WalletIcon } from 'lucide-react'
import { RingArt } from '@/components/brand/JewelArt'
import { GoldParticles } from '@/components/motion/GoldParticles'
import { CountUp } from '@/components/motion/CountUp'
import { PageTransition } from '@/components/motion/Primitives'
import { RollingNumber, TypeIn, WipeReveal } from '@/components/motion/Signature'
import { Badge, SectionHeading } from '@/components/ui/Basics'
import { Button } from '@/components/ui/Button'
import { Card, GoldRule } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States'
import { ReferralCreditItem } from '@/components/wallet/ReferralCreditItem'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { wallet } from '@/data/mock'
import { useCopyToClipboard, useDemoFlag, useDocumentTitle, useIsDesktop, useMockQuery, useReducedMotion } from '@/hooks'
import { formatINR } from '@/lib/format'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Wallet — the referral bonus wallet. Every friend who joins a scheme
   with your reference code earns you a bonus, redeemable against an
   instalment or in store.
------------------------------------------------------------------- */

type Action = 'share' | 'redeem' | null

const steps = [
  { icon: Share2, title: 'Share your code', text: 'Send your reference code to friends and family.' },
  { icon: Users, title: 'They join a scheme', text: 'Your friend registers with your code and joins any scheme.' },
  { icon: Gift, title: 'Bonus credited', text: `${formatINR(wallet.bonusPerReferral, { decimals: false })} lands in your wallet after their first instalment.` },
]

function ShareModal({ open, onClose, code }: { open: boolean; onClose: () => void; code: string }) {
  const { copied, copy } = useCopyToClipboard()
  const { toast } = useToast()
  const message = `Join Thirukochi Gold & Diamonds with my reference code ${code} and start your gold savings journey.`
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Thirukochi Gold & Diamonds', text: message })
        return
      } catch {
        /* user dismissed the sheet */
      }
    }
    await copy(message)
    toast('Invite copied', { description: 'Paste it into any chat to share.', tone: 'success' })
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Refer & earn"
      title="Share your code"
      footer={
        <Button fullWidth size="lg" onClick={share} leading={<Share2 size={16} />}>
          Share invite
        </Button>
      }
    >
      <p>Every friend who joins a scheme with this code earns you {formatINR(wallet.bonusPerReferral, { decimals: false })}.</p>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-cream px-4 py-3">
        <span className="font-figures text-2xl font-semibold tracking-[0.08em] text-maroon tabular">{code}</span>
        <button
          type="button"
          onClick={async () => {
            await copy(code)
            toast('Reference code copied', { tone: 'success' })
          }}
          aria-label="Copy reference code"
          className={cn('flex h-10 w-10 items-center justify-center rounded-full border transition', copied ? 'border-success/30 bg-success-soft text-success' : 'border-gold/40 bg-white text-maroon hover:border-gold')}
        >
          {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} />}
        </button>
      </div>
    </Modal>
  )
}

function RedeemModal({ open, onClose, balance }: { open: boolean; onClose: () => void; balance: number }) {
  const { toast } = useToast()
  const [mode, setMode] = useState<'instalment' | 'store'>('instalment')
  const [loading, setLoading] = useState(false)
  const submit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    onClose()
    toast(mode === 'instalment' ? 'Bonus applied to next instalment' : 'Store voucher issued', {
      description: mode === 'instalment' ? `${formatINR(balance, { decimals: false })} will be deducted from your next Gold Savings instalment.` : `Show the voucher at any Thirukochi showroom for ${formatINR(balance, { decimals: false })} off.`,
      tone: 'success',
    })
  }
  const options = [
    { id: 'instalment' as const, icon: WalletIcon, title: 'Apply to next instalment', text: 'Reduce your upcoming scheme payment.' },
    { id: 'store' as const, icon: Store, title: 'Redeem in store', text: 'Get a voucher for jewellery purchases.' },
  ]
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Referral bonus"
      title={`Redeem ${formatINR(balance, { decimals: false })}`}
      footer={
        <Button fullWidth size="lg" loading={loading} loadingText="Redeeming" onClick={submit} disabled={balance <= 0}>
          Confirm redemption
        </Button>
      }
    >
      <div role="radiogroup" aria-label="Redeem option" className="space-y-3">
        {options.map((o) => {
          const active = mode === o.id
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setMode(o.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl border bg-white p-3.5 text-left transition-all duration-300',
                active ? 'border-gold shadow-[0_0_0_4px_rgba(212,175,55,0.14)]' : 'border-gold/20 hover:border-gold/60',
              )}
            >
              <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', active ? 'bg-maroon text-gold-light' : 'bg-maroon-tint text-maroon')}>
                <o.icon size={17} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-maroon">{o.title}</span>
                <span className="block text-xs text-ink-soft">{o.text}</span>
              </span>
            </button>
          )
        })}
      </div>
    </Modal>
  )
}

export function Wallet() {
  useDocumentTitle('Referral Wallet')
  const { user } = useAuth()
  const code = user?.referenceCode ?? 'TKGD123'
  const [action, setAction] = useState<Action>(null)
  const fail = useDemoFlag('error')
  const empty = useDemoFlag('empty')
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  const query = useMockQuery(() => (empty ? { ...wallet, balance: 0, pending: 0, lifetime: 0, referrals: [] } : wallet), [empty], { fail })
  const data = query.data
  const successful = data?.referrals.filter((r) => r.status === 'credited').length ?? 0

  return (
    <PageTransition>
      <div className="space-y-6 pt-5 md:pt-8 lg:pt-4">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 space-y-5 lg:col-span-7">
            <WipeReveal delay={0.15} duration={1}>
              {query.status === 'error' ? (
                <Card tone="maroon" padding="none">
                  <ErrorState tone="dark" title="Wallet unavailable" onRetry={query.retry} />
                </Card>
              ) : !data ? (
                <Card tone="maroon" radius="xl" padding="lg" aria-busy="true" aria-label="Loading wallet">
                  <Skeleton tone="dark" className="h-3 w-28" />
                  <Skeleton tone="dark" className="mt-4 h-12 w-40" />
                  <Skeleton tone="dark" className="mt-3 h-4 w-52" />
                  <div className="mt-8 flex gap-3">
                    <Skeleton tone="dark" className="h-12 flex-1 rounded-full" />
                    <Skeleton tone="dark" className="h-12 flex-1 rounded-full" />
                  </div>
                </Card>
              ) : (
                <Card tone="maroon" radius="xl" padding="none" className="grain">
                  {isDesktop && <GoldParticles count={16} opacity={0.55} />}
                  <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full gold-glow opacity-60" aria-hidden="true" />
                  <div className="pointer-events-none absolute -right-8 -top-6 h-36 w-36 opacity-40 sm:-bottom-10 sm:-right-6 sm:top-auto sm:h-56 sm:w-56 sm:opacity-60" aria-hidden="true">
                    <div className="float-slower h-full w-full">
                      <RingArt intensity={0.8} />
                    </div>
                  </div>
                  <div className="relative p-5 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="eyebrow text-gold-light/80">Referral Bonus</p>
                      <Badge tone="onMaroon" dot className="whitespace-nowrap">
                        {formatINR(data.bonusPerReferral, { decimals: false })} per referral
                      </Badge>
                    </div>
                    <p className="mt-3 font-figures text-[clamp(2.4rem,6vw,3.6rem)] font-semibold leading-none gold-text tabular">
                      <span className="mr-1 align-top text-[0.5em]">₹</span>
                      <RollingNumber value={data.balance} format={(n) => n.toLocaleString('en-IN')} delay={0.2} />
                    </p>
                    <p className="mt-2 text-sm text-cream/75">Available to redeem</p>
                    <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-gold-light/15 pt-4 text-left sm:gap-3">
                      <div className="min-w-0">
                        <dt className="text-[10px] tracking-wider text-cream/55 uppercase">Pending</dt>
                        <dd className="mt-0.5 text-sm font-medium text-gold-light tabular">{formatINR(data.pending, { decimals: false })}</dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="text-[10px] tracking-wider text-cream/55 uppercase">Lifetime</dt>
                        <dd className="mt-0.5 text-sm font-medium text-cream tabular">
                          <CountUp value={data.lifetime} format={(n) => formatINR(n, { decimals: false })} duration={1.2} delay={0.3} />
                        </dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="text-[10px] tracking-wider text-cream/55 uppercase">Friends</dt>
                        <dd className="mt-0.5 text-sm font-medium text-cream tabular">{successful}</dd>
                      </div>
                    </dl>
                    <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3">
                      <Button size="lg" className="px-3 sm:px-7" leading={<Share2 size={17} />} onClick={() => setAction('share')}>
                        Share Code
                      </Button>
                      <Button size="lg" variant="onMaroon" className="px-3 sm:px-7" leading={<Gift size={17} />} onClick={() => setAction('redeem')} disabled={data.balance <= 0}>
                        Redeem
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </WipeReveal>

            <WipeReveal delay={0.4}>
              <Card tone="cream" padding="sm" className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="eyebrow text-gold-deep">Reference code</p>
                  <p className="mt-0.5 font-figures text-xl font-semibold tracking-[0.06em] text-maroon tabular">
                    <TypeIn text={code} delay={0.9} speed={0.09} />
                  </p>
                </div>
                <Button size="sm" variant="outline" leading={<Share2 size={14} />} onClick={() => setAction('share')}>
                  Share
                </Button>
              </Card>
            </WipeReveal>

            <WipeReveal delay={0.55} axis="y">
              <Card tone="white" padding="md">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-gold-deep" aria-hidden="true" />
                  <p className="font-display text-lg text-maroon">How it works</p>
                </div>
                <GoldRule className="my-4" />
                <ol className="grid gap-4 sm:grid-cols-3">
                  {steps.map((s, i) => (
                    <li key={s.title} className="flex gap-3 sm:flex-col sm:gap-2">
                      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon text-gold-light">
                        <s.icon size={17} strokeWidth={1.8} aria-hidden="true" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full gold-surface text-[10px] font-semibold text-maroon-deep">{i + 1}</span>
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-maroon">{s.title}</span>
                        <span className="block text-xs leading-relaxed text-ink-soft">{s.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </Card>
            </WipeReveal>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <WipeReveal delay={0.3}>
              <SectionHeading eyebrow="Ledger" title="Referral Credits" />
            </WipeReveal>
            <div className="mt-4">
              {query.status === 'error' ? null : !data ? (
                <div className="space-y-3" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-[76px] w-full rounded-2xl" />
                  ))}
                </div>
              ) : data.referrals.length === 0 ? (
                <Card tone="white" padding="none">
                  <EmptyState art="necklace" title="No referrals yet" description="Share your code — your first bonus lands here." action={<Button size="sm" onClick={() => setAction('share')}>Share code</Button>} />
                </Card>
              ) : (
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.06, delayChildren: 0.45 } } }}
                  className="space-y-3"
                >
                  {data.referrals.map((c) => (
                    <ReferralCreditItem key={c.id} credit={c} />
                  ))}
                </motion.ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <ShareModal open={action === 'share'} onClose={() => setAction(null)} code={code} />
      <RedeemModal open={action === 'redeem'} onClose={() => setAction(null)} balance={data?.balance ?? 0} />
    </PageTransition>
  )
}
