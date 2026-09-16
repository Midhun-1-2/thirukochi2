import { createContext } from 'react'

/* Context objects live here, in a component-free module, so Vite HMR can
   hot-swap the providers without minting new context identities. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthContext = createContext<any>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SchemeContext = createContext<any>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ToastContext = createContext<any>(null)
