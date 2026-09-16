/* ------------------------------------------------------------------
   Domain contracts. Components depend only on these shapes so that a
   real API can replace the mocks without touching the UI.
------------------------------------------------------------------- */

export type Purity = '24K' | '22K' | '18K'

export interface GoldRate {
  id: string
  label: string // "1G 22K"
  weightGrams: number
  purity: Purity
  price: number // INR
  change: number // INR delta vs previous update
  history: number[]
}

export interface GoldRateData {
  date: string // ISO date
  updatedAt: string
  live: boolean
  rates: GoldRate[]
}

export type SchemeCategory = 'gold-savings' | 'fixed-deposit'
export type SchemeArt = 'ring' | 'diamond' | 'necklace'

export interface Scheme {
  id: string
  name: string
  tagline: string
  description: string
  category: SchemeCategory
  art: SchemeArt
  minAmount: number
  maxAmount: number
  amountStep: number
  presetAmounts: number[]
  /** Fixed plan length in months. */
  tenure: number
  benefits: string[]
  highlight?: string
}

export interface PaymentMethod {
  id: string
  label: string
  description: string
  icon: 'upi' | 'bank' | 'card' | 'auto'
}

export interface SchemeSelection {
  schemeId: string
  amount: number
  paymentMethodId: string
}

export interface JoinedScheme extends SchemeSelection {
  id: string
  joinedAt: string
  referenceNo: string
}

export type ActivityCategory = 'payments' | 'schemes' | 'rate'
export type ActivityStatus = 'completed' | 'info' | 'due' | 'new'

export interface ActivityItem {
  id: string
  category: ActivityCategory
  title: string
  description: string
  date: string // ISO
  status: ActivityStatus
  amount?: number
  unread?: boolean
}

export type ReferralStatus = 'credited' | 'pending' | 'redeemed'

export interface ReferralCredit {
  id: string
  friendName: string
  schemeName: string
  date: string // ISO — joined / credited
  amount: number // INR, positive for credits, negative for redemptions
  status: ReferralStatus
}

export interface WalletData {
  /** referral bonus available to redeem (INR) */
  balance: number
  /** credits awaiting the friend's first instalment */
  pending: number
  /** lifetime referral earnings */
  lifetime: number
  /** bonus per successful referral */
  bonusPerReferral: number
  referrals: ReferralCredit[]
}

export interface PromoBannerData {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  cta: string
  href: string
}

export interface SocialLink {
  id: 'instagram' | 'facebook' | 'youtube'
  label: string
  href: string
}

export interface UserProfile {
  name: string
  phone: string // 10 digits
  referenceCode: string
  memberSince: string
  email?: string
}
