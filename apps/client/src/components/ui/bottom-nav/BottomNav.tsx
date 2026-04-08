'use client'

import { CalendarClock, Gauge, Trophy, User } from 'lucide-react'
import type { NavItemId } from '@/components/ui/sidebar/Sidebar'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { id: 'home' as NavItemId, label: 'Home', Icon: Gauge },
  { id: 'clubs' as NavItemId, label: 'Clubs', Icon: Trophy },
  { id: 'sessions' as NavItemId, label: 'Sessions', Icon: CalendarClock },
  { id: 'profile' as NavItemId, label: 'Profile', Icon: User },
]

export interface BottomNavProps {
  activeItem?: NavItemId
}

export function BottomNav({ activeItem = 'home' }: BottomNavProps) {
  return (
    <nav
      className="md:hidden flex justify-around items-center h-16 w-full fixed bottom-0 z-50 bg-bg-surface/80 backdrop-blur-xl border-t border-border rounded-t-lg shadow-[0_-8px_24px_rgba(0,255,136,0.08)]"
      aria-label="Bottom navigation"
    >
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = activeItem === id
        return (
          <button
            key={id}
            type="button"
            aria-label={label}
            className={cn(
              'relative flex flex-col items-center justify-center flex-1 h-full active:scale-90 transition-transform duration-fast',
              isActive ? 'text-accent' : 'text-text-disabled',
            )}
          >
            {/* Active indicator: 2px top border per branding nav spec */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full" />
            )}
            <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
          </button>
        )
      })}
    </nav>
  )
}
