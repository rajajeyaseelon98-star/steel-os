import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { homePathForRole, workspaceForRole, type Workspace } from '@/lib/permissions'
import { cn } from '@/lib/format'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

type NavItem = { to: string; label: string }
type ShellConfig = { title: string; nav: NavItem[]; mobile?: boolean }

export const SHELL_BY_WORKSPACE: Record<Workspace, ShellConfig> = {
  buyer: {
    title: 'Buyer Workspace',
    nav: [
      { to: '/buyer', label: 'Home' },
      { to: '/buyer/catalog', label: 'Catalog' },
      { to: '/search', label: 'Search' },
      { to: '/buyer/quotations', label: 'Quotations' },
      { to: '/buyer/orders', label: 'Orders' },
      { to: '/buyer/payments', label: 'Payments' },
      { to: '/buyer/fabrication', label: 'Fabrication' },
      { to: '/buyer/addresses', label: 'Addresses' },
      { to: '/buyer/wishlist', label: 'Wishlist' },
      { to: '/profile', label: 'Profile' },
      { to: '/settings', label: 'Settings' },
      { to: '/support', label: 'Support' },
    ],
  },
  admin: {
    title: 'Operations Console',
    nav: [
      { to: '/admin', label: 'Dashboard' },
      { to: '/search', label: 'Search' },
      { to: '/admin/orders', label: 'Orders' },
      { to: '/admin/quotations', label: 'Quotations' },
      { to: '/admin/products', label: 'Products' },
      { to: '/admin/catalog-meta', label: 'Categories' },
      { to: '/admin/pricing', label: 'Pricing' },
      { to: '/admin/special-pricing', label: 'Special $' },
      { to: '/admin/inventory', label: 'Inventory' },
      { to: '/admin/purchase', label: 'Purchase' },
      { to: '/admin/vendors', label: 'Vendors' },
      { to: '/admin/transport', label: 'Transport' },
      { to: '/admin/finance', label: 'Finance' },
      { to: '/admin/crm', label: 'CRM' },
      { to: '/admin/reports', label: 'Reports' },
      { to: '/admin/analytics', label: 'Analytics' },
      { to: '/admin/ai', label: 'AI Insights' },
      { to: '/admin/estimator', label: 'Estimator' },
      { to: '/admin/hr', label: 'HR' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/audit', label: 'Audit' },
      { to: '/admin/settings', label: 'Settings' },
    ],
  },
  warehouse: {
    title: 'Warehouse App',
    mobile: true,
    nav: [
      { to: '/warehouse', label: 'Home' },
      { to: '/warehouse/receiving', label: 'Receiving' },
      { to: '/warehouse/stock', label: 'Stock' },
      { to: '/warehouse/dispatch', label: 'Dispatch' },
      { to: '/warehouse/transfers', label: 'Transfer' },
      { to: '/warehouse/scan', label: 'Barcode' },
      { to: '/warehouse/reports', label: 'Reports' },
    ],
  },
  fabricator: {
    title: 'Fabricator App',
    mobile: true,
    nav: [
      { to: '/fabricator', label: 'Leads' },
      { to: '/fabricator/quotes', label: 'Quotes' },
      { to: '/fabricator/jobs', label: 'Jobs' },
      { to: '/fabricator/payments', label: 'Payments' },
      { to: '/fabricator/reviews', label: 'Reviews' },
      { to: '/profile', label: 'Profile' },
    ],
  },
  driver: {
    title: 'Driver App',
    mobile: true,
    nav: [
      { to: '/driver', label: 'Today' },
      { to: '/driver/history', label: 'History' },
      { to: '/profile', label: 'Profile' },
    ],
  },
  manufacturer: {
    title: 'Manufacturer Portal',
    nav: [
      { to: '/manufacturer', label: 'Home' },
      { to: '/profile', label: 'Profile' },
      { to: '/settings', label: 'Settings' },
      { to: '/support', label: 'Support' },
    ],
  },
}

function resolveTopBarTitle(pathname: string, config: ShellConfig) {
  const match = [...config.nav]
    .sort((a, b) => b.to.length - a.to.length)
    .find((item) => pathname === item.to || (item.to !== '/' && pathname.startsWith(`${item.to}/`)))
  if (match) return { title: match.label, subtitle: config.title }
  return { title: config.title, subtitle: 'Steel Cart' }
}

function Shell({
  title,
  nav,
  mobile,
}: {
  title: string
  nav: NavItem[]
  mobile?: boolean
}) {
  const { pathname } = useLocation()
  const bar = resolveTopBarTitle(pathname, { title, nav, mobile })

  if (mobile) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-surface-card">
        <TopBar title={bar.title} subtitle={bar.subtitle} />
        <main className="min-h-0 flex-1 overflow-y-auto bg-surface-main">
          <div className="mx-auto flex max-w-content flex-col gap-4 p-4 pb-24">
            <Outlet />
          </div>
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface-card/95 backdrop-blur-md">
          <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 py-2">
            {nav.slice(0, 4).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.split('/').length <= 2}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-2 py-2 text-center text-[11px] font-medium transition-colors',
                    isActive ? 'bg-brand text-white' : 'text-text-secondary',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-card">
      <Sidebar nav={nav} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={bar.title} subtitle={bar.subtitle} />
        <main className="min-h-0 flex-1 overflow-y-auto bg-surface-main">
          <div className="mx-auto flex max-w-content flex-col gap-4 p-4 pb-24 sm:p-6 lg:pb-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav for desktop workspaces */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface-card/95 backdrop-blur-md lg:hidden">
        <div className="flex gap-1 overflow-x-auto px-2 py-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-colors',
                  isActive ? 'bg-brand text-white' : 'text-text-secondary',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

export function BuyerLayout() {
  return <Shell {...SHELL_BY_WORKSPACE.buyer} />
}

export function AdminLayout() {
  return <Shell {...SHELL_BY_WORKSPACE.admin} />
}

export function WarehouseLayout() {
  return <Shell {...SHELL_BY_WORKSPACE.warehouse} />
}

export function FabricatorLayout() {
  return <Shell {...SHELL_BY_WORKSPACE.fabricator} />
}

export function DriverLayout() {
  return <Shell {...SHELL_BY_WORKSPACE.driver} />
}

export function ManufacturerLayout() {
  return <Shell {...SHELL_BY_WORKSPACE.manufacturer} />
}

/** Shared routes (/search, /profile, …) keep sticky Shell chrome for the current role. */
export function RoleWorkspaceShell() {
  const user = useAppStore((s) => s.currentUser())
  if (!user) return <Navigate to="/login" replace />
  return <Shell {...SHELL_BY_WORKSPACE[workspaceForRole(user.role)]} />
}

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#c45c2640,transparent_35%),radial-gradient(circle_at_80%_0%,#7a90a455,transparent_30%),linear-gradient(160deg,#0f1419,#1a2330_45%,#2f3c4a)]" />
      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-2">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-light">Steel Cart</div>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            South Tamil Nadu steel distribution operating system
          </h1>
          <p className="mt-3 max-w-md text-steel-300">
            Prototype for dealers, contractors, warehouses, fabricators, and transport — not a shop app.
          </p>
        </div>
        <div className="w-full md:justify-self-end md:max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.currentUser())
  if (!user) return <Navigate to="/login" replace />
  return children
}

export function RoleHomeRedirect() {
  const user = useAppStore((s) => s.currentUser())
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={homePathForRole(user.role)} replace />
}
