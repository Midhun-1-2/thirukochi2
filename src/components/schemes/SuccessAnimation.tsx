import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks'
import { ease, spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Premium success sequence:
   1 backdrop settles · 2 gold disc appears · 3 rings expand
   4 checkmark draws · 5 gold motes drift · (message + summary
   are staged by the page around this component)
------------------------------------------------------------------- */

const MOTES = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2 + (i % 2 ? 0.2 : -0.15)
  const dist = 78 + (i % 3) * 16
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    size: 3 + (i % 3),
    delay: 1.05 + (i % 5) * 0.06,
  }
})

export function SuccessAnimation({ className, size = 168 }: { className?: string; size?: number }) {
  const reduced = useReducedMotion()
  const t = (d: number) => (reduced ? 0 : d)

  return (
    <div className={cn('relative flex items-center justify-center', className)} style={{ width: size, height: size }} role="img" aria-label="Success">
      {/* glow */}
      <motion.div
        className="absolute inset-[-40%] rounded-full gold-glow"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ delay: t(0.2), duration: 1.2, ease: ease.luxe }}
        aria-hidden="true"
      />
      {/* expanding rings */}
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-gold/70"
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: 1.35 + i * 0.28, opacity: [0, 0.7, 0] }}
          transition={{ delay: t(0.55 + i * 0.18), duration: 1.4, ease: ease.luxe }}
          aria-hidden="true"
        />
      ))}
      <motion.span
        className="absolute inset-[8%] rounded-full border border-gold-light/60"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: t(0.45), ...spring.gentle }}
        aria-hidden="true"
      />
      {/* gold disc */}
      <motion.div
        className="relative flex items-center justify-center rounded-full gold-surface shadow-gold"
        style={{ width: size * 0.62, height: size * 0.62 }}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: t(0.3), ...spring.snappy }}
      >
        <span className="absolute inset-[6px] rounded-full border border-white/40" aria-hidden="true" />
        <svg viewBox="0 0 48 48" className="h-1/2 w-1/2" fill="none" aria-hidden="true">
          <motion.path
            d="M12 25.5 L20.5 34 L37 15"
            stroke="#3a0000"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: t(0.7), duration: reduced ? 0 : 0.55, ease: ease.luxe }}
          />
        </svg>
      </motion.div>
      {/* gold motes */}
      {!reduced &&
        MOTES.map((m, i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full bg-gold-light"
            style={{ width: m.size, height: m.size, marginLeft: -m.size / 2, marginTop: -m.size / 2, boxShadow: '0 0 8px rgba(249,223,146,0.9)' }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
            animate={{ x: m.x, y: m.y - 14, opacity: [0, 1, 0], scale: [0.4, 1, 0.6] }}
            transition={{ delay: m.delay, duration: 1.7, ease: ease.luxe }}
            aria-hidden="true"
          />
        ))}
    </div>
  )
}
