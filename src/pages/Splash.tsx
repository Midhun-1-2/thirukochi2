import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Flourish } from '@/components/brand/JewelArt'
import { Logo } from '@/components/brand/Logo'
import { GoldParticles } from '@/components/motion/GoldParticles'
import { useAuth } from '@/context/AuthContext'
import { useReducedMotion } from '@/hooks'
import { ease, spring } from '@/lib/motion'

/* Brand splash — shown at "/" for a moment, then routes onward. */
export function Splash() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const reduced = useReducedMotion()

  useEffect(() => {
    const id = window.setTimeout(() => navigate(isAuthenticated ? '/home' : '/register', { replace: true }), reduced ? 400 : 1700)
    return () => window.clearTimeout(id)
  }, [navigate, isAuthenticated, reduced])

  return (
    <motion.div
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden maroon-surface grain px-6 text-center"
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <GoldParticles count={30} />
      <motion.div
        className="absolute h-[520px] w-[520px] rounded-full gold-glow"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 1.4, ease: ease.luxe }}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, ease: ease.luxe }}
        className="relative"
      >
        <Logo width={280} priority shine />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { ...spring.soft, delay: 0.5 } }}
        className="relative mt-8 flex flex-col items-center"
      >
        <Flourish className="w-32" />
        <p className="mt-4 font-display text-lg italic text-cream/85">Tradition meets tomorrow.</p>
      </motion.div>
    </motion.div>
  )
}
