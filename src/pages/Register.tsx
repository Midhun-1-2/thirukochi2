import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Phone, User } from 'lucide-react'
import { AuthCard } from '@/components/auth/AuthCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useDocumentTitle } from '@/hooks'
import { isValidIndianMobile } from '@/lib/utils'

export function Register() {
  useDocumentTitle('Register')
  const navigate = useNavigate()
  const { startRegistration } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean }>({})
  const [loading, setLoading] = useState(false)

  const nameError = touched.name && name.trim().length < 3 ? 'Please enter your full name.' : undefined
  const phoneError = touched.phone && !isValidIndianMobile(phone) ? 'Enter a valid 10-digit mobile number.' : undefined
  const valid = name.trim().length >= 3 && isValidIndianMobile(phone)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, phone: true })
    if (!valid) return
    setLoading(true)
    await startRegistration(name.trim(), phone)
    setLoading(false)
    toast('OTP sent', { description: 'Use 123456 to verify in this prototype.', tone: 'success' })
    navigate('/otp')
  }

  return (
    <AuthCard
      eyebrow="Registration"
      title={
        <>
          Welcome to <span className="italic font-normal">Thirukochi</span>
        </>
      }
      description="Your gold journey begins here."
      footer={
        <>
          By continuing, you agree to our{' '}
          <Link to="/profile" className="text-maroon underline-offset-4 hover:underline">
            Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link to="/profile" className="text-maroon underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
          <p className="mt-3">
            Already a member?{' '}
            <Link to="/login" className="font-medium text-maroon underline-offset-4 hover:underline">
              Login
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-3">
        <Input
          dense
          label="Full Name"
          name="name"
          autoComplete="name"
          icon={<User size={18} strokeWidth={1.8} />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          error={nameError}
          success={touched.name && !nameError && name.length > 0}
        />
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
          success={isValidIndianMobile(phone)}
          hint={!phoneError ? 'We will send a 6-digit OTP to this number.' : undefined}
        />
        <Button type="submit" size="md" fullWidth magnetic loading={loading} loadingText="Sending OTP" trailing={<ArrowRight size={17} />} className="!mt-4">
          Get OTP
        </Button>
      </form>
    </AuthCard>
  )
}
