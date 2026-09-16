import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, KeyRound, Phone, RefreshCw, ShieldCheck } from 'lucide-react'
import { AuthCard } from '@/components/auth/AuthCard'
import { WELCOME_FLAG } from '@/components/motion/WelcomeVeil'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useDocumentTitle, useReducedMotion } from '@/hooks'
import { generateCaptcha, isValidIndianMobile } from '@/lib/utils'
import { spring } from '@/lib/motion'

/* Captcha token — stylised digits on a gold plate with hairline noise. */
function CaptchaPlate({ code, onRefresh }: { code: string; onRefresh: () => void }) {
  const reduced = useReducedMotion()
  return (
    <div className="relative">
      <div
        className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl border border-gold/50 gold-surface pr-10 select-none"
        aria-label={`Captcha code ${code.split('').join(' ')}`}
        role="img"
      >
        <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 160 56">
          <path d="M0 40 C 40 10, 80 50, 160 18" stroke="#540000" strokeWidth="0.8" fill="none" />
          <path d="M0 14 C 50 44, 100 4, 160 40" stroke="#540000" strokeWidth="0.6" fill="none" />
          <circle cx="30" cy="12" r="1" fill="#540000" />
          <circle cx="120" cy="44" r="1.2" fill="#540000" />
          <circle cx="75" cy="30" r="0.8" fill="#540000" />
        </svg>
        <motion.span
          key={code}
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0, transition: spring.soft }}
          className="relative font-display text-[22px] tracking-[0.3em] text-maroon-deep tabular"
        >
          {code.split('').map((c, i) => (
            <span key={i} className="inline-block" style={{ transform: `rotate(${(i % 2 ? -1 : 1) * (4 + i * 2)}deg) translateY(${i % 2 ? 2 : -2}px)` }}>
              {c}
            </span>
          ))}
        </motion.span>
      </div>
      <motion.button
        type="button"
        onClick={onRefresh}
        whileTap={{ rotate: 180, scale: 0.92 }}
        transition={spring.snappy}
        aria-label="Refresh captcha"
        className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-xl border border-maroon/25 bg-white/70 text-maroon transition hover:bg-white"
      >
        <RefreshCw size={16} strokeWidth={1.8} />
      </motion.button>
    </div>
  )
}

export function Login() {
  useDocumentTitle('Login')
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()
  const [phone, setPhone] = useState('')
  const [mpin, setMpin] = useState('')
  const [showMpin, setShowMpin] = useState(false)
  const [captcha, setCaptcha] = useState(() => generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  const [touched, setTouched] = useState<{ phone?: boolean; mpin?: boolean; captcha?: boolean }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const phoneError = touched.phone && !isValidIndianMobile(phone) ? 'Enter a valid 10-digit mobile number.' : undefined
  const mpinError = touched.mpin && mpin.length !== 4 ? 'Enter your 4-digit MPIN.' : undefined
  const captchaError = touched.captcha && captchaInput !== captcha ? 'Captcha does not match.' : undefined
  const valid = isValidIndianMobile(phone) && mpin.length === 4 && captchaInput === captcha

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())
    setCaptchaInput('')
    setTouched((t) => ({ ...t, captcha: false }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({ phone: true, mpin: true, captcha: true })
    setFormError(null)
    if (!valid) return
    setLoading(true)
    // raised before the guard can redirect us; the shell consumes it on mount
    try {
      sessionStorage.setItem(WELCOME_FLAG, '1')
    } catch {
      /* private mode — no welcome veil, sign-in still works */
    }
    const result = await login(phone, mpin)
    setLoading(false)
    if (!result.ok) {
      try {
        sessionStorage.removeItem(WELCOME_FLAG)
      } catch {
        /* ignore */
      }
      setFormError(result.error)
      setMpin('')
      refreshCaptcha()
      return
    }
    setSuccess(true)
    toast('Welcome back', { description: 'Signed in securely.', tone: 'success' })
    window.setTimeout(() => navigate('/home', { replace: true }), 600)
  }

  return (
    <AuthCard
      eyebrow="Member Login"
      title="Welcome Back"
      description="Login to your account."
      footer={
        <>
          New to Thirukochi?{' '}
          <Link to="/register" className="font-medium text-maroon underline-offset-4 hover:underline">
            Create an account
          </Link>
          <p className="mt-2 text-[11px] text-ink-mute">Demo: 98765 43210 · MPIN 1234</p>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-3">
        <Input
          dense
          label="Phone Number"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          prefix="+91"
          icon={<Phone size={18} strokeWidth={1.8} />}
          value={phone}
          maxLength={10}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          error={phoneError}
        />
        <Input
          dense
          label="Enter MPIN"
          name="mpin"
          type={showMpin ? 'text' : 'password'}
          inputMode="numeric"
          autoComplete="current-password"
          icon={<KeyRound size={18} strokeWidth={1.8} />}
          value={mpin}
          maxLength={4}
          onChange={(e) => setMpin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onBlur={() => setTouched((t) => ({ ...t, mpin: true }))}
          error={mpinError}
          trailing={
            <button
              type="button"
              onClick={() => setShowMpin((s) => !s)}
              aria-label={showMpin ? 'Hide MPIN' : 'Show MPIN'}
              aria-pressed={showMpin}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-mute transition hover:bg-maroon-tint hover:text-maroon"
            >
              {showMpin ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <CaptchaPlate code={captcha} onRefresh={refreshCaptcha} />
          <Input
            dense
            label="Enter Captcha"
            name="captcha"
            inputMode="numeric"
            autoComplete="off"
            value={captchaInput}
            maxLength={4}
            onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
            onBlur={() => setTouched((t) => ({ ...t, captcha: true }))}
            error={captchaError}
            success={captchaInput.length === 4 && captchaInput === captcha}
          />
        </div>

        {formError && (
          <p role="alert" className="rounded-xl border border-danger/25 bg-danger-soft px-3 py-2 text-xs text-danger">
            {formError}
          </p>
        )}

        <Button type="submit" size="md" fullWidth magnetic loading={loading} success={success} successText="Signed in" loadingText="Signing in" leading={<ShieldCheck size={17} />} className="!mt-4">
          Login
        </Button>
        <Link to="/forgot-mpin" className="draw-underline mx-auto block w-fit pb-0.5 text-[13px] font-medium text-maroon">
          Forgot MPIN?
        </Link>
      </form>
    </AuthCard>
  )
}
