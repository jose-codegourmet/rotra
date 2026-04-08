import {
  Bell,
  ChevronRight,
  Globe,
  Lock,
  LogOut,
  Moon,
  Shield,
  Smartphone,
  Trash2,
  User,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings — ROTRA',
  description: 'Manage your account and app preferences.',
}

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile Information', description: 'Name, photo, playing level', href: '#' },
      { icon: Lock, label: 'Password & Security', description: 'Change password, 2FA', href: '#' },
      { icon: Globe, label: 'Language & Region', description: 'Language, timezone, currency', href: '#' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', description: 'Session alerts, club updates', href: '#' },
      { icon: Moon, label: 'Appearance', description: 'Light, dark, or system theme', href: '#' },
      { icon: Smartphone, label: 'App & Display', description: 'Font size, accessibility', href: '#' },
    ],
  },
  {
    title: 'Privacy',
    items: [
      { icon: Shield, label: 'Privacy Settings', description: 'Who can see your profile', href: '#' },
      { icon: Lock, label: 'Blocked Players', description: 'Manage blocked accounts', href: '#' },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="max-w-[800px] mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div>
          <p className="text-micro font-bold uppercase tracking-widest text-accent mb-1">
            Account
          </p>
          <h1 className="text-display font-bold text-text-primary tracking-tight">Settings</h1>
          <p className="text-body text-text-secondary mt-2">
            Manage your account and preferences.
          </p>
        </div>

        {/* Profile card */}
        <div className="bg-bg-surface border border-border rounded-lg p-5 shadow-card flex items-center gap-4">
          <div className="size-12 rounded-full bg-bg-elevated border-2 border-border flex items-center justify-center shrink-0">
            <span className="text-body font-black text-text-secondary">AS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body font-semibold text-text-primary">Alex Santos</p>
            <p className="text-small text-text-secondary">alex@example.com</p>
          </div>
          <a
            href="/profile"
            className="text-small font-bold uppercase tracking-widest text-accent shrink-0"
          >
            View Profile
          </a>
        </div>

        {/* Settings sections */}
        {SETTINGS_SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <p className="text-small font-bold uppercase tracking-widest text-text-secondary px-1">
              {section.title}
            </p>
            <div className="bg-bg-surface border border-border rounded-lg overflow-hidden shadow-card">
              {section.items.map((item, idx) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-bg-elevated transition-colors duration-default ${
                      idx < section.items.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="size-9 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
                      <Icon size={18} strokeWidth={1.5} className="text-text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-medium text-text-primary">{item.label}</p>
                      <p className="text-small text-text-secondary">{item.description}</p>
                    </div>
                    <ChevronRight size={16} strokeWidth={1.5} className="text-text-disabled shrink-0" />
                  </a>
                )
              })}
            </div>
          </div>
        ))}

        {/* Session + account actions */}
        <div className="flex flex-col gap-2">
          <p className="text-small font-bold uppercase tracking-widest text-text-secondary px-1">
            Session
          </p>
          <div className="bg-bg-surface border border-border rounded-lg overflow-hidden shadow-card">
            <button
              type="button"
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-bg-elevated transition-colors duration-default border-b border-border"
            >
              <div className="size-9 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
                <LogOut size={18} strokeWidth={1.5} className="text-text-secondary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-body font-medium text-text-primary">Log Out</p>
                <p className="text-small text-text-secondary">Sign out of your account</p>
              </div>
              <ChevronRight size={16} strokeWidth={1.5} className="text-text-disabled shrink-0" />
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-error/5 transition-colors duration-default"
            >
              <div className="size-9 rounded-lg bg-error/10 flex items-center justify-center shrink-0">
                <Trash2 size={18} strokeWidth={1.5} className="text-error" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-body font-medium text-error">Delete Account</p>
                <p className="text-small text-text-secondary">
                  Permanently remove your account and data
                </p>
              </div>
              <ChevronRight size={16} strokeWidth={1.5} className="text-text-disabled shrink-0" />
            </button>
          </div>
        </div>

        {/* App version */}
        <p className="text-small text-text-disabled text-center pb-4">ROTRA v0.1.0 · Beta</p>
      </div>
    </div>
  )
}
