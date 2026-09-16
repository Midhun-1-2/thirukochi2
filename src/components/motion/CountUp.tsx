import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { useReducedMotion } from '@/hooks'
import { ease } from '@/lib/motion'

/* ------------------------------------------------------------------
   Animated number: counts from 0 (or the previous value) to `value`
   once in view, then stops exactly on the real value.
------------------------------------------------------------------- */

interface CountUpProps {
  value: number
  format?: (n: number) => string
  duration?: number
  delay?: number
  className?: string
  /** re-run when `value` changes (default true) */
  live?: boolean
}

export function CountUp({ value, format = (n) => n.toString(), duration = 1.1, delay = 0, className, live = true }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(() => format(reduced ? value : 0))
  const previous = useRef(0)
  const formatRef = useRef(format)

  useEffect(() => {
    formatRef.current = format
  })

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setDisplay(formatRef.current(value))
      previous.current = value
      return
    }
    const from = live ? previous.current : 0
    const controls = animate(from, value, {
      duration,
      delay,
      ease: ease.luxe,
      onUpdate: (v) => setDisplay(formatRef.current(v)),
      onComplete: () => {
        setDisplay(formatRef.current(value))
        previous.current = value
      },
    })
    return () => controls.stop()
  }, [inView, value, duration, delay, reduced, live])

  return (
    <span ref={ref} className={className} aria-label={format(value)}>
      {display}
    </span>
  )
}
