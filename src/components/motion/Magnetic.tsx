import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRichMotion } from '@/hooks'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Magnetic wrapper: the child drifts a few px towards the pointer.
   Desktop-only (fine pointer, no reduced motion) — no-op on touch.
------------------------------------------------------------------- */

interface MagneticProps {
  children: ReactNode
  className?: string
  /** displacement strength (0–1) */
  strength?: number
  /** activation radius in px beyond the element bounds */
  radius?: number
}

export function Magnetic({ children, className, strength = 0.25, radius = 40 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rich = useRichMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  if (!rich) return <div className={className}>{children}</div>

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const maxX = rect.width / 2 + radius
    const maxY = rect.height / 2 + radius
    if (Math.abs(dx) > maxX || Math.abs(dy) > maxY) {
      x.set(0)
      y.set(0)
      return
    }
    x.set(dx * strength)
    y.set(dy * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x: sx, y: sy }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}
