import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import { AuthCard } from '@/components/auth/AuthCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useDocumentTitle } from '@/hooks'
import { isValidIndianMobile } from '@/lib/utils'

/* Forgot MPIN: re-verify the number by OTP, then set a new MPIN. */
export function ForgotMpin() {
  useDocumentTitle('Reset MPIN')
  const navigate = useNavigate()
  const { startRegistration } = useAuth()
  const { toast } = useToast()
  const [phone, setPhone] = useState('')
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const error = touched && !isValidIndianMobile(phone) ? 'Enter a valid 10-digit mobile number.' : undefined

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!isValidIndianMobile(phone)) return
    setLoading(true)
    await startRegistration('', phone)
    setLoading(false)
    toast('OTP sent', { description: 'Verify to set a new MPIN. Use 123456 in this prototype.', tone: 'success' })
    navigate('/otp')
  }

  return (
    <AuthCard
      eyebrow="Account Recovery"
      title="Reset MPIN"
      description="Enter your registered mobile number and we will send an OTP to verify it is you."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-medium text-maroon underline-offset-4 hover:underline">
            Back to login
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
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
          onBlur={() => setTouched(true)}
          error={error}
          success={isValidIndianMobile(phone)}
        />
        <Button type="submit" size="md" fullWidth magnetic loading={loading} loadingText="Sending OTP" trailing={<ArrowRight size={17} />}>
          Send OTP
        </Button>
      </form>
    </AuthCard>
  )
}
