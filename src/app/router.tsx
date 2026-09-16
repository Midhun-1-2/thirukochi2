import { createBrowserRouter } from 'react-router-dom'
import { Lazy, PublicOnly, RequireAuth } from '@/app/guards'
import { Activity, JoinScheme, Profile, SchemeDetails, Schemes, Success, Wallet } from '@/app/lazy'
import { AppShell } from '@/components/layout/AppShell'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Splash } from '@/pages/Splash'
import { Register } from '@/pages/Register'
import { Otp } from '@/pages/Otp'
import { SetMpin } from '@/pages/SetMpin'
import { Login } from '@/pages/Login'
import { ForgotMpin } from '@/pages/ForgotMpin'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'

export const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
  {
    element: <AuthLayout />,
    children: [
      { path: '/register', element: <PublicOnly><Register /></PublicOnly> },
      { path: '/login', element: <PublicOnly><Login /></PublicOnly> },
      { path: '/otp', element: <Otp /> },
      { path: '/mpin', element: <SetMpin /> },
      { path: '/forgot-mpin', element: <ForgotMpin /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/home', element: <Home /> },
          { path: '/schemes', element: <Lazy><Schemes /></Lazy> },
          { path: '/schemes/:id', element: <Lazy><SchemeDetails /></Lazy> },
          { path: '/join-scheme', element: <Lazy><JoinScheme /></Lazy> },
          { path: '/success', element: <Lazy><Success /></Lazy> },
          { path: '/wallet', element: <Lazy><Wallet /></Lazy> },
          { path: '/activity', element: <Lazy><Activity /></Lazy> },
          { path: '/profile', element: <Lazy><Profile /></Lazy> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])
