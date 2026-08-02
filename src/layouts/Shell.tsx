import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { homePathForRole, roleLabels, workspaceForRole, type Workspace } from '@/lib/permissions'
import type { Role } from '@/types'
import { Button } from '@/components/ui'
import { cn } from '@/lib/format'
import { users } from '@/mock/data'

const roleOptions: Role[] = [
  'super_admin',
  'master_trader',
  'manufacturer',
  'dealer',
  'contractor',
  'warehouse_manager',
  'fabricator',
  'driver',
  'retail',
]

type NavItem = { to: string; label: string }
type ShellConfig = { title: string; nav: NavItem[]; mobile?: boolean }

const SHELL_BY_WORKSPACE: Record<Workspace, ShellConfig> = {
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

function Shell({
  title,
  nav,
  mobile,
}: {
  title: string
  nav: NavItem[]
  mobile?: boolean
}) {
  const user = useAppStore((s) => s.currentUser())
  const loginAs = useAppStore((s) => s.loginAs)
  const logout = useAppStore((s) => s.logout)
  const unread = useAppStore((s) =>
    s.notifications.reduce((n, item) => (item.userId === s.currentUserId && !item.read ? n + 1 : n), 0),
  )
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef2f6_0%,#f7f8fa_45%,#e8ecf0_100%)]">
      <header className="sticky top-0 z-30 border-b border-steel-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Steel Cart</div>
            <div className="truncate text-sm font-semibold text-steel-900">{title}</div>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="relative rounded-lg bg-steel-100 px-3 py-2 text-xs font-medium text-steel-700"
          >
            Alerts
            {unread > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] text-white">
                {unread}
              </span>
            ) : null}
          </button>
          <select
            className="max-w-[160px] rounded-lg border border-steel-200 bg-white px-2 py-2 text-xs"
            value={user?.role}
            onChange={(e) => {
              const role = e.target.value as Role
              const u = users.find((x) => x.role === role)
              if (u) navigate(loginAs(u.id))
            }}
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {roleLabels[r]}
              </option>
            ))}
          </select>
          <Button variant="ghost" onClick={() => { logout(); navigate('/login') }}>
            Logout
          </Button>
        </div>
      </header>

      <div className={cn('mx-auto flex max-w-7xl gap-6 px-4 py-6', mobile ? 'flex-col' : 'flex-col lg:flex-row')}>
        {!mobile ? (
          <aside className="hidden w-56 shrink-0 lg:block">
            <nav className="sticky top-24 space-y-1 rounded-2xl border border-steel-200 bg-white p-3 shadow-sm">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to.split('/').length <= 2}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-lg px-3 py-2 text-sm font-medium transition',
                      isActive ? 'bg-steel-900 text-white' : 'text-steel-600 hover:bg-steel-50',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        ) : null}

        <main className="min-w-0 flex-1 pb-24">
          <Outlet />
        </main>
      </div>

      {mobile ? (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-steel-200 bg-white/95 backdrop-blur">
          <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 py-2">
            {nav.slice(0, 4).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.split('/').length <= 2}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-2 py-2 text-center text-[11px] font-medium',
                    isActive ? 'bg-steel-900 text-white' : 'text-steel-600',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-steel-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex gap-1 overflow-x-auto px-2 py-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium',
                    isActive ? 'bg-steel-900 text-white' : 'text-steel-600',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
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
