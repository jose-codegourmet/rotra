import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'
import { ReduxProvider } from '@/providers/ReduxProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import './globals.css'

const satoshi = localFont({
  src: [
    { path: '../../public/fonts/Satoshi-Variable.woff2', weight: '300 900', style: 'normal' },
    { path: '../../public/fonts/Satoshi-VariableItalic.woff2', weight: '300 900', style: 'italic' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ROTRA',
  description: 'The badminton session platform.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={satoshi.variable} suppressHydrationWarning>
      <body className="bg-bg-base text-text-primary antialiased font-sans">
        <ReduxProvider>
          <ThemeProvider>
            {children}
            <Toaster position="top-center" duration={4000} />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
