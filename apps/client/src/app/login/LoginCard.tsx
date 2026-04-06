'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  )
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('animate-spin', className)}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  )
}

function QrIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75V16.5zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
      />
    </svg>
  )
}

export function LoginCard() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleFacebookLogin() {
    if (isLoading) return
    setIsLoading(true)
    try {
      // TODO: initiate Facebook OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch {
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="w-full"
      style={{
        background: '#1A1A1D',
        border: '1px solid #2A2A2E',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        padding: '2rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Card header */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: '#F0F0F2' }}
          >
            Welcome to ROTRA
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: '#9090A0' }}
          >
            Sign in to access your sessions, player queue, and court activity.
          </p>
        </header>

        {/* Auth actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Facebook OAuth button */}
          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={isLoading}
            className={cn(
              'flex h-12 w-full items-center justify-center gap-3 rounded-lg text-sm font-bold uppercase tracking-widest text-white transition-all duration-150',
              isLoading
                ? 'cursor-not-allowed opacity-80'
                : 'hover:brightness-90 active:scale-[0.98]',
            )}
            style={{
              backgroundColor: isLoading ? '#1467D4' : '#1877F2',
            }}
            aria-label="Continue with Facebook"
          >
            {isLoading ? (
              <Spinner className="size-5" />
            ) : (
              <>
                <FacebookIcon className="size-5 shrink-0" />
                <span>Continue with Facebook</span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t" style={{ borderColor: '#2A2A2E' }} />
          </div>
          <div className="relative flex justify-center">
            <span
              className="px-4 font-bold uppercase"
              style={{
                background: '#1A1A1D',
                color: '#9090A0',
                fontSize: '0.625rem',
                letterSpacing: '0.18em',
              }}
            >
              Or access with
            </span>
          </div>
        </div>

        {/* Mock alternate access buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled
            className="flex cursor-not-allowed items-center justify-center gap-2 rounded-lg py-3 opacity-40 transition-colors"
            style={{ border: '1px solid #2A2A2E', color: '#9090A0' }}
            aria-label="Email sign-in (coming soon)"
          >
            <MailIcon className="size-5 shrink-0" />
            <span
              className="font-bold uppercase"
              style={{ fontSize: '0.6875rem', letterSpacing: '0.1em' }}
            >
              Email
            </span>
          </button>
          <button
            type="button"
            disabled
            className="flex cursor-not-allowed items-center justify-center gap-2 rounded-lg py-3 opacity-40 transition-colors"
            style={{ border: '1px solid #2A2A2E', color: '#9090A0' }}
            aria-label="QR code scan (coming soon)"
          >
            <QrIcon className="size-5 shrink-0" />
            <span
              className="font-bold uppercase"
              style={{ fontSize: '0.6875rem', letterSpacing: '0.1em' }}
            >
              Scan
            </span>
          </button>
        </div>

        {/* Legal copy */}
        <footer>
          <p
            className="text-center leading-relaxed"
            style={{ color: '#4A4A55', fontSize: '0.6875rem' }}
          >
            By continuing, you agree to our{' '}
            <a
              href="/terms"
              className="underline underline-offset-4 transition-colors duration-150"
              style={{ color: '#9090A0' }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#F0F0F2')}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = '#9090A0')}
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              className="underline underline-offset-4 transition-colors duration-150"
              style={{ color: '#9090A0' }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#F0F0F2')}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = '#9090A0')}
            >
              Privacy Policy
            </a>
            .
          </p>
        </footer>

      </div>
    </div>
  )
}
