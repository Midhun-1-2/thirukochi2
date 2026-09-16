import { SchemeContext } from '@/context/registry'
import { useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { defaultSelection, getScheme } from '@/data/mock'
import type { JoinedScheme, SchemeSelection } from '@/data/types'
import { readStorage, sleep, writeStorage } from '@/lib/utils'

/* ------------------------------------------------------------------
   Scheme enrolment flow: a draft selection edited through the
   stepper, and a list of joined schemes once confirmed.
------------------------------------------------------------------- */

const STORAGE_KEY = 'tkgd2.scheme.v1'

interface Persisted {
  draft: SchemeSelection
  joined: JoinedScheme[]
  lastJoinedId: string | null
}

interface SchemeContextValue {
  draft: SchemeSelection
  joined: JoinedScheme[]
  lastJoined: JoinedScheme | null
  updateDraft: (patch: Partial<SchemeSelection>) => void
  resetDraft: (schemeId?: string) => void
  confirmDraft: () => Promise<JoinedScheme>
}


export function SchemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(() =>
    readStorage<Persisted>(STORAGE_KEY, { draft: { ...defaultSelection }, joined: [], lastJoinedId: null }),
  )

  const persist = useCallback((next: Persisted) => {
    setState(next)
    writeStorage(STORAGE_KEY, next)
  }, [])

  const updateDraft = useCallback(
    (patch: Partial<SchemeSelection>) => {
      persist({ ...state, draft: { ...state.draft, ...patch } })
    },
    [persist, state],
  )

  const resetDraft = useCallback(
    (schemeId?: string) => {
      const scheme = getScheme(schemeId) ?? getScheme(defaultSelection.schemeId)!
      persist({
        ...state,
        draft: {
          schemeId: scheme.id,
          amount: scheme.presetAmounts.includes(defaultSelection.amount) ? defaultSelection.amount : scheme.presetAmounts[1] ?? scheme.minAmount,
          tenure: scheme.defaultTenure,
          paymentMethodId: defaultSelection.paymentMethodId,
        },
      })
    },
    [persist, state],
  )

  const confirmDraft = useCallback(async () => {
    await sleep(1100)
    const joined: JoinedScheme = {
      ...state.draft,
      id: `js-${Date.now()}`,
      joinedAt: new Date().toISOString(),
      referenceNo: `TKGD-SCH-${Math.floor(100000 + Math.random() * 900000)}`,
    }
    persist({ ...state, joined: [joined, ...state.joined], lastJoinedId: joined.id })
    return joined
  }, [persist, state])

  const value = useMemo<SchemeContextValue>(
    () => ({
      draft: state.draft,
      joined: state.joined,
      lastJoined: state.joined.find((j) => j.id === state.lastJoinedId) ?? null,
      updateDraft,
      resetDraft,
      confirmDraft,
    }),
    [state, updateDraft, resetDraft, confirmDraft],
  )

  return <SchemeContext.Provider value={value}>{children}</SchemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSchemes(): SchemeContextValue {
  const ctx = useContext(SchemeContext) as SchemeContextValue | null
  if (!ctx) throw new Error('useSchemes must be used within SchemeProvider')
  return ctx
}
