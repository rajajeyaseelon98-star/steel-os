import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { roleLabels } from '@/lib/permissions'
import type { Role } from '@/types'
import { Button } from '@/components/ui'
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

export function TopBar({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  const user = useAppStore((s) => s.currentUser())
  const loginAs = useAppStore((s) => s.loginAs)
  const logout = useAppStore((s) => s.logout)
  const unread = useAppStore((s) =>
    s.notifications.reduce((n, item) => (item.userId === s.currentUserId && !item.read ? n + 1 : n), 0),
  )
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface-topbar px-4 backdrop-blur-md sm:px-6">
      <div className="min-w-0 flex-1">
        <div className="truncate text-base font-semibold text-text-primary">{title}</div>
        {subtitle ? <div className="truncate text-xs text-text-secondary">{subtitle}</div> : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          className="relative h-9 rounded-sm border border-border-chrome bg-surface-card px-3 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-muted"
        >
          Alerts
          {unread > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] text-white">
              {unread}
            </span>
          ) : null}
        </button>

        <select
          className="h-9 max-w-[160px] rounded-sm border border-border-chrome bg-surface-card px-2 text-xs text-text-primary outline-none focus:ring-2 focus:ring-focus/30"
          value={user?.role}
          onChange={(e) => {
            const role = e.target.value as Role
            const u = users.find((x) => x.role === role)
            if (u) navigate(loginAs(u.id))
          }}
          aria-label="Switch demo role"
        >
          {roleOptions.map((r) => (
            <option key={r} value={r}>
              {roleLabels[r]}
            </option>
          ))}
        </select>

        <div className="hidden items-center gap-2 sm:flex">
          <div className="text-right">
            <div className="max-w-[120px] truncate text-xs font-medium text-text-primary">{user?.name}</div>
            <div className="text-[11px] text-text-secondary">{user ? roleLabels[user.role] : ''}</div>
          </div>
        </div>

        <Button variant="ghost" onClick={() => { logout(); navigate('/login') }}>
          Logout
        </Button>
      </div>
    </header>
  )
}
