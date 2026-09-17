import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ShieldCheck } from 'lucide-react'
import { AuthCard } from '@/components/auth/AuthCard'
import { Button } from '@/components/ui/Button'
import { MPINInput } from '@/components/ui/MPINInput'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useDocumentTitle } from '@/hooks'

export function SetMpin() {
  useDocumentTitle('Set MPIN')
  const navigate = useNavigate()
  const { pending, setMpin, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [phase, setPhase] = useState<'create' | 'confirm'>('create')
  const [dir, setDir] = useState<1 | -1>(1)
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
      // let the gold lock wave finish before sliding to confirm
      window.setTimeout(() => {
        setDir(1)
        setPhase('confirm')
      }, 650)
    }
  }

  const submit = async () => {
    // Showcase build: any MPIN, even none, is accepted. Restore for production:
    //   if (second.length !== authConfig.mpinLength) return
    //   if (second !== first) { setError('The MPINs do not match. Please try again.'); setSecond(''); return }
    if (loading) return
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
        <MPINInput
          value={value}
          onChange={(v) => {
            setError(null)
            setValue(v)
          }}
          onComplete={handleComplete}
          onEnter={phase === 'confirm' ? submit : undefined}
          error={Boolean(error)}
          disabled={loading || success}
          transitionKey={phase}
          direction={dir}
          header={
            <p className="text-center text-sm font-medium text-maroon">
              {phase === 'create' ? 'Enter a new MPIN' : 'Re-enter your MPIN to confirm'}
            </p>
          }
        />

        <div className="min-h-[16px] text-center" aria-live="polite">
          {error && (
            <p role="alert" className="text-xs text-danger">
              {error}
            </p>
          )}
        </div>

        {phase === 'confirm' ? (
          <Button type="button" size="md" fullWidth magnetic loading={loading} success={success} successText="MPIN secured" onClick={submit} leading={<ShieldCheck size={17} />}>
            Continue
          </Button>
        ) : (
          <Button type="button" size="md" fullWidth variant="outline" onClick={() => setPhase('confirm')}>
            Continue
          </Button>
        )}

        {phase === 'confirm' && (
          <button
            type="button"
            onClick={() => {
              setDir(-1)
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
