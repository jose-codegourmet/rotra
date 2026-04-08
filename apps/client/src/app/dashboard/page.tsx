import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — ROTRA',
  description: 'Your ROTRA dashboard.',
}

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div>
          <p className="text-micro font-bold uppercase tracking-widest text-accent mb-1">
            Dashboard
          </p>
          <h1 className="text-display font-bold text-text-primary tracking-tight">
            Run the game.
          </h1>
          <p className="text-body text-text-secondary mt-2">
            Your sessions, clubs, and queue — all in one place.
          </p>
        </div>

        {/* Placeholder content grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Placeholder card 1 */}
          <div className="col-span-12 md:col-span-8 bg-bg-surface border border-border rounded-lg p-6 shadow-card min-h-[200px] flex items-center justify-center">
            <p className="text-small text-text-disabled uppercase tracking-widest font-medium">
              Active Sessions
            </p>
          </div>

          {/* Placeholder card 2 */}
          <div className="col-span-12 md:col-span-4 bg-bg-surface border border-border rounded-lg p-6 shadow-card min-h-[200px] flex items-center justify-center">
            <p className="text-small text-text-disabled uppercase tracking-widest font-medium">
              Quick Stats
            </p>
          </div>

          {/* Placeholder card 3 */}
          <div className="col-span-12 bg-bg-surface border border-border rounded-lg p-6 shadow-card min-h-[140px] flex items-center justify-center">
            <p className="text-small text-text-disabled uppercase tracking-widest font-medium">
              Upcoming Schedule
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
