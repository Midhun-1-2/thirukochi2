import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Delete } from 'lucide-react'
import { useReducedMotion } from '@/hooks'
import { ease, spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   MPIN entry — four gold coins and a big, familiar keypad.

   · Four coins across the top hold the digits. A pressed numeral
     flies from its key into the next coin, shows there for a moment
     (so the person can check it), then the coin flips to a masked
     maroon face.
   · A gold thread beneath the coins draws across as they fill.
   · The keypad is a plain 3×4 grid with large numerals and 44px keys;
     a key lights up whether pressed on screen or on a keyboard.
   · Four coins: the row bows in a wave and the thread sparkles.
   · Wrong MPIN: the coins shake, flash red and flip back to blank.

   There is no text field anywhere in this control, so a phone's
   on-screen keyboard never opens. Hardware keyboards still work
   without focusing anything: digits, Backspace and Enter are captured
   at document level while the control is mounted.
------------------------------------------------------------------- */

interface MPINInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  /** Enter key while a full MPIN is entered */
  onEnter?: () => void
  error?: boolean
  disabled?: boolean
  label?: string
  showKeypad?: boolean
  tone?: 'light' | 'dark'
  className?: string
  /** Rendered above the coins; slides when `transitionKey` changes */
  header?: ReactNode
  /** Changing this key slides the header + coins to the next phase */
  transitionKey?: string
  /** Slide direction when transitionKey changes: 1 forward, -1 back */
  direction?: 1 | -1
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] as const
const REVEAL_MS = 650

/* ---------- Coin ---------- */
function Coin({
  digit,
  revealed,
  active,
  error,
  order,
  complete,
  coinRef,
}: {
  digit: string | null
  revealed: boolean
  active: boolean
  error: boolean
  order: number
  complete: boolean
  coinRef: (el: HTMLDivElement | null) => void
}) {
  const reduced = useReducedMotion()
  const filled = digit !== null
  const masked = filled && !revealed
  return (
    <motion.div
      ref={coinRef}
      className="relative h-12 w-12 [perspective:600px]"
      animate={
        reduced
          ? undefined
          : complete && !error
            ? { y: [0, -8, 0], transition: { duration: 0.5, delay: order * 0.07, ease: ease.soft } }
            : { y: 0 }
      }
      aria-hidden="true"
    >
      {/* active halo */}
      {active && !filled && !reduced && (
        <motion.span
          className="absolute -inset-1 rounded-full border border-gold/60"
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.06, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: masked ? 180 : 0 }}
        transition={reduced ? { duration: 0 } : { ...spring.snappy, duration: 0.5 }}
      >
        {/* front: blank or the revealed digit */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-full border font-display text-[22px] leading-none [backface-visibility:hidden]',
            error ? 'border-danger/70 bg-danger-soft text-danger' : filled ? 'border-gold bg-gold-pale/60 text-maroon' : 'border-gold/50 bg-white text-maroon/30',
            active && !filled && !error && 'border-gold shadow-[0_0_0_4px_rgba(212,175,55,0.16)]',
          )}
        >
          {filled ? (
            <motion.span
              key={digit}
              initial={reduced ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: spring.snappy }}
            >
              {digit}
            </motion.span>
          ) : (
            <span className="block h-1.5 w-1.5 rounded-full bg-gold/50" />
          )}
        </div>
        {/* back: masked maroon face */}
        <div className="absolute inset-0 flex items-center justify-center rounded-full border border-gold-light/60 maroon-surface [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="absolute inset-[3px] rounded-full border border-gold-light/30" />
          <span className="block h-2.5 w-2.5 rotate-45 gold-surface shadow-[0_0_6px_rgba(249,223,146,0.8)]" />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Keypad ---------- */
function Keypad({
  onKey,
  onDelete,
  disabled,
  lit,
  keyRef,
}: {
  onKey: (d: string) => void
  onDelete: () => void
  disabled?: boolean
  lit: string | null
  keyRef: (k: string, el: HTMLButtonElement | null) => void
}) {
  const reduced = useReducedMotion()
  return (
    <div className="mx-auto grid w-full max-w-[276px] grid-cols-3 gap-1.5" role="group" aria-label="Numeric keypad">
      {KEYS.map((k, i) => {
        if (k === '') return <span key={`sp-${i}`} aria-hidden="true" />
        const isDel = k === 'del'
        const isLit = lit === k
        return (
          <motion.button
            key={k}
            ref={(el) => keyRef(k, el)}
            type="button"
            tabIndex={-1}
            disabled={disabled}
            aria-label={isDel ? 'Delete' : k}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => (isDel ? onDelete() : onKey(k))}
            whileTap={reduced ? undefined : { scale: 0.95 }}
            transition={spring.press}
            className={cn(
              'relative flex h-11 items-center justify-center rounded-2xl border font-display text-[22px] select-none',
              'transition-[background-color,border-color,box-shadow,color] duration-200',
              isLit
                ? 'border-gold gold-surface text-maroon-deep shadow-[0_6px_16px_-8px_rgba(179,135,28,0.7)]'
                : 'border-gold/25 bg-white text-maroon shadow-[0_2px_10px_-6px_rgba(84,0,0,0.25)] hover:border-gold/70 hover:bg-gold-pale/40',
              isDel && 'text-[18px]',
              disabled && 'opacity-50',
            )}
          >
            {isDel ? <Delete size={20} strokeWidth={1.8} aria-hidden="true" /> : k}
            {/* stamp ring on press */}
            {isLit && !reduced && (
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-gold"
                initial={{ opacity: 0.9, scale: 1 }}
                animate={{ opacity: 0, scale: 1.18 }}
                transition={{ duration: 0.45, ease: ease.soft }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

/* ---------- Input ---------- */
function isEditable(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable
}

const slide = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: spring.soft },
  exit: (dir: number) => ({ x: dir * -40, opacity: 0, transition: { duration: 0.18 } }),
}

interface Flight {
  id: number
  digit: string
  from: { x: number; y: number }
  to: { x: number; y: number }
}

export function MPINInput({
  length = 4,
  value,
  onChange,
  onComplete,
  onEnter,
  error,
  disabled,
  label = 'MPIN',
  showKeypad = true,
  className,
  header,
  transitionKey = 'mpin',
  direction = 1,
}: MPINInputProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const keyEls = useRef<Record<string, HTMLButtonElement | null>>({})
  const coinEls = useRef<(HTMLDivElement | null)[]>([])
  const reduced = useReducedMotion()

  const [lit, setLit] = useState<string | null>(null)
  const [revealed, setRevealed] = useState<number | null>(null)
  const [flight, setFlight] = useState<Flight | null>(null)
  const timers = useRef<number[]>([])

  // Latest props for the document-level key handler (no re-subscribe per keystroke).
  const latest = useRef({ value, length, disabled, onChange, onEnter })
  useEffect(() => {
    latest.current = { value, length, disabled, onChange, onEnter }
  })

  useEffect(() => {
    if (value.length === length) onComplete?.(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    const t = timers.current
    return () => t.forEach((id) => window.clearTimeout(id))
  }, [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  /** Light the key, fly the numeral to its coin, reveal it briefly, then mask. */
  const enter = (d: string, index: number) => {
    setLit(d)
    later(() => setLit((k) => (k === d ? null : k)), 180)
    const root = rootRef.current
    const from = keyEls.current[d]
    const to = coinEls.current[index]
    if (root && from && to && !reduced) {
      const r = root.getBoundingClientRect()
      const a = from.getBoundingClientRect()
      const b = to.getBoundingClientRect()
      setFlight({
        id: Date.now(),
        digit: d,
        from: { x: a.left + a.width / 2 - r.left, y: a.top + a.height / 2 - r.top },
        to: { x: b.left + b.width / 2 - r.left, y: b.top + b.height / 2 - r.top },
      })
    }
    setRevealed(index)
    later(() => setRevealed((i) => (i === index ? null : i)), REVEAL_MS)
  }

  const push = (d: string) => {
    if (disabled || value.length >= length) return
    enter(d, value.length)
    onChange(value + d)
  }
  const pop = () => {
    if (disabled) return
    setLit('del')
    later(() => setLit((k) => (k === 'del' ? null : k)), 180)
    onChange(value.slice(0, -1))
  }

  // Hardware keyboard: works whether or not anything is focused.
  const pushRef = useRef(push)
  const popRef = useRef(pop)
  useEffect(() => {
    pushRef.current = push
    popRef.current = pop
  })
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const { value: v, length: len, disabled: off, onEnter: enterKey } = latest.current
      if (off || e.metaKey || e.ctrlKey || e.altKey) return
      // let other fields on the page keep their keys
      if (isEditable(e.target)) return
      if (/^\d$/.test(e.key)) {
        e.preventDefault()
        pushRef.current(e.key)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        popRef.current()
      } else if (e.key === 'Enter') {
        if (v.length === len) {
          e.preventDefault()
          enterKey?.()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const complete = value.length === length
  const progress = value.length / length

  return (
    <div ref={rootRef} className={cn('relative flex flex-col items-center gap-2.5', className)}>
      {/* fixed height so the keypad never jumps while the coins slide between phases */}
      <div className="relative min-h-[94px] w-full overflow-hidden py-0.5">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={transitionKey}
            custom={direction}
            variants={reduced ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } } : slide}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center gap-2.5"
          >
            {header}
            {/* coins */}
            <motion.div
              className="flex items-center gap-3.5"
              animate={error && !reduced ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
              transition={{ duration: 0.42, ease: ease.soft }}
            >
              {Array.from({ length }, (_, i) => (
                <Coin
                  key={i}
                  order={i}
                  digit={i < value.length ? value[i] : null}
                  revealed={revealed === i}
                  active={i === value.length}
                  error={Boolean(error)}
                  complete={complete}
                  coinRef={(el) => {
                    coinEls.current[i] = el
                  }}
                />
              ))}
            </motion.div>
            {/* gold thread */}
            <div className="relative h-[3px] w-[212px] overflow-visible rounded-full bg-gold/20" aria-hidden="true">
              <motion.span
                className={cn('absolute inset-y-0 left-0 rounded-full', error ? 'bg-danger' : 'gold-surface')}
                initial={false}
                animate={{ width: `${progress * 100}%` }}
                transition={reduced ? { duration: 0 } : spring.snappy}
              />
              {complete && !error && !reduced && (
                <motion.span
                  className="absolute -top-[3px] h-[9px] w-[9px] rounded-full bg-gold-light shadow-[0_0_10px_3px_rgba(249,223,146,0.8)]"
                  initial={{ left: 0, opacity: 0 }}
                  animate={{ left: 'calc(100% - 9px)', opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.7, delay: 0.1, ease: ease.soft }}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="sr-only" aria-live="polite" aria-invalid={error || undefined}>
        {`${label}: ${value.length} of ${length} digits entered`}
      </p>

      {showKeypad && (
        <Keypad
          onKey={push}
          onDelete={pop}
          disabled={disabled}
          lit={lit}
          keyRef={(k, el) => {
            keyEls.current[k] = el
          }}
        />
      )}

      {/* numeral in flight from key to coin */}
      <AnimatePresence>
        {flight && (
          <motion.span
            key={flight.id}
            className="pointer-events-none absolute left-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full gold-surface font-display text-[22px] text-maroon-deep shadow-gold"
            initial={{ x: flight.from.x - 22, y: flight.from.y - 22, scale: 1, opacity: 1 }}
            animate={{ x: flight.to.x - 22, y: flight.to.y - 22, scale: 0.6, opacity: [1, 1, 0] }}
            transition={{ duration: 0.34, ease: ease.soft }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setFlight((f) => (f?.id === flight.id ? null : f))}
            aria-hidden="true"
          >
            {flight.digit}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
