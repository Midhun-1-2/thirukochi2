import { useEffect, useRef } from 'react'
import { useFinePointer, useReducedMotion } from '@/hooks'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Lightweight canvas particle field — a handful of soft gold motes
   that drift, rotate and fade. Pointer-reactive on desktop, paused
   when off-screen or the tab is hidden, disabled for reduced motion.
------------------------------------------------------------------- */

interface Particle {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  a: number // alpha
  da: number // alpha drift
  rot: number
  vr: number
  shape: 0 | 1 // 0 = dot, 1 = tiny diamond
}

interface GoldParticlesProps {
  count?: number
  className?: string
  /** 0..1 overall opacity */
  opacity?: number
}

export function GoldParticles({ count = 28, className, opacity = 0.9 }: GoldParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let running = false
    let visible = true
    let particles: Particle[] = []
    const pointer = { x: -9999, y: -9999, active: false }
    const total = fine ? count : Math.round(count * 0.6)

    const rand = (min: number, max: number) => min + Math.random() * (max - min)

    const spawn = (): Particle => ({
      x: rand(0, width),
      y: rand(0, height),
      r: rand(0.8, 2.4),
      vx: rand(-0.08, 0.08),
      vy: rand(-0.14, -0.03),
      a: rand(0.15, 0.7),
      da: rand(-0.003, 0.003),
      rot: rand(0, Math.PI),
      vr: rand(-0.01, 0.01),
      shape: Math.random() > 0.72 ? 1 : 0,
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = Array.from({ length: total }, spawn)
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        // gentle pointer attraction/repulsion
        if (pointer.active) {
          const dx = pointer.x - p.x
          const dy = pointer.y - p.y
          const dist2 = dx * dx + dy * dy
          if (dist2 < 160 * 160) {
            const f = (1 - Math.sqrt(dist2) / 160) * 0.012
            p.vx -= dx * f * 0.02
            p.vy -= dy * f * 0.02
          }
        }
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.995
        p.vy = p.vy * 0.995 - 0.0005
        p.rot += p.vr
        p.a += p.da
        if (p.a < 0.08 || p.a > 0.75) p.da *= -1

        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          Object.assign(p, spawn(), { y: height + 6, x: rand(0, width) })
        }

        ctx.save()
        ctx.globalAlpha = p.a * opacity
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r * 3)
        grad.addColorStop(0, 'rgba(249, 223, 146, 0.95)')
        grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.5)')
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)')
        ctx.fillStyle = grad
        if (p.shape === 1) {
          ctx.beginPath()
          ctx.moveTo(0, -p.r * 2.2)
          ctx.lineTo(p.r * 1.3, 0)
          ctx.lineTo(0, p.r * 2.2)
          ctx.lineTo(-p.r * 1.3, 0)
          ctx.closePath()
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.r * 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = 'rgba(255, 250, 230, 0.9)'
          ctx.beginPath()
          ctx.arc(0, 0, p.r * 0.7, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
    }

    const loop = () => {
      if (!running) return
      draw()
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running || !visible || document.hidden) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onVisibility = () => (document.hidden ? stop() : start())
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0.05 },
    )

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    io.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)
    const host = canvas.parentElement ?? canvas
    if (fine) {
      host.addEventListener('pointermove', onMove, { passive: true })
      host.addEventListener('pointerleave', onLeave)
    }
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      if (fine) {
        host.removeEventListener('pointermove', onMove)
        host.removeEventListener('pointerleave', onLeave)
      }
    }
  }, [count, fine, opacity, reduced])

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  )
}
