'use client'

import { LogOut, Moon, Search, Settings, Sun } from 'lucide-react'

export interface NavbarProps {
  pageTitle?: string
  pageSubtitle?: string
}

export function Navbar({
  pageTitle = 'Dashboard',
  pageSubtitle = 'ROTRA',
}: NavbarProps) {
  return (
    <header className="hidden lg:flex fixed top-0 right-0 w-[calc(100%-256px)] h-16 items-center justify-between px-8 z-40 border-b border-border backdrop-blur-xl bg-bg-surface/80">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-4">
        <span className="text-label font-bold uppercase tracking-widest text-accent">
          {pageTitle}
        </span>
        <div className="h-4 w-px bg-border-strong" />
        <span className="text-label font-bold uppercase tracking-widest text-text-secondary">
          {pageSubtitle}
        </span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          className="text-text-disabled hover:text-accent transition-colors duration-default"
          aria-label="Toggle theme"
        >
          <Moon size={20} strokeWidth={1.5} className="dark:hidden" />
          <Sun size={20} strokeWidth={1.5} className="hidden dark:block" />
        </button>
        <button
          type="button"
          className="text-text-disabled hover:text-accent transition-colors duration-default"
          aria-label="Search"
        >
          <Search size={20} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className="text-text-disabled hover:text-accent transition-colors duration-default"
          aria-label="Settings"
        >
          <Settings size={20} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className="text-text-disabled hover:text-accent transition-colors duration-default"
          aria-label="Log out"
        >
          <LogOut size={20} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  )
}
