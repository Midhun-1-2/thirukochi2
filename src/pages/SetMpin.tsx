import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Lock, ShieldCheck } from 'lucide-react'
import { AuthCard } from '@/components/auth/AuthCard'
import { Button } from '@/components/ui/Button'
import { MPINInput } from '@/components/ui/MPINInput'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useDocumentTitle } from '@/hooks'
import { authConfig } from '@/data/mock'
import { spring } from '@/lib/motion'

export function SetMpin() {
  useDocumentTitle('Set MPIN')
  const navigate = useNavigate()
  const { pending, setMpin, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [phase, setPhase] = useState<'create' | 'confirm'>('create')
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!pending?.verified) navigate('/register', { replace: true })
  }, [pending, navigate])

  const value = phase === 'create' ? first : second
  const setValue = phase === 'create' ? setFirst : setSecond

  const handleComplete = (v: string) => {
    if (phase === 'create') {
      if (/^(\d)\1{3}$/.test(v) || v === '1234' || v === '0000') {
        setError('Choose a less predictable MPIN.')
        setFirst('')
        return
      }
      setError(null)
      window.setTimeout(() => setPhase('confirm'), 220)
    }
  }

  const submit = async () => {
    if (second.length !== authConfig.mpinLength || loading) return
    if (second !== first) {
      setError('The MPINs do not match. Please try again.')
      setSecond('')
      return
    }
    setLoading(true)
    await setMpin(second)
    setLoading(false)
    setSuccess(true)
    if (isAuthenticated) {
      toast('MPIN updated', { description: 'Use your new MPIN the next time you sign in.', tone: 'success' })
      window.setTimeout(() => navigate('/profile'), 700)
    } else {
      toast('MPIN set', { description: 'Your account is secured. Please login to continue.', tone: 'success' })
      window.setTimeout(() => navigate('/login'), 700)
    }
  }

  return (
    <AuthCard
      eyebrow="Security"
      title="Set Your MPIN"
      description={
        <span className="flex items-center gap-2">
          <Lock size={14} className="text-gold-deep" aria-hidden="true" />
          Create a 4 digit MPIN for secure access.
        </span>
      }
    >
      <div className="space-y-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: spring.soft }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
            className="text-center text-sm font-medium text-maroon"
          >
            {phase === 'create' ? 'Enter a new MPIN' : 'Re-enter your MPIN to confirm'}
          </motion.p>
        </AnimatePresence>

        <MPINInput
          key={phase}
          value={value}
          onChange={(v) => {
            setError(null)
            setValue(v)
          }}
          onComplete={handleComplete}
          error={Boolean(error)}
          disabled={loading || success}
        />

        <div className="min-h-[16px] text-center" aria-live="polite">
          {error && (
            <p role="alert" className="text-xs text-danger">
              {error}
            </p>
          )}
        </div>

        {phase === 'confirm' ? (
          <Button type="button" size="md" fullWidth magnetic loading={loading} success={success} successText="MPIN secured" onClick={submit} disabled={second.length !== authConfig.mpinLength} leading={<ShieldCheck size={17} />}>
            Continue
          </Button>
        ) : (
          <Button type="button" size="md" fullWidth variant="outline" disabled={first.length !== authConfig.mpinLength} onClick={() => setPhase('confirm')}>
            Continue
          </Button>
        )}

        {phase === 'confirm' && (
          <button
            type="button"
            onClick={() => {
              setPhase('create')
              setFirst('')
              setSecond('')
              setError(null)
            }}
            className="mx-auto block text-sm text-ink-soft underline-offset-4 hover:text-maroon hover:underline"
          >
            Start over
          </button>
        )}
        <p className="text-center text-xs text-ink-mute">Your MPIN keeps your account secure. Never share it.</p>
      </div>
    </AuthCard>
  )
}
