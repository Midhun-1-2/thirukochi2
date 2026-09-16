import { Link } from 'react-router-dom'
import { DiamondArt } from '@/components/brand/JewelArt'
import { Logo } from '@/components/brand/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useDocumentTitle } from '@/hooks'

export function NotFound() {
  useDocumentTitle('Page not found')
  const { isAuthenticated } = useAuth()
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center maroon-surface grain px-6 text-center text-cream">
      <Logo width={180} priority />
      <div className="mt-10 h-32 w-32">
        <DiamondArt />
      </div>
      <p className="eyebrow mt-4 text-gold-light/80">404</p>
      <h1 className="mt-2 font-display text-3xl text-cream">This page has wandered off.</h1>
      <p className="mt-2 max-w-sm text-sm text-cream/70">The link may be old or mistyped. Let&apos;s take you somewhere golden.</p>
      <ButtonLink to={isAuthenticated ? '/home' : '/register'} size="lg" className="mt-8">
        {isAuthenticated ? 'Back to Home' : 'Get started'}
      </ButtonLink>
      {!isAuthenticated && (
        <Link to="/login" className="mt-4 text-sm text-gold-light underline-offset-4 hover:underline">
          Login instead
        </Link>
      )}
    </div>
  )
}
