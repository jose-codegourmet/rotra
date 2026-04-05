import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ROTRA',
  description: 'The badminton session platform.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-base text-text-primary antialiased">{children}</body>
    </html>
  )
}
