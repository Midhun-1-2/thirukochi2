import { AuthContext } from '@/context/registry'
import { useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { authConfig, demoUser } from '@/data/mock'
import type { UserProfile } from '@/data/types'
import { readStorage, removeStorage, sleep, writeStorage } from '@/lib/utils'

/* ------------------------------------------------------------------
   Mock authentication. Replace the async methods with real endpoints;
   the context shape stays identical.
------------------------------------------------------------------- */

const STORAGE_KEY = 'tkgd2.auth.v1'

interface PersistedAuth {
  user: UserProfile | null
  pending: { name: string; phone: string; verified: boolean } | null
  /** Registered accounts (phone → { name, mpin }). Demo only. */
  accounts: Record<string, { name: string; mpin: string; referenceCode: string }>
}

interface AuthContextValue {
  user: UserProfile | null
  pending: PersistedAuth['pending']
  isAuthenticated: boolean
  startRegistration: (name: string, phone: string) => Promise<void>
  verifyOtp: (otp: string) => Promise<boolean>
  resendOtp: () => Promise<void>
  setMpin: (mpin: string) => Promise<void>
  login: (phone: string, mpin: string) => Promise<{ ok: true } | { ok: false; error: string }>
  logout: () => void
  updateProfile: (patch: Partial<UserProfile>) => void
}


function seedAccounts(): PersistedAuth['accounts'] {
  return {
    [demoUser.phone]: { name: demoUser.name, mpin: authConfig.demoMpin, referenceCode: demoUser.referenceCode },
  }
}

function makeReferenceCode(): string {
  return `TKGD${Math.floor(100 + Math.random() * 900)}`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedAuth>(() => {
    const stored = readStorage<PersistedAuth | null>(STORAGE_KEY, null)
    return stored ?? { user: null, pending: null, accounts: seedAccounts() }
  })

  const persist = useCallback((next: PersistedAuth) => {
    setState(next)
    writeStorage(STORAGE_KEY, next)
  }, [])

  const startRegistration = useCallback(
    async (name: string, phone: string) => {
      await sleep(authConfig.latencyMs)
      persist({ ...state, pending: { name, phone, verified: false } })
    },
    [persist, state],
  )

  const verifyOtp = useCallback(
    async (otp: string) => {
      await sleep(authConfig.latencyMs)
      // Showcase build: any code verifies. Restore `if (otp !== authConfig.otp) return false` for production.
      void otp
      persist({ ...state, pending: state.pending ? { ...state.pending, verified: true } : null })
      return true
    },
    [persist, state],
  )

  const resendOtp = useCallback(async () => {
    await sleep(500)
  }, [])

  const setMpin = useCallback(
    async (mpin: string) => {
      await sleep(authConfig.latencyMs)
      const pending = state.pending
      if (!pending) return
      const existing = state.accounts[pending.phone]
      persist({
        ...state,
        accounts: {
          ...state.accounts,
          [pending.phone]: {
            name: pending.name || existing?.name || 'Member',
            mpin,
            referenceCode: existing?.referenceCode ?? makeReferenceCode(),
          },
        },
        pending: null,
      })
    },
    [persist, state],
  )

  const login = useCallback(
    async (phone: string, mpin: string) => {
      await sleep(authConfig.latencyMs)
      // Showcase build: any phone + MPIN signs in. A number registered in this demo keeps its own
      // name; anything else walks in as the showcase member. Restore the MPIN check for production.
      void mpin
      const account = state.accounts[phone]
      const user: UserProfile = account
        ? {
            name: account.name,
            phone,
            referenceCode: account.referenceCode,
            memberSince: phone === demoUser.phone ? demoUser.memberSince : 'September 2026',
            email: phone === demoUser.phone ? demoUser.email : undefined,
          }
        : { ...demoUser, phone: phone || demoUser.phone }
      persist({ ...state, user })
      return { ok: true as const }
    },
    [persist, state],
  )

  const logout = useCallback(() => {
    const next = { ...state, user: null }
    persist(next)
    removeStorage('tkgd2.scheme.v1')
  }, [persist, state])

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      if (!state.user) return
      persist({ ...state, user: { ...state.user, ...patch } })
    },
    [persist, state],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      pending: state.pending,
      isAuthenticated: Boolean(state.user),
      startRegistration,
      verifyOtp,
      resendOtp,
      setMpin,
      login,
      logout,
      updateProfile,
    }),
    [state.user, state.pending, startRegistration, verifyOtp, resendOtp, setMpin, login, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext) as AuthContextValue | null
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
