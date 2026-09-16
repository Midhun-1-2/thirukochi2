import { ToastContext } from '@/context/registry'
import { useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

export type ToastTone = 'success' | 'info' | 'error'

interface Toast {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

interface ToastContextValue {
  toast: (title: string, opts?: { description?: string; tone?: ToastTone; duration?: number }) => void
}


const icons = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback<ToastContextValue['toast']>(
    (title, opts = {}) => {
      const id = ++counter.current
      const { description, tone = 'info', duration = 3200 } = opts
      setToasts((list) => [...list.slice(-2), { id, title, description, tone }])
      window.setTimeout(() => dismiss(id), duration)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 top-[calc(var(--safe-top)+12px)] z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = icons[t.tone]
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: spring.snappy }}
                exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.2 } }}
                role="status"
                className={cn(
                  'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl px-4 py-3 shadow-lift',
                  'glass-cream text-ink',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                    t.tone === 'success' && 'bg-success-soft text-success',
                    t.tone === 'info' && 'bg-gold-pale text-gold-deep',
                    t.tone === 'error' && 'bg-danger-soft text-danger',
                  )}
                >
                  <Icon size={15} strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-maroon">{t.title}</p>
                  {t.description && <p className="mt-0.5 text-xs leading-snug text-ink-soft">{t.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-mute transition hover:bg-maroon-tint hover:text-maroon"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext) as ToastContextValue | null
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
