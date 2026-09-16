import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, Copy, Check, FileText, KeyRound, LogOut, Mail, ShieldCheck, UserRound, type LucideIcon } from 'lucide-react'
import { PageTransition, Stagger, StaggerItem } from '@/components/motion/Primitives'
import { Avatar, Badge } from '@/components/ui/Basics'
import { Button } from '@/components/ui/Button'
import { Card, GoldRule } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useCopyToClipboard, useDocumentTitle } from '@/hooks'
import { formatPhone } from '@/lib/format'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Section = 'personal' | 'security' | 'notifications' | 'terms' | 'privacy' | null

const sections: Array<{ id: Exclude<Section, null>; label: string; hint: string; icon: LucideIcon }> = [
  { id: 'personal', label: 'Personal Details', hint: 'Name, email and contact', icon: UserRound },
  { id: 'security', label: 'Security / MPIN', hint: 'Change your 4-digit MPIN', icon: KeyRound },
  { id: 'notifications', label: 'Notifications', hint: 'Rates, reminders, offers', icon: Bell },
  { id: 'terms', label: 'Terms & Conditions', hint: 'Scheme and app terms', icon: FileText },
  { id: 'privacy', label: 'Privacy Policy', hint: 'How we protect your data', icon: ShieldCheck },
]

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-300', checked ? 'border-transparent bg-maroon' : 'border-maroon/15 bg-sand')}
    >
      <motion.span
        layout
        transition={spring.snappy}
        className={cn('absolute top-0.5 h-[22px] w-[22px] rounded-full shadow', checked ? 'left-[22px] gold-surface' : 'left-0.5 bg-white')}
      />
    </button>
  )
}

export function Profile() {
  useDocumentTitle('Profile')
  const navigate = useNavigate()
  const { user, logout, updateProfile } = useAuth()
  const { toast } = useToast()
  const { copied, copy } = useCopyToClipboard()
  const [open, setOpen] = useState<Section>(null)
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [prefs, setPrefs] = useState({ rate: true, reminders: true, offers: false })
  const [confirmLogout, setConfirmLogout] = useState(false)

  const savePersonal = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 3) return
    updateProfile({ name: name.trim(), email: email.trim() || undefined })
    setOpen(null)
    toast('Profile updated', { tone: 'success' })
  }

  const doLogout = () => {
    logout()
    toast('Signed out', { description: 'See you again soon.', tone: 'info' })
    navigate('/login')
  }

  if (!user) return null

  return (
    <PageTransition>
      <Stagger className="mx-auto max-w-3xl space-y-6 pt-5 md:pt-8 lg:pt-4" stagger={0.09}>
        <StaggerItem>
          <Card tone="maroon" radius="xl" padding="none" className="grain">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full gold-glow opacity-60" aria-hidden="true" />
            <div className="relative flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:items-center sm:text-left sm:p-8">
              <div className="relative">
                <span className="absolute -inset-1.5 rounded-full border border-gold-light/40" aria-hidden="true" />
                <Avatar name={user.name} size={84} tone="gold" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-2xl text-cream">{user.name}</h1>
                <p className="mt-0.5 text-sm text-cream/70 tabular">{formatPhone(user.phone)}</p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Badge tone="onMaroon">Member since {user.memberSince}</Badge>
                  <button
                    type="button"
                    onClick={async () => {
                      await copy(user.referenceCode)
                      toast('Reference code copied', { tone: 'success' })
                    }}
                    className="inline-flex h-6 items-center gap-1.5 rounded-full border border-gold-light/30 bg-white/10 px-2.5 text-[11px] font-medium tracking-wider text-gold-light transition hover:bg-white/20"
                    aria-label={`Copy reference code ${user.referenceCode}`}
                  >
                    Ref. {user.referenceCode}
                    {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card tone="white" padding="none">
            <ul className="divide-y divide-gold/15">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setOpen(s.id)}
                    className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-cream/70 sm:px-6"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-maroon-tint text-maroon transition-colors duration-300 group-hover:bg-maroon group-hover:text-gold-light">
                      <s.icon size={18} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-maroon">{s.label}</span>
                      <span className="block text-xs text-ink-mute">{s.hint}</span>
                    </span>
                    <ChevronRight size={18} className="shrink-0 text-ink-mute transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-maroon" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Button variant="subtle" size="lg" fullWidth leading={<LogOut size={17} />} onClick={() => setConfirmLogout(true)} className="text-maroon">
            Logout
          </Button>
          <p className="mt-4 text-center text-[11px] tracking-wider text-ink-mute uppercase">Thirukochi Gold & Diamonds · v2.0</p>
        </StaggerItem>
      </Stagger>

      {/* ---------- modals ---------- */}
      <Modal open={open === 'personal'} onClose={() => setOpen(null)} eyebrow="Profile" title="Personal Details" footer={<Button fullWidth onClick={savePersonal} disabled={name.trim().length < 3}>Save changes</Button>}>
        <form onSubmit={savePersonal} className="space-y-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} icon={<UserRound size={17} />} autoComplete="name" />
          <Input label="Phone Number" value={formatPhone(user.phone)} readOnly icon={<KeyRound size={17} />} hint="Contact a showroom to change your number." />
          <Input label="Email (optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={17} />} autoComplete="email" />
        </form>
      </Modal>

      <Modal open={open === 'security'} onClose={() => setOpen(null)} eyebrow="Security" title="Security / MPIN" footer={<Button fullWidth onClick={() => navigate('/forgot-mpin')}>Change MPIN</Button>}>
        <p>Your MPIN protects every login. To change it, we will verify your mobile number with an OTP and then let you set a new 4-digit MPIN.</p>
        <GoldRule className="my-4" />
        <ul className="space-y-2 text-xs">
          <li>· Never share your MPIN or OTP with anyone.</li>
          <li>· Thirukochi staff will never ask for your MPIN.</li>
          <li>· Last sign-in: today, this device.</li>
        </ul>
      </Modal>

      <Modal open={open === 'notifications'} onClose={() => setOpen(null)} eyebrow="Preferences" title="Notifications">
        <ul className="divide-y divide-gold/15">
          {[
            { key: 'rate' as const, label: 'Gold rate updates', hint: 'Daily 22K rate every morning' },
            { key: 'reminders' as const, label: 'Instalment reminders', hint: 'Three days before each due date' },
            { key: 'offers' as const, label: 'Collections & offers', hint: 'New launches and festive previews' },
          ].map((p) => (
            <li key={p.key} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-maroon">{p.label}</p>
                <p className="text-xs text-ink-mute">{p.hint}</p>
              </div>
              <Toggle checked={prefs[p.key]} label={p.label} onChange={(v) => setPrefs((s) => ({ ...s, [p.key]: v }))} />
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={open === 'terms'} onClose={() => setOpen(null)} eyebrow="Legal" title="Terms & Conditions" size="lg">
        <div className="space-y-3">
          <p>These terms govern the use of the Thirukochi Gold & Diamonds member application and its gold savings schemes.</p>
          <p><strong className="text-maroon">Schemes.</strong> Monthly instalments are recorded against your reference code. Accumulated value may be redeemed towards jewellery purchases at any Thirukochi showroom on completion of the chosen tenure.</p>
          <p><strong className="text-maroon">Rates.</strong> Gold rates shown in the app are indicative and refreshed periodically. The rate applicable at the time of purchase or redemption is the showroom rate on that day.</p>
          <p><strong className="text-maroon">Prototype notice.</strong> This build uses demonstration data. No financial claims are made.</p>
        </div>
      </Modal>

      <Modal open={open === 'privacy'} onClose={() => setOpen(null)} eyebrow="Legal" title="Privacy Policy" size="lg">
        <div className="space-y-3">
          <p>We collect only the information needed to operate your account: your name, mobile number and scheme activity.</p>
          <p>Your MPIN is stored on your device and never transmitted in plain text. We do not sell personal data and share it only with payment partners needed to process your instalments.</p>
          <p>You may request a copy or deletion of your data at any Thirukochi showroom.</p>
        </div>
      </Modal>

      <Modal
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="Log out?"
        size="sm"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setConfirmLogout(false)}>Stay</Button>
            <Button variant="maroon" onClick={doLogout} leading={<LogOut size={15} />}>Logout</Button>
          </div>
        }
      >
        <p>You will need your phone number and MPIN to sign in again.</p>
      </Modal>
    </PageTransition>
  )
}
