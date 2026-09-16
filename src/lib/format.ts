/* Indian locale formatting helpers. */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const inrWholeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** ₹1,76,543.00 */
export function formatINR(value: number, opts: { decimals?: boolean } = {}): string {
  const { decimals = true } = opts
  return (decimals ? inrFormatter : inrWholeFormatter).format(value)
}

/** 1,76,543.00 (no symbol) */
export function formatNumberIN(value: number, fractionDigits = 2): string {
  if (fractionDigits === 2) return numberFormatter.format(value)
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

/** 12.45 g */
export function formatGrams(value: number, digits = 2): string {
  return `${value.toFixed(digits)} g`
}

/** +91 98765 43210 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(-10)
  if (digits.length !== 10) return raw
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
}

/** +91 XXXXX 43210 */
export function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(-10)
  if (digits.length !== 10) return raw
  return `+91 ${digits.slice(0, 2)}XXX ${digits.slice(5)}`
}

/** 14 Sep 2026 */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** 14 Sep 2026, 09:30 AM */
export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return `${formatDate(iso)}, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
}

export function greetingForHour(hour = new Date().getHours()): string {
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

export function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}
