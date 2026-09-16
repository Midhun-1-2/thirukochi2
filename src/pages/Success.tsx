import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Home as HomeIcon } from 'lucide-react'
import { Flourish } from '@/components/brand/JewelArt'
import { GoldParticles } from '@/components/motion/GoldParticles'
import { PageTransition } from '@/components/motion/Primitives'
import { SplitText } from '@/components/motion/Signature'
import { SuccessAnimation } from '@/components/schemes/SuccessAnimation'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useSchemes } from '@/context/SchemeContext'
import { getPaymentMethod, getScheme } from '@/data/mock'
import { useDocumentTitle, useIsDesktop, useReducedMotion } from '@/hooks'
import { formatDate, formatINR } from '@/lib/format'
import { ease, spring } from '@/lib/motion'

export function Success() {
  useDocumentTitle('Scheme Joined')
  const navigate = useNavigate()
  const { lastJoined } = useSchemes()
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  const scheme = getScheme(lastJoined?.schemeId)
  const method = getPaymentMethod(lastJoined?.paymentMethodId)

  useEffect(() => {
    if (!lastJoined) navigate('/schemes', { replace: true })
  }, [lastJoined, navigate])

  if (!lastJoined || !scheme) return null
  const t = (d: number) => (reduced ? 0 : d)

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl pt-5 md:pt-8 lg:pt-4">
        <Card tone="maroon" radius="2xl" padding="none" className="grain">
          <motion.div
            className="absolute inset-0 bg-maroon-deep"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ duration: 0.9, ease: ease.soft }}
            aria-hidden="true"
          />
          {isDesktop && <GoldParticles count={22} opacity={0.7} />}
          <div className="relative flex flex-col items-center px-6 pb-8 pt-10 text-center sm:px-10 sm:pt-12">
            <SuccessAnimation size={168} />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: t(1.2), ...spring.soft }}
              className="mt-6"
            >
              <p className="eyebrow text-gold-light/80">Confirmation</p>
              <SplitText as="h1" className="mt-2 font-display text-[clamp(1.6rem,3.2vw,2.3rem)] leading-tight text-cream" words={['Scheme', 'Joined', { text: 'Successfully!', className: 'gold-text' }]} delay={t(1.25)} stagger={0.1} />
              <p className="mx-auto mt-2 max-w-sm text-sm text-cream/75">
                Your scheme has been activated.
                <br />
                Keep saving for a brighter tomorrow.
              </p>
              <Flourish className="mx-auto mt-5 w-32" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: t(1.55), ...spring.soft }}
              className="mt-7 w-full max-w-md"
            >
              <div className="rounded-[24px] border border-gold-light/25 bg-white/[0.06] p-5 backdrop-blur-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="font-display text-lg leading-tight text-cream">{scheme.name}</p>
                  <span className="whitespace-nowrap text-[11px] tracking-wider text-gold-light/70 tabular">{lastJoined.referenceNo}</span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <span className="font-figures text-2xl font-semibold gold-text tabular">{formatINR(lastJoined.amount, { decimals: false })}</span>
                  <span className="h-6 w-px bg-gold-light/30" aria-hidden="true" />
                  <span className="font-figures text-2xl font-semibold text-cream tabular">{scheme.tenure} Months</span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-gold-light/15 pt-3 text-left text-xs">
                  <div>
                    <dt className="text-cream/55">Payment</dt>
                    <dd className="text-cream">{method?.label}</dd>
                  </div>
                  <div className="text-right">
                    <dt className="text-cream/55">Activated</dt>
                    <dd className="text-cream tabular">{formatDate(lastJoined.joinedAt)}</dd>
                  </div>
                </dl>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: t(1.8), ...spring.soft }}
              className="mt-6 grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <ButtonLink to="/home" size="lg" fullWidth magnetic leading={<HomeIcon size={16} />}>
                Go to Home
              </ButtonLink>
              <ButtonLink to={`/schemes/${scheme.id}`} size="lg" fullWidth variant="onMaroon" trailing={<ArrowRight size={16} />}>
                View Scheme
              </ButtonLink>
            </motion.div>
          </div>
        </Card>
        <p className="mt-5 text-center text-xs text-ink-mute">
          A confirmation has been added to your{' '}
          <Link to="/activity" className="text-maroon underline-offset-4 hover:underline">
            activity
          </Link>
          .
        </p>
      </div>
    </PageTransition>
  )
}
