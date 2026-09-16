import { cloneElement, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom'
import { Bell, LogOut, ChevronRight } from 'lucide-react'
import { isNavActive, pageTitles, primaryNav } from '@/app/navigation'
import { BangleArt } from '@/components/brand/JewelArt'
import { Logo } from '@/components/brand/Logo'
import { GoldParticles } from '@/components/motion/GoldParticles'
import { SplitText } from '@/components/motion/Signature'
import { WELCOME_FLAG, WelcomeVeil } from '@/components/motion/WelcomeVeil'
import { Avatar, IconButton, LiveBadge } from '@/components/ui/Basics'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { activity, goldRates } from '@/data/mock'
import { useIsDesktop, useIsTablet, useReducedMotion } from '@/hooks'
import { formatDate, formatINR, formatNumberIN } from '@/lib/format'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   App shell — three intentional layouts:
   · ≥1024px  maroon sidebar + editorial content column
   · 768–1023 maroon top bar with inline navigation
   · <768     compact maroon header + floating bottom navigation
------------------------------------------------------------------- */

function useNotifications() {
  const [open, setOpen] = useState(false)
  const unread = activity.filter((a) => a.unread).length
  return { open, setOpen, unread }
}

function NotificationsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  return (
    <Modal open={open} onClose={onClose} title="Notifications" eyebrow="Recent" size="sm">
      <ul className="-mx-2 divide-y divide-gold/15">
        {activity.slice(0, 4).map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate('/activity')
              }}
              className="flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-maroon-tint/60"
            >
              <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', a.unread ? 'bg-gold' : 'bg-gold/25')} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-maroon">{a.title}</span>
                <span className="block truncate text-xs text-ink-soft">{a.description}</span>
                <span className="mt-0.5 block text-[11px] text-ink-mute">{formatDate(a.date)}</span>
              </span>
              <ChevronRight size={16} className="mt-1 shrink-0 text-ink-mute" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  )
}

/* ---------- Desktop sidebar ---------- */
function DesktopSidebar({ entrance = false }: { entrance?: boolean }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const reduced = useReducedMotion()

  return (
    <motion.aside
      className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col maroon-surface grain text-cream lg:flex"
      initial={entrance && !reduced ? { x: -48, opacity: 0 } : false}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ...spring.soft, delay: 0.2 }}
    >
      <div className="px-7 pb-6 pt-8">
        <Link to="/home" aria-label="Thirukochi home" className="block">
          <Logo width={168} priority shine />
        </Link>
      </div>
      <div className="gold-hairline mx-7" aria-hidden="true" />
      <nav className="mt-6 flex-1 px-4" aria-label="Primary">
        <ul className="space-y-1">
          {primaryNav.map((item) => {
            const active = isNavActive(item, location.pathname)
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex h-12 items-center gap-3 rounded-2xl px-4 text-sm font-medium transition-colors duration-300',
                    active ? 'text-gold-light' : 'text-cream/65 hover:text-cream hover:bg-white/[0.05]',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      transition={reduced ? { duration: 0 } : spring.snappy}
                      className="absolute inset-0 rounded-2xl border border-gold-light/25 bg-white/[0.08]"
                      aria-hidden="true"
                    />
                  )}
                  {active && (
                    <motion.span
                      layoutId="sidebar-bar"
                      transition={reduced ? { duration: 0 } : spring.snappy}
                      className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-gold-light to-gold"
                      aria-hidden="true"
                    />
                  )}
                  <item.icon size={18} strokeWidth={1.8} className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5" />
                  <span className="relative z-10">{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4">
        <div className="rounded-2xl border border-gold-light/15 bg-white/[0.05] p-4">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name ?? 'Member'} size={40} tone="gold" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-cream">{user?.name}</p>
              <p className="truncate text-[11px] tracking-wider text-gold-light/70">Ref. {user?.referenceCode}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              toast('Signed out', { description: 'See you again soon.', tone: 'info' })
              navigate('/login')
            }}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-gold-light/20 text-xs font-medium text-cream/80 transition hover:border-gold-light/50 hover:text-cream"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </motion.aside>
  )
}

/* ---------- Tablet top bar ---------- */
function TabletTopBar({ onBell, unread, entrance = false }: { onBell: () => void; unread: number; entrance?: boolean }) {
  const location = useLocation()
  const { user } = useAuth()
  const reduced = useReducedMotion()
  return (
    <motion.header
      className="sticky top-0 z-30 hidden maroon-surface text-cream md:block lg:hidden"
      initial={entrance && !reduced ? { y: -40, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...spring.soft, delay: 0.2 }}
    >
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between gap-6 px-[var(--page-x)]">
        <Link to="/home" aria-label="Thirukochi home" className="shrink-0">
          <Logo width={132} priority />
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1">
          {primaryNav.map((item) => {
            const active = isNavActive(item, location.pathname)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={cn('relative flex h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium transition-colors', active ? 'text-gold-light' : 'text-cream/65 hover:text-cream')}
              >
                {active && (
                  <motion.span
                    layoutId="topnav-active"
                    transition={reduced ? { duration: 0 } : spring.snappy}
                    className="absolute inset-0 rounded-full border border-gold-light/25 bg-white/[0.08]"
                    aria-hidden="true"
                  />
                )}
                <item.icon size={16} strokeWidth={1.8} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
        <div className="flex items-center gap-2">
          <IconButton label="Notifications" tone="dark" size="sm" onClick={onBell} badge={unread > 0}>
            <Bell size={17} strokeWidth={1.8} />
          </IconButton>
          <Link to="/profile" aria-label="Profile" className="rounded-full">
            <Avatar name={user?.name ?? 'Member'} size={38} tone="gold" />
          </Link>
        </div>
      </div>
    </motion.header>
  )
}

/* ---------- Mobile header ---------- */
function MobileHeader({ onBell, unread, entrance = false }: { onBell: () => void; unread: number; entrance?: boolean }) {
  const location = useLocation()
  const { user } = useAuth()
  const reduced = useReducedMotion()
  const isHome = location.pathname === '/home'
  const title = pageTitles[location.pathname] ?? (location.pathname.startsWith('/schemes/') ? 'Scheme Details' : 'Thirukochi')
  const rate = goldRates.rates[0]
  const down = rate.change < 0
  const [first, ...rest] = (user?.name ?? 'Member').split(' ')

  return (
    <header className="relative z-20 overflow-hidden maroon-surface grain text-cream md:hidden">
      {/* ornament layer */}
      <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full gold-glow opacity-70" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -top-6 w-[320px] opacity-[0.28]" aria-hidden="true">
        <BangleArt intensity={0.8} />
      </div>
      {!reduced && <GoldParticles count={10} opacity={0.55} />}

      {/* row 1 — the lockup hangs from the top edge like a pendant on a gold chain;
          bell and avatar sit on the chain either side */}
      <div className="relative px-[var(--page-x)] pt-[var(--safe-top)]">
        <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--safe-top)+36px)] h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden="true" />
        <div className="relative flex items-start justify-between">
          <IconButton label="Notifications" tone="dark" size="sm" onClick={onBell} badge={unread > 0} className="mt-4 bg-maroon-deep/80 backdrop-blur-sm">
            <Bell size={17} strokeWidth={1.8} />
          </IconButton>
          <motion.div initial={entrance && !reduced ? { y: -96 } : false} animate={{ y: 0 }} transition={{ ...spring.soft, delay: 0.25 }}>
            <Link
              to="/home"
              aria-label="Thirukochi home"
              className="pendant-tile flex rounded-b-[26px] border border-t-0 border-gold/70 px-4 pb-2.5 pt-2"
            >
              <Logo width={104} priority shine decode="sync" />
            </Link>
          </motion.div>
          {/* same footprint as the bell so the pendant sits dead centre */}
          <div className="mt-4 flex h-10 w-10 items-center justify-end">
            <Link to="/profile" aria-label="Profile" className="rounded-full shadow-[0_0_0_3px_rgba(212,175,55,0.22)]">
              <Avatar name={user?.name ?? 'Member'} size={36} tone="gold" />
            </Link>
          </div>
        </div>
      </div>

      {/* row 2 — greeting (home) or page title + compact live rate (elsewhere) */}
      <div className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-[var(--page-x)] pb-9 pt-3">
        <p className="min-w-0 max-w-full truncate font-display text-[22px] leading-tight text-cream">
          {isHome ? (
            <>
              Hi, {first} {rest.length > 0 && <span className="italic font-normal gold-text">{rest.join(' ')}</span>}
            </>
          ) : (
            title
          )}
        </p>
        {!isHome && (
          <Link
            to="/home"
            aria-label={`Live gold rate ${formatINR(rate.price)} per gram, ${down ? 'down' : 'up'} ${formatINR(Math.abs(rate.change))}`}
            className="glass-maroon ml-auto flex h-9 shrink-0 items-center gap-2 rounded-full pl-1.5 pr-3"
          >
            <LiveBadge />
            <span className="text-[13px] font-medium gold-text tabular">₹{formatNumberIN(rate.price, 2)}</span>
          </Link>
        )}
      </div>

      {/* jewellery curve with gold edge */}
      <div className="absolute inset-x-0 -bottom-px h-7 rounded-t-[36px] border-t border-gold/45 bg-cream" aria-hidden="true" />
    </header>
  )
}

/* ---------- Mobile bottom nav ---------- */
function BottomNav({ entrance = false }: { entrance?: boolean }) {
  const location = useLocation()
  const reduced = useReducedMotion()
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-3 z-40 md:hidden"
      style={{ bottom: 'calc(var(--safe-bottom) + 10px)' }}
    >
      <motion.ul
        className="relative flex items-end justify-between overflow-visible rounded-[28px] border border-gold-light/20 maroon-surface px-1.5 pb-1.5 pt-1 shadow-maroon"
        initial={entrance && !reduced ? { y: 96, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring.soft, delay: 0.3 }}
      >
        <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold-light/60 to-transparent" aria-hidden="true" />
        {primaryNav.map((item) => {
          const active = isNavActive(item, location.pathname)
          return (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
                className={cn(
                  'relative flex h-[58px] flex-col items-center justify-end gap-1 pb-1 text-[10px] font-medium tracking-wide transition-colors duration-300',
                  active ? 'text-gold-light' : 'text-cream/55',
                )}
              >
                <span className="relative flex h-9 w-9 items-center justify-center">
                  {active && (
                    <motion.span
                      layoutId="bottomnav-disc"
                      transition={reduced ? { duration: 0 } : spring.snappy}
                      className="absolute -top-3 h-11 w-11 rounded-full gold-surface shadow-[0_8px_20px_-6px_rgba(212,175,55,0.7)] ring-4 ring-maroon"
                      aria-hidden="true"
                    />
                  )}
                  <motion.span
                    className={cn('relative z-10', active && 'text-maroon-deep')}
                    // disc sits 12px above the 36px slot (centre at -8 from the icon's rest centre)
                    animate={active ? { y: -8, scale: 1.05 } : { y: 0, scale: 1 }}
                    transition={reduced ? { duration: 0 } : spring.snappy}
                  >
                    <item.icon size={20} strokeWidth={active ? 2 : 1.7} />
                  </motion.span>
                </span>
                <span className="relative z-10 leading-none">{item.label}</span>
              </NavLink>
            </li>
          )
        })}
      </motion.ul>
    </nav>
  )
}

/* ---------- Desktop header ---------- */
function DesktopHeader({ onBell, unread }: { onBell: () => void; unread: number }) {
  const { user } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === '/home'
  const today = new Date()
  return (
    <header className={cn('hidden items-center justify-between gap-6 lg:flex', isHome ? 'pb-2 pt-9' : 'pb-0 pt-7')}>
      <div>
        <p className="eyebrow text-gold-deep">{today.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
        {isHome ? (
          <SplitText
            as="h1"
            className="mt-1 font-display text-[28px] text-maroon"
            words={['Hi,', { text: user?.name?.split(' ')[0] ?? 'Member', className: 'italic font-normal' }]}
            delay={0.1}
          />
        ) : (
          <p className="mt-1 font-display text-lg text-maroon/70">Thirukochi Gold &amp; Diamonds</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <IconButton label="Notifications" tone="light" onClick={onBell} badge={unread > 0}>
          <Bell size={18} strokeWidth={1.8} />
        </IconButton>
        <Link to="/profile" className="flex items-center gap-3 rounded-full border border-gold/25 bg-white py-1 pl-1 pr-4 shadow-soft transition hover:border-gold/60">
          <Avatar name={user?.name ?? 'Member'} size={36} />
          <span className="text-sm font-medium text-maroon">{user?.name}</span>
        </Link>
      </div>
    </header>
  )
}

export function AppShell() {
  const location = useLocation()
  const outlet = useOutlet()
  const isDesktop = useIsDesktop()
  const isTablet = useIsTablet()
  const { user } = useAuth()
  const { open, setOpen, unread } = useNotifications()

  // Sign-in raises WELCOME_FLAG. The veil greets the member, then lifts; the
  // shell and page mount only as it lifts so their own entrances play in the
  // reveal. 'veil' → 'lift' → null. The flag is consumed here so a refresh
  // never replays it.
  const [welcome, setWelcome] = useState<'veil' | 'lift' | null>(() => {
    try {
      if (!sessionStorage.getItem(WELCOME_FLAG)) return null
      sessionStorage.removeItem(WELCOME_FLAG)
      return 'veil'
    } catch {
      return null
    }
  })
  const lift = useCallback(() => setWelcome('lift'), [])
  const held = welcome === 'veil'
  const entrance = welcome === 'lift'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  return (
    <div className="min-h-dvh bg-cream">
      <AnimatePresence onExitComplete={() => setWelcome(null)}>
        {held && <WelcomeVeil name={(user?.name ?? 'Member').split(' ')[0]} onLift={lift} />}
      </AnimatePresence>

      {!held && isDesktop && <DesktopSidebar entrance={entrance} />}
      {!held && isTablet && !isDesktop && <TabletTopBar onBell={() => setOpen(true)} unread={unread} entrance={entrance} />}
      {!held && !isTablet && <MobileHeader onBell={() => setOpen(true)} unread={unread} entrance={entrance} />}

      <div className={cn('relative', isDesktop && 'pl-[264px]')}>
        <div className="pointer-events-none absolute right-0 top-0 hidden h-[420px] w-[420px] rounded-full gold-glow opacity-40 lg:block" aria-hidden="true" />
        <main className="relative mx-auto w-full max-w-[1200px] px-[var(--page-x)] pb-[calc(var(--safe-bottom)+6.5rem)] md:pb-14">
          {!held && <DesktopHeader onBell={() => setOpen(true)} unread={unread} />}
          <AnimatePresence mode="wait" initial={false}>
            {!held && outlet && cloneElement(outlet, { key: location.pathname })}
          </AnimatePresence>
        </main>
      </div>

      {!held && !isTablet && <BottomNav entrance={entrance} />}
      <NotificationsModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
