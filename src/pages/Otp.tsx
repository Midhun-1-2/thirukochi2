import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Timer } from 'lucide-react'
import { AuthCard } from '@/components/auth/AuthCard'
import { Button } from '@/components/ui/Button'
import { OTPInput } from '@/components/ui/OTPInput'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useCountdown, useDocumentTitle } from '@/hooks'
import { authConfig } from '@/data/mock'
import { maskPhone, pad2 } from '@/lib/format'

export function Otp() {
  useDocumentTitle('Verify OTP')
  const navigate = useNavigate()
  const { pending, verifyOtp, resendOtp } = useAuth()
  const { toast } = useToast()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { remaining, done, restart } = useCountdown(authConfig.resendSeconds)

  const phone = pending?.phone ?? '9876543210'

  useEffect(() => {
    if (!pending) {
      // Reached directly — send the visitor to register first.
      navigate('/register', { replace: true })
    }
  }, [pending, navigate])

  const verify = async (value = otp) => {
    if (value.length !== authConfig.otpLength || loading) return
    setLoading(true)
    setError(null)
    const ok = await verifyOtp(value)
    setLoading(false)
    if (!ok) {
      setError('That code does not match. Please try again.')
      setOtp('')
      return
    }
    setSuccess(true)
    window.setTimeout(() => navigate('/mpin'), 650)
  }

  const resend = async () => {
    await resendOtp()
    restart()
    setOtp('')
    setError(null)
    toast('OTP re-sent', { description: `A fresh code was sent to ${maskPhone(phone)}.`, tone: 'info' })
  }

  return (
    <AuthCard
      eyebrow="Verification"
      title="Verify OTP"
      description={
        <>
          We&apos;ve sent a 6 digit OTP to
          <br />
          <span className="font-medium text-maroon tabular">{maskPhone(phone)}</span>
          <Link to="/register" className="ml-2 text-xs text-gold-deep underline-offset-4 hover:underline">
            Change
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <OTPInput value={otp} onChange={setOtp} onComplete={(v) => verify(v)} error={Boolean(error)} disabled={loading || success} />
        {error && (
          <p role="alert" className="-mt-2 text-center text-xs text-danger">
            {error}
          </p>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-ink-soft" aria-live="polite">
          <Timer size={15} className="text-gold-deep" aria-hidden="true" />
          {done ? (
            <span>Didn&apos;t receive the code?</span>
          ) : (
            <span>
              Resend in <span className="font-medium text-maroon tabular">00:{pad2(remaining)}</span>
            </span>
          )}
        </div>

        <Button type="button" size="lg" fullWidth magnetic loading={loading} success={success} successText="Verified" loadingText="Verifying" onClick={() => verify()} disabled={otp.length !== authConfig.otpLength} leading={<ShieldCheck size={17} />}>
          Verify
        </Button>

        <button
          type="button"
          onClick={resend}
          disabled={!done}
          className="mx-auto block text-sm font-medium text-maroon underline-offset-4 transition hover:underline disabled:cursor-not-allowed disabled:text-ink-mute disabled:no-underline"
        >
          Resend OTP
        </button>
      </div>
    </AuthCard>
  )
}
