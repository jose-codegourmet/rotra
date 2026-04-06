import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
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
  title: 'ROTRA Umpire',
  description: 'Live match scoring.',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={satoshi.variable} suppressHydrationWarning>
      <body className="bg-bg-base text-text-primary antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
