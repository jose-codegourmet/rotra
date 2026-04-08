import type { Metadata } from 'next'
import DarkVeil from '@/components/ui/dark-veil/DarkVeil'
import { Logo } from '@/components/ui/logo/Logo'
import { LoginCard } from './LoginCard'

export const metadata: Metadata = {
  title: 'Login — ROTRA',
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Dark Veil animated WebGL background */}
      <div className="absolute inset-0">
        <DarkVeil speed={1.4} />
      </div>

      {/* Readability overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.55)' }}
      />

      {/* Radial depth accents */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-1/3 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: 'rgba(59,130,246,0.05)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 h-[320px] w-[320px] rounded-full blur-3xl"
          style={{ background: 'rgba(100,120,180,0.04)' }}
        />
      </div>



      {/* Main content — centered column */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-12">
        {/* Brand block */}
        <div
          className="mb-8 flex flex-col items-center text-center"
          style={{ animation: 'fadeUp 500ms ease-out both' }}
        >
          <Logo variant="dark" className="w-48" />
          <p
            className="mt-3 text-xs font-medium uppercase"
            style={{ color: '#9090A0', letterSpacing: '0.2em' }}
          >
            Run the game.
          </p>
        </div>

        {/* Auth card */}
        <div style={{ animation: 'fadeUp 500ms 80ms ease-out both', width: '100%', maxWidth: '420px' }}>
          <LoginCard />
        </div>
      </main>

      {/* Fixed footer */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center gap-4 px-6 py-5 md:flex-row md:gap-8"
        style={{ background: 'rgba(0,0,0,0)' }}
      >
        <Logo variant="dark" className="h-6 w-6" />
        <div className="flex items-center gap-6">
          <a
            href="/privacy"
            className="transition-colors duration-150 hover:opacity-80"
            style={{ color: '#4A4A55', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="transition-colors duration-150 hover:opacity-80"
            style={{ color: '#4A4A55', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}
          >
            Terms of Service
          </a>
          <a
            href="/status"
            className="transition-colors duration-150 hover:opacity-80"
            style={{ color: '#4A4A55', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}
          >
            System Status
          </a>
        </div>
        <span
          style={{ color: '#4A4A55', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}
        >
          © 2025 ROTRA
        </span>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
