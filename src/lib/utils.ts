/** Tiny className joiner — keeps components free of a runtime dependency. */
export function cn(...parts: unknown[]): string {
  return parts.filter((p): p is string => typeof p === 'string' && p.length > 0).join(' ')
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function randomDigits(length: number): string {
  let out = ''
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10)
  return out
}

/** Generate a captcha of the given length, avoiding ambiguous leading zeros. */
export function generateCaptcha(length = 4): string {
  const first = 1 + Math.floor(Math.random() * 9)
  return `${first}${randomDigits(length - 1)}`
}

export function isValidIndianMobile(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))
}

/* ---------- storage ---------- */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) — state stays in memory */
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* noop */
  }
}

/* ---------- environment ---------- */
export const isBrowser = typeof window !== 'undefined'

export function prefersFinePointer(): boolean {
  return isBrowser && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}
