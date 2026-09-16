import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, type Variants } from 'framer-motion'
import { useReducedMotion, useRichMotion } from '@/hooks'
import { ease, spring, viewportOnce } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Signature motion pieces that give the product its own voice:
   · RollingNumber — odometer digits that roll on mount and on change
   · SplitText     — words rise out of a mask, staggered
   · Tilt          — pointer-tracked 3D tilt with a gold glare
------------------------------------------------------------------- */

/* ---------- RollingNumber ---------- */
interface RollingNumberProps {
  value: number
  format?: (n: number) => string
  className?: string
  /** stagger per character on mount */
  stagger?: number
  delay?: number
}

function RollingChar({ ch, index, stagger, delay, reduced }: { ch: string; index: number; stagger: number; delay: number; reduced: boolean }) {
  const isDigit = /\d/.test(ch)
  return (
    <span className="relative inline-block overflow-hidden align-baseline" style={{ height: '1.05em', lineHeight: '1.05em' }}>
      <AnimatePresence mode="popLayout" initial={!reduced}>
        <motion.span
          key={ch}
          initial={reduced ? false : { y: '110%', opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)', transition: { ...spring.snappy, delay: isDigit ? delay + index * stagger : 0 } }}
          exit={{ y: '-110%', opacity: 0, filter: 'blur(4px)', transition: { duration: 0.22, ease: ease.soft } }}
          className="inline-block"
        >
          {ch}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function RollingNumber({ value, format = (n) => n.toString(), className, stagger = 0.045, delay = 0.1 }: RollingNumberProps) {
  const reduced = useReducedMotion()
  const text = format(value)
  return (
    <span className={cn('inline-flex tabular', className)} aria-label={text} role="text">
      {text.split('').map((ch, i) => (
        <RollingChar key={i} ch={ch} index={i} stagger={stagger} delay={delay} reduced={reduced} />
      ))}
    </span>
  )
}

/* ---------- SplitText ---------- */
type Word = string | { text: string; className?: string }

interface SplitTextProps {
  words: Word[]
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  delay?: number
  stagger?: number
  inView?: boolean
  /** insert a line break after this word index */
  breakAfter?: number
}

const wordVariants: Variants = {
  hidden: { y: '110%', rotate: 2, opacity: 0 },
  visible: { y: 0, rotate: 0, opacity: 1, transition: { duration: 0.7, ease: ease.luxe } },
}

export function SplitText({ words, as: Tag = 'h1', className, delay = 0.05, stagger = 0.08, inView = false, breakAfter }: SplitTextProps) {
  const reduced = useReducedMotion()
  const MotionTag = motion[Tag]
  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate={inView ? undefined : 'visible'}
      whileInView={inView ? 'visible' : undefined}
      viewport={inView ? viewportOnce : undefined}
      variants={{ visible: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : delay } } }}
      aria-label={words.map((w) => (typeof w === 'string' ? w : w.text)).join(' ')}
    >
      {words.map((w, i) => {
        const text = typeof w === 'string' ? w : w.text
        const cls = typeof w === 'string' ? undefined : w.className
        return (
          <span key={i} aria-hidden="true">
            <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
              <motion.span variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : wordVariants} className={cn('inline-block origin-bottom-left', cls)}>
                {text}
              </motion.span>
            </span>
            {breakAfter === i ? <br /> : ' '}
          </span>
        )
      })}
    </MotionTag>
  )
}

/* ---------- Tilt ---------- */
interface TiltProps {
  children: ReactNode
  className?: string
  max?: number
  glare?: boolean
  style?: CSSProperties
}

export function Tilt({ children, className, max = 6, glare = true, style }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rich = useRichMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const srx = useSpring(rx, { stiffness: 180, damping: 20, mass: 0.5 })
  const sry = useSpring(ry, { stiffness: 180, damping: 20, mass: 0.5 })
  const glareBg = useMotionTemplate`radial-gradient(360px circle at ${gx}% ${gy}%, rgba(249,223,146,0.22), transparent 60%)`

  if (!rich) return <div className={className} style={style}>{children}</div>

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2)
    rx.set((0.5 - py) * max * 2)
    gx.set(px * 100)
    gy.set(py * 100)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d', perspective: 900, ...style }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 [.group:hover_&]:opacity-100"
          style={{ background: glareBg }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  )
}

/* ---------- WipeReveal ---------- */
/**
 * Content is unveiled left-to-right behind a travelling gold hairline —
 * a light passing over a display case rather than a fade.
 */
interface WipeRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  inView?: boolean
  /** 'x' sweeps left→right, 'y' top→bottom */
  axis?: 'x' | 'y'
}

export function WipeReveal({ children, className, delay = 0, duration = 0.9, inView = false, axis = 'x' }: WipeRevealProps) {
  const reduced = useReducedMotion()
  const clipFrom = axis === 'x' ? 'inset(0 100% 0 0)' : 'inset(0 0 100% 0)'
  const clipTo = 'inset(0 0% 0 0)'
  const variants: Variants = reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: { clipPath: clipFrom, opacity: 1 },
        visible: { clipPath: clipTo, transition: { duration, delay, ease: ease.luxe } },
      }
  const lineVariants: Variants =
    axis === 'x'
      ? { hidden: { left: '0%', opacity: 0 }, visible: { left: ['0%', '100%'], opacity: [0, 1, 1, 0], transition: { duration, delay, ease: ease.luxe } } }
      : { hidden: { top: '0%', opacity: 0 }, visible: { top: ['0%', '100%'], opacity: [0, 1, 1, 0], transition: { duration, delay, ease: ease.luxe } } }
  return (
    <motion.div
      className={cn('relative min-w-0', className)}
      initial="hidden"
      animate={inView ? undefined : 'visible'}
      whileInView={inView ? 'visible' : undefined}
      viewport={inView ? viewportOnce : undefined}
    >
      <motion.div className="min-w-0" variants={variants} style={{ willChange: 'clip-path' }}>
        {children}
      </motion.div>
      {!reduced && (
        <motion.span
          aria-hidden="true"
          variants={lineVariants}
          className={cn(
            'pointer-events-none absolute z-20 bg-gradient-to-b from-transparent via-gold-light to-transparent',
            axis === 'x' ? 'top-0 h-full w-px' : 'left-0 h-px w-full bg-gradient-to-r',
          )}
          style={{ boxShadow: '0 0 12px 1px rgba(249,223,146,0.55)' }}
        />
      )}
    </motion.div>
  )
}

/* ---------- DrawnArt ---------- */
/**
 * Makes any inline SVG artwork draw itself: strokes trace in, fills bloom after.
 */
export function DrawnArt({ children, className, delay = 0.3, duration = 1.6, stagger = 0.06 }: { children: ReactNode; className?: string; delay?: number; duration?: number; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const host = ref.current
    if (!host) return
    const shapes = host.querySelectorAll<SVGGeometryElement>('path, ellipse, circle, polygon, polyline, line')
    const anims: Animation[] = []
    let i = 0
    shapes.forEach((el) => {
      const stroke = el.getAttribute('stroke')
      const fill = el.getAttribute('fill')
      const hasStroke = stroke && stroke !== 'none'
      const hasFill = fill && fill !== 'none'
      if (hasStroke) {
        el.setAttribute('pathLength', '1')
        el.style.strokeDasharray = '1'
        el.style.strokeDashoffset = '1'
        anims.push(
          el.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
            duration: duration * 1000,
            delay: (delay + i * stagger) * 1000,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards',
          }),
        )
        i += 1
      }
      if (hasFill && !hasStroke) {
        const target = el.getAttribute('opacity') ?? '1'
        el.style.opacity = '0'
        anims.push(
          el.animate([{ opacity: 0 }, { opacity: target }], {
            duration: 700,
            delay: (delay + duration * 0.7) * 1000,
            easing: 'ease-out',
            fill: 'forwards',
          }),
        )
      }
    })
    return () => anims.forEach((a) => a.cancel())
  }, [reduced, delay, duration, stagger])
  return (
    <div ref={ref} className={cn('h-full w-full', className)}>
      {children}
    </div>
  )
}

/* ---------- TypeIn ---------- */
/** Characters appear one by one behind a gold caret, then the caret leaves. */
export function TypeIn({ text, className, delay = 0.4, speed = 0.07 }: { text: string; className?: string; delay?: number; speed?: number }) {
  const reduced = useReducedMotion()
  const chars = text.split('')
  const total = delay + chars.length * speed
  return (
    <span className={cn('inline-flex items-baseline', className)} aria-label={text} role="text">
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : delay + i * speed, duration: 0.05 }}
        >
          {c}
        </motion.span>
      ))}
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] bg-gold"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0, 1, 0, 1, 0] }}
          transition={{ delay, duration: total - delay + 0.9, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
          style={{ animationFillMode: 'forwards' }}
        />
      )}
    </span>
  )
}
