import { MotionConfig } from 'framer-motion'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import { AuthProvider } from '@/context/AuthContext'
import { SchemeProvider } from '@/context/SchemeContext'
import { ToastProvider } from '@/context/ToastContext'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <AuthProvider>
          <SchemeProvider>
            <RouterProvider router={router} />
          </SchemeProvider>
        </AuthProvider>
      </ToastProvider>
    </MotionConfig>
  )
}
