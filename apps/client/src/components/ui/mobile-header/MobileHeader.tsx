'use client'

import { Menu, Search } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { toggleMobileDrawer } from '@/store/slices/uiSlice'

export function MobileHeader() {
  const dispatch = useAppDispatch()

  return (
    <header className="flex md:hidden justify-between items-center px-6 py-4 w-full bg-bg-base/80 backdrop-blur-xl fixed top-0 z-50 border-b border-border">
      {/* Left: hamburger + wordmark */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation menu"
          className="text-accent active:scale-95 transition-transform"
          onClick={() => dispatch(toggleMobileDrawer())}
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>
        <span className="text-title font-black italic text-accent tracking-tighter">
          ROTRA
        </span>
      </div>

      {/* Right: search */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Search"
          className="text-text-primary hover:text-accent transition-colors duration-default"
        >
          <Search size={20} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  )
}
