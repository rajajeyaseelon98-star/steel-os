import type { ReactNode } from 'react'
import { cn, statusLabel } from '@/lib/format'

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-text-secondary">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

/** Soft brand-tint strip for KPI rows (Koach overview pattern). */
export function OverviewStrip({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-surface-overview p-3.5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
    </div>
  )
}

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface-card p-5 shadow-xs',
        onClick && 'cursor-pointer transition-shadow duration-[180ms] hover:shadow-md',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-card p-4 shadow-xs">
      <div className="text-xs font-medium text-text-secondary">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-text-primary">{value}</div>
      {hint ? <div className="mt-1 text-xs text-text-tertiary">{hint}</div> : null}
    </div>
  )
}

export function Button({
  children,
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
}) {
  const styles = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    secondary: 'bg-steel-900 text-white hover:bg-steel-800',
    ghost: 'bg-surface-muted text-text-primary hover:bg-steel-200',
    outline: 'border border-border-chrome bg-surface-card text-text-primary hover:bg-surface-muted',
    danger: 'bg-danger text-white hover:opacity-90',
  }
  return (
    <button
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-sm px-3.5 text-sm font-medium leading-[18px] transition-colors duration-[180ms] disabled:cursor-not-allowed disabled:opacity-50',
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'h-[42px] w-full rounded-sm bg-surface-card px-3 text-sm text-text-primary outline-none placeholder:text-text-tertiary',
        'shadow-[inset_0_0_0_1px_var(--border-chrome),0_2px_2px_0_rgba(0,0,0,0.02)]',
        'focus:shadow-[inset_0_0_0_1.5px_var(--color-primary)]',
        props.className,
      )}
    />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'h-[42px] w-full rounded-sm bg-surface-card px-3 text-sm text-text-primary outline-none',
        'shadow-[inset_0_0_0_1px_var(--border-chrome),0_2px_2px_0_rgba(0,0,0,0.02)]',
        'focus:shadow-[inset_0_0_0_1.5px_var(--color-primary)]',
        props.className,
      )}
    />
  )
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full rounded-sm bg-surface-card px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary',
        'shadow-[inset_0_0_0_1px_var(--border-chrome),0_2px_2px_0_rgba(0,0,0,0.02)]',
        'focus:shadow-[inset_0_0_0_1.5px_var(--color-primary)]',
        props.className,
      )}
    />
  )
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-xs font-medium text-text-secondary">{children}</label>
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'brand'
}) {
  const tones = {
    neutral: 'bg-surface-muted text-text-secondary',
    success: 'bg-emerald-50 text-success',
    warning: 'bg-amber-50 text-warning',
    danger: 'bg-red-50 text-danger',
    brand: 'bg-surface-overview text-brand',
  }
  return (
    <span className={cn('inline-flex rounded-md px-2.5 py-0.5 text-xs font-medium', tones[tone])}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status.includes('fail') || status.includes('cancel') || status.includes('reject') || status.includes('overdue')
      ? 'danger'
      : status.includes('deliver') || status.includes('paid') || status.includes('accept') || status.includes('complet') || status === 'verified' || status === 'approved' || status === 'pass'
        ? 'success'
        : status.includes('pending') || status.includes('draft') || status.includes('loading') || status.includes('quot')
          ? 'warning'
          : 'neutral'
  return <Badge tone={tone}>{statusLabel(status)}</Badge>
}

export function Empty({ title, body }: { title: string; body?: string }) {
  return (
    <Card className="border-dashed text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-surface-overview text-brand">
        <span className="text-lg font-semibold">∅</span>
      </div>
      <div className="text-sm font-medium text-text-primary">{title}</div>
      {body ? <p className="mt-1 text-sm text-text-secondary">{body}</p> : null}
    </Card>
  )
}

export function Timeline({ steps, current }: { steps: string[]; current: string }) {
  const idx = Math.max(0, steps.indexOf(current))
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-3">
          <span
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
              i <= idx ? 'bg-brand text-white' : 'bg-surface-muted text-text-tertiary',
            )}
          >
            {i + 1}
          </span>
          <span className={cn('text-sm', i <= idx ? 'font-medium text-text-primary' : 'text-text-tertiary')}>
            {statusLabel(step)}
          </span>
        </li>
      ))}
    </ol>
  )
}

export function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface-card shadow-xs">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-surface-page text-[13px] font-medium text-text-secondary">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border-section">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-text-primary">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

/** Toolbar card used above tables (search / filters / CTA). */
export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border-section bg-surface-card p-4 shadow-xs">
      {children}
    </div>
  )
}
