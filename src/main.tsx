import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/playfair-display'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource-variable/inter'
import '@fontsource-variable/fraunces'
import '@/styles/globals.css'
import App from '@/App'

/* Warm every face the shell uses while the splash holds, so the first screens
   do not reflow when a font lands mid-entrance. '₹' pulls the latin-ext subset too. */
if ('fonts' in document) {
  for (const face of [
    '300 1em Poppins',
    '400 1em Poppins',
    '500 1em Poppins',
    '600 1em Poppins',
    "500 1em 'Playfair Display Variable'",
    "500 1em 'Inter Variable'",
    "600 1em 'Fraunces Variable'",
  ]) {
    document.fonts.load(face, '₹ ').catch(() => {})
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
