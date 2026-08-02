import { NavItemLink } from './NavItemLink'

export function Sidebar({
  nav,
}: {
  nav: { to: string; label: string }[]
}) {
  return (
    <aside className="hidden h-full w-sidebar shrink-0 flex-col bg-surface-sidebar px-2 py-5 lg:flex">
      <div className="mb-7 px-2">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">Steel Cart</div>
        <div className="mt-1 text-sm font-semibold text-text-primary">Distribution OS</div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Primary">
        {nav.map((item) => (
          <NavItemLink
            key={item.to}
            to={item.to}
            label={item.label}
            end={item.to.split('/').length <= 2}
          />
        ))}
      </nav>
    </aside>
  )
}
