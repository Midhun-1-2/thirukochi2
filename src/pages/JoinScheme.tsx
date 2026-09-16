import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Banknote, Building2, CalendarDays, Check, CreditCard, IndianRupee, RefreshCcw, Smartphone, type LucideIcon } from 'lucide-react'
import { SchemeArtwork } from '@/components/brand/JewelArt'
import { PageTransition } from '@/components/motion/Primitives'
import { SplitText } from '@/components/motion/Signature'
import { SchemeSummary } from '@/components/schemes/SchemeComponents'
import { BackLink, Badge, Chip } from '@/components/ui/Basics'
import { Button } from '@/components/ui/Button'
import { Card, GoldRule } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Stepper } from '@/components/ui/Stepper'
import { useSchemes } from '@/context/SchemeContext'
import { getPaymentMethod, getScheme, paymentMethods, schemes } from '@/data/mock'
import { useDocumentTitle, useReducedMotion } from '@/hooks'
import { formatINR } from '@/lib/format'
import { stepVariants } from '@/lib/motion'
import { clamp, cn } from '@/lib/utils'

const STEPS = ['Scheme', 'Amount', 'Payment', 'Review']

const methodIcons: Record<string, LucideIcon> = { upi: Smartphone, bank: Building2, card: CreditCard, auto: RefreshCcw }

function OptionCard({ selected, onSelect, children, className }: { selected: boolean; onSelect: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'group relative w-full rounded-2xl border bg-white p-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        selected ? 'border-gold shadow-[0_0_0_4px_rgba(212,175,55,0.14),0_14px_32px_-16px_rgba(84,0,0,0.35)]' : 'border-gold/20 hover:border-gold/60 hover:shadow-soft',
        className,
      )}
    >
      {children}
      <span
        className={cn(
          'absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300',
          selected ? 'border-transparent bg-maroon text-gold-light' : 'border-maroon/20 bg-white text-transparent',
        )}
        aria-hidden="true"
      >
        <Check size={13} strokeWidth={3} />
      </span>
    </button>
  )
}

export function JoinScheme() {
  useDocumentTitle('Join Scheme')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { draft, updateDraft, confirmDraft } = useSchemes()
  const reduced = useReducedMotion()
  const [step, setStep] = useState(() => {
    const raw = params.get('step')
    const s = raw === null ? NaN : Number(raw)
    if (Number.isInteger(s) && s >= 0 && s < STEPS.length) return s
    return getScheme(params.get('scheme') ?? undefined) ? 1 : 0
  })
  const [dir, setDir] = useState(1)
  const [customAmount, setCustomAmount] = useState('')
  const [amountError, setAmountError] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  // Preselect a scheme from the query string
  useEffect(() => {
    const id = params.get('scheme')
    const scheme = getScheme(id ?? undefined)
    if (scheme && draft.schemeId !== scheme.id) {
      updateDraft({
        schemeId: scheme.id,
        amount: scheme.presetAmounts.includes(draft.amount) ? draft.amount : scheme.presetAmounts[1] ?? scheme.minAmount,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scheme = getScheme(draft.schemeId) ?? schemes[0]
  const method = getPaymentMethod(draft.paymentMethodId)
  const total = draft.amount * scheme.tenure
  const maturity = useMemo(() => {
    const d = new Date()
    d.setMonth(d.getMonth() + scheme.tenure)
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
  }, [scheme.tenure])

  const go = (next: number) => {
    setDir(next > step ? 1 : -1)
    setStep(clamp(next, 0, STEPS.length - 1))
  }

  const chooseScheme = (id: string) => {
    const s = getScheme(id)!
    updateDraft({
      schemeId: id,
      amount: s.presetAmounts.includes(draft.amount) ? draft.amount : s.presetAmounts[1] ?? s.minAmount,
    })
  }

  const applyCustomAmount = (raw: string) => {
    setCustomAmount(raw)
    const n = Number(raw.replace(/\D/g, ''))
    if (!raw) {
      setAmountError(undefined)
      return
    }
    if (n < scheme.minAmount) setAmountError(`Minimum is ${formatINR(scheme.minAmount, { decimals: false })}.`)
    else if (n > scheme.maxAmount) setAmountError(`Maximum is ${formatINR(scheme.maxAmount, { decimals: false })}.`)
    else if (n % scheme.amountStep !== 0) setAmountError(`Use multiples of ${formatINR(scheme.amountStep, { decimals: false })}.`)
    else {
      setAmountError(undefined)
      updateDraft({ amount: n })
    }
  }

  const canContinue = step === 1 ? !amountError && draft.amount >= scheme.minAmount : true

  const join = async () => {
    setLoading(true)
    await confirmDraft()
    setLoading(false)
    navigate('/success')
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl space-y-6 pt-5 md:pt-8 lg:pt-4">
        <div className="flex items-center justify-between gap-4">
          <BackLink to="/schemes" label="Schemes" />
          <Badge tone="maroon">{scheme.name}</Badge>
        </div>

        <Card tone="maroon" radius="xl" padding="none" className="grain">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full gold-glow opacity-60" aria-hidden="true" />
          <div className="relative p-6 sm:p-8">
            <p className="eyebrow text-gold-light/80">Join Scheme</p>
            <SplitText as="h1" className="mt-2 font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-tight text-cream" words={['Secure', 'Your', 'Future', { text: 'With Gold', className: 'gold-text' }]} delay={0.2} />
            <p className="mt-1 text-sm text-cream/70">Small steps. Big dreams.</p>
            <Stepper steps={STEPS} current={step} onStepClick={go} tone="dark" className="mt-7" />
          </div>
        </Card>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.section
              key={step}
              custom={dir}
              variants={reduced ? { initial: { opacity: 0 }, enter: { opacity: 1 }, exit: { opacity: 0 } } : stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              aria-labelledby="step-title"
            >
              {/* ---------- 1 · Scheme ---------- */}
              {step === 0 && (
                <div>
                  <h2 id="step-title" className="font-display text-xl text-maroon">Choose your scheme</h2>
                  <p className="mt-1 text-sm text-ink-soft">Each plan can be redeemed against jewellery at any Thirukochi showroom.</p>
                  <div role="radiogroup" aria-label="Scheme" className="mt-5 grid gap-3 sm:grid-cols-3">
                    {schemes.map((s) => (
                      <OptionCard key={s.id} selected={draft.schemeId === s.id} onSelect={() => chooseScheme(s.id)}>
                        <div className="h-16 w-16 rounded-full bg-maroon p-2">
                          <SchemeArtwork art={s.art} />
                        </div>
                        <p className="mt-3 pr-8 font-display text-base text-maroon">{s.name}</p>
                        <p className="mt-0.5 text-xs text-ink-soft">{s.tagline}</p>
                        <p className="mt-2 text-xs text-ink-mute tabular">From {formatINR(s.minAmount, { decimals: false })}/mo · {s.tenure} months</p>
                      </OptionCard>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------- 2 · Amount ---------- */}
              {step === 1 && (
                <div>
                  <h2 id="step-title" className="font-display text-xl text-maroon">Monthly amount</h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    Between {formatINR(scheme.minAmount, { decimals: false })} and {formatINR(scheme.maxAmount, { decimals: false })}, in steps of {formatINR(scheme.amountStep, { decimals: false })}.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Preset amounts">
                    {scheme.presetAmounts.map((a) => (
                      <Chip
                        key={a}
                        active={draft.amount === a && !customAmount}
                        onClick={() => {
                          setCustomAmount('')
                          setAmountError(undefined)
                          updateDraft({ amount: a })
                        }}
                      >
                        {formatINR(a, { decimals: false })}
                      </Chip>
                    ))}
                  </div>
                  <Input
                    className="mt-4"
                    label="Custom amount"
                    inputMode="numeric"
                    icon={<IndianRupee size={17} strokeWidth={1.8} />}
                    value={customAmount}
                    onChange={(e) => applyCustomAmount(e.target.value.replace(/\D/g, '').slice(0, 7))}
                    error={amountError}
                    success={Boolean(customAmount) && !amountError}
                    hint="Optional — or pick a preset above."
                  />
                  <Card tone="cream" padding="sm" className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-ink-mute">You will save</p>
                      <p className="mt-0.5 font-display text-xl text-maroon tabular">
                        {formatINR(draft.amount, { decimals: false })}
                        <span className="ml-1 font-body text-sm text-ink-mute">/ month</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-ink-soft sm:justify-center">
                      <CalendarDays size={16} className="shrink-0 text-gold-deep" aria-hidden="true" />
                      <span>
                        {scheme.tenure} months · matures <span className="font-medium text-maroon">{maturity}</span>
                      </span>
                    </div>
                    <div className="text-ink-soft sm:text-right">
                      Total <span className="font-medium text-maroon tabular">{formatINR(total, { decimals: false })}</span>
                    </div>
                  </Card>
                </div>
              )}

              {/* ---------- 3 · Payment ---------- */}
              {step === 2 && (
                <div>
                  <h2 id="step-title" className="font-display text-xl text-maroon">Payment method</h2>
                  <p className="mt-1 text-sm text-ink-soft">Choose how you would like to pay each month.</p>
                  <div role="radiogroup" aria-label="Payment method" className="mt-5 grid gap-3 sm:grid-cols-2">
                    {paymentMethods.map((m) => {
                      const Icon = methodIcons[m.icon] ?? Banknote
                      return (
                        <OptionCard key={m.id} selected={draft.paymentMethodId === m.id} onSelect={() => updateDraft({ paymentMethodId: m.id })}>
                          <div className="flex items-center gap-3 pr-8">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon text-gold-light">
                              <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                            </span>
                            <div>
                              <p className="text-sm font-medium text-maroon">{m.label}</p>
                              <p className="text-xs text-ink-soft">{m.description}</p>
                            </div>
                          </div>
                        </OptionCard>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ---------- 4 · Review ---------- */}
              {step === 3 && (
                <div>
                  <h2 id="step-title" className="font-display text-xl text-maroon">Review & confirm</h2>
                  <p className="mt-1 text-sm text-ink-soft">Everything look right? You can edit any detail before joining.</p>
                  <SchemeSummary className="mt-5" scheme={scheme} selection={draft} method={method} onEditStep={go} />
                </div>
              )}
            </motion.section>
          </AnimatePresence>
        </div>

        <GoldRule />

        <div className="flex items-center justify-between gap-3 pb-2">
          <Button variant="ghost" size="lg" onClick={() => (step === 0 ? navigate('/schemes') : go(step - 1))} leading={<ArrowLeft size={16} />}>
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button size="lg" magnetic onClick={() => go(step + 1)} disabled={!canContinue} trailing={<ArrowRight size={16} />} className="min-w-[150px]">
              Continue
            </Button>
          ) : (
            <Button size="lg" magnetic onClick={join} loading={loading} loadingText="Activating" trailing={<ArrowRight size={16} />} className="min-w-[150px]">
              Join Now
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
