import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useIsTablet, useReducedMotion, useScrollLock } from '@/hooks'
import { ease, spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------
   Modal: centred dialog on tablet/desktop, bottom sheet on phones.
   Escape closes; focus moves into the dialog and returns on close.
------------------------------------------------------------------- */

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  eyebrow?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-2xl' }

export function Modal({ open, onClose, title, eyebrow, children, footer, size = 'md' }: ModalProps) {
  const isTablet = useIsTablet()
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ;(focusable ?? panelRef.current)?.focus()
    }, 40)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      restoreRef.current?.focus?.()
    }
  }, [open, onClose])

  const sheet = !isTablet

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-maroon-deep/55 backdrop-blur-[3px] sm:bg-maroon-deep/60 sm:backdrop-blur-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'tk-modal-title' : undefined}
            tabIndex={-1}
            // phones: sheet slides up on a spring. larger screens: a short eased
            // tween — springs overshoot on scale and read as a "pop", and the
            // full-screen backdrop blur is skipped there so the frame stays cheap.
            initial={reduced ? { opacity: 0 } : sheet ? { y: '100%', opacity: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : sheet ? { y: 0, transition: spring.soft } : { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: ease.luxe } }}
            exit={reduced ? { opacity: 0 } : sheet ? { y: '100%', transition: { duration: 0.25 } } : { opacity: 0, y: 8, scale: 0.99, transition: { duration: 0.16, ease: ease.soft } }}
            className={cn(
              'relative z-10 flex max-h-[88dvh] w-full flex-col overflow-hidden bg-ivory shadow-lift outline-none',
              'rounded-t-[28px] sm:rounded-[28px]',
              sizes[size],
            )}
            style={{ paddingBottom: sheet ? 'var(--safe-bottom)' : undefined, willChange: 'transform, opacity' }}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-deep via-gold-light to-gold-deep" aria-hidden="true" />
            {sheet && <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-maroon/15" aria-hidden="true" />}
            <div className="flex items-start justify-between gap-4 px-6 pt-5">
              <div className="min-w-0">
                {eyebrow && <p className="eyebrow mb-1 text-gold-deep">{eyebrow}</p>}
                {title && (
                  <h2 id="tk-modal-title" className="font-display text-xl text-maroon">
                    {title}
                  </h2>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-mute transition hover:bg-maroon-tint hover:text-maroon"
              >
                <X size={18} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 text-sm leading-relaxed text-ink-soft">{children}</div>
            {footer && <div className="border-t border-gold/20 bg-white px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
