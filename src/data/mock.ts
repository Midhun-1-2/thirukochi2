import type {
  ActivityItem,
  GoldRateData,
  PaymentMethod,
  PromoBannerData,
  Scheme,
  SocialLink,
  UserProfile,
  WalletData,
} from './types'

/* ------------------------------------------------------------------
   DEMO DATA — prototype only. Values are indicative placeholders.
------------------------------------------------------------------- */

export const demoUser: UserProfile = {
  name: 'Anjali K',
  phone: '9876543210',
  referenceCode: 'TKGD123',
  memberSince: 'March 2026',
  email: 'anjali.k@example.com',
}

export const authConfig = {
  otp: '123456',
  otpLength: 6,
  mpinLength: 4,
  resendSeconds: 45,
  latencyMs: 900,
  demoMpin: '1234',
}

export const goldRates: GoldRateData = {
  date: '2026-09-14',
  updatedAt: '2026-09-14T09:30:00+05:30',
  live: true,
  rates: [
    {
      id: '1g-22k',
      label: '1G 22K',
      weightGrams: 1,
      purity: '22K',
      price: 14125,
      change: -30,
      history: [14040, 14065, 14110, 14090, 14150, 14170, 14155, 14135, 14160, 14180, 14150, 14125],
    },
    {
      id: '8g-22k',
      label: '8G 22K',
      weightGrams: 8,
      purity: '22K',
      price: 113000,
      change: -240,
      history: [112320, 112520, 112880, 112720, 113200, 113360, 113240, 113080, 113280, 113440, 113200, 113000],
    },
    {
      id: '1g-18k',
      label: '1G 18K',
      weightGrams: 1,
      purity: '18K',
      price: 10600,
      change: 18,
      history: [10480, 10505, 10530, 10520, 10560, 10585, 10570, 10555, 10575, 10590, 10580, 10600],
    },
  ],
}

export const schemes: Scheme[] = [
  {
    id: 'gold-savings',
    name: 'Gold Savings Scheme',
    tagline: 'Save today, secure tomorrow.',
    description:
      'A gentle monthly savings plan that grows into the jewellery you have always imagined. Contribute a fixed amount each month and redeem it against any gold purchase at Thirukochi.',
    category: 'gold-savings',
    art: 'ring',
    minAmount: 500,
    maxAmount: 100000,
    amountStep: 500,
    presetAmounts: [1000, 2500, 5000, 10000],
    tenures: [6, 12, 18, 24],
    defaultTenure: 12,
    benefits: ['Flexible tenure', 'Safe & secure', 'Easy monthly contributions', 'Trusted jewellery brand'],
    highlight: 'Most popular',
  },
  {
    id: 'diamond-plus',
    name: 'Diamond Plus Scheme',
    tagline: 'For a brighter tomorrow.',
    description:
      'Designed for diamond jewellery lovers. Build towards a certified diamond piece with monthly contributions and priority access to new collections.',
    category: 'gold-savings',
    art: 'diamond',
    minAmount: 2000,
    maxAmount: 200000,
    amountStep: 500,
    presetAmounts: [2500, 5000, 10000, 25000],
    tenures: [12, 18, 24],
    defaultTenure: 18,
    benefits: ['Priority collection previews', 'Certified diamonds', 'Flexible tenure', 'Trusted jewellery brand'],
    highlight: 'New',
  },
  {
    id: 'premium-gold',
    name: 'Premium Gold Scheme',
    tagline: 'Build your wealth.',
    description:
      'A fixed-tenure plan for those who prefer to set aside a larger sum towards a treasured heirloom purchase.',
    category: 'fixed-deposit',
    art: 'necklace',
    minAmount: 10000,
    maxAmount: 500000,
    amountStep: 1000,
    presetAmounts: [10000, 20000, 50000, 100000],
    tenures: [12, 24, 36],
    defaultTenure: 24,
    benefits: ['Fixed tenure', 'Safe & secure', 'Dedicated relationship manager', 'Trusted jewellery brand'],
  },
]

export const paymentMethods: PaymentMethod[] = [
  { id: 'upi', label: 'UPI', description: 'Pay instantly with any UPI app', icon: 'upi' },
  { id: 'netbanking', label: 'Net Banking', description: 'All major Indian banks supported', icon: 'bank' },
  { id: 'card', label: 'Debit Card', description: 'Visa, Mastercard, RuPay', icon: 'card' },
  { id: 'autodebit', label: 'Auto-debit', description: 'Standing instruction on your bank account', icon: 'auto' },
]

export const defaultSelection = {
  schemeId: 'gold-savings',
  amount: 5000,
  tenure: 12,
  paymentMethodId: 'upi',
} as const

/** Referral wallet — every friend who joins a scheme with your code earns you a bonus. */
export const wallet: WalletData = {
  balance: 750,
  pending: 250,
  lifetime: 1250,
  bonusPerReferral: 250,
  referrals: [
    { id: 'r1', friendName: 'Sabu Thomas', schemeName: 'Gold Savings Scheme', date: '2026-09-10T11:20:00+05:30', amount: 250, status: 'pending' },
    { id: 'r2', friendName: 'Divya Nair', schemeName: 'Diamond Plus Scheme', date: '2026-08-18T16:05:00+05:30', amount: 250, status: 'credited' },
    { id: 'r3', friendName: 'Arjun Menon', schemeName: 'Gold Savings Scheme', date: '2026-07-02T09:40:00+05:30', amount: 250, status: 'credited' },
    { id: 'r4', friendName: 'Bonus redeemed', schemeName: 'Applied to Jun instalment', date: '2026-06-05T09:00:00+05:30', amount: -500, status: 'redeemed' },
    { id: 'r5', friendName: 'Meera Pillai', schemeName: 'Premium Gold Scheme', date: '2026-05-12T14:10:00+05:30', amount: 250, status: 'credited' },
    { id: 'r6', friendName: 'Rahul Krishnan', schemeName: 'Gold Savings Scheme', date: '2026-04-03T10:30:00+05:30', amount: 250, status: 'credited' },
  ],
}

export const activity: ActivityItem[] = [
  {
    id: 'a1',
    category: 'payments',
    title: 'Scheme Payment Received',
    description: 'Gold Savings Scheme · Instalment 6 of 12',
    date: '2026-09-14T09:30:00+05:30',
    status: 'completed',
    amount: 5000,
    unread: true,
  },
  {
    id: 'a2',
    category: 'rate',
    title: 'Gold Rate Updated',
    description: '1g (22K) · ₹14,125.00',
    date: '2026-09-12T09:00:00+05:30',
    status: 'info',
    unread: true,
  },
  {
    id: 'a3',
    category: 'schemes',
    title: 'New Scheme Launched',
    description: 'Diamond Plus Scheme is now open for enrolment.',
    date: '2026-09-10T11:15:00+05:30',
    status: 'new',
  },
  {
    id: 'a4',
    category: 'payments',
    title: 'Reminder',
    description: 'Monthly instalment due · Gold Savings Scheme',
    date: '2026-09-05T08:00:00+05:30',
    status: 'due',
    amount: 5000,
  },
  {
    id: 'a5',
    category: 'rate',
    title: 'Gold Rate Updated',
    description: '1g (22K) · ₹14,155.00',
    date: '2026-09-02T09:00:00+05:30',
    status: 'info',
  },
  {
    id: 'a6',
    category: 'schemes',
    title: 'Scheme Joined',
    description: 'Welcome to the Gold Savings Scheme.',
    date: '2026-03-18T14:20:00+05:30',
    status: 'completed',
  },
]

export const promo: PromoBannerData = {
  id: 'p1',
  eyebrow: 'The Heritage Edit',
  title: 'Celebrate Every Moment With Gold',
  subtitle: 'Heirloom craftsmanship for the days you will always remember.',
  cta: 'Explore Now',
  href: '/schemes',
}

export const social: SocialLink[] = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
]

export function getScheme(id: string | undefined): Scheme | undefined {
  return schemes.find((s) => s.id === id)
}

export function getPaymentMethod(id: string | undefined): PaymentMethod | undefined {
  return paymentMethods.find((p) => p.id === id)
}
