import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Copy } from 'lucide-react'
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/icons/SocialIcons'
import { NecklaceArt, RingArt } from '@/components/brand/JewelArt'
import { Parallax, ParallaxLayer } from '@/components/motion/Parallax'
import { GoldParticles } from '@/components/motion/GoldParticles'
import { DrawnArt, TypeIn } from '@/components/motion/Signature'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/context/ToastContext'
import type { PromoBannerData, SocialLink } from '@/data/types'
import { useCopyToClipboard, useIsDesktop, useRichMotion } from '@/hooks'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ---------- Reference code ---------- */
export function ReferralCard({ code, className }: { code: string; className?: string }) {
  const { copied, copy } = useCopyToClipboard()
  const { toast } = useToast()
  return (
    <Card tone="cream" padding="sm" className={cn('flex items-center justify-between gap-3', className)}>
      <div className="min-w-0">
        <p className="eyebrow text-gold-deep">Ref. Code</p>
        <p className="mt-0.5 font-display text-xl tracking-[0.08em] text-maroon">
          <TypeIn text={code} delay={0.9} speed={0.09} />
        </p>
      </div>
      <motion.button
        type="button"
        onClick={async () => {
          await copy(code)
          toast('Reference code copied', { description: `${code} is ready to share.`, tone: 'success' })
        }}
        whileTap={{ scale: 0.92 }}
        transition={spring.press}
        aria-label={copied ? 'Copied' : 'Copy reference code'}
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 touch-target',
          copied ? 'border-success/30 bg-success-soft text-success' : 'border-gold/40 bg-white text-maroon hover:border-gold hover:bg-gold-pale/50',
        )}
      >
        {copied ? <Check size={17} strokeWidth={2.5} /> : <Copy size={17} strokeWidth={1.8} />}
      </motion.button>
    </Card>
  )
}

/* ---------- Promotional banner ---------- */
export function PromoBanner({ promo, className }: { promo: PromoBannerData; className?: string }) {
  const isDesktop = useIsDesktop()
  return (
    <Parallax className={cn('group', className)} strength={12}>
      <Card tone="maroon" radius="xl" padding="none" className="grain">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full gold-glow opacity-50" aria-hidden="true" />
        <div className="relative grid min-h-[190px] grid-cols-[1fr_minmax(110px,38%)] items-center sm:min-h-[220px] lg:min-h-[240px]">
          <div className="p-5 sm:p-8">
            <p className="eyebrow text-gold-light/80">{promo.eyebrow}</p>
            <h3 className="mt-2 font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-tight text-cream">{promo.title}</h3>
            <p className="mt-2 hidden max-w-xs text-sm text-cream/70 sm:block">{promo.subtitle}</p>
            <ButtonLink to={promo.href} variant="primary" size="sm" className="mt-5" trailing={<ArrowRight size={15} />}>
              {promo.cta}
            </ButtonLink>
          </div>
          <div className="relative h-full min-h-[170px] overflow-hidden">
            <ParallaxLayer depth={0.6} className="absolute inset-0 flex items-center justify-center">
              <div className="float-slow h-[130%] w-[130%] translate-x-4 translate-y-3 sm:translate-x-0">
                <DrawnArt delay={0.9} duration={1.8}>
                  <NecklaceArt intensity={0.95} />
                </DrawnArt>
              </div>
            </ParallaxLayer>
            <ParallaxLayer depth={1.1} className="absolute -bottom-6 -right-4 h-24 w-24 opacity-70 sm:h-32 sm:w-32">
              <div className="float-slower h-full w-full">
                <DrawnArt delay={1.6} duration={1.4}>
                  <RingArt intensity={0.7} />
                </DrawnArt>
              </div>
            </ParallaxLayer>
            {isDesktop && <GoldParticles count={14} opacity={0.6} />}
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" aria-hidden="true" />
      </Card>
    </Parallax>
  )
}

/* ---------- Social ---------- */
const socialIcons = { instagram: InstagramIcon, facebook: FacebookIcon, youtube: YoutubeIcon }

export function SocialLinks({ links, className, tone = 'light' }: { links: SocialLink[]; className?: string; tone?: 'light' | 'dark' }) {
  const rich = useRichMotion()
  return (
    <ul className={cn('flex items-center gap-3', className)} aria-label="Follow us">
      {links.map((l) => {
        const Icon = socialIcons[l.id]
        return (
          <li key={l.id}>
            <motion.a
              href={l.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Follow us on ${l.label}`}
              initial="rest"
              whileHover={rich ? 'hover' : undefined}
              whileTap="tap"
              variants={{ rest: { scale: 1, y: 0 }, hover: { scale: 1.06, y: -2 }, tap: { scale: 0.94 } }}
              transition={spring.snappy}
              className={cn(
                'group relative flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-300 touch-target',
                tone === 'light' ? 'border-gold/30 bg-white text-maroon hover:border-gold' : 'border-gold-light/25 bg-white/[0.06] text-gold-light hover:border-gold-light/70',
              )}
            >
              <span className="absolute inset-0 rounded-full ring-1 ring-gold/0 transition-[box-shadow] duration-300 group-hover:shadow-[0_0_0_4px_rgba(212,175,55,0.15)]" aria-hidden="true" />
              <motion.span variants={{ rest: { rotate: 0 }, hover: { rotate: -8 } }} transition={spring.snappy} className="relative">
                <Icon size={19} />
              </motion.span>
            </motion.a>
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- Join scheme CTA ---------- */
export function JoinSchemeCTA({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Card tone="gold" radius="xl" padding="none" className={cn('shimmer-gold shimmer-soft', className)}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/25 blur-2xl" aria-hidden="true" />
      <div className={cn('relative flex items-center justify-between gap-4 p-5', !compact && 'sm:p-6')}>
        <div className="min-w-0">
          <p className="eyebrow text-maroon/70">Gold Schemes</p>
          <h3 className={cn('mt-1.5 font-display leading-tight text-maroon-deep', compact ? 'text-[clamp(1.1rem,1.5vw,1.35rem)]' : 'text-[clamp(1.2rem,2vw,1.6rem)]')}>Secure Your Future With Gold</h3>
          <p className="mt-1 text-[13px] text-maroon/75">Small steps. Big dreams.</p>
          <Link
            to="/join-scheme"
            className="group mt-4 inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-maroon px-5 text-sm font-medium text-gold-light shadow-[0_10px_24px_-10px_rgba(84,0,0,0.6)] transition hover:bg-maroon-soft"
          >
            Join Scheme
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
        <div className={cn('relative hidden h-28 w-28 shrink-0 xs:block sm:h-32 sm:w-32', compact && 'md:hidden xl:block xl:h-24 xl:w-24 2xl:h-28 2xl:w-28')}>
          <div className="absolute inset-0 rounded-full border border-maroon/15" aria-hidden="true" />
          <div className="absolute inset-3 rounded-full bg-maroon" aria-hidden="true" />
          <div className="float-slow absolute inset-3">
            <DrawnArt delay={1.1} duration={1.5}>
              <RingArt intensity={1} />
            </DrawnArt>
          </div>
        </div>
      </div>
    </Card>
  )
}
