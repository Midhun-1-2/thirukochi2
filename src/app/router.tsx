import { createBrowserRouter } from 'react-router-dom'
import { PublicOnly, RequireAuth } from '@/app/guards'
import { AppShell } from '@/components/layout/AppShell'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Splash } from '@/pages/Splash'
import { Register } from '@/pages/Register'
import { Otp } from '@/pages/Otp'
import { SetMpin } from '@/pages/SetMpin'
import { Login } from '@/pages/Login'
import { ForgotMpin } from '@/pages/ForgotMpin'
import { Home } from '@/pages/Home'
import { Schemes } from '@/pages/Schemes'
import { SchemeDetails } from '@/pages/SchemeDetails'
import { JoinScheme } from '@/pages/JoinScheme'
import { Success } from '@/pages/Success'
import { Wallet } from '@/pages/Wallet'
import { Activity } from '@/pages/Activity'
import { Profile } from '@/pages/Profile'
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
          { path: '/schemes', element: <Schemes /> },
          { path: '/schemes/:id', element: <SchemeDetails /> },
          { path: '/join-scheme', element: <JoinScheme /> },
          { path: '/success', element: <Success /> },
          { path: '/wallet', element: <Wallet /> },
          { path: '/activity', element: <Activity /> },
          { path: '/profile', element: <Profile /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])
