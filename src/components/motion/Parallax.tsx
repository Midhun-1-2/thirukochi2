import { createContext, useContext, useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useReducedMotion, useRichMotion } from '@/hooks'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Parallax: pointer depth on desktop, gentle scroll depth on touch.
   Wrap a hero in <Parallax>; give layers a `depth` (0 = static).
------------------------------------------------------------------- */

interface ParallaxCtx {
  px: MotionValue<number>
  py: MotionValue<number>
  scroll: MotionValue<number>
  pointerMode: boolean
  disabled: boolean
}

const Ctx = createContext<ParallaxCtx | null>(null)

interface ParallaxProps {
  children: ReactNode
  className?: string
  /** max pointer displacement in px at depth 1 */
  strength?: number
}

export function Parallax({ children, className, strength = 18 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rich = useRichMotion()
  const reduced = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const px = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 })
  const py = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!rich || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    rawX.set(nx * strength * 2)
    rawY.set(ny * strength * 2)
  }
  const onPointerLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <Ctx.Provider value={{ px, py, scroll: scrollYProgress, pointerMode: rich, disabled: reduced }}>
      <div ref={ref} className={cn('relative', className)} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
        {children}
      </div>
    </Ctx.Provider>
  )
}

interface LayerProps {
  children: ReactNode
  depth?: number
  className?: string
  style?: React.CSSProperties
}

export function ParallaxLayer({ children, depth = 0.5, className, style }: LayerProps) {
  const ctx = useContext(Ctx)
  const empty = useMotionValue(0)
  const px = ctx?.px ?? empty
  const py = ctx?.py ?? empty
  const scroll = ctx?.scroll ?? empty
  const pointerMode = ctx?.pointerMode ?? false
  const disabled = ctx?.disabled ?? true

  const x = useTransform(px, (v) => (pointerMode && !disabled ? v * depth : 0))
  const yPointer = useTransform(py, (v) => (pointerMode && !disabled ? v * depth : 0))
  const yScroll = useTransform(scroll, [0, 1], [depth * 28, depth * -28])
  const y = useTransform([yPointer, yScroll], ([a, b]) => (disabled ? 0 : pointerMode ? (a as number) : (b as number)))

  return (
    <motion.div className={className} style={{ x, y, willChange: 'transform', ...style }}>
      {children}
    </motion.div>
  )
}
