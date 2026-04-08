'use client'

import { CalendarClock, Gauge, Moon, MoreVertical, Sun, Trophy, User, X } from 'lucide-react'
import { Logo } from '@/components/ui/logo/Logo'
import type { NavItemId } from '@/components/ui/sidebar/Sidebar'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { closeMobileDrawer } from '@/store/slices/uiSlice'

const NAV_ITEMS = [
  { id: 'home' as NavItemId, label: 'Home', Icon: Gauge },
  { id: 'clubs' as NavItemId, label: 'Clubs', Icon: Trophy },
  { id: 'sessions' as NavItemId, label: 'Sessions', Icon: CalendarClock },
  { id: 'profile' as NavItemId, label: 'Profile', Icon: User },
]

export interface MobileDrawerProps {
  activeItem?: NavItemId
}

export function MobileDrawer({ activeItem = 'home' }: MobileDrawerProps) {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector((state) => state.ui.isMobileDrawerOpen)

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-slow',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => dispatch(closeMobileDrawer())}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[60] w-72 bg-bg-base flex flex-col md:hidden',
          'border-r border-border shadow-modal',
          'transform transition-transform duration-slow ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-2">
            <Logo variant="dark" className="w-24" />
          </div>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-full transition-colors duration-default"
            onClick={() => dispatch(closeMobileDrawer())}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeItem === id
            return (
              <button
                key={id}
                type="button"
                className={cn(
                  'w-full flex items-center px-6 py-4 transition-colors duration-default',
                  isActive
                    ? 'text-accent bg-accent/10 border-r-4 border-accent'
                    : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  className="mr-4 shrink-0"
                />
                <span
                  className={cn(
                    'text-label uppercase tracking-widest',
                    isActive ? 'font-bold' : 'font-medium',
                  )}
                >
                  {label}
                </span>
              </button>
            )
          })}

          {/* Theme toggle */}
          <button
            type="button"
            className="w-full flex items-center px-6 py-4 text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors duration-default"
          >
            <Moon size={20} strokeWidth={1.5} className="mr-4 shrink-0 dark:hidden" />
            <Sun size={20} strokeWidth={1.5} className="mr-4 shrink-0 hidden dark:block" />
            <span className="text-label font-medium uppercase tracking-widest dark:hidden">
              Dark Mode
            </span>
            <span className="text-label font-medium uppercase tracking-widest hidden dark:block">
              Light Mode
            </span>
          </button>
        </nav>

        {/* User section */}
        <div className="p-6 border-t border-border bg-bg-base">
          <div className="flex items-center gap-3 p-3 bg-bg-surface rounded-lg border border-border/30">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-bg-elevated border-2 border-accent flex items-center justify-center shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                <User size={18} strokeWidth={1.5} className="text-text-secondary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-bg-surface" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-small font-black text-text-primary uppercase tracking-wider truncate">
                Alex Santos
              </span>
              <span className="text-micro font-bold text-accent uppercase tracking-tight">
                Warrior 2
              </span>
            </div>
            <MoreVertical
              size={16}
              strokeWidth={1.5}
              className="ml-auto text-text-disabled shrink-0"
            />
          </div>
        </div>
      </aside>
    </>
  )
}
