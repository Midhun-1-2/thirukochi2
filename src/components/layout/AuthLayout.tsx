import { cloneElement, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'
import { ShieldCheck, Gem, Sparkles } from 'lucide-react'
import { authSteps } from '@/app/navigation'
import { BangleArt, RingArt } from '@/components/brand/JewelArt'
import { Logo } from '@/components/brand/Logo'
import { GoldParticles } from '@/components/motion/GoldParticles'
import { Parallax, ParallaxLayer } from '@/components/motion/Parallax'
import { SplitText } from '@/components/motion/Signature'
import { useFitToViewport, useIsDesktop, useReducedMotion } from '@/hooks'
import { spring } from '@/lib/motion'
import { TransitionDirection } from '@/lib/transition-context'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Auth layout — one full-bleed maroon stage. An editorial statement
   on the left, the form inside a jharokha arch on the right; on
   phones the arch card sits centred on the same stage.
------------------------------------------------------------------- */

const pillars = [
  { icon: ShieldCheck, label: 'Secure Transactions' },
  { icon: Gem, label: 'Trusted Brand' },
  { icon: Sparkles, label: 'Modern Technology' },
]

function StepRail({ pathname, className }: { pathname: string; className?: string }) {
  const index = Math.max(0, authSteps.findIndex((s) => s.path === pathname))
  return (
    <ol className={cn('flex items-center gap-1.5 sm:gap-2', className)} aria-label="Sign-up progress">
      {authSteps.map((s, i) => {
        const done = i < index
        const active = i === index
        return (
          <li key={s.path} className="flex items-center gap-1.5 sm:gap-2">
            <span className="flex items-center gap-1.5">
              <span className={cn('block h-1.5 w-1.5 rounded-full transition-colors', active ? 'bg-gold-light shadow-[0_0_0_3px_rgba(249,223,146,0.25)]' : done ? 'bg-gold' : 'bg-cream/25')} aria-hidden="true" />
              <span className={cn('whitespace-nowrap text-[10px] font-medium tracking-[0.14em] uppercase transition-colors', active ? 'text-gold-light' : done ? 'text-gold/80' : 'text-cream/40')}>{s.label}</span>
            </span>
            {i < authSteps.length - 1 && <span className={cn('block h-px w-2.5 sm:w-7', done ? 'bg-gold/70' : 'bg-cream/15')} aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

export function AuthLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  // direction of travel through the auth flow (register → otp → mpin → login)
  const stepIndex = Math.max(0, authSteps.findIndex((s) => s.path === location.pathname))
  const [track, setTrack] = useState({ index: stepIndex, dir: 1 })
  const dir = track.index === stepIndex ? track.dir : stepIndex >= track.index ? 1 : -1
  if (track.index !== stepIndex) setTrack({ index: stepIndex, dir })
  // scale the whole stage down if the viewport is shorter than the content — never scroll
  const { ref: fitRef, scale, scaledHeight } = useFitToViewport()

  return (
    <Parallax className="relative flex h-dvh flex-col items-center justify-center overflow-clip maroon-surface grain text-cream" strength={14}>
      {/* ---------- stage ornaments ---------- */}
      <GoldParticles count={isDesktop ? 42 : 18} opacity={0.8} />
      <div className="pointer-events-none absolute -left-24 -top-32 h-[420px] w-[420px] rounded-full gold-glow opacity-60 lg:h-[640px] lg:w-[640px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 right-[-10%] h-[420px] w-[420px] rounded-full gold-glow opacity-40 lg:h-[560px] lg:w-[560px]" aria-hidden="true" />
      <ParallaxLayer depth={0.7} className="pointer-events-none absolute -bottom-24 -left-32 w-[560px] opacity-30 lg:-bottom-40 lg:-left-20 lg:w-[880px] lg:opacity-40">
        <BangleArt intensity={0.9} />
      </ParallaxLayer>
      <ParallaxLayer depth={1.2} className="pointer-events-none absolute -right-10 top-24 hidden h-40 w-40 opacity-50 lg:block">
        <div className="float-slow h-full w-full">
          <RingArt intensity={0.8} />
        </div>
      </ParallaxLayer>
      <div className="pointer-events-none absolute inset-x-[var(--page-x)] top-[calc(var(--safe-top)+84px)] hidden h-px bg-gradient-to-r from-gold/50 via-gold/10 to-transparent lg:block" aria-hidden="true" />

      <div className="relative z-10 w-full" style={{ height: scaledHeight || undefined }}>
      <div ref={fitRef} className="w-full origin-top" style={{ transform: scale < 1 ? `scale(${scale})` : undefined, transformOrigin: 'top center' }}>
      {/* ---------- header ---------- */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0, transition: { ...spring.soft, delay: 0.05 } }}
        className="relative z-10 flex items-center justify-between gap-4 px-[var(--page-x)] pt-[calc(var(--safe-top)+0.75rem)] lg:pt-[calc(var(--safe-top)+1.25rem)]"
      >
        <Logo width={isDesktop ? 168 : 110} priority shine />
        <StepRail pathname={location.pathname} className="hidden md:flex" />
      </motion.header>

      {/* ---------- stage ---------- */}
      <main className="relative z-10 mx-auto grid w-full max-w-[1180px] gap-2 px-[var(--page-x)] pb-[calc(var(--safe-bottom)+0.75rem)] pt-2 lg:grid-cols-[1.05fr_minmax(400px,460px)] lg:items-center lg:gap-16 lg:pb-4 lg:pt-6">
        {/* statement (tablet / desktop) */}
        <section className="relative hidden sm:block">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0, transition: { ...spring.soft, delay: 0.15 } }}
            className="eyebrow hidden text-gold-light/80 sm:block"
          >
            Digital Gold · Savings · Jewellery
          </motion.p>
          <SplitText
            as="h1"
            className="font-display text-[1.55rem] font-medium leading-[1.05] text-cream sm:mt-3 sm:text-[clamp(2rem,4vw,3.2rem)] lg:text-[clamp(2.8rem,5.2vw,4.8rem)]"
            words={['Tradition', { text: 'Meets', className: 'italic font-normal gold-text' }, 'Tomorrow.']}
            breakAfter={isDesktop ? 1 : undefined}
            delay={0.25}
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { ...spring.soft, delay: 0.55 } }}
            className="mt-4 hidden max-w-md text-[15px] leading-relaxed text-cream/70 sm:block"
          >
            Your gold journey, digitally. Live rates, monthly savings and a legacy of trust from Thirukochi Gold &amp; Diamonds.
          </motion.p>

          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: 0.7 } } }}
            className="mt-6 hidden gap-6 lg:mt-10 lg:flex"
          >
            {pillars.map(({ icon: Icon, label }) => (
              <motion.li
                key={label}
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: spring.soft } }}
                className="flex items-center gap-3 border-l border-gold/40 pl-3 text-[12px] tracking-wide text-cream/80"
              >
                <Icon size={15} strokeWidth={1.8} className="text-gold-light" aria-hidden="true" />
                {label}
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* arch card */}
        {/* reserved height: cards of different sizes never move the stage or the statement */}
        <div className="relative flex min-h-[min(660px,calc(100dvh_-_170px))] flex-col justify-center pt-2 lg:pt-4">
          <TransitionDirection.Provider value={dir}>
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              {outlet && cloneElement(outlet, { key: location.pathname })}
            </AnimatePresence>
          </TransitionDirection.Provider>
        </div>

        <StepRail pathname={location.pathname} className="justify-center md:hidden" />
      </main>
      </div>
      </div>
    </Parallax>
  )
}
