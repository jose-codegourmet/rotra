import { BottomNav } from '@/components/ui/bottom-nav/BottomNav'
import { MobileDrawer } from '@/components/ui/mobile-drawer/MobileDrawer'
import { MobileHeader } from '@/components/ui/mobile-header/MobileHeader'
import { Navbar } from '@/components/ui/navbar/Navbar'
import { Sidebar } from '@/components/ui/sidebar/Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  pageTitle?: string
  pageSubtitle?: string
  activeItem?: string
}

export function DashboardLayout({
  children,
  pageTitle = 'Dashboard',
  pageSubtitle = 'ROTRA',
  activeItem = 'home',
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-base">
      {/* Desktop sidebar — icon rail at md, full at lg */}
      <Sidebar activeItem={activeItem} />

      {/* Desktop top navbar — lg only */}
      <Navbar pageTitle={pageTitle} pageSubtitle={pageSubtitle} />

      {/* Mobile top header — hidden at md+ */}
      <MobileHeader />

      {/* Mobile navigation drawer — controlled by Redux */}
      <MobileDrawer activeItem={activeItem} />

      {/* Main content */}
      <main className="md:ml-20 lg:ml-64 pt-16 pb-20 md:pb-8 min-h-screen">
        {children}
      </main>

      {/* Mobile bottom navigation — hidden at md+ */}
      <BottomNav activeItem={activeItem} />
    </div>
  )
}
