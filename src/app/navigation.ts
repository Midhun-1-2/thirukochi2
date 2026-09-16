import { Activity, Home, Layers, User, Wallet, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  match?: string[]
}

export const primaryNav: NavItem[] = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/schemes', label: 'Schemes', icon: Layers, match: ['/schemes', '/join-scheme', '/success'] },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/profile', label: 'Profile', icon: User },
]

export const authSteps = [
  { path: '/register', label: 'Register' },
  { path: '/otp', label: 'Verify' },
  { path: '/mpin', label: 'Secure' },
  { path: '/login', label: 'Sign in' },
]

export function isNavActive(item: NavItem, pathname: string): boolean {
  const candidates = item.match ?? [item.to]
  return candidates.some((c) => pathname === c || pathname.startsWith(`${c}/`))
}

export const pageTitles: Record<string, string> = {
  '/home': 'Home',
  '/wallet': 'Referral Wallet',
  '/schemes': 'Schemes',
  '/join-scheme': 'Join Scheme',
  '/success': 'Scheme Joined',
  '/activity': 'Activity',
  '/profile': 'Profile',
}
