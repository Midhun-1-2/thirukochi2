import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Pencil, ShieldCheck } from 'lucide-react'
import { SchemeArtwork } from '@/components/brand/JewelArt'
import { PageTransition, Stagger, StaggerItem } from '@/components/motion/Primitives'
import { SchemeSummary } from '@/components/schemes/SchemeComponents'
import { BackLink, Badge } from '@/components/ui/Basics'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/States'
import { useSchemes } from '@/context/SchemeContext'
import { useToast } from '@/context/ToastContext'
import { getPaymentMethod, getScheme } from '@/data/mock'
import type { SchemeSelection } from '@/data/types'
import { useDocumentTitle } from '@/hooks'
import { formatINR } from '@/lib/format'

export function SchemeDetails() {
  const { id } = useParams()
  const scheme = getScheme(id)
  useDocumentTitle(scheme?.name ?? 'Scheme')
  const navigate = useNavigate()
  const { draft, updateDraft, confirmDraft } = useSchemes()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  if (!scheme) {
    return (
      <PageTransition>
        <div className="pt-6">
          <BackLink to="/schemes" label="All schemes" />
          <Card tone="white" padding="none" className="mt-4">
            <EmptyState art="diamond" title="Scheme not found" description="This scheme may have been retired. Explore our current schemes instead." />
          </Card>
        </div>
      </PageTransition>
    )
  }

  const selection: SchemeSelection =
    draft.schemeId === scheme.id
      ? draft
      : { schemeId: scheme.id, amount: scheme.presetAmounts[1] ?? scheme.minAmount, paymentMethodId: 'upi' }
  const method = getPaymentMethod(selection.paymentMethodId)

  const proceed = async () => {
    setLoading(true)
    updateDraft(selection)
    await confirmDraft()
    setLoading(false)
    navigate('/success')
  }

  return (
    <PageTransition>
      <Stagger className="space-y-6 pt-5 md:pt-8 lg:pt-4" stagger={0.09}>
        <StaggerItem>
          <BackLink to="/schemes" label="All schemes" />
        </StaggerItem>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 lg:col-span-7">
            <StaggerItem>
              <Card tone="maroon" radius="xl" padding="none" className="grain">
                <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full gold-glow opacity-60" aria-hidden="true" />
                <div className="relative grid gap-4 p-6 sm:grid-cols-[1fr_140px] sm:items-center sm:p-8">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="onMaroon">{scheme.category === 'fixed-deposit' ? 'Fixed Deposit' : 'Gold Savings'}</Badge>
                      {scheme.highlight && <Badge tone="onMaroon">{scheme.highlight}</Badge>}
                    </div>
                    <h1 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.3rem)] leading-tight text-cream">{scheme.name}</h1>
                    <p className="mt-1 font-display text-base italic text-gold-light/90">{scheme.tagline}</p>
                    <p className="mt-3 text-sm text-cream/70">{scheme.description}</p>
                  </div>
                  <div className="mx-auto h-32 w-32 sm:h-36 sm:w-36">
                    <SchemeArtwork art={scheme.art} />
                  </div>
                </div>
                <dl className="relative grid grid-cols-3 divide-x divide-gold-light/15 border-t border-gold-light/15 bg-black/10 text-center">
                  {[
                    { label: 'Min. monthly', value: formatINR(scheme.minAmount, { decimals: false }) },
                    { label: 'Tenure', value: `${scheme.tenure} months` },
                    { label: 'Step', value: formatINR(scheme.amountStep, { decimals: false }) },
                  ].map((d) => (
                    <div key={d.label} className="px-2 py-3.5">
                      <dt className="text-[10px] tracking-wider text-cream/55 uppercase">{d.label}</dt>
                      <dd className="mt-0.5 text-sm font-medium text-gold-light tabular">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </StaggerItem>

            <StaggerItem className="hidden lg:block">
              <Card tone="cream" padding="md" className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon text-gold-light">
                  <ShieldCheck size={20} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-lg text-maroon">Safe, transparent, yours.</p>
                  <p className="mt-1 text-sm text-ink-soft">Every instalment is recorded against your reference code and can be redeemed at any Thirukochi showroom. No hidden charges.</p>
                </div>
              </Card>
            </StaggerItem>
          </div>

          <div className="space-y-4 lg:col-span-5">
            <StaggerItem>
              <SchemeSummary scheme={scheme} selection={selection} method={method} />
            </StaggerItem>
            <StaggerItem className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" leading={<Pencil size={15} />} onClick={() => navigate(`/join-scheme?scheme=${scheme.id}`)}>
                Edit Details
              </Button>
              <Button size="lg" magnetic loading={loading} loadingText="Activating" trailing={<ArrowRight size={16} />} onClick={proceed}>
                Proceed
              </Button>
            </StaggerItem>
            <StaggerItem>
              <p className="text-center text-xs text-ink-mute">
                Proceeding activates the scheme with the summary above.{' '}
                <button type="button" className="text-maroon underline-offset-4 hover:underline" onClick={() => toast('Need help?', { description: 'Visit any Thirukochi showroom or call our care line.', tone: 'info' })}>
                  Need help?
                </button>
              </p>
            </StaggerItem>
          </div>
        </div>
      </Stagger>
    </PageTransition>
  )
}
