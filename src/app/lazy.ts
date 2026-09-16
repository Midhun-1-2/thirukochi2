import { lazy } from 'react'

/* Heavier, less-visited screens are code-split. */
export const Schemes = lazy(() => import('@/pages/Schemes').then((m) => ({ default: m.Schemes })))
export const SchemeDetails = lazy(() => import('@/pages/SchemeDetails').then((m) => ({ default: m.SchemeDetails })))
export const JoinScheme = lazy(() => import('@/pages/JoinScheme').then((m) => ({ default: m.JoinScheme })))
export const Success = lazy(() => import('@/pages/Success').then((m) => ({ default: m.Success })))
export const Wallet = lazy(() => import('@/pages/Wallet').then((m) => ({ default: m.Wallet })))
export const Activity = lazy(() => import('@/pages/Activity').then((m) => ({ default: m.Activity })))
export const Profile = lazy(() => import('@/pages/Profile').then((m) => ({ default: m.Profile })))
