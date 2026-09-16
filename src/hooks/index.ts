import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

/* ---------- media queries ---------- */
function subscribeMedia(query: string, cb: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', cb)
  return () => mql.removeEventListener('change', cb)
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => subscribeMedia(query, cb),
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** true on devices with a mouse/trackpad — hover + pointer effects are enabled. */
export function useFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px)')
}

/** Reduced-motion preference (respects OS setting). */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false
}

/** Rich motion = fine pointer + no reduced-motion preference. */
export function useRichMotion(): boolean {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  return fine && !reduced
}

/* ---------- countdown ---------- */
export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running || remaining <= 0) return
    const id = window.setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => window.clearInterval(id)
  }, [running, remaining])

  const restart = useCallback(() => {
    setRemaining(seconds)
    setRunning(true)
  }, [seconds])

  return { remaining, done: remaining <= 0, restart }
}

/* ---------- clipboard ---------- */
export function useCopyToClipboard(resetMs = 1800) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), resetMs)
      return true
    },
    [resetMs],
  )

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current)
  }, [])

  return { copied, copy }
}

/* ---------- mock query (simulated network) ---------- */
export type QueryState<T> =
  | { status: 'loading'; data?: undefined; error?: undefined }
  | { status: 'error'; data?: undefined; error: string }
  | { status: 'success'; data: T; error?: undefined }

interface MockQueryOptions {
  /** Force the error state (e.g. `?demo=error`). */
  fail?: boolean
}

/**
 * Mock data is local, so it resolves in the same render — no skeleton
 * between pages, only the route transition. The `loading` state stays in
 * the union so screens keep their skeletons for when a real API lands.
 */
export function useMockQuery<T>(loader: () => T, deps: unknown[], opts: MockQueryOptions = {}) {
  const { fail = false } = opts
  const [attempt, setAttempt] = useState(0)
  const depsKey = JSON.stringify(deps)

  const state = useMemo<QueryState<T>>(
    () => (fail && attempt === 0 ? { status: 'error', error: 'Something went wrong' } : { status: 'success', data: loader() }),
    // the caller's deps array (as depsKey) decides when to re-run the loader, not the loader's identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [attempt, depsKey, fail],
  )
  const retry = useCallback(() => setAttempt((a) => a + 1), [])
  return { ...state, retry }
}

/* ---------- misc ---------- */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const body = document.body
    const prev = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
    // keep the page from jumping sideways when the desktop scrollbar disappears
    const gutter = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gutter > 0) body.style.paddingRight = `${gutter}px`
    return () => {
      body.style.overflow = prev.overflow
      body.style.paddingRight = prev.paddingRight
    }
  }, [locked])
}

export function useDemoFlag(name: string): boolean {
  const [flag] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('demo') === name
    } catch {
      return false
    }
  })
  return flag
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title
    document.title = `${title} · Thirukochi Gold & Diamonds`
    return () => {
      document.title = prev
    }
  }, [title])
}

/* ---------- fit-to-viewport (no-scroll screens) ---------- */
/**
 * Measures a block's natural height and returns the scale needed to fit
 * the viewport height. Ignores resizes while a field is focused so the
 * on-screen keyboard does not shrink the page mid-typing.
 */
export function useFitToViewport(padding = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ scale: 1, height: 0 })

  // Layout effect so the first paint is already scaled — no unscaled flash.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const apply = () => {
      const active = document.activeElement
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return
      const natural = el.offsetHeight
      const available = window.innerHeight - padding
      const scale = natural > 0 ? Math.min(1, available / natural) : 1
      setFit((prev) => (Math.abs(prev.scale - scale) < 0.005 && prev.height === natural ? prev : { scale, height: natural }))
    }
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(apply)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    apply()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [padding])

  return { ref, scale: fit.scale, scaledHeight: fit.height * fit.scale }
}
