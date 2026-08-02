import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/format'

/** Koach-style nav leaf: brand pill + 4px left rail when active. */
export function NavItemLink({
  to,
  label,
  end,
}: {
  to: string
  label: string
  end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className="flex items-center gap-[9px] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-1"
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'w-1 shrink-0 self-stretch rounded-r-[4px]',
              isActive ? 'bg-brand' : 'bg-transparent',
            )}
            aria-hidden
          />
          <span
            className={cn(
              'flex h-10 min-w-0 flex-1 items-center rounded-md px-2 text-sm leading-[18px] transition-colors duration-[180ms]',
              isActive
                ? 'bg-brand font-semibold text-white'
                : 'font-medium text-text-secondary hover:bg-surface-muted',
            )}
          >
            <span className="truncate">{label}</span>
          </span>
        </>
      )}
    </NavLink>
  )
}
